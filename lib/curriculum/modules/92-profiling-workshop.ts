import type { WorkshopModule } from "../types";

export const profilingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "92",
  slug: "profiling-workshop",
  title: "Measuring Bottlenecks & Optimizing Code",
  icon: "🚀",
  estimatedMinutes: 20,
  description: "Profile Python code and apply targeted optimizations",
  steps: [
    {
      instruction:
        "Use `timeit.timeit` to compare two string-building implementations: (1) concatenating with `+=` in a loop, and (2) using `''.join()`. Run each 1,000 times and print both elapsed times and the speedup ratio. Which approach wins and why?",
      hint: "Pass the snippet as a string to `timeit.timeit(stmt, setup, number=1000)`. Put any imports or data setup in the `setup` argument — that code runs once before the timed loop. The join approach wins because strings are immutable; `+=` creates a new string object on every iteration.",
      starterCode: `import timeit

setup = "words = ['hello', 'world', 'foo', 'bar'] * 250"  # 1000 words

# Approach 1: string concatenation with +=
stmt_concat = """
result = ''
for w in words:
    result += w + ' '
"""

# Approach 2: ''.join()
stmt_join = "result = ' '.join(words)"

N = 1_000

t_concat = timeit.timeit(stmt_concat, setup=setup, number=N)
# t_join   = timeit.timeit(stmt_join,   setup=setup, number=N)

print(f"Concatenation: {t_concat:.4f}s for {N} runs")
# print(f"join():        {t_join:.4f}s for {N} runs")
# print(f"Speedup:       {t_concat / t_join:.1f}x")
`,
      validate: (code: string) =>
        code.includes("timeit.timeit") &&
        code.includes("join"),
      successMessage:
        "join() is typically 5-20x faster than += in a loop for large lists. The reason is immutability: each += allocates a new string of growing size, turning an O(n) operation into O(n²) in total character copies. join() allocates exactly once.",
    },
    {
      instruction:
        "Profile a naive recursive Fibonacci function using `cProfile.run()`. Then use `pstats.Stats` to sort the output by `tottime` and print the top 5 functions. Observe the `ncalls` column — `fib(25)` makes over a million calls!",
      hint: "Use `cProfile.run('fib(25)')` where `fib` is defined before the run call. To capture the output as a string, use `io.StringIO()` with `pstats.Stats(pr, stream=sio)`. The ncalls column for recursive functions shows `total_calls/primitive_calls`.",
      starterCode: `import cProfile
import pstats
import io

def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

# Profile fib(25) using cProfile.run()
# cProfile.run("fib(25)")

# For more control, use Profile() context manager style:
pr = cProfile.Profile()
pr.enable()
result = fib(25)
pr.disable()

print(f"fib(25) = {result}")

# Capture stats and sort by tottime, print top 5
stream = io.StringIO()
# stats = pstats.Stats(pr, stream=stream)
# stats.sort_stats("tottime")
# stats.print_stats(5)
# print(stream.getvalue())
`,
      validate: (code: string) =>
        code.includes("cProfile") &&
        (code.includes("pstats") || code.includes("cProfile.run")),
      successMessage:
        "fib(25) without memoization makes 242,785 calls. cProfile shows this clearly in the ncalls column. tottime per call is tiny, but ncalls is enormous — this is the classic exponential blowup. The fix is memoization, which you'll apply in step 4.",
    },
    {
      instruction:
        "Compare the memory footprint of a list comprehension versus a generator expression using `sys.getsizeof`. Create both for `x**2` over `range(1000)` and print their sizes. Then iterate through the generator to show it produces the same values.",
      hint: "`sys.getsizeof([x**2 for x in range(1000)])` gives the list's size in bytes. `sys.getsizeof(x**2 for x in range(1000))` gives the generator object's size — generators are lazy, so the size is nearly constant regardless of how many elements they would produce.",
      starterCode: `import sys

# List comprehension — all 1000 values allocated immediately
squares_list = [x**2 for x in range(1000)]

# Generator expression — lazy, no values computed yet
squares_gen = (x**2 for x in range(1000))

list_size = sys.getsizeof(squares_list)
gen_size  = sys.getsizeof(squares_gen)

print(f"List size:      {list_size:,} bytes")
print(f"Generator size: {gen_size:,} bytes")
# print(f"Ratio:          {list_size / gen_size:.0f}x larger")

# Show that the generator produces the same values
# first_five = [next(squares_gen) for _ in range(5)]
# print(f"First 5 values: {first_five}")
`,
      validate: (code: string) =>
        code.includes("sys.getsizeof") &&
        (code.includes("for x in range") || code.includes("x**2")),
      successMessage:
        "A list of 1000 integers takes ~8,056 bytes. The generator object takes ~104 bytes — about 80x smaller. Generators are the right tool when you process items one at a time and don't need random access. For very large sequences (millions of items), the memory difference is even more dramatic.",
    },
    {
      instruction:
        "Speed up recursive Fibonacci with `@functools.lru_cache`. Measure the time for `fib(35)` before and after adding the cache using `timeit.timeit`. Then inspect `fib.cache_info()` to see how many cache hits occurred.",
      hint: "Decorate the function with `@lru_cache(maxsize=None)` (unbounded cache). Use `timeit.timeit` with `number=1` for the uncached version (it's too slow for many runs) and `number=1000` for the cached version. Call `fib.cache_clear()` between timing runs to reset the cache.",
      starterCode: `import timeit
from functools import lru_cache

# Uncached version
def fib_slow(n):
    if n < 2:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)

# Cached version — add @lru_cache decorator
# @lru_cache(maxsize=None)
def fib_fast(n):
    if n < 2:
        return n
    return fib_fast(n - 1) + fib_fast(n - 2)

# Time the slow version (use number=1 — it's exponential!)
t_slow = timeit.timeit("fib_slow(30)", globals=globals(), number=1)
print(f"fib_slow(30): {t_slow:.4f}s")

# Time the fast (cached) version
# t_fast = timeit.timeit("fib_fast(30)", globals=globals(), number=1000)
# print(f"fib_fast(30) x1000: {t_fast:.6f}s")

# Inspect cache stats
# print(fib_fast.cache_info())
`,
      validate: (code: string) =>
        code.includes("lru_cache") &&
        code.includes("timeit"),
      successMessage:
        "With lru_cache, fib(30) goes from ~1 second (9 million calls) to microseconds. cache_info shows nearly all calls become hits after the first run. This is memoization: trade memory for time by storing results you've already computed.",
    },
    {
      instruction:
        "Demonstrate local variable optimization: in a tight loop that calls a module-level function (like `math.sqrt`), cache the function as a local variable before the loop. Use `timeit` to measure the speedup. Explain in a comment why this works.",
      hint: "Python resolves names in order: local → enclosing → global → builtin. Each global lookup costs a dict access. Binding `_sqrt = math.sqrt` before the loop means the loop body does a local lookup (LOAD_FAST bytecode) instead of two global lookups (LOAD_GLOBAL for `math`, then attribute access for `sqrt`).",
      starterCode: `import timeit
import math

# Slow: global lookup of math.sqrt on every iteration
def compute_slow(n):
    result = []
    for i in range(n):
        result.append(math.sqrt(i))
    return result

# Fast: cache math.sqrt as a local variable before the loop
def compute_fast(n):
    _sqrt = math.sqrt   # Local reference — LOAD_FAST is cheaper than LOAD_GLOBAL
    _append = [].append # Won't work quite right — see below for correct pattern
    result = []
    append = result.append
    for i in range(n):
        append(_sqrt(i))
    return result

N = 10_000
RUNS = 500

t_slow = timeit.timeit("compute_slow(N)", globals=globals(), number=RUNS)
t_fast = timeit.timeit("compute_fast(N)", globals=globals(), number=RUNS)

print(f"Global lookup: {t_slow:.4f}s")
print(f"Local cache:   {t_fast:.4f}s")
# print(f"Speedup:       {t_slow / t_fast:.2f}x")
`,
      validate: (code: string) =>
        code.includes("timeit") &&
        code.includes("math.sqrt") &&
        code.includes("_sqrt"),
      successMessage:
        "Local variable optimization typically gives a 10-30% speedup in tight loops. It's a micro-optimization — only worth it in hot paths called millions of times. The key insight: LOAD_FAST (local) is a single array index lookup; LOAD_GLOBAL is a dict lookup plus attribute access.",
    },
  ],
};
