import type { WorkshopModule } from "../types";

export const functoolsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "30",
  slug: "functools-workshop",
  title: "Caching & Partial Application",
  icon: "⚡",
  estimatedMinutes: 20,
  description: "Apply functools patterns to write efficient, reusable code",
  steps: [
    {
      instruction:
        "Use `functools.partial` to create two specialized functions from a general `power(base, exp)` function: `square` (exp=2) and `cube` (exp=3). Then print `square(4)` and `cube(3)`.",
      hint: "Import partial from functools. Define power(base, exp), then use partial(power, exp=2) for square. Call square(4) and cube(3) and print the results.",
      starterCode: `from functools import partial

def power(base, exp):
    return base ** exp

# Create square and cube using partial
square = None  # replace with partial call
cube = None    # replace with partial call

print(square(4))   # Should print 16
print(cube(3))     # Should print 27
`,
      validate: (code: string) => {
        return (
          code.includes("partial") &&
          code.includes("square") &&
          code.includes("cube") &&
          code.includes("power")
        );
      },
      successMessage:
        "Partial application mastered! You locked in arguments to create specialized versions of a general function.",
    },
    {
      instruction:
        "Use `functools.reduce` to compute the product of all numbers in a list `[1, 2, 3, 4, 5]`. Store the result in `product` and print it. (Expected: 120)",
      hint: "Import reduce from functools. Use reduce(lambda acc, x: acc * x, numbers) to multiply all elements together.",
      starterCode: `from functools import reduce

numbers = [1, 2, 3, 4, 5]

# Use reduce to compute the product
product = None  # replace with reduce call

print(product)  # Should print 120
`,
      validate: (code: string) => {
        return (
          code.includes("reduce") &&
          code.includes("product") &&
          (code.includes("lambda") || code.includes("def "))
        );
      },
      successMessage:
        "reduce() folds a sequence into a single value — the foundation of many functional patterns!",
    },
    {
      instruction:
        "Decorate a `fibonacci(n)` function with `@lru_cache(maxsize=None)`. The function should recursively compute the nth Fibonacci number. Print `fibonacci(40)` and then print `fibonacci.cache_info()` to see the cache statistics.",
      hint: "Import lru_cache from functools. Use @lru_cache(maxsize=None) above your def. Base case: n < 2 returns n. Recursive: fibonacci(n-1) + fibonacci(n-2).",
      starterCode: `from functools import lru_cache

# Add the lru_cache decorator here
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(40))          # Should print 102334155
print(fibonacci.cache_info()) # Should show hits, misses, currsize
`,
      validate: (code: string) => {
        return (
          code.includes("lru_cache") &&
          code.includes("fibonacci") &&
          code.includes("cache_info")
        );
      },
      successMessage:
        "Memoization with lru_cache turns exponential recursion into linear time — a huge practical speedup!",
    },
    {
      instruction:
        "Write a decorator called `log_calls` that prints the function name and arguments each time it is called. Use `@functools.wraps(func)` inside the decorator to preserve metadata. Apply it to a function `add(a, b)` that returns `a + b`. Verify that `add.__name__` is still `'add'`.",
      hint: "Import wraps from functools. In your decorator, define wrapper(*args, **kwargs), print the function name and args, call func(*args, **kwargs), and return the result. Use @wraps(func) on the wrapper.",
      starterCode: `from functools import wraps

def log_calls(func):
    # Use @wraps(func) here to preserve metadata
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
        result = func(*args, **kwargs)
        return result
    return wrapper

@log_calls
def add(a, b):
    """Return the sum of a and b."""
    return a + b

print(add(3, 4))        # Should print the log then 7
print(add.__name__)     # Should print 'add', not 'wrapper'
print(add.__doc__)      # Should print the original docstring
`,
      validate: (code: string) => {
        return (
          code.includes("wraps") &&
          code.includes("log_calls") &&
          code.includes("__name__")
        );
      },
      successMessage:
        "functools.wraps keeps your decorators transparent — introspection tools see the real function, not the wrapper.",
    },
    {
      instruction:
        "Compare the performance of a cached vs uncached recursive Fibonacci. Implement `fib_cached` using `@functools.cache` and `fib_uncached` without. Use `time.perf_counter()` to measure how long each takes to compute `fib(35)`. Print both results and times.",
      hint: "Import cache from functools and time. Decorate fib_cached with @cache. For fib_uncached, just a plain recursive function. Measure with start = time.perf_counter(), then elapsed = time.perf_counter() - start.",
      starterCode: `from functools import cache
import time

@cache
def fib_cached(n):
    if n < 2:
        return n
    return fib_cached(n - 1) + fib_cached(n - 2)

def fib_uncached(n):
    if n < 2:
        return n
    return fib_uncached(n - 1) + fib_uncached(n - 2)

# Measure cached version
start = time.perf_counter()
result_cached = fib_cached(35)
time_cached = time.perf_counter() - start

# Measure uncached version
start = time.perf_counter()
result_uncached = fib_uncached(35)
time_uncached = time.perf_counter() - start

print(f"Cached:   {result_cached} in {time_cached:.6f}s")
print(f"Uncached: {result_uncached} in {time_uncached:.6f}s")
print(f"Speedup: {time_uncached / time_cached:.1f}x")
`,
      validate: (code: string) => {
        return (
          code.includes("cache") &&
          code.includes("fib_cached") &&
          code.includes("fib_uncached") &&
          code.includes("perf_counter")
        );
      },
      successMessage:
        "The cache makes the difference between milliseconds and seconds. This is why memoization is one of the most powerful optimization techniques in Python!",
    },
  ],
};
