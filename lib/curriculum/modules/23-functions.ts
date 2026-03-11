import type { LessonModule } from "../types";

export const functions: LessonModule = {
  type: "lesson",
  id: "23",
  slug: "functions",
  title: "Functions: def, return, Docstrings",
  icon: "🔧",
  estimatedMinutes: 12,
  content: `# Functions: def, return, Docstrings

Functions are reusable blocks of code that accept inputs, perform a task, and optionally return a value. They are the primary tool for organising code, avoiding repetition, and expressing intent.

## Defining Functions

\`\`\`python
# Basic syntax
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")   # Hello, Alice!
greet("Bob")     # Hello, Bob!
\`\`\`

A function definition consists of:
1. \`def\` keyword
2. Function name (follows the same rules as variable names)
3. Parameter list in parentheses
4. Colon
5. Indented body

## Parameters and Arguments

\`\`\`python
# Multiple parameters
def add(a, b):
    return a + b

result = add(3, 4)    # 7

# Default parameter values — make a parameter optional
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))             # Hello, Alice!
print(greet("Bob", "Good day"))   # Good day, Bob!

# Calling with keyword arguments (order doesn't matter)
print(greet(greeting="Hi", name="Carol"))  # Hi, Carol!
\`\`\`

### The Mutable Default Gotcha

This is one of the most common Python bugs for newcomers: **mutable default arguments are shared across all calls**.

\`\`\`python
# BUG: the default list is created ONCE and reused
def append_to(value, lst=[]):
    lst.append(value)
    return lst

print(append_to(1))   # [1]
print(append_to(2))   # [1, 2]  — NOT [2]!
print(append_to(3))   # [1, 2, 3]

# FIX: use None as default, create fresh object inside
def append_to(value, lst=None):
    if lst is None:
        lst = []
    lst.append(value)
    return lst

print(append_to(1))   # [1]
print(append_to(2))   # [2]  — correct!
\`\`\`

The pattern \`def func(arg=None)\` with \`if arg is None: arg = []\` inside the body is the idiomatic fix for any mutable default (lists, dicts, sets).

## Return Values

\`\`\`python
def square(x):
    return x ** 2

print(square(5))   # 25

# Functions return None by default if return is absent or bare
def do_nothing():
    pass

result = do_nothing()
print(result)   # None

# Return multiple values — Python packs them into a tuple
def min_max(lst):
    return min(lst), max(lst)

lo, hi = min_max([3, 1, 4, 1, 5, 9])
print(lo, hi)   # 1 9

# Return early from a function
def divide(a, b):
    if b == 0:
        return None   # or raise ValueError
    return a / b
\`\`\`

## Type Hints

Type hints (PEP 484) annotate function signatures with expected types. They don't enforce types at runtime but enable static analysis tools (mypy, pyright) and improve editor autocompletion.

\`\`\`python
def add(a: int, b: int) -> int:
    return a + b

def greet(name: str, loud: bool = False) -> str:
    msg = f"Hello, {name}!"
    return msg.upper() if loud else msg

# Complex types use the built-ins (Python 3.9+)
def first(lst: list[int]) -> int | None:
    return lst[0] if lst else None

# For Python 3.8 compatibility, import from typing
from typing import Optional, List
def first_compat(lst: List[int]) -> Optional[int]:
    return lst[0] if lst else None
\`\`\`

## Docstrings

A docstring is a string literal placed immediately after the \`def\` line. It documents what the function does, its parameters, and its return value. Tools like \`help()\`, Sphinx, and IDEs read docstrings automatically.

\`\`\`python
# One-liner docstring — for simple, obvious functions
def square(x: float) -> float:
    """Return x raised to the power of 2."""
    return x ** 2

# Multi-line Google-style docstring
def divide(a: float, b: float) -> float:
    """Divide a by b and return the result.

    Args:
        a: The dividend.
        b: The divisor. Must not be zero.

    Returns:
        The quotient a / b.

    Raises:
        ValueError: If b is zero.
    """
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# Access the docstring at runtime
print(divide.__doc__)
help(divide)
\`\`\`

## First-Class Functions

In Python, functions are **first-class objects** — they can be assigned to variables, passed as arguments, and returned from other functions.

\`\`\`python
# Assign a function to a variable
def shout(text):
    return text.upper()

say = shout          # say now references the same function
print(say("hello"))  # HELLO

# Pass a function as an argument (higher-order functions)
def apply(func, value):
    return func(value)

print(apply(str.upper, "hello"))   # HELLO
print(apply(len, "hello"))         # 5

# Built-in higher-order functions: map, filter, sorted
numbers = [3, 1, 4, 1, 5, 9]
doubled = list(map(lambda x: x * 2, numbers))
evens   = list(filter(lambda x: x % 2 == 0, numbers))
print(doubled)  # [6, 2, 8, 2, 10, 18]
print(evens)    # [4]
\`\`\`

## Scope: Local vs Global

\`\`\`python
x = 10   # Global variable

def show():
    x = 20         # Local variable — shadows the global x
    print(x)       # 20 (local)

show()
print(x)           # 10 (global unchanged)

# The global keyword lets you modify a global variable from inside a function
counter = 0

def increment():
    global counter
    counter += 1

increment()
increment()
print(counter)  # 2
\`\`\`

Rely on \`global\` only when necessary. Most of the time, returning a value and reassigning it at the call site is cleaner and more testable than mutating globals.

\`\`\`python
# Prefer this pattern over global mutation
def increment(counter):
    return counter + 1

counter = 0
counter = increment(counter)
counter = increment(counter)
print(counter)  # 2
\`\`\`
`,
  quiz: [
    {
      question:
        "What does a Python function return if it has no explicit return statement?",
      options: [
        "0",
        "An empty string",
        "None",
        "A TypeError is raised",
      ],
      correctIndex: 2,
    },
    {
      question:
        "Why is `def func(lst=[])` considered a bug-prone pattern?",
      options: [
        "Lists cannot be used as default arguments — Python raises a SyntaxError",
        "The default list is created once at function definition time and shared across all calls",
        "Each call creates a new list, wasting memory",
        "The list default is ignored — Python always passes None instead",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Which statement about first-class functions in Python is TRUE?",
      options: [
        "Functions cannot be assigned to variables",
        "Functions cannot be passed as arguments to other functions",
        "Functions can be assigned to variables, passed as arguments, and returned from other functions",
        "Only built-in functions are first-class; user-defined functions are not",
      ],
      correctIndex: 2,
    },
  ],
};
