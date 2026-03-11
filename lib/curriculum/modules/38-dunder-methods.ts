import type { LessonModule } from "../types";

export const dunderMethods: LessonModule = {
  type: "lesson",
  id: "38",
  slug: "dunder-methods",
  title: "Dunder Methods: __str__, __repr__, __eq__, __len__",
  icon: "✨",
  estimatedMinutes: 15,
  content: `# Dunder Methods: Making Your Objects Feel Like Python

**Dunder methods** (double underscore methods, also called "magic methods" or "special methods") let your objects integrate with Python's built-in syntax and functions. When Python sees \`len(obj)\`, it calls \`obj.__len__()\`. When it sees \`a + b\`, it calls \`a.__add__(b)\`. By implementing these methods, your classes become first-class citizens in the Python ecosystem.

## __str__ vs __repr__

These are the two most important dunder methods for any class:

- \`__repr__(self)\`: Developer representation. Should ideally return a string that could recreate the object. Used in the REPL, debugging, and logging. **Always implement this one.**
- \`__str__(self)\`: User-friendly representation. Used by \`print()\` and \`str()\`. Falls back to \`__repr__\` if not defined.

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x!r}, {self.y!r})"

    def __str__(self):
        return f"({self.x}, {self.y})"

p = Point(3, 4)
print(p)          # (3, 4)         — uses __str__
print(repr(p))    # Point(3, 4)    — uses __repr__
print(f"{p!r}")   # Point(3, 4)    — !r forces repr
print(f"{p!s}")   # (3, 4)         — !s forces str
\`\`\`

## __eq__ and Comparison Methods

By default, \`==\` compares object identity (same as \`is\`). Define \`__eq__\` to compare by value:

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented   # Let Python try the other operand
        return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
p2 = Point(1, 2)
p3 = Point(3, 4)

print(p1 == p2)  # True  (same values)
print(p1 == p3)  # False
print(p1 is p2)  # False (different objects in memory)

# Note: defining __eq__ disables the default __hash__
# so your class is no longer usable in sets or as dict keys unless you also define __hash__
\`\`\`

Return \`NotImplemented\` (not \`NotImplementedError\`) when the comparison doesn't make sense — Python will then try the reversed operation on the other operand.

## Ordering: __lt__, __le__, __gt__, __ge__

Define all six comparison methods, or use \`@functools.total_ordering\` with just \`__eq__\` and one of \`__lt__\`/\`__le__\`/\`__gt__\`/\`__ge__\`:

\`\`\`python
from functools import total_ordering

@total_ordering
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    def __repr__(self):
        return f"Temperature({self.celsius}°C)"

    def __eq__(self, other):
        if not isinstance(other, Temperature):
            return NotImplemented
        return self.celsius == other.celsius

    def __lt__(self, other):
        if not isinstance(other, Temperature):
            return NotImplemented
        return self.celsius < other.celsius

# @total_ordering derives __le__, __gt__, __ge__ automatically
t1 = Temperature(20)
t2 = Temperature(30)

print(t1 < t2)   # True
print(t1 > t2)   # False
print(t1 <= t1)  # True

# Now works with sorted() and min()/max()!
temps = [Temperature(35), Temperature(10), Temperature(22)]
print(sorted(temps))   # [Temperature(10°C), Temperature(22°C), Temperature(35°C)]
print(min(temps))      # Temperature(10°C)
\`\`\`

## __len__ and __bool__

\`__len__\` makes \`len(obj)\` work. \`__bool__\` controls truthiness. If you define \`__len__\` but not \`__bool__\`, Python uses \`len(obj) != 0\` for truth testing.

\`\`\`python
class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        return self._items.pop()

    def __len__(self):
        return len(self._items)

    def __bool__(self):
        return len(self._items) > 0

    def __repr__(self):
        return f"Stack({self._items!r})"

s = Stack()
print(len(s))    # 0
print(bool(s))   # False
if not s:
    print("Stack is empty!")

s.push(1)
s.push(2)
print(len(s))    # 2
print(bool(s))   # True
\`\`\`

## __contains__

\`__contains__\` makes the \`in\` operator work:

\`\`\`python
class WordList:
    def __init__(self, words):
        self._words = set(w.lower() for w in words)

    def __contains__(self, word):
        return word.lower() in self._words

    def __len__(self):
        return len(self._words)

dictionary = WordList(["Python", "Java", "Ruby", "Go"])
print("python" in dictionary)   # True  (case-insensitive)
print("C++" in dictionary)      # False
\`\`\`

## __iter__ and __getitem__

These make your object iterable. Implement \`__iter__\` to return an iterator, or \`__getitem__\` for sequence-style access (Python will create an iterator from it automatically):

\`\`\`python
class NumberRange:
    def __init__(self, start, stop):
        self.start = start
        self.stop = stop

    def __iter__(self):
        current = self.start
        while current < self.stop:
            yield current
            current += 1

    def __len__(self):
        return max(0, self.stop - self.start)

    def __getitem__(self, index):
        if index < 0:
            index = len(self) + index
        if not (0 <= index < len(self)):
            raise IndexError("index out of range")
        return self.start + index

    def __repr__(self):
        return f"NumberRange({self.start}, {self.stop})"

r = NumberRange(1, 6)
print(list(r))      # [1, 2, 3, 4, 5]
print(r[0])         # 1
print(r[-1])        # 5
print(3 in r)       # True (uses __iter__ since no __contains__)
for n in r:
    print(n, end=" ")  # 1 2 3 4 5
\`\`\`

## __add__, __mul__, and Arithmetic

\`\`\`python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):
        # Handles: 3 * vector (when scalar.__mul__ returns NotImplemented)
        return self.__mul__(scalar)

    def __neg__(self):
        return Vector(-self.x, -self.y)

    def __abs__(self):
        return (self.x**2 + self.y**2) ** 0.5

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)     # Vector(4, 6)
print(v1 - v2)     # Vector(-2, -2)
print(v1 * 3)      # Vector(3, 6)
print(3 * v1)      # Vector(3, 6)  — uses __rmul__
print(-v1)         # Vector(-1, -2)
print(abs(v2))     # 5.0
\`\`\`

## __hash__

If you define \`__eq__\`, Python sets \`__hash__ = None\`, making your object unhashable. Define \`__hash__\` to make it usable in sets and dicts:

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        # Hash based on the values that determine equality
        return hash((self.x, self.y))

points = {Point(1, 2), Point(1, 2), Point(3, 4)}
print(len(points))  # 2 — duplicates removed by hash equality

d = {Point(1, 2): "origin area"}
print(d[Point(1, 2)])  # "origin area"
\`\`\`

Only make objects hashable if they are **immutable** (or if equal objects will always hash the same). Mutable objects should generally not be hashable.

## Quick Reference

| Dunder Method | Triggered By |
|--------------|-------------|
| \`__repr__\` | \`repr(x)\`, REPL display |
| \`__str__\` | \`str(x)\`, \`print(x)\` |
| \`__eq__\` | \`x == y\` |
| \`__lt__\`, \`__le__\`, etc. | \`x < y\`, \`x <= y\`, etc. |
| \`__len__\` | \`len(x)\` |
| \`__bool__\` | \`bool(x)\`, \`if x\` |
| \`__contains__\` | \`item in x\` |
| \`__iter__\` | \`for item in x\`, \`list(x)\` |
| \`__getitem__\` | \`x[i]\` |
| \`__add__\` | \`x + y\` |
| \`__mul__\` | \`x * y\` |
| \`__hash__\` | \`hash(x)\`, sets, dict keys |
`,
  quiz: [
    {
      question: "Why should `__eq__` return `NotImplemented` (not raise an error) when it can't compare with the other object?",
      options: [
        "To avoid a Python SyntaxError",
        "It signals to Python to try the comparison from the other operand's perspective using the reflected method",
        "It makes the comparison return False automatically",
        "NotImplemented is faster than raising an exception",
      ],
      correctIndex: 1,
    },
    {
      question: "If you define `__eq__` on a class but not `__hash__`, what happens?",
      options: [
        "Python automatically generates __hash__ based on __eq__",
        "The object uses the default hash from object",
        "Python sets __hash__ to None, making the object unhashable (cannot be used in sets or as dict keys)",
        "Python raises a TypeError when you try to hash the object",
      ],
      correctIndex: 2,
    },
    {
      question: "What does `@functools.total_ordering` do when used with `__eq__` and `__lt__`?",
      options: [
        "It creates a total ordering by sorting the class attributes",
        "It automatically derives __le__, __gt__, and __ge__ from __eq__ and __lt__",
        "It makes comparison operators work in both directions",
        "It overrides all comparison operators with a single implementation",
      ],
      correctIndex: 1,
    },
  ],
};
