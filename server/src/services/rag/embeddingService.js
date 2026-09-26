/**
 * embeddingService.js
 * High-performance BAAI/bge-m3 dense vector embedding service with automatic GPU/CPU detection.
 */

const { spawn } = require('child_process');
const path = require('path');

const BRIDGE_PATH = path.join(__dirname, 'embed_bridge.py');

let workerProcess = null;
let pendingQueue = [];
let bufferAccumulator = '';

/**
 * getWorker
 * Lazily spawns and maintains a single persistent Python worker process.
 */
const getWorker = () => {
  if (workerProcess && !workerProcess.killed) {
    return workerProcess;
  }

  const pythonCmd = process.env.PYTHON_CMD || (process.platform === 'win32' ? 'python' : 'python3');
  workerProcess = spawn(pythonCmd, [BRIDGE_PATH], {
    cwd: path.resolve(__dirname, '../../..'),
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
    },
    stdio: ['pipe', 'pipe', 'inherit'],
  });

  workerProcess.stdout.on('data', (data) => {
    bufferAccumulator += data.toString('utf8');
    const lines = bufferAccumulator.split('\n');
    bufferAccumulator = lines.pop(); // keep partial line in accumulator

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line.trim());
        const resolver = pendingQueue.shift();
        if (resolver) {
          if (parsed.success) {
            resolver.resolve(parsed.data);
          } else {
            resolver.reject(new Error(parsed.error || 'Embedding worker error'));
          }
        }
      } catch (err) {
        console.error('Error parsing Python worker output:', err, line);
      }
    }
  });

  workerProcess.on('error', (err) => {
    console.error('Python embedding worker error:', err);
    while (pendingQueue.length > 0) {
      const resolver = pendingQueue.shift();
      resolver.reject(err);
    }
  });

  workerProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.warn(`Python embedding worker exited with code ${code}`);
    }
    workerProcess = null;
    while (pendingQueue.length > 0) {
      const resolver = pendingQueue.shift();
      resolver.reject(new Error(`Embedding worker terminated with code ${code}`));
    }
  });

  return workerProcess;
};

/**
 * sendToWorker
 * Sends an RPC action to the persistent Python worker process.
 */
const sendToWorker = (payload) => {
  return new Promise((resolve, reject) => {
    const worker = getWorker();
    pendingQueue.push({ resolve, reject });
    worker.stdin.write(JSON.stringify(payload) + '\n');
  });
};

/**
 * generateEmbeddings
 * Computes 1024-dimensional BGE-M3 dense embeddings for an array of texts.
 *
 * @param {Array<string>} texts - List of texts to embed
 * @returns {Promise<Array<Array<number>>>} Array of float embedding vectors
 */
const generateEmbeddings = async (texts) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  // Batch into slices of 32 for optimal memory usage
  const batchSize = 32;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const result = await sendToWorker({
      action: 'embed',
      texts: batch,
    });
    allEmbeddings.push(...result);
  }

  return allEmbeddings;
};

/**
 * generateQueryEmbedding
 * Computes BGE-M3 embedding vector for a single query string.
 *
 * @param {string} query
 * @returns {Promise<Array<number>>} 1024-dimensional vector
 */
const generateQueryEmbedding = async (query) => {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    throw new Error('Query string cannot be empty');
  }

  const results = await generateEmbeddings([query.trim()]);
  return results[0];
};

const closeWorker = () => {
  if (workerProcess) {
    try {
      if (workerProcess.stdin) workerProcess.stdin.destroy();
      if (workerProcess.stdout) workerProcess.stdout.destroy();
      workerProcess.kill();
    } catch (e) {
      // ignore
    }
    workerProcess = null;
  }
};

module.exports = {
  generateEmbeddings,
  generateQueryEmbedding,
  sendToWorker,
  closeWorker,
};
