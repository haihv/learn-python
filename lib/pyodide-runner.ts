// Manages the Pyodide Web Worker. Python runs off the main thread so the UI
// stays responsive, and hung code can be killed by terminating the worker.

const DEFAULT_CDN = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/";
const TIMEOUT_MS = 10_000;

type WorkerResult = {
  id: number;
  stdout: string;
  stderr: string;
  error: string | null;
};

type PendingEntry = {
  resolve: (v: WorkerResult) => void;
  timer: ReturnType<typeof setTimeout>;
};

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, PendingEntry>();

function createWorker(): Worker {
  const cdnUrl = process.env.NEXT_PUBLIC_PYODIDE_CDN ?? DEFAULT_CDN;

  const w = new Worker("/pyodide-worker.mjs", { type: "module" });

  // Send CDN URL so the worker can start loading Pyodide eagerly.
  w.postMessage({ type: "init", cdnUrl });

  w.onmessage = ({ data }: MessageEvent<WorkerResult>) => {
    const entry = pending.get(data.id);
    if (!entry) return;
    clearTimeout(entry.timer);
    pending.delete(data.id);
    entry.resolve(data);
  };

  // Worker crashed (OOM, uncaught error) — resolve all pending and reset.
  w.onerror = () => {
    for (const [id, entry] of pending) {
      clearTimeout(entry.timer);
      entry.resolve({ id, stdout: "", stderr: "", error: "Python worker crashed unexpectedly." });
    }
    pending.clear();
    worker = null;
  };

  return w;
}

function getWorker(): Worker {
  if (!worker) worker = createWorker();
  return worker;
}

export function runInWorker(code: string): Promise<WorkerResult> {
  const id = ++nextId;

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      // Terminate the hung worker; next call gets a fresh one.
      worker?.terminate();
      worker = null;
      resolve({ id, stdout: "", stderr: "", error: "Execution timed out (10 s)." });
    }, TIMEOUT_MS);

    pending.set(id, { resolve, timer });
    getWorker().postMessage({ id, code });
  });
}
