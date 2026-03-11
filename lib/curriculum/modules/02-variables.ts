import type { LessonModule } from "../types";

export const variables: LessonModule = {
  type: "lesson",
  id: "02",
  slug: "variables",
  title: "Variables & Assignment",
  icon: "📦",
  estimatedMinutes: 10,
  content: `# Variables & Assignment

Variables are named references to values stored in memory. In Python, variables are dynamically typed — you don't declare a type, and a variable can point to different types throughout its life.

## Basic Assignment

Assignment uses the \`=\` operator. The variable name goes on the left, the value on the right:

\`\`\`python
name = "Alice"
age = 30
height = 1.75
is_student = False

print(name)     # Alice
print(age)      # 30
print(height)   # 1.75
\`\`\`

Python variables are **references** (pointers) to objects, not boxes containing values. When you do \`x = 42\`, Python creates an integer object with value 42 and makes \`x\` point to it.

## Naming Conventions

Python follows **PEP 8** naming conventions. Following them makes your code instantly readable to other Python developers:

\`\`\`python
# snake_case for variables and functions (PEP 8 standard)
first_name = "Alice"
last_name = "Smith"
user_age = 30
is_logged_in = True

# PascalCase for classes (we'll cover classes later)
# class UserAccount:

# UPPER_SNAKE_CASE for constants (by convention — Python doesn't enforce it)
MAX_RETRIES = 3
PI = 3.14159
DEFAULT_TIMEOUT = 30

# Single underscore prefix: "private by convention"
_internal_cache = {}

# Double underscore prefix: name mangling (in classes)
# __private_attr

# Single underscore: throwaway variable
for _ in range(5):
    print("Hello")
\`\`\`

### Valid vs Invalid Names

\`\`\`python
# Valid names
x = 1
my_var = 2
_private = 3
CamelCase = 4
var123 = 5
CONSTANT = 6

# Invalid names — these cause SyntaxError:
# 1st_place = 1    # Can't start with digit
# my-var = 2       # Hyphens not allowed
# class = 3        # Reserved keyword
# my var = 4       # Spaces not allowed
\`\`\`

Reserved keywords you cannot use as variable names:
\`False, None, True, and, as, assert, async, await, break, class, continue, def, del, elif, else, except, finally, for, from, global, if, import, in, is, lambda, nonlocal, not, or, pass, raise, return, try, while, with, yield\`

## Multiple Assignment

Python supports several forms of multiple assignment:

\`\`\`python
# Assign the same value to multiple variables
a = b = c = 0
print(a, b, c)  # 0 0 0

# Tuple unpacking — assign multiple values at once
x, y = 10, 20
print(x, y)  # 10 20

# Swap two variables elegantly (no temp variable needed!)
x, y = y, x
print(x, y)  # 20 10

# Extended unpacking with *
first, *rest = [1, 2, 3, 4, 5]
print(first)  # 1
print(rest)   # [2, 3, 4, 5]

head, *middle, last = [1, 2, 3, 4, 5]
print(head)   # 1
print(middle) # [2, 3, 4]
print(last)   # 5

# Unpack from function return value
def get_dimensions():
    return 1920, 1080

width, height = get_dimensions()
print(f"{width}x{height}")  # 1920x1080
\`\`\`

## Augmented Assignment Operators

Augmented assignment modifies a variable in place (or rather, creates a new object and rebinds the name):

\`\`\`python
count = 10

count += 5    # count = count + 5  → 15
count -= 3    # count = count - 3  → 12
count *= 2    # count = count * 2  → 24
count //= 5   # count = count // 5 → 4
count **= 2   # count = count ** 2 → 16
count %= 7    # count = count % 7  → 2

# Works with strings too
greeting = "Hello"
greeting += ", World!"
print(greeting)  # Hello, World!

# Works with lists
items = [1, 2]
items += [3, 4]  # Same as items.extend([3, 4])
print(items)     # [1, 2, 3, 4]
\`\`\`

## Constants by Convention

Python has no built-in constant mechanism — you can always reassign a variable. The community convention is to use UPPER_SNAKE_CASE for values that shouldn't change:

\`\`\`python
# Constants are UPPER_CASE by convention
MAX_CONNECTIONS = 100
DATABASE_URL = "postgresql://localhost/mydb"
API_VERSION = "v2"
GRAVITY = 9.81  # m/s²

# Python won't stop you from reassigning, but you shouldn't:
# MAX_CONNECTIONS = 200  # Technically works, but bad practice

# For true constants, use typing.Final (Python 3.8+)
from typing import Final
MAX_SIZE: Final = 1024
# Type checkers like mypy will flag assignments to Final variables
\`\`\`

## The Walrus Operator (\`:=\`)

Introduced in Python 3.8, the walrus operator (\`:=\`) assigns a value to a variable **as part of an expression**. This is useful when you want to both assign and test a value:

\`\`\`python
# Without walrus: read input, check, process
line = input("Enter something: ")
if line:
    print(f"You entered: {line}")

# With walrus: assign and test in one step
if line := input("Enter something: "):
    print(f"You entered: {line}")
\`\`\`

Common walrus operator patterns:

\`\`\`python
# Loop with assignment — process lines until empty
while chunk := file.read(8192):
    process(chunk)

# Avoid computing a value twice
import re
if match := re.search(r"\\d+", text):
    print(f"Found number: {match.group()}")

# In list comprehensions — compute and filter
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
# Find squares that are greater than 25
results = [y for x in numbers if (y := x ** 2) > 25]
print(results)  # [36, 49, 64, 81, 100]
\`\`\`

The walrus operator is intentionally different from \`=\` to avoid confusion. Use it when it genuinely reduces repetition — don't overuse it.

## Variable Scope Preview

Variables have different scopes depending on where they're defined:

\`\`\`python
global_var = "I'm global"

def my_function():
    local_var = "I'm local"
    print(global_var)  # Can read global
    print(local_var)   # Can read local

my_function()
print(global_var)  # Works
# print(local_var) # NameError! local_var doesn't exist here
\`\`\`

We'll explore scope in depth when we cover functions.

## Deleting Variables

You can delete a variable with \`del\`:

\`\`\`python
x = 42
print(x)  # 42
del x
# print(x)  # NameError: name 'x' is not defined
\`\`\`

\`del\` removes the name binding, not necessarily the object (which gets garbage collected when there are no more references to it).
`,
  quiz: [
    {
      question: "What naming convention does PEP 8 recommend for regular Python variables?",
      options: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
      correctIndex: 2,
    },
    {
      question: "What does this code print? x, y = 1, 2; x, y = y, x; print(x, y)",
      options: ["1 2", "2 1", "2 2", "SyntaxError"],
      correctIndex: 1,
    },
    {
      question: "What is the walrus operator (:=) used for?",
      options: [
        "Comparing two values for equality",
        "Assigning a value as part of an expression",
        "Declaring a constant variable",
        "Augmented addition assignment",
      ],
      correctIndex: 1,
    },
  ],
};
