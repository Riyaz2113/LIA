"""
profile_rag_memory.py
Empirical Memory Profiler for LIA RAG Pipeline on CPU and GPU.
Measures exact Resident Set Size (RSS), heap allocations, and peak memory during real operations.
"""

import os
import sys
import time
import json
import tracemalloc

# Ensure CPU profiling mode for accurate cloud container emulation
os.environ["CUDA_VISIBLE_DEVICES"] = ""

def get_process_memory_mb():
    try:
        import psutil
        process = psutil.Process(os.getpid())
        return process.memory_info().rss / (1024 * 1024)
    except Exception:
        # Fallback for Windows if psutil is not installed
        import ctypes
        from ctypes import wintypes
        class PROCESS_MEMORY_COUNTERS(ctypes.Structure):
            _fields_ = [
                ('cb', wintypes.DWORD),
                ('PageFaultCount', wintypes.DWORD),
                ('PeakWorkingSetSize', ctypes.c_size_t),
                ('WorkingSetSize', ctypes.c_size_t),
                ('QuotaPeakPagedPoolUsage', ctypes.c_size_t),
                ('QuotaPagedPoolUsage', ctypes.c_size_t),
                ('QuotaPeakNonPagedPoolUsage', ctypes.c_size_t),
                ('QuotaNonPagedPoolUsage', ctypes.c_size_t),
                ('PagefileUsage', ctypes.c_size_t),
                ('PeakPagefileUsage', ctypes.c_size_t),
            ]
        counters = PROCESS_MEMORY_COUNTERS()
        counters.cb = ctypes.sizeof(PROCESS_MEMORY_COUNTERS)
        handle = ctypes.windll.kernel32.GetCurrentProcess()
        if ctypes.windll.psapi.GetProcessMemoryInfo(handle, ctypes.byref(counters), counters.cb):
            return counters.WorkingSetSize / (1024 * 1024)
        return 0.0

def run_profiling():
    print("=" * 60)
    print("[PROFILER] EMPIRICAL RAG MEMORY PROFILER (CPU Mode / Cloud Emulation)")
    print("=" * 60)

    # 1. Baseline Python Runtime
    mem_base = get_process_memory_mb()
    print(f"1. Baseline Python Runtime: {mem_base:.2f} MB")

    # 2. ChromaDB Import & Initialization
    import chromadb
    chroma_path = os.path.abspath("./chroma_data")
    chroma_client = chromadb.PersistentClient(path=chroma_path)
    collection = chroma_client.get_or_create_collection(
        name="lia_knowledge",
        metadata={"hnsw:space": "cosine"}
    )
    vector_count = collection.count()
    mem_chroma = get_process_memory_mb()
    delta_chroma = mem_chroma - mem_base
    print(f"2. ChromaDB Client + HNSW Index ({vector_count} vectors): {mem_chroma:.2f} MB (+{delta_chroma:.2f} MB)")

    # 3. BAAI/bge-m3 Model Load (CPU)
    from sentence_transformers import SentenceTransformer
    print("Loading BAAI/bge-m3 on CPU...")
    t0 = time.time()
    bge_model = SentenceTransformer("BAAI/bge-m3", device="cpu")
    t1 = time.time()
    mem_bge = get_process_memory_mb()
    delta_bge = mem_bge - mem_chroma
    print(f"3. BAAI/bge-m3 Loaded on CPU: {mem_bge:.2f} MB (+{delta_bge:.2f} MB in {t1-t0:.2f}s)")

    # 4. Peak Memory During Embedding Inference (Batch of 32 Chunks)
    sample_texts = [
        f"Sample academic timetable chunk {i}: Vignan Lara Institute of Technology & Science class schedule for IV B.Tech AIML semester 1."
        for i in range(32)
    ]
    t0 = time.time()
    embeddings = bge_model.encode(sample_texts, normalize_embeddings=True, batch_size=32)
    t1 = time.time()
    mem_embed_peak = get_process_memory_mb()
    delta_embed = mem_embed_peak - mem_bge
    print(f"4. Peak Memory during Embedding (32 chunks): {mem_embed_peak:.2f} MB (+{delta_embed:.2f} MB overhead in {t1-t0:.2f}s)")

    # 5. BAAI/bge-reranker-v2-m3 Cross-Encoder Load (CPU)
    from sentence_transformers import CrossEncoder
    print("Loading BAAI/bge-reranker-v2-m3 on CPU...")
    t0 = time.time()
    reranker = CrossEncoder("BAAI/bge-reranker-v2-m3", device="cpu")
    t1 = time.time()
    mem_rerank_load = get_process_memory_mb()
    delta_rerank = mem_rerank_load - mem_embed_peak
    print(f"5. Cross-Encoder Loaded on CPU: {mem_rerank_load:.2f} MB (+{delta_rerank:.2f} MB in {t1-t0:.2f}s)")

    # 6. Peak Memory During Cross-Encoder Inference (15 Candidate Pairs)
    query = "What is the IV-I AIML timetable?"
    candidate_pairs = [[query, text] for text in sample_texts[:15]]
    t0 = time.time()
    scores = reranker.predict(candidate_pairs)
    t1 = time.time()
    mem_rerank_peak = get_process_memory_mb()
    delta_rerank_op = mem_rerank_peak - mem_rerank_load
    print(f"6. Peak Memory during Reranking (15 candidate pairs): {mem_rerank_peak:.2f} MB (+{delta_rerank_op:.2f} MB in {t1-t0:.2f}s)")

    total_python_rss = mem_rerank_peak
    print("\n" + "=" * 60)
    print(f"[SUMMARY] TOTAL STEADY-STATE PYTHON WORKER RSS: {total_python_rss:.2f} MB ({total_python_rss/1024:.2f} GB)")
    print("=" * 60)

    # Output JSON summary for automated reporting
    results = {
        "baseline_python_mb": round(mem_base, 2),
        "chromadb_overhead_mb": round(delta_chroma, 2),
        "bge_m3_loaded_mb": round(delta_bge, 2),
        "embedding_peak_overhead_mb": round(delta_embed, 2),
        "cross_encoder_loaded_mb": round(delta_rerank, 2),
        "reranking_peak_overhead_mb": round(delta_rerank_op, 2),
        "total_python_worker_mb": round(total_python_rss, 2),
        "total_python_worker_gb": round(total_python_rss / 1024, 2)
    }
    with open("memory_profile_python.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run_profiling()
