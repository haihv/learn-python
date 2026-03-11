import type { LessonModule } from "../types";

export const profiling: LessonModule = {
  type: "lesson",
  id: "91",
  slug: "profiling",
  title: "cProfile, timeit, line_profiler concepts",
  icon: "⏱️",
  estimatedMinutes: 15,
  content: `# Profiling and Performance in Python

Before optimizing code, *measure*. Guessing at bottlenecks wastes time and often makes code worse. Python provides several tools for measuring where time actually goes.

---

## timeit — Micro-Benchmarking

\`timeit\` runs a small snippet many times and reports wall-clock time. It disables garbage collection by default so GC pauses don't skew results.

\`\`\`python
import timeit

# timeit.timeit(stmt, setup="", number=1_000_000)
# Returns total seconds for all runs

t = timeit.timeit(
    stmt="x = [i**2 for i in range(100)]",
    number=10_000
)
print(f"List comprehension: {t:.4f}s for 10,000 runs")

# Compare two approaches
t_map = timeit.timeit(
    stmt="list(map(lambda i: i**2, range(100)))",
    number=10_000
)
print(f"map+lambda:         {t_map:.4f}s for 10,000 runs")
\`\`\`

The \`setup\` argument runs once before the timed loop — use it to import modules or create data that the snippet needs without including that time in the measurement:

\`\`\`python
import timeit

t = timeit.timeit(
    stmt="result = ','.join(words)",
    setup="words = ['hello', 'world'] * 500",
    number=50_000
)
print(f"str.join: {t:.4f}s")

t2 = timeit.timeit(
    stmt="""
result = ''
for w in words:
    result += w + ','
""",
    setup="words = ['hello', 'world'] * 500",
    number=50_000
)
print(f"string concat loop: {t2:.4f}s")
\`\`\`

### timeit.repeat()

\`repeat(stmt, repeat=5, number=1000)\` runs \`number\` iterations \`repeat\` times and returns a list of totals. Use \`min()\` of the list — the minimum is the most stable estimate of "best case" (lower is fewer OS interruptions):

\`\`\`python
import timeit

results = timeit.repeat(
    stmt="sum(range(1000))",
    repeat=5,
    number=10_000
)
print(f"min={min(results):.4f}s  max={max(results):.4f}s")
\`\`\`

### timeit from the Command Line

\`\`\`bash
# -n: number of executions, -r: repeat count
python -m timeit -n 100000 -r 5 "x = 2**10"
python -m timeit -s "data = list(range(1000))" "sorted(data)"
\`\`\`

---

## cProfile — Full Program Profiling

\`cProfile\` is a deterministic profiler — it instruments every function call. Use it to find which functions consume the most time in a real program.

\`\`\`python
import cProfile

def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

cProfile.run("fib(30)")
\`\`\`

Sample output:

\`\`\`
         2692539 function calls (3 primitive calls) in 0.812 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
2692537/1    0.812    0.000    0.812    0.812 script.py:3(fib)
        1    0.000    0.000    0.812    0.812 <string>:1(<module>)
        1    0.000    0.000    0.000    0.000 {built-in method builtins.exec}
\`\`\`

**Columns explained:**

| Column | Meaning |
|--------|---------|
| \`ncalls\` | Total calls (recursive shown as \`2692537/1\` = total/primitive) |
| \`tottime\` | Time spent *inside* this function, excluding subcalls |
| \`percall\` | tottime ÷ ncalls |
| \`cumtime\` | Total time *including* all subcalls |
| \`percall\` (2nd) | cumtime ÷ primitive calls |

Look at **tottime** to find functions that are slow *in themselves*; look at **cumtime** to find the most expensive call trees.

---

## pstats — Sorting Profile Output

\`pstats.Stats\` lets you load, sort, and filter profile data programmatically:

\`\`\`python
import cProfile
import pstats
import io

def slow_function():
    total = 0
    for i in range(100_000):
        total += i ** 2
    return total

pr = cProfile.Profile()
pr.enable()
slow_function()
pr.disable()

stream = io.StringIO()
stats = pstats.Stats(pr, stream=stream)
stats.sort_stats("tottime")   # sort by time spent inside each function
stats.print_stats(10)         # show top 10 functions
print(stream.getvalue())
\`\`\`

Sort keys: \`"tottime"\`, \`"cumtime"\`, \`"ncalls"\`, \`"filename"\`, \`"name"\`.

---

## memory_profiler — Concept (Not in Stdlib)

\`memory_profiler\` is a third-party package (\`pip install memory-profiler\`) that reports per-line memory usage. It uses the \`@profile\` decorator (which is injected by the runner, not imported):

\`\`\`python
# Run with: python -m memory_profiler script.py
@profile
def load_data():
    data = list(range(1_000_000))   # Line that allocates memory
    return data
\`\`\`

For a quick size estimate without installing anything, use \`sys.getsizeof\`:

\`\`\`python
import sys

lst = list(range(1000))
gen = (x for x in range(1000))

print(sys.getsizeof(lst))   # ~8,056 bytes — all elements allocated
print(sys.getsizeof(gen))   # ~104 bytes — generator is lazy
\`\`\`

---

## Practical Python Performance Tips

### 1. Use built-in functions over manual loops

Built-ins like \`sum()\`, \`map()\`, \`filter()\`, \`min()\`, \`max()\` are implemented in C and run faster than equivalent Python for-loops:

\`\`\`python
data = list(range(1_000_000))

# Slow
total = 0
for x in data:
    total += x

# Fast
total = sum(data)
\`\`\`

### 2. Avoid global variable lookups — cache as local

Python looks up global names in the module's \`__dict__\` on every access. Inside a tight loop, binding a global to a local variable eliminates that overhead:

\`\`\`python
import math

# Slow — global lookup for 'math.sqrt' on every iteration
def slow(n):
    return [math.sqrt(i) for i in range(n)]

# Fast — cache as local once
def fast(n):
    _sqrt = math.sqrt       # local reference
    return [_sqrt(i) for i in range(n)]
\`\`\`

### 3. List comprehensions vs for-loops

List comprehensions are compiled to a faster bytecode path than equivalent for-loops with \`.append()\`:

\`\`\`python
# Slower
result = []
for i in range(10_000):
    if i % 2 == 0:
        result.append(i ** 2)

# Faster
result = [i ** 2 for i in range(10_000) if i % 2 == 0]
\`\`\`

### 4. Avoid repeated attribute lookup

Each \`obj.method\` expression traverses the attribute chain. Cache it:

\`\`\`python
# Slow — repeated lookup of list.append on every iteration
result = []
for i in range(100_000):
    result.append(i)

# Fast — cache the method reference
result = []
append = result.append
for i in range(100_000):
    append(i)
\`\`\`

### 5. \_\_slots\_\_ for memory-dense objects

By default, Python instances store attributes in a \`__dict__\`. Declaring \`__slots__\` replaces that with a fixed-size array, cutting memory by ~40-50% for many small objects:

\`\`\`python
class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x = x
        self.y = y

# 1 million Points with __slots__ uses ~88 MB instead of ~150 MB
\`\`\`

### 6. lru_cache for expensive pure functions

\`functools.lru_cache\` memoizes calls so repeated inputs return cached results without re-computing:

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)    # maxsize=None → unbounded cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(100))   # Fast — O(n) instead of O(2^n)
print(fib.cache_info())   # CacheInfo(hits=98, misses=101, ...)
\`\`\`

### 7. NumPy for numeric work

For array arithmetic, NumPy's vectorized operations run in C and are 10-100× faster than Python loops:

\`\`\`python
import numpy as np
import timeit

# Pure Python
t1 = timeit.timeit(
    "total = sum(x**2 for x in range(100_000))",
    number=100
)

# NumPy
t2 = timeit.timeit(
    "total = np.sum(np.arange(100_000) ** 2)",
    setup="import numpy as np",
    number=100
)

print(f"Python: {t1:.3f}s   NumPy: {t2:.3f}s")
# NumPy is typically 20-50× faster for this kind of work
\`\`\`

---

## Big-O of Common Operations

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| \`list.append()\` | O(1) amortized | Occasional resize is O(n) |
| \`list.insert(i, x)\` | O(n) | Shifts all elements after index |
| \`list[i]\` | O(1) | Index access |
| \`list.pop()\` | O(1) | Pop from end |
| \`list.pop(0)\` | O(n) | Use \`collections.deque\` instead |
| \`x in list\` | O(n) | Linear scan |
| \`x in set\` | O(1) avg | Hash lookup |
| \`dict[key]\` | O(1) avg | Hash lookup |
| \`sorted(n)\` | O(n log n) | Timsort |
| \`bisect.bisect\` | O(log n) | Binary search |
| \`heapq.heappush\` | O(log n) | Heap sift |
| \`heapq.heapify\` | O(n) | Build heap from list |
`,
  quiz: [
    {
      question:
        "In cProfile output, `tottime` represents:",
      options: [
        "The total wall-clock time including all sub-function calls",
        "The time spent inside the function itself, excluding calls to other functions",
        "The average time per call",
        "The number of times the function was called",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Why does `timeit` disable the garbage collector by default during measurement?",
      options: [
        "To prevent memory leaks in the benchmark",
        "Because GC pauses would add non-deterministic time and skew results",
        "Because the code being timed might free memory that GC needs",
        "To allow more iterations to run within the time limit",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What is the time complexity of `x in some_set` for a Python set?",
      options: [
        "O(n) — it scans every element",
        "O(log n) — it uses a balanced tree",
        "O(1) average — it uses a hash table",
        "O(n log n) — it sorts before searching",
      ],
      correctIndex: 2,
    },
  ],
};
