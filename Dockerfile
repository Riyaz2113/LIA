# Production Dockerfile for LIA Backend with Node.js + Python ML Runtime (BGE-M3 + Cross-Encoder + ChromaDB)
FROM node:20-bookworm-slim

# Install Python 3, pip, and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create Python virtual environment and install ML requirements (CPU-optimized PyTorch)
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install CPU-only PyTorch first to save disk and memory
RUN pip3 install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install sentence-transformers, chromadb, transformers
COPY server/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy package files and install production Node dependencies
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy server application code and knowledge files
COPY server/ ./

# Ensure persistent chroma_data storage directory exists
RUN mkdir -p /app/chroma_data

# Expose server port and set default environment variables
ENV PORT=5000
ENV NODE_ENV=production
ENV PYTHON_CMD=/opt/venv/bin/python
ENV CHROMA_PATH=/app/chroma_data
ENV BM25_INDEX_PATH=/app/chroma_data/bm25_index.json
ENV TORCH_NUM_THREADS=4

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
