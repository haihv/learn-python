import type { LessonModule } from "../types";

export const contextManagers: LessonModule = {
  type: "lesson",
  id: "46",
  slug: "context-managers",
  title: "with Statement, __enter__/__exit__, contextlib",
  icon: "📁",
  estimatedMinutes: 15,
  content: `# Context Managers: with Statement, __enter__/__exit__, contextlib

The \`with\` statement solves a pervasive problem: ensuring that resources are always cleaned up, even when exceptions occur. Files must be closed, locks must be released, database transactions must be committed or rolled back. Context managers make this automatic.

## The with Statement

\`\`\`python
# Without with: easy to forget cleanup, fails on exceptions
f = open("data.txt")
data = f.read()
f.close()   # What if read() raised an exception? close() is never called!

# With with: cleanup is guaranteed
with open("data.txt") as f:
    data = f.read()
# f.close() is called automatically, even if read() raised an exception
\`\`\`

The \`with\` statement:
1. Calls \`__enter__()\` on the context manager
2. Binds the return value to the \`as\` variable (if present)
3. Executes the body
4. Calls \`__exit__()\` — always, even if an exception occurred

## __enter__ and __exit__

To make a class a context manager, implement these two methods:

\`\`\`python
class ManagedFile:
    def __init__(self, path, mode="r"):
        self.path = path
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.path, self.mode)
        return self.file    # bound to 'as' variable

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        # Return False (or None) to propagate any exception
        # Return True to suppress it
        return False

with ManagedFile("data.txt") as f:
    content = f.read()
\`\`\`

### __exit__ Parameters

\`__exit__(self, exc_type, exc_val, exc_tb)\` receives three arguments:
- \`exc_type\`: the exception class, or \`None\` if no exception
- \`exc_val\`: the exception instance, or \`None\`
- \`exc_tb\`: the traceback object, or \`None\`

**Return \`True\`** to suppress the exception (swallow it — execution continues after the \`with\` block). **Return \`False\` or \`None\`** to let it propagate.

\`\`\`python
class SuppressZeroDivision:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is ZeroDivisionError:
            print(f"Suppressed: {exc_val}")
            return True   # suppress the exception
        return False      # propagate any other exception

with SuppressZeroDivision():
    result = 1 / 0   # ZeroDivisionError is suppressed
print("Continuing after suppressed error")
\`\`\`

## Database Transaction Pattern

A classic context manager use case:

\`\`\`python
class Transaction:
    def __init__(self, connection):
        self.conn = connection

    def __enter__(self):
        self.conn.execute("BEGIN")
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            self.conn.execute("COMMIT")
        else:
            self.conn.execute("ROLLBACK")
        return False   # don't suppress exceptions

with Transaction(db_conn) as conn:
    conn.execute("INSERT INTO users VALUES (?)", (user_id,))
    conn.execute("UPDATE balances SET amount = amount - 100")
    # If any operation raises, ROLLBACK is called automatically
# If no exception: COMMIT
\`\`\`

## contextlib.contextmanager — Generator-Based Context Managers

The \`@contextmanager\` decorator lets you write context managers as generator functions. Everything before \`yield\` is the \`__enter__\` logic; the yielded value is bound to \`as\`; everything after \`yield\` is the \`__exit__\` logic:

\`\`\`python
from contextlib import contextmanager

@contextmanager
def managed_file(path, mode="r"):
    f = open(path, mode)
    try:
        yield f            # __enter__ returns f
    finally:
        f.close()          # __exit__ logic — always runs

with managed_file("data.txt") as f:
    content = f.read()
\`\`\`

To handle exceptions in a \`@contextmanager\`, wrap the \`yield\` in try/except:

\`\`\`python
@contextmanager
def transaction(conn):
    conn.execute("BEGIN")
    try:
        yield conn
        conn.execute("COMMIT")
    except Exception:
        conn.execute("ROLLBACK")
        raise   # re-raise to not suppress
\`\`\`

## contextlib.suppress

\`contextlib.suppress(*exceptions)\` is a pre-built context manager that silently suppresses specified exceptions:

\`\`\`python
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove("file_that_might_not_exist.tmp")

# Equivalent to:
try:
    os.remove("file_that_might_not_exist.tmp")
except FileNotFoundError:
    pass
\`\`\`

## contextlib.nullcontext

\`nullcontext(enter_result=None)\` is a no-op context manager — useful when a context manager is optional:

\`\`\`python
from contextlib import nullcontext

def process(data, lock=None):
    ctx = lock if lock is not None else nullcontext()
    with ctx:
        # If lock is provided, we hold it; otherwise no-op
        do_work(data)
\`\`\`

## Multiple Context Managers

You can open multiple context managers in one \`with\` statement:

\`\`\`python
# Read from one file, write to another — both are always closed
with open("input.txt") as src, open("output.txt", "w") as dst:
    for line in src:
        dst.write(line.upper())

# Equivalent to nested with:
with open("input.txt") as src:
    with open("output.txt", "w") as dst:
        for line in src:
            dst.write(line.upper())
\`\`\`

## Timing Example

A common use case — measuring how long a block takes:

\`\`\`python
import time
from contextlib import contextmanager

@contextmanager
def timer(label=""):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.3f}s")

with timer("sorting"):
    data = sorted(range(1_000_000), reverse=True)
# Output: sorting: 0.045s
\`\`\`
`,
  quiz: [
    {
      question: "What does `__exit__` returning `True` do?",
      options: [
        "It signals that the context manager succeeded",
        "It suppresses any exception that occurred in the with block",
        "It re-raises the exception",
        "It causes the with block to repeat",
      ],
      correctIndex: 1,
    },
    {
      question: "In a `@contextmanager` generator, where is the `__enter__` logic placed?",
      options: [
        "After the yield statement",
        "In a separate __enter__ method",
        "Before the yield statement",
        "In the finally block",
      ],
      correctIndex: 2,
    },
    {
      question: "What is `contextlib.nullcontext` used for?",
      options: [
        "To suppress all exceptions inside a with block",
        "To provide a no-op context manager, useful when a context manager is optional",
        "To measure the execution time of a block",
        "To redirect stdout to null (discard output)",
      ],
      correctIndex: 1,
    },
  ],
};
