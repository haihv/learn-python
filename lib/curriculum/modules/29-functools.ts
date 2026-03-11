import type { LessonModule } from "../types";

export const functools: LessonModule = {
  type: "lesson",
  id: "29",
  slug: "functools",
  title: "functools: partial, reduce, lru_cache, wraps",
  icon: "🔧",
  estimatedMinutes: 15,
  content: `# functools: Higher-Order Functions & Caching

The \`functools\` module is Python's toolbox for working with functions as first-class objects. It provides utilities for caching expensive computations, creating specialized versions of functions, and writing well-behaved decorators.

\`\`\`python
import functools
\`\`\`

## functools.partial — Partial Application

\`partial(func, *args, **kwargs)\` creates a new function with some arguments pre-filled. This is called **partial application** — you "partially" call a function, locking in some of its arguments.

\`\`\`python
from functools import partial

def power(base, exponent):
    return base ** exponent

# Create specialized versions
square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))   # 25
print(cube(3))     # 27

# Partial with positional args (fills from the left)
double = partial(lambda x, n: x * n, n=2)
print(double(7))   # 14

# Practical use: configuring functions for map()
from functools import partial

def multiply(x, factor):
    return x * factor

triple = partial(multiply, factor=3)
numbers = [1, 2, 3, 4, 5]
tripled = list(map(triple, numbers))
print(tripled)  # [3, 6, 9, 12, 15]
\`\`\`

### Why Use partial Instead of a Lambda?

\`\`\`python
# Lambda version
triple_lambda = lambda x: multiply(x, 3)

# partial version
triple_partial = partial(multiply, factor=3)

# partial has a better repr and preserves the original function's metadata
print(triple_partial)
# functools.partial(<function multiply at 0x...>, factor=3)
\`\`\`

\`partial\` also works great for callback-based APIs where you need to pass a function with no arguments but want to encode some configuration into it.

## functools.reduce — Fold Over a Sequence

\`reduce(function, iterable, initializer=None)\` applies a two-argument function cumulatively to items of an iterable, reducing it to a single value.

\`\`\`python
from functools import reduce

# Sum using reduce
numbers = [1, 2, 3, 4, 5]
total = reduce(lambda acc, x: acc + x, numbers)
print(total)  # 15

# How it works step by step:
# Step 1: acc=1,  x=2  → 3
# Step 2: acc=3,  x=3  → 6
# Step 3: acc=6,  x=4  → 10
# Step 4: acc=10, x=5  → 15

# With an initializer (starting value)
product = reduce(lambda acc, x: acc * x, numbers, 1)
print(product)  # 120

# Flatten a list of lists
nested = [[1, 2], [3, 4], [5, 6]]
flat = reduce(lambda acc, lst: acc + lst, nested, [])
print(flat)  # [1, 2, 3, 4, 5, 6]

# Find the maximum (demonstrating the concept — max() is better in practice)
maximum = reduce(lambda a, b: a if a > b else b, numbers)
print(maximum)  # 5
\`\`\`

Note: For simple reductions, Python's built-ins (\`sum()\`, \`max()\`, \`min()\`) are preferred. \`reduce()\` shines for custom accumulation logic.

## functools.lru_cache — Memoization Made Easy

\`lru_cache\` (Least Recently Used cache) caches the return value of a function based on its arguments. When the same arguments are passed again, it returns the cached result without re-executing the function.

\`\`\`python
from functools import lru_cache
import time

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Without cache: exponential time O(2^n)
# With cache: linear time O(n) — each value computed once

print(fibonacci(10))   # 55
print(fibonacci(50))   # 12586269025 (instant!)

# Check cache stats
print(fibonacci.cache_info())
# CacheInfo(hits=48, misses=11, maxsize=128, currsize=11)
\`\`\`

### maxsize Parameter

\`maxsize\` controls how many different argument combinations to remember:

\`\`\`python
# maxsize=None means unlimited cache (no eviction)
@lru_cache(maxsize=None)
def expensive_computation(n):
    time.sleep(0.1)  # Simulate slow work
    return n * n

# maxsize=128 (default) keeps the 128 most recent unique calls
@lru_cache(maxsize=128)
def fetch_user(user_id):
    # In real code, this might query a database
    return {"id": user_id, "name": f"User {user_id}"}

# Clear cache when needed
fibonacci.cache_clear()
print(fibonacci.cache_info())  # hits=0, misses=0, currsize=0
\`\`\`

### Important: Arguments Must Be Hashable

\`lru_cache\` uses the arguments as a dictionary key, so they must be hashable. Lists, dicts, and sets cannot be cached directly.

\`\`\`python
@lru_cache(maxsize=None)
def sum_tuple(items: tuple) -> int:
    return sum(items)

# Call with a tuple (hashable)
print(sum_tuple((1, 2, 3, 4)))  # 10

# To use with lists, convert at the call site:
my_list = [1, 2, 3, 4]
print(sum_tuple(tuple(my_list)))  # 10
\`\`\`

## functools.cache — Simpler Unlimited Cache (Python 3.9+)

\`functools.cache\` is shorthand for \`lru_cache(maxsize=None)\`. It's simpler and slightly faster because it skips the LRU bookkeeping.

\`\`\`python
from functools import cache

@cache
def factorial(n):
    return 1 if n == 0 else n * factorial(n - 1)

print(factorial(10))  # 3628800
print(factorial.cache_info())  # CacheInfo(hits=9, misses=11, maxsize=None, currsize=11)
\`\`\`

Use \`cache\` when you want unlimited caching. Use \`lru_cache(maxsize=N)\` when memory is a concern and you want to limit the cache size.

## functools.wraps — Preserving Decorator Metadata

When you write a decorator, your wrapper function replaces the original. This breaks \`__name__\`, \`__doc__\`, and other metadata. \`wraps\` fixes that.

\`\`\`python
from functools import wraps

# WITHOUT wraps — metadata is lost
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        """Wrapper docstring."""
        return func(*args, **kwargs)
    return wrapper

@bad_decorator
def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}!"

print(greet.__name__)   # 'wrapper'  ← WRONG
print(greet.__doc__)    # 'Wrapper docstring.'  ← WRONG

# WITH wraps — metadata is preserved
def good_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@good_decorator
def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}!"

print(greet.__name__)   # 'greet'  ← correct
print(greet.__doc__)    # 'Return a greeting message.'  ← correct
\`\`\`

\`wraps\` copies \`__name__\`, \`__qualname__\`, \`__doc__\`, \`__dict__\`, \`__module__\`, and \`__annotations__\` from the original function to the wrapper. This makes introspection tools, documentation generators, and debuggers work correctly.

### Accessing the Wrapped Function

\`wraps\` also sets \`__wrapped__\`, which points to the original function:

\`\`\`python
print(greet.__wrapped__)  # <function greet at 0x...>

# This lets you bypass the decorator for testing
original = greet.__wrapped__
print(original("World"))  # Hello, World!
\`\`\`

## Combining functools Tools

\`\`\`python
from functools import lru_cache, partial, wraps
import time

def timed(func):
    """Log the execution time of a function."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timed
@lru_cache(maxsize=None)
def fib(n):
    """Compute fibonacci(n) with memoization."""
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(35))
# fib took 0.0001s  (fast due to caching after first call)
# 9227465
\`\`\`

The key insight is that \`functools\` transforms functions into more powerful versions of themselves — adding caching, parameter locking, or metadata preservation — without changing their fundamental behavior.
`,
  quiz: [
    {
      question: "What does `functools.partial(pow, 2)` create?",
      options: [
        "A function that raises its argument to the power of 2",
        "A function that computes 2 raised to a given power",
        "A function that always returns 2",
        "A curried version of pow() that takes no arguments",
      ],
      correctIndex: 1,
    },
    {
      question: "Why must arguments to an `lru_cache`-decorated function be hashable?",
      options: [
        "Because the cache stores results in a set",
        "Because the arguments are used as dictionary keys to look up cached results",
        "Because hashable objects are faster to compare",
        "Because the LRU algorithm requires it for eviction ordering",
      ],
      correctIndex: 1,
    },
    {
      question: "What problem does `@functools.wraps(func)` solve in decorators?",
      options: [
        "It makes the decorator thread-safe",
        "It prevents the decorated function from being called multiple times",
        "It copies the original function's name, docstring, and other metadata to the wrapper",
        "It automatically caches the decorated function's results",
      ],
      correctIndex: 2,
    },
  ],
};
