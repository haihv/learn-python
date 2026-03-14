// ES-module Web Worker — receives an "init" message with the CDN URL,
// then eagerly loads Pyodide so it is ready before the first run arrives.

const CAPTURE_SCRIPT = `
import sys, io, traceback as _tb

_saved_out = sys.stdout
_saved_err = sys.stderr
_out = io.StringIO()
_err = io.StringIO()
sys.stdout = _out
sys.stderr = _err

try:
    exec(_user_code, {"__builtins__": __builtins__})
except SystemExit:
    pass
except BaseException:
    _tb.print_exc()
finally:
    sys.stdout = _saved_out
    sys.stderr = _saved_err

_stdout_result = _out.getvalue()
_stderr_result = _err.getvalue()
`.trimStart();

let pyodideReady = null;

self.onmessage = async ({ data }) => {
  if (data.type === "init") {
    // Assign a Promise *before* any await so run messages that arrive
    // concurrently see a non-null value and can await it rather than
    // returning the "not initialised" error.
    pyodideReady = import(data.cdnUrl + "pyodide.mjs").then(
      ({ loadPyodide }) => loadPyodide({ indexURL: data.cdnUrl })
    );
    return;
  }

  const { id, code } = data;

  if (!pyodideReady) {
    self.postMessage({ id, stdout: "", stderr: "", error: "Worker not initialised — please try again." });
    return;
  }

  try {
    const pyodide = await pyodideReady;
    pyodide.globals.set("_user_code", code);
    await pyodide.runPythonAsync(CAPTURE_SCRIPT);
    const stdout = pyodide.globals.get("_stdout_result") ?? "";
    const stderr = pyodide.globals.get("_stderr_result") ?? "";
    self.postMessage({ id, stdout, stderr, error: null });
  } catch (err) {
    self.postMessage({ id, stdout: "", stderr: "", error: String(err) });
  }
};
