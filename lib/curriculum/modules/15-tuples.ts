import type { LessonModule } from "../types";

export const tuples: LessonModule = {
  type: "lesson",
  id: "15",
  slug: "tuples",
  title: "Tuples: Immutability & Packing/Unpacking",
  icon: "📦",
  estimatedMinutes: 12,
  content: `# Tuples: Immutability & Packing/Unpacking

Tuples are ordered, **immutable** sequences — like lists that can't be changed. This immutability isn't just a restriction; it unlocks important capabilities like hashability and use as dict keys.

## Creating Tuples

\`\`\`python
# Tuples are created with parentheses (or just commas)
empty = ()
single = (42,)       # IMPORTANT: trailing comma makes it a tuple!
not_a_tuple = (42)   # This is just 42 in parentheses, not a tuple

point = (3, 4)
rgb = (255, 128, 0)
mixed = (1, "hello", 3.14, True)

# Parentheses are optional — the comma creates the tuple
coordinates = 10, 20          # Same as (10, 20)
triple = 1, 2, 3              # Same as (1, 2, 3)

# From an iterable
from_list = tuple([1, 2, 3])  # (1, 2, 3)
from_str = tuple("hello")     # ('h', 'e', 'l', 'l', 'o')
\`\`\`

## Tuple Immutability

Tuples cannot be modified after creation:

\`\`\`python
point = (3, 4)

# These all fail with TypeError:
# point[0] = 5         # Can't assign to index
# point.append(5)      # No append method
# del point[0]         # Can't delete items

# But you can create a new tuple
point = point + (5,)   # (3, 4, 5)
point = (0,) + point   # (0, 3, 4, 5)

# Note: if a tuple contains a mutable object, that object CAN change
t = ([1, 2], [3, 4])
t[0].append(5)         # OK — the list itself is mutable
print(t)               # ([1, 2, 5], [3, 4])
# But you still can't reassign: t[0] = [9, 9]  # TypeError
\`\`\`

## Indexing and Slicing

Tuples support the same indexing and slicing as lists:

\`\`\`python
coords = (10, 20, 30, 40, 50)

print(coords[0])       # 10
print(coords[-1])      # 50
print(coords[1:3])     # (20, 30)
print(coords[::-1])    # (50, 40, 30, 20, 10)
print(len(coords))     # 5
print(20 in coords)    # True
\`\`\`

## Tuple Packing and Unpacking

**Packing** means putting values into a tuple. **Unpacking** means extracting them:

\`\`\`python
# Packing
point = 3, 4           # Pack x=3, y=4 into a tuple

# Unpacking — assign each element to a variable
x, y = point
print(x, y)   # 3 4

# Unpacking must match the number of elements
a, b, c = (1, 2, 3)
# a, b = (1, 2, 3)  # ValueError: too many values

# Extended unpacking with *
first, *rest = (1, 2, 3, 4, 5)
print(first)   # 1
print(rest)    # [2, 3, 4, 5]  (rest becomes a list!)

head, *middle, tail = (1, 2, 3, 4, 5)
print(head)    # 1
print(middle)  # [2, 3, 4]
print(tail)    # 5

# Swap without a temp variable
a = 10
b = 20
a, b = b, a    # Python creates tuple (b, a) then unpacks
print(a, b)    # 20 10
\`\`\`

## Function Return Values

Tuples are the standard way for functions to return multiple values:

\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)   # Returns a tuple

data = [3, 1, 4, 1, 5, 9, 2, 6]
lo, hi = min_max(data)
print(f"Min: {lo}, Max: {hi}")   # Min: 1, Max: 9

# Or capture the tuple itself
result = min_max(data)
print(type(result))   # <class 'tuple'>
print(result)         # (1, 9)

def divmod_custom(a, b):
    return a // b, a % b   # quotient and remainder

q, r = divmod_custom(17, 5)
print(f"17 ÷ 5 = {q} remainder {r}")  # 17 ÷ 5 = 3 remainder 2
\`\`\`

## Named Tuples

Regular tuples access elements by index, which is unclear: what does \`person[2]\` mean? \`namedtuple\` adds named fields:

\`\`\`python
from collections import namedtuple

# Define a named tuple type
Point = namedtuple("Point", ["x", "y"])
Person = namedtuple("Person", ["name", "age", "city"])

# Create instances
p = Point(3, 4)
alice = Person("Alice", 30, "New York")

# Access by name (readable!)
print(p.x, p.y)                      # 3 4
print(alice.name, alice.age)          # Alice 30

# Also supports index access
print(p[0], p[1])                    # 3 4

# Unpack like a regular tuple
x, y = p
name, age, city = alice

# Named tuples are immutable
# p.x = 5  # AttributeError

# Python 3.6+ typing.NamedTuple (preferred):
from typing import NamedTuple

class Point3D(NamedTuple):
    x: float
    y: float
    z: float = 0.0   # Default value

origin = Point3D(0.0, 0.0)
print(origin)          # Point3D(x=0.0, y=0.0, z=0.0)
\`\`\`

## Tuples as Dictionary Keys

Because tuples are immutable and hashable, they can be dictionary keys (lists cannot):

\`\`\`python
# Use (row, col) tuple as a grid coordinate key
grid = {}
grid[(0, 0)] = "start"
grid[(3, 4)] = "treasure"
grid[(5, 5)] = "exit"

print(grid[(3, 4)])   # treasure

# A list would fail here:
# grid[[0, 0]] = "start"  # TypeError: unhashable type: 'list'

# 2D memoization cache
cache = {}
def fibonacci_memo(n):
    if n <= 1:
        return n
    if n in cache:
        return cache[n]
    result = fibonacci_memo(n-1) + fibonacci_memo(n-2)
    cache[n] = result
    return result
\`\`\`

## When to Use Tuples vs Lists

| Situation | Use |
|-----------|-----|
| Fixed collection of heterogeneous items (like a record) | Tuple |
| Multiple return values from a function | Tuple |
| Dictionary key | Tuple (lists can't be keys) |
| Contents may change (append, remove, etc.) | List |
| Homogeneous collection (same type, variable count) | List |
| Set element | Tuple (lists can't be in sets) |

A useful heuristic: if the positions have meaning (index 0 = name, index 1 = age), use a tuple or named tuple. If it's "a bunch of the same thing", use a list.
`,
  quiz: [
    {
      question: "Which of these creates a tuple containing only the number 42?",
      options: ["(42)", "(42,)", "[42]", "tuple[42]"],
      correctIndex: 1,
    },
    {
      question: "Why can tuples be used as dictionary keys but lists cannot?",
      options: [
        "Tuples are faster to look up than lists",
        "Tuples are immutable and therefore hashable",
        "Python's dict implementation only accepts tuples",
        "Lists are too large to be dictionary keys",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the result of: first, *rest = (1, 2, 3, 4, 5)",
      options: [
        "first=1, rest=(2, 3, 4, 5)",
        "first=1, rest=[2, 3, 4, 5]",
        "first=(1,), rest=[2, 3, 4, 5]",
        "SyntaxError",
      ],
      correctIndex: 1,
    },
  ],
};
