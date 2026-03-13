import { runInWorker } from "@/lib/pyodide-runner";

export type RunResult = {
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
};

export async function runPythonCode(code: string): Promise<RunResult> {
  const { stdout, stderr, error } = await runInWorker(code);
  return {
    stdout,
    stderr,
    error,
    timedOut: error?.includes("timed out") ?? false,
  };
}
