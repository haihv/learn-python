import type { LessonModule } from "../types";

export const properties: LessonModule = {
  type: "lesson",
  id: "52",
  slug: "properties",
  title: "@property, @setter, @deleter, __slots__",
  icon: "⚙️",
  estimatedMinutes: 15,
  content: `# @property, @setter, @deleter, __slots__

Python properties let you expose computed or validated attributes with the clean access syntax of plain attributes. Instead of \`person.get_age()\`, you write \`person.age\` — but behind the scenes, logic runs. \`__slots__\` is a complementary feature that restricts what attributes a class can have, saving memory and preventing typos.

## @property — Computed Attributes

\`@property\` turns a method into an attribute-like accessor. Callers use \`obj.name\` (no parentheses):

\`\`\`python
class Circle:
    def __init__(self, radius: float) -> None:
        self._radius = radius   # Private storage

    @property
    def radius(self) -> float:
        return self._radius

    @property
    def area(self) -> float:
        import math
        return math.pi * self._radius ** 2

    @property
    def diameter(self) -> float:
        return self._radius * 2

c = Circle(5)
print(c.radius)    # 5  — looks like attribute access, runs method
print(c.area)      # 78.54...
print(c.diameter)  # 10

# c.area = 100    # AttributeError: can't set attribute (no setter defined)
\`\`\`

## @<name>.setter — Validated Writes

Add a setter to allow writes, with validation:

\`\`\`python
class Circle:
    def __init__(self, radius: float) -> None:
        self.radius = radius   # Goes through the setter

    @property
    def radius(self) -> float:
        return self._radius

    @radius.setter
    def radius(self, value: float) -> None:
        if value < 0:
            raise ValueError(f"Radius cannot be negative, got {value}")
        self._radius = value

    @property
    def area(self) -> float:
        import math
        return math.pi * self._radius ** 2

c = Circle(5)
c.radius = 10     # Calls the setter
print(c.area)     # 314.16...

try:
    c.radius = -1   # Raises ValueError
except ValueError as e:
    print(e)   # Radius cannot be negative, got -1
\`\`\`

**Why private \`_radius\`?** The setter uses \`self._radius\` for storage while the property is called \`radius\`. If you used \`self.radius\` in the setter, it would call the setter recursively — infinite loop.

## @<name>.deleter — Cleanup on Delete

\`\`\`python
class CachedData:
    def __init__(self):
        self._data = None

    @property
    def data(self):
        if self._data is None:
            print("Computing...")
            self._data = expensive_computation()
        return self._data

    @data.deleter
    def data(self):
        print("Clearing cache")
        self._data = None

cd = CachedData()
_ = cd.data     # "Computing..." first time
_ = cd.data     # Cached — no computation
del cd.data     # "Clearing cache"
_ = cd.data     # "Computing..." again
\`\`\`

## property() Function — Old Style

Before decorators, you used \`property()\` directly. You may see this in legacy code:

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    def _get_celsius(self):
        return self._celsius

    def _set_celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value

    celsius = property(_get_celsius, _set_celsius)

# The decorator form is equivalent and preferred:
# @property / @celsius.setter
\`\`\`

## Read-Only Properties

A property with no setter is read-only. Writing raises \`AttributeError\`:

\`\`\`python
class Person:
    def __init__(self, first: str, last: str) -> None:
        self.first = first
        self.last = last

    @property
    def full_name(self) -> str:
        return f"{self.first} {self.last}"

p = Person("John", "Doe")
print(p.full_name)      # "John Doe"
# p.full_name = "Jane"  # AttributeError: can't set attribute
\`\`\`

## __slots__ — Restricting Attributes and Saving Memory

By default, Python objects store attributes in a \`__dict__\`. With \`__slots__\`, you declare exactly which attributes the instance can have:

\`\`\`python
class Point:
    __slots__ = ('x', 'y')   # Only x and y are allowed

    def __init__(self, x: float, y: float) -> None:
        self.x = x
        self.y = y

p = Point(1.0, 2.0)
print(p.x, p.y)   # 1.0 2.0

# Can't add new attributes
try:
    p.z = 3.0    # AttributeError: 'Point' object has no attribute 'z'
except AttributeError as e:
    print(e)

# No __dict__ — can't inspect arbitrary attributes
print(hasattr(p, '__dict__'))   # False
\`\`\`

**Memory savings**: Slots replace the per-instance \`__dict__\` with fixed-offset storage. For classes with millions of instances, this can save 30-50% memory:

\`\`\`python
import sys

class WithDict:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class WithSlots:
    __slots__ = ('x', 'y')
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Create 100k instances
import sys
d = WithDict(1.0, 2.0)
s = WithSlots(1.0, 2.0)
print(sys.getsizeof(d))   # ~48 bytes + dict overhead (~232 bytes)
print(sys.getsizeof(s))   # ~48 bytes (no dict)
\`\`\`

## __slots__ with Inheritance

Slots and inheritance have caveats:

\`\`\`python
class Base:
    __slots__ = ('x',)

class Child(Base):
    __slots__ = ('y',)   # Only declare NEW slots

    def __init__(self, x, y):
        self.x = x   # From Base's slots
        self.y = y   # From Child's slots

c = Child(1, 2)
print(c.x, c.y)  # 1 2

# If ANY class in the hierarchy doesn't define __slots__,
# instances will still have __dict__ (from that class)
class NoSlots:
    pass   # Has __dict__

class Mixed(NoSlots):
    __slots__ = ('z',)

m = Mixed()
m.z = 1
m.anything = "arbitrary"  # Works! NoSlots brings __dict__ back
\`\`\`

## When to Use Properties

| Use Case | Pattern |
|----------|---------|
| Computed values from other attributes | Read-only property |
| Validation on write | Property + setter with validation |
| Backward compatibility (old \`get_x()\` → \`x\`) | Property with no code changes at call sites |
| Lazy computation (cache result) | Property that sets a private cache |
| Prevent attribute from being set | Read-only property (no setter) |
| Memory-critical code with many instances | \`__slots__\` |
`,
  quiz: [
    {
      question: "Why does a property's setter store data in `self._value` rather than `self.value`?",
      options: [
        "It's just a naming convention with no technical reason",
        "Using self.value in the setter would call the setter recursively, causing infinite recursion",
        "Properties can only access private attributes",
        "self.value would bypass the getter",
      ],
      correctIndex: 1,
    },
    {
      question: "What does `__slots__` do to a class?",
      options: [
        "It makes all attributes read-only",
        "It replaces __dict__ with fixed-offset storage, restricting allowed attributes and saving memory",
        "It defines the valid values each attribute can hold",
        "It prevents the class from being subclassed",
      ],
      correctIndex: 1,
    },
    {
      question: "How do you create a read-only property (one that can be read but not written)?",
      options: [
        "Use @property with @readonly decorator",
        "Define @property without a corresponding @<name>.setter",
        "Set the attribute to a frozenset",
        "Use @property and raise AttributeError in the setter",
      ],
      correctIndex: 1,
    },
  ],
};
