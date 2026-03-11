import type { WorkshopModule } from "../types";

export const contextManagersWorkshop: WorkshopModule = {
  type: "workshop",
  id: "47",
  slug: "context-managers-workshop",
  title: "Building Custom Context Managers",
  icon: "🔒",
  estimatedMinutes: 20,
  description: "Build reusable context managers for resource management",
  steps: [
    {
      instruction:
        "Build a class-based `Timer` context manager. `__enter__` should record the start time using `time.perf_counter()` and return `self`. `__exit__` should print `'Elapsed: X.XXXs'` with 3 decimal places. Test it with a small computation.",
      hint: "import time. In __enter__: self.start = time.perf_counter(); return self. In __exit__: elapsed = time.perf_counter() - self.start; print(f'Elapsed: {elapsed:.3f}s'). __exit__ must accept exc_type, exc_val, exc_tb.",
      starterCode: `import time

class Timer:
    def __enter__(self):
        # TODO: record start time, return self
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: compute elapsed time and print "Elapsed: X.XXXs"
        return False  # don't suppress exceptions


# Test 1: simple computation
with Timer():
    total = sum(range(1_000_000))
    print(f"Sum: {total}")

# Test 2: with 'as' to access the timer object
with Timer() as t:
    result = sorted([3, 1, 4, 1, 5, 9, 2, 6] * 10000)
print(f"Sorted {len(result)} items")
`,
      validate: (code: string) => {
        return (
          code.includes("class Timer") &&
          code.includes("__enter__") &&
          code.includes("__exit__") &&
          code.includes("perf_counter") &&
          code.includes("Elapsed")
        );
      },
      successMessage:
        "Class-based context managers are the most explicit form — every piece of setup and teardown is visible. The `__exit__` signature with three parameters handles both normal exit and exception exit uniformly.",
    },
    {
      instruction:
        "Rewrite the `Timer` using `@contextmanager` from `contextlib`. The generator version is more concise: setup before `yield`, teardown in `finally` after `yield`. Test it identically to the class version.",
      hint: "from contextlib import contextmanager. @contextmanager def timer(): start = time.perf_counter(); try: yield; finally: elapsed = time.perf_counter() - start; print(f'Elapsed: {elapsed:.3f}s').",
      starterCode: `import time
from contextlib import contextmanager

@contextmanager
def timer():
    # TODO: record start time
    # TODO: yield (body of with block runs here)
    # TODO: in finally, compute elapsed and print "Elapsed: X.XXXs"
    pass


# Test 1: simple computation
with timer():
    total = sum(range(1_000_000))
    print(f"Sum: {total}")

# Test 2: verify cleanup runs even when exception occurs
print("\\nTesting cleanup on exception:")
try:
    with timer():
        raise ValueError("something went wrong")
except ValueError:
    print("ValueError was propagated (good — timer still printed)")
`,
      validate: (code: string) => {
        return (
          code.includes("@contextmanager") &&
          code.includes("def timer") &&
          code.includes("yield") &&
          code.includes("finally") &&
          code.includes("Elapsed")
        );
      },
      successMessage:
        "The `@contextmanager` approach is usually preferred for its conciseness. The `try/finally` ensures teardown runs even when an exception propagates through the block — equivalent to `__exit__` always being called.",
    },
    {
      instruction:
        "Write a `transaction()` context manager (using `@contextmanager`) that simulates a database transaction. It should print `'BEGIN'` on entry, then `'COMMIT'` on clean exit or `'ROLLBACK'` if an exception occurred. The exception should still propagate after ROLLBACK.",
      hint: "try: print('BEGIN'); yield; print('COMMIT') except Exception: print('ROLLBACK'); raise. The raise re-propagates the exception after printing ROLLBACK.",
      starterCode: `from contextlib import contextmanager

@contextmanager
def transaction():
    # TODO: print "BEGIN"
    # TODO: yield — let the with block run
    # TODO: on clean exit print "COMMIT"
    # TODO: on exception print "ROLLBACK" and re-raise
    pass


# Test 1: successful transaction
print("=== Successful transaction ===")
with transaction():
    print("  Executing query 1")
    print("  Executing query 2")

# Test 2: failed transaction
print("\\n=== Failed transaction ===")
try:
    with transaction():
        print("  Executing query 1")
        raise RuntimeError("Connection lost!")
        print("  This line never runs")
except RuntimeError as e:
    print(f"Caught: {e}")
`,
      validate: (code: string) => {
        return (
          code.includes("@contextmanager") &&
          code.includes("yield") &&
          code.includes("BEGIN") &&
          code.includes("COMMIT") &&
          code.includes("ROLLBACK") &&
          code.includes("raise")
        );
      },
      successMessage:
        "This transaction pattern is used in SQLAlchemy, Django ORM, and virtually every database library. The context manager guarantees that every BEGIN is paired with either COMMIT or ROLLBACK — no leaked transactions.",
    },
    {
      instruction:
        "Write a `capture_output()` context manager that redirects `sys.stdout` to a `StringIO` buffer, letting you capture what `print()` outputs. After the `with` block exits, the captured text should be stored on the context manager object as `.output`. Restore original stdout in `finally`.",
      hint: "import sys, io. In __enter__: self._old_stdout = sys.stdout; sys.stdout = io.StringIO(); return self. In __exit__/finally: self.output = sys.stdout.getvalue(); sys.stdout = self._old_stdout.",
      starterCode: `import sys
import io
from contextlib import contextmanager

@contextmanager
def capture_output():
    # TODO: redirect sys.stdout to a StringIO buffer
    # TODO: yield — code in with block runs with redirected stdout
    # TODO: in finally, save captured text and restore original stdout
    pass


# Test 1: capture simple prints
with capture_output() as cap:
    print("Hello from inside!")
    print("Line two")
    for i in range(3):
        print(f"  item {i}")

print(f"Captured {len(cap.output.splitlines())} lines")
print("First line:", cap.output.splitlines()[0])

# Test 2: verify stdout is restored
print("This prints normally — stdout restored")

# Test 3: capture also works when exception occurs
try:
    with capture_output() as cap2:
        print("Before error")
        raise ValueError("oops")
except ValueError:
    print(f"Captured before error: {cap2.output.strip()!r}")
`,
      validate: (code: string) => {
        return (
          code.includes("sys.stdout") &&
          code.includes("StringIO") &&
          code.includes("yield") &&
          code.includes("finally") &&
          (code.includes("getvalue") || code.includes(".output"))
        );
      },
      successMessage:
        "Redirecting stdout via context manager is how Python's `unittest.mock.patch` and `io.StringIO` are used in testing. Always restore in `finally` — if `__enter__` succeeds, `__exit__` or `finally` must run.",
    },
    {
      instruction:
        "Write a `suppress_and_log(*exc_types)` context manager class that catches any of the specified exception types, prints `'SUPPRESSED <ExceptionType>: <message>'`, and suppresses them (execution continues after the `with` block). All other exceptions propagate normally.",
      hint: "__exit__(self, exc_type, exc_val, exc_tb): if exc_type is not None and issubclass(exc_type, self.exc_types): print(f'SUPPRESSED {exc_type.__name__}: {exc_val}'); return True. Return False otherwise.",
      starterCode: `class suppress_and_log:
    def __init__(self, *exc_types):
        self.exc_types = exc_types

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: if exc_type is one of self.exc_types, print and suppress
        # TODO: otherwise let it propagate
        pass


# Test 1: ValueError is suppressed and logged
print("Test 1:")
with suppress_and_log(ValueError, KeyError):
    raise ValueError("bad value")
print("Execution continued after ValueError")

# Test 2: KeyError is suppressed
print("\\nTest 2:")
with suppress_and_log(ValueError, KeyError):
    d = {}
    _ = d["missing"]
print("Execution continued after KeyError")

# Test 3: TypeError is NOT suppressed
print("\\nTest 3:")
try:
    with suppress_and_log(ValueError):
        raise TypeError("type mismatch")
except TypeError:
    print("TypeError propagated correctly")

# Test 4: no exception — nothing happens
print("\\nTest 4:")
with suppress_and_log(ValueError):
    result = 1 + 1
print(f"No exception, result={result}")
`,
      validate: (code: string) => {
        return (
          code.includes("class suppress_and_log") &&
          code.includes("__enter__") &&
          code.includes("__exit__") &&
          code.includes("exc_type") &&
          code.includes("issubclass") &&
          code.includes("return True") &&
          code.includes("SUPPRESSED")
        );
      },
      successMessage:
        "This is a production-ready pattern for error suppression with observability. Unlike `contextlib.suppress`, this version logs what was suppressed. The `issubclass` check handles subclass relationships correctly.",
    },
  ],
};
