import type { LessonModule } from "../types";

export const decorators: LessonModule = {
  type: "lesson",
  id: "31",
  slug: "decorators",
  title: "Function Decorators & @ Syntax",
  icon: "🎨",
  estimatedMinutes: 15,
  content: `# Function Decorators & @ Syntax

A **decorator** is a function that takes another function and returns a modified version of it. Decorators let you add behavior to existing functions without modifying their source code — a key principle of clean, composable design.

## What Is a Decorator?

At the core, decorators are just functions that wrap other functions:

\`\`\`python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before the function runs")
        result = func(*args, **kwargs)
        print("After the function runs")
        return result
    return wrapper

def greet(name):
    print(f"Hello, {name}!")

# Manually applying a decorator
greet = my_decorator(greet)
greet("Alice")
# Before the function runs
# Hello, Alice!
# After the function runs
\`\`\`

## The @ Syntax (Syntactic Sugar)

The \`@decorator_name\` syntax is just a cleaner way to write the pattern above. These two are **identical**:

\`\`\`python
# Long form
def greet(name):
    print(f"Hello, {name}!")
greet = my_decorator(greet)

# Short form using @ syntax
@my_decorator
def greet(name):
    print(f"Hello, {name}!")
\`\`\`

Python sees \`@my_decorator\` and immediately applies it: \`greet = my_decorator(greet)\`.

## The Wrapper Pattern

The standard pattern for a decorator that works with any function:

\`\`\`python
from functools import wraps

def decorator(func):
    @wraps(func)             # Preserves __name__, __doc__, etc.
    def wrapper(*args, **kwargs):
        # Code that runs BEFORE the original function
        result = func(*args, **kwargs)  # Call the original
        # Code that runs AFTER the original function
        return result        # Always return the result
    return wrapper
\`\`\`

Using \`*args\` and \`**kwargs\` makes the wrapper transparent — it passes through any arguments the original function accepts.

### Practical Example: Timing

\`\`\`python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(0.5)
    return "done"

result = slow_function()
# slow_function took 0.5001s
print(result)  # done
\`\`\`

### Practical Example: Logging

\`\`\`python
from functools import wraps

def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}({args}, {kwargs})")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result!r}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

add(3, 4)
# Calling add((3, 4), {})
# add returned 7
\`\`\`

## Preserving Metadata with functools.wraps

Without \`@wraps\`, decorators destroy the original function's identity:

\`\`\`python
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@bad_decorator
def my_func():
    """My important docstring."""
    pass

print(my_func.__name__)  # 'wrapper'  ← broken
print(my_func.__doc__)   # None       ← broken
\`\`\`

\`@wraps(func)\` copies \`__name__\`, \`__qualname__\`, \`__doc__\`, \`__annotations__\`, and \`__module__\` from the original to the wrapper. Always use it.

## Stacking Decorators

Multiple decorators can be applied to the same function. They are applied **bottom-up** (innermost first):

\`\`\`python
from functools import wraps

def bold(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return f"<b>{func(*args, **kwargs)}</b>"
    return wrapper

def italic(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return f"<i>{func(*args, **kwargs)}</i>"
    return wrapper

@bold
@italic
def greet(name):
    return f"Hello, {name}"

print(greet("Alice"))  # <b><i>Hello, Alice</i></b>

# Equivalent to:
# greet = bold(italic(greet))
\`\`\`

The innermost decorator (\`@italic\`) is applied first, then \`@bold\` wraps the result.

## Decorators with Parameters

To create a decorator that accepts arguments, you need an extra level of nesting — a function that returns a decorator:

\`\`\`python
from functools import wraps

def repeat(n):
    """Decorator factory: returns a decorator that calls func n times."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Hello!")

say_hello()
# Hello!
# Hello!
# Hello!
\`\`\`

The \`repeat(3)\` call returns a decorator, and that decorator is applied to \`say_hello\`. This is called a **decorator factory**.

## Class Decorators

A class can also act as a decorator if it defines \`__call__\`:

\`\`\`python
import functools

class CountCalls:
    """Decorator that counts how many times a function is called."""
    def __init__(self, func):
        self.func = func
        self.count = 0
        # Preserve the original function's attributes
        functools.update_wrapper(self, func)

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Call #{self.count} to {self.func.__name__}")
        return self.func(*args, **kwargs)

@CountCalls
def greet(name):
    return f"Hi, {name}!"

greet("Alice")  # Call #1 to greet
greet("Bob")    # Call #2 to greet
print(greet.count)  # 2  ← accessible as an attribute!
\`\`\`

Class decorators are useful when you need to store state between calls.

## Built-in Decorators

Python provides several built-in decorators for class methods:

### @staticmethod

A method that doesn't receive \`self\` or \`cls\`. It's just a regular function namespaced inside a class.

\`\`\`python
class MathUtils:
    @staticmethod
    def add(a, b):
        return a + b

print(MathUtils.add(3, 4))  # 7  (no instance needed)
\`\`\`

### @classmethod

Receives the **class** itself as the first argument (\`cls\`). Used for alternative constructors.

\`\`\`python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_string):
        year, month, day = map(int, date_string.split("-"))
        return cls(year, month, day)  # Creates an instance of the class

d = Date.from_string("2024-03-15")
print(d.year, d.month, d.day)  # 2024 3 15
\`\`\`

### @property

Turns a method into a computed attribute (covered in depth in the Properties lesson):

\`\`\`python
class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        import math
        return math.pi * self.radius ** 2

c = Circle(5)
print(c.area)  # 78.539...  (called like an attribute, not a method)
\`\`\`

## Decorator Use Cases in the Real World

Decorators are everywhere in Python:

- **Flask/FastAPI routes**: \`@app.get("/users")\` registers URL handlers
- **pytest fixtures**: \`@pytest.fixture\` marks setup functions
- **dataclasses**: \`@dataclass\` auto-generates \`__init__\`, \`__repr__\`, etc.
- **Django views**: \`@login_required\` enforces authentication
- **Caching**: \`@lru_cache\` and \`@cache\` memoize expensive computations
- **Retrying**: \`@retry(times=3)\` auto-retries on failure

The decorator pattern is one of Python's most powerful and widely-used features.
`,
  quiz: [
    {
      question: "When you stack decorators like `@A` above `@B` on a function, in what order are they applied?",
      options: [
        "A is applied first, then B wraps the result",
        "B is applied first, then A wraps the result",
        "They are applied simultaneously",
        "The order doesn't matter for stacked decorators",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the main purpose of using `@functools.wraps(func)` inside a decorator?",
      options: [
        "To make the decorator faster by skipping argument validation",
        "To allow the decorator to accept keyword arguments",
        "To copy the original function's metadata (name, docstring) to the wrapper function",
        "To automatically cache the decorated function's return values",
      ],
      correctIndex: 2,
    },
    {
      question: "What does `@repeat(3)` represent if `repeat` is a decorator factory?",
      options: [
        "A decorator applied 3 times to the same function",
        "A call to `repeat(3)` that returns a decorator, which is then applied to the function",
        "A syntax error — decorators cannot have parentheses with arguments",
        "A way to run the function 3 times before defining it",
      ],
      correctIndex: 1,
    },
  ],
};
