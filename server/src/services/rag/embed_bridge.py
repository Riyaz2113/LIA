"""
embed_bridge.py
Python worker for BAAI/bge-m3 dense embeddings, BAAI/bge-reranker-v2-m3 Cross-Encoder reranking, and ChromaDB vector operations.
Maintains models persistently loaded in memory across requests.
"""

import sys
import os
import json
import torch
from sentence_transformers import SentenceTransformer, CrossEncoder
import chromadb

# Robust CUDA Device Detection
def get_optimal_device():
    if torch.cuda.is_available():
        try:
            # Test allocating a tiny tensor to verify CUDA execution context
            t = torch.zeros(1, device="cuda")
            del t
            return "cuda"
        except Exception as e:
            sys.stderr.write(f"[embed_bridge] CUDA available but init failed: {e}. Falling back to CPU.\n")
            return "cpu"
    return "cpu"

DEVICE = get_optimal_device()
MODEL_NAME = os.environ.get("RAG_EMBEDDING_MODEL", "BAAI/bge-m3")
RERANKER_MODEL_NAME = os.environ.get("RAG_RERANKER_MODEL", "BAAI/bge-reranker-v2-m3")
CHROMA_HOST = os.environ.get("CHROMA_HOST")
CHROMA_PORT = os.environ.get("CHROMA_PORT")
CHROMA_SSL = os.environ.get("CHROMA_SSL", "false").lower() in ("true", "1", "yes")
CHROMA_PATH = os.environ.get("CHROMA_PATH", "./chroma_data")
COLLECTION_NAME = os.environ.get("CHROMA_COLLECTION", "lia_knowledge")

# Set CPU threads for predictable performance in containerized environments
if DEVICE == "cpu":
    try:
        torch.set_num_threads(int(os.environ.get("TORCH_NUM_THREADS", "4")))
    except Exception:
        pass

_model = None
_reranker = None
_chroma_client = None
_collection = None

def get_model():
    global _model
    if _model is None:
        target_dev = get_optimal_device()
        try:
            _model = SentenceTransformer(MODEL_NAME, device=target_dev)
        except Exception as e:
            if target_dev != "cpu":
                sys.stderr.write(f"[embed_bridge] Failed loading {MODEL_NAME} on {target_dev}: {e}. Retrying on CPU.\n")
                _model = SentenceTransformer(MODEL_NAME, device="cpu")
            else:
                raise e
    return _model

def get_reranker():
    global _reranker
    if _reranker is None:
        target_dev = get_optimal_device()
        try:
            _reranker = CrossEncoder(RERANKER_MODEL_NAME, device=target_dev)
        except Exception as e:
            if target_dev != "cpu":
                sys.stderr.write(f"[embed_bridge] Failed loading {RERANKER_MODEL_NAME} on {target_dev}: {e}. Retrying on CPU.\n")
                _reranker = CrossEncoder(RERANKER_MODEL_NAME, device="cpu")
            else:
                raise e
    return _reranker

def get_chroma():
    global _chroma_client, _collection
    if _chroma_client is None:
        use_remote = os.environ.get("CHROMA_USE_REMOTE", "false").lower() in ("true", "1", "yes")
        if CHROMA_HOST and (use_remote or CHROMA_HOST not in ("127.0.0.1", "localhost")):
            port = int(CHROMA_PORT) if CHROMA_PORT else 8000
            sys.stderr.write(f"[embed_bridge] Connecting to remote ChromaDB at {CHROMA_HOST}:{port} (SSL: {CHROMA_SSL})\n")
            _chroma_client = chromadb.HttpClient(
                host=CHROMA_HOST,
                port=port,
                ssl=CHROMA_SSL
            )
        else:
            resolved_path = os.path.abspath(CHROMA_PATH)
            _chroma_client = chromadb.PersistentClient(path=resolved_path)
    if _collection is None:
        _collection = _chroma_client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
    return _chroma_client, _collection

def handle_embed(texts):
    model = get_model()
    embeddings = model.encode(texts, normalize_embeddings=True)
    return embeddings.tolist()

def handle_rerank(query, candidate_texts):
    if not candidate_texts or len(candidate_texts) == 0:
        return []
    
    reranker = get_reranker()
    pairs = [[query, text] for text in candidate_texts]
    scores = reranker.predict(pairs)
    
    # If single score or numpy array
    if hasattr(scores, "tolist"):
        scores_list = scores.tolist()
    elif isinstance(scores, (list, tuple)):
        scores_list = list(scores)
    else:
        scores_list = [float(scores)]
        
    return [float(s) for s in scores_list]

def handle_chroma_upsert(chunks, embeddings):
    _, collection = get_chroma()
    
    ids = []
    documents = []
    metadatas = []
    
    for chunk in chunks:
        doc_id = str(chunk.get("documentId", "doc"))
        idx = str(chunk.get("chunkIndex", "0"))
        c_hash = str(chunk.get("contentHash", ""))[:12]
        stable_id = f"{doc_id}_{idx}_{c_hash}"
        
        ids.append(stable_id)
        documents.append(chunk.get("text", ""))
        metadatas.append({
            "documentId": doc_id,
            "chunkIndex": int(chunk.get("chunkIndex", 0)),
            "source": str(chunk.get("source", "")),
            "title": str(chunk.get("title", "")),
            "pageNumber": int(chunk.get("pageNumber", 0)) if chunk.get("pageNumber") is not None else -1,
            "section": str(chunk.get("section", "") or ""),
            "contentHash": str(chunk.get("contentHash", "")),
        })
    
    collection.upsert(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas
    )
    return {"status": "SUCCESS", "count": len(ids)}

def handle_chroma_query(query_embedding, top_k=5):
    _, collection = get_chroma()
    res = collection.query(
        query_embeddings=[query_embedding],
        n_results=int(top_k),
        include=["documents", "metadatas", "distances"]
    )
    
    results = []
    if res and "documents" in res and len(res["documents"]) > 0:
        docs = res["documents"][0]
        metas = res["metadatas"][0] if "metadatas" in res else []
        distances = res["distances"][0] if "distances" in res else []
        
        for i in range(len(docs)):
            results.append({
                "text": docs[i],
                "metadata": metas[i] if i < len(metas) else {},
                "score": float(1.0 - distances[i]) if i < len(distances) else 1.0,
                "documentId": metas[i].get("documentId") if i < len(metas) else None,
                "chunkIndex": metas[i].get("chunkIndex") if i < len(metas) else i,
            })
    return results

def handle_chroma_delete(document_id):
    _, collection = get_chroma()
    collection.delete(where={"documentId": str(document_id)})
    return {"status": "DELETED", "documentId": document_id}

def handle_chroma_count():
    _, collection = get_chroma()
    return {"count": collection.count()}

def handle_health():
    client, collection = get_chroma()
    cuda_detected = torch.cuda.is_available()
    gpu_name = torch.cuda.get_device_name(0) if cuda_detected else "N/A"
    
    bge_dev = str(getattr(_model, "device", DEVICE if _model is not None else get_optimal_device()))
    reranker_dev = str(getattr(_reranker, "device", DEVICE if _reranker is not None else get_optimal_device()))
    
    vram_alloc = 0.0
    vram_total = 0.0
    if cuda_detected:
        try:
            vram_alloc = round(torch.cuda.memory_allocated(0) / (1024 * 1024), 2)
            vram_total = round(torch.cuda.get_device_properties(0).total_memory / (1024 * 1024), 2)
        except Exception:
            pass

    return {
        "status": "HEALTHY",
        "device": get_optimal_device(),
        "cudaDetected": cuda_detected,
        "gpuName": gpu_name,
        "bgeM3Device": bge_dev,
        "rerankerDevice": reranker_dev,
        "vramAllocatedMB": vram_alloc,
        "vramTotalMB": vram_total,
        "model": MODEL_NAME,
        "rerankerModel": RERANKER_MODEL_NAME,
        "collection": COLLECTION_NAME,
        "count": collection.count()
    }

def main():
    # If passed as single command line invocation JSON
    if len(sys.argv) > 1 and sys.argv[1] == "--exec":
        payload_str = sys.argv[2] if len(sys.argv) > 2 else sys.stdin.read()
        payload = json.loads(payload_str)
        action = payload.get("action")
        
        if action == "embed":
            out = handle_embed(payload.get("texts", []))
            print(json.dumps({"success": True, "data": out}))
        elif action == "rerank":
            out = handle_rerank(payload.get("query", ""), payload.get("candidateTexts", []))
            print(json.dumps({"success": True, "data": out}))
        elif action == "upsert":
            out = handle_chroma_upsert(payload.get("chunks", []), payload.get("embeddings", []))
            print(json.dumps({"success": True, "data": out}))
        elif action == "query":
            out = handle_chroma_query(payload.get("queryEmbedding"), payload.get("topK", 5))
            print(json.dumps({"success": True, "data": out}))
        elif action == "delete":
            out = handle_chroma_delete(payload.get("documentId"))
            print(json.dumps({"success": True, "data": out}))
        elif action == "count":
            out = handle_chroma_count()
            print(json.dumps({"success": True, "data": out}))
        elif action == "health":
            out = handle_health()
            print(json.dumps({"success": True, "data": out}))
        else:
            print(json.dumps({"success": False, "error": f"Unknown action {action}"}))
        sys.exit(0)

    # Stdio stream loop mode
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            action = req.get("action")
            
            if action == "embed":
                data = handle_embed(req.get("texts", []))
                sys.stdout.write(json.dumps({"success": True, "data": data}) + "\n")
            elif action == "rerank":
                data = handle_rerank(req.get("query", ""), req.get("candidateTexts", []))
                sys.stdout.write(json.dumps({"success": True, "data": data}) + "\n")
            elif action == "upsert":
                data = handle_chroma_upsert(req.get("chunks", []), req.get("embeddings", []))
                sys.stdout.write(json.dumps({"success": True, "data": data}) + "\n")
            elif action == "query":
                data = handle_chroma_query(req.get("queryEmbedding"), req.get("topK", 5))
                sys.stdout.write(json.dumps({"success": True, "data": data}) + "\n")
            elif action == "delete":
                data = handle_chroma_delete(req.get("documentId"))
                sys.stdout.write(json.dumps({"success": True, "data": data}) + "\n")
            elif action == "count":
                data = handle_chroma_count()
                sys.stdout.write(json.dumps({"success": True, "data": data}) + "\n")
            elif action == "health":
                data = handle_health()
                sys.stdout.write(json.dumps({"success": True, "data": data}) + "\n")
            else:
                sys.stdout.write(json.dumps({"success": False, "error": f"Unknown action {action}"}) + "\n")
            sys.stdout.flush()
        except Exception as e:
            sys.stdout.write(json.dumps({"success": False, "error": str(e)}) + "\n")
            sys.stdout.flush()

if __name__ == "__main__":
    main()
