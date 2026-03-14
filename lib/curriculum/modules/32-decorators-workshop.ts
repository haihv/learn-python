import type { WorkshopModule } from "../types";

export const decoratorsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "32",
  slug: "decorators-workshop",
  title: "Building Custom Decorators",
  icon: "🔨",
  estimatedMinutes: 20,
  description: "Build real-world decorator patterns",
  steps: [
    {
      instruction:
        "Build a `timer` decorator that measures and prints how long a function takes to run. Use `time.perf_counter()` for precision. Apply it to a `slow_add(a, b)` function that sleeps 0.1 seconds and returns `a + b`. Use `@functools.wraps` to preserve metadata.",
      hint: "Import wraps from functools and time. In wrapper: record start = time.perf_counter(), call func, compute elapsed = time.perf_counter() - start, print the time, return result. The print format should include func.__name__.",
      starterCode: `import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # TODO: record start, call func, compute elapsed,
        # print f"{func.__name__} took {elapsed:.4f}s", return result
        pass
    return wrapper

@timer
def slow_add(a, b):
    """Add two numbers after a short delay."""
    time.sleep(0.1)
    return a + b

result = slow_add(3, 4)
print(f"Result: {result}")
print(f"Name: {slow_add.__name__}")   # Should be 'slow_add'
print(f"Doc: {slow_add.__doc__}")     # Should show the docstring
`,
      validate: (code: string) => {
        return (
          code.includes("timer") &&
          code.includes("perf_counter") &&
          code.includes("wraps") &&
          code.includes("elapsed")
        );
      },
      successMessage:
        "Timer decorator built! This pattern is invaluable for profiling code bottlenecks in production.",
    },
    {
      instruction:
        "Build a `retry(times=3)` decorator factory that automatically retries a function if it raises an exception. After all retries are exhausted, re-raise the last exception. Test it with a function that fails twice then succeeds.",
      hint: "retry(times) returns a decorator. Inside wrapper, use a loop: for attempt in range(times): try: return func(...) except Exception as e: last_exc = e. After the loop, raise last_exc.",
      starterCode: `from functools import wraps

def retry(times=3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # TODO: loop range(times), try calling func, catch errors,
            # re-raise after all retries are exhausted
            pass
        return wrapper
    return decorator

# Test: fails first two attempts, succeeds on third
call_count = 0

@retry(times=3)
def flaky_function():
    global call_count
    call_count += 1
    if call_count < 3:
        raise ValueError(f"Not ready yet (attempt {call_count})")
    return "success!"

result = flaky_function()
print(f"Final result: {result}")  # success!
`,
      validate: (code: string) => {
        return (
          code.includes("retry") &&
          code.includes("times") &&
          code.includes("attempt") &&
          code.includes("Exception") &&
          code.includes("raise")
        );
      },
      successMessage:
        "Retry decorator done! This pattern is used in HTTP clients, database connections, and any operation that may transiently fail.",
    },
    {
      instruction:
        "Build a simple `cache` decorator (without using functools.lru_cache) that stores results in a dictionary keyed by the function arguments. Apply it to a `fib(n)` function and verify it works for `fib(20)`.",
      hint: "In your decorator, create a dict called cache = {}. In wrapper: key = args, if key in cache: return cache[key]. Otherwise compute result = func(*args), store cache[key] = result, return result.",
      starterCode: `from functools import wraps

def simple_cache(func):
    cache = {}

    @wraps(func)
    def wrapper(*args):
        # TODO: if args in cache return it, else compute,
        # store cache[args] = result, return result
        pass

    wrapper.cache = cache  # expose cache for inspection
    return wrapper

@simple_cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(20))            # 6765
print(fib(30))            # 832040
print(len(fib.cache))     # Number of cached values
`,
      validate: (code: string) => {
        return (
          code.includes("simple_cache") &&
          code.includes("cache") &&
          code.includes("args") &&
          code.includes("fib") &&
          code.includes("in cache")
        );
      },
      successMessage:
        "You built memoization from scratch! Understanding the internals helps you know when to use lru_cache vs rolling your own.",
    },
    {
      instruction:
        "Build a `validate_types` decorator that checks that all positional arguments match expected types. Use `inspect.signature` or just check `isinstance` against a tuple of types passed to the decorator factory. If a type doesn't match, raise a `TypeError`.",
      hint: "validate_types(*types) returns a decorator. In wrapper, use zip(types, args) to check isinstance(arg, expected_type). Raise TypeError with a descriptive message if a mismatch is found.",
      starterCode: `from functools import wraps

def validate_types(*types):
    """Decorator factory: validates positional arg types at call time."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # TODO: pair each arg with its expected type, check the type,
            # raise an error on mismatch, then call and return func(*args, **kwargs)
            pass
        return wrapper
    return decorator

@validate_types(str, int)
def repeat_string(text, times):
    """Repeat a string n times."""
    return text * times

print(repeat_string("ha", 3))   # hahaha

try:
    repeat_string(42, 3)         # Should raise TypeError
except TypeError as e:
    print(f"TypeError: {e}")    # Argument 0 expected str, got int
`,
      validate: (code: string) => {
        return (
          code.includes("validate_types") &&
          code.includes("isinstance") &&
          code.includes("TypeError") &&
          code.includes("zip")
        );
      },
      successMessage:
        "Runtime type validation via decorator! This pattern is the foundation of many data validation libraries like Pydantic.",
    },
    {
      instruction:
        "Create a parameterized `@log_level(level)` decorator that prints a log message at the given level ('INFO', 'DEBUG', 'WARNING') before and after calling the function. Stack it with the `@timer` decorator to show decorator composition.",
      hint: "log_level(level) returns a decorator. In the wrapper, print f'[{level}] Calling {func.__name__}' before and f'[{level}] {func.__name__} complete' after. Then stack both @timer and @log_level on one function.",
      starterCode: `import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"  [TIMER] {func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

def log_level(level="INFO"):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # TODO: print a bracketed label before calling func,
            # call func, print a bracketed label after, return result
            pass
        return wrapper
    return decorator

@timer
@log_level("DEBUG")
def compute(x, y):
    """Compute x to the power of y."""
    time.sleep(0.05)
    return x ** y

result = compute(2, 10)
print(f"Final: {result}")
`,
      validate: (code: string) => {
        return (
          code.includes("log_level") &&
          code.includes("timer") &&
          code.includes("@timer") &&
          code.includes("@log_level") &&
          code.includes("{level}") &&
          code.includes("func.__name__")
        );
      },
      successMessage:
        "Decorator composition is powerful — each decorator adds one concern, and they stack cleanly. This is the Open/Closed Principle in action!",
    },
  ],
};
