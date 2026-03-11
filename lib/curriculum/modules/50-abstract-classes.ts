import type { LessonModule } from "../types";

export const abstractClasses: LessonModule = {
  type: "lesson",
  id: "50",
  slug: "abstract-classes",
  title: "ABC, @abstractmethod, Protocol",
  icon: "🏛️",
  estimatedMinutes: 15,
  content: `# Abstract Classes: ABC, @abstractmethod, Protocol

As codebases grow, you need mechanisms to define contracts — "any class that does X must implement Y". Python offers two approaches: **ABC** (Abstract Base Classes) for inheritance-based contracts, and **Protocol** for structural typing (duck typing with type safety).

## ABC and abstractmethod

\`ABC\` from \`abc\` module is a base class that supports abstract methods. You can't instantiate a class with unimplemented abstract methods:

\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        """Return the area of the shape."""
        ...

    @abstractmethod
    def perimeter(self) -> float:
        """Return the perimeter of the shape."""
        ...

    def describe(self) -> str:
        # Concrete method — can call abstract methods
        return f"{type(self).__name__}: area={self.area():.2f}, perimeter={self.perimeter():.2f}"

# Can't instantiate directly
try:
    s = Shape()
except TypeError as e:
    print(e)   # Can't instantiate abstract class Shape with abstract methods area, perimeter
\`\`\`

## Concrete Subclasses Must Implement All Abstract Methods

A subclass becomes concrete (instantiatable) only when it provides implementations for **all** abstract methods:

\`\`\`python
import math

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)

c = Circle(5)
r = Rectangle(4, 6)
print(c.describe())    # Circle: area=78.54, perimeter=31.42
print(r.describe())    # Rectangle: area=24.00, perimeter=20.00

# Polymorphism: treat all shapes uniformly
shapes: list[Shape] = [c, r, Circle(2)]
total_area = sum(s.area() for s in shapes)
print(f"Total area: {total_area:.2f}")
\`\`\`

## @abstractproperty Pattern

Use \`@property\` combined with \`@abstractmethod\` to require properties in subclasses:

\`\`\`python
from abc import ABC, abstractmethod

class Animal(ABC):
    @property
    @abstractmethod
    def sound(self) -> str:
        """The sound this animal makes."""
        ...

    def speak(self) -> str:
        return f"{type(self).__name__} says {self.sound}!"

class Dog(Animal):
    @property
    def sound(self) -> str:
        return "Woof"

class Cat(Animal):
    @property
    def sound(self) -> str:
        return "Meow"

print(Dog().speak())   # Dog says Woof!
print(Cat().speak())   # Cat says Meow!
\`\`\`

## Protocol — Structural Subtyping

\`Protocol\` (from \`typing\`) defines an interface by structure — a class satisfies a Protocol if it has the right methods and attributes, regardless of its class hierarchy. No inheritance required:

\`\`\`python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> str:
        ...

class Serializable(Protocol):
    def to_json(self) -> str:
        ...

# These classes have NO inheritance from Drawable or Serializable
class Button:
    def __init__(self, label: str):
        self.label = label

    def draw(self) -> str:
        return f"[{self.label}]"

    def to_json(self) -> str:
        import json
        return json.dumps({"type": "button", "label": self.label})

# Satisfies both Drawable and Serializable structurally
def render(item: Drawable) -> None:
    print(item.draw())

def save(item: Serializable) -> None:
    print(item.to_json())

btn = Button("OK")
render(btn)   # Works — Button has draw()
save(btn)     # Works — Button has to_json()
\`\`\`

## @runtime_checkable Protocol

By default, Protocols only work with static type checkers. Add \`@runtime_checkable\` to enable \`isinstance()\` checks at runtime:

\`\`\`python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Closeable(Protocol):
    def close(self) -> None:
        ...

class FileWrapper:
    def close(self) -> None:
        print("file closed")

class Connection:
    def close(self) -> None:
        print("connection closed")

class Timer:
    def start(self) -> None:
        pass   # no close() method

f = FileWrapper()
c = Connection()
t = Timer()

print(isinstance(f, Closeable))   # True
print(isinstance(c, Closeable))   # True
print(isinstance(t, Closeable))   # False

# Generic cleanup function
def cleanup(resource: Closeable) -> None:
    resource.close()

for resource in [f, c]:
    if isinstance(resource, Closeable):
        cleanup(resource)
\`\`\`

**Note**: \`@runtime_checkable\` only checks for the existence of methods, not their signatures.

## ABC vs Protocol: When to Use Each

| Situation | Use |
|-----------|-----|
| Shared implementation between subclasses | **ABC** |
| Enforcing that subclasses exist in the hierarchy | **ABC** |
| Defining an interface without restricting inheritance | **Protocol** |
| Cross-library duck typing | **Protocol** |
| Third-party classes you can't modify | **Protocol** |

\`\`\`python
# Good fit for ABC: shared implementation
class Vehicle(ABC):
    def __init__(self, make: str, model: str):
        self.make = make     # shared by all vehicles
        self.model = model

    @abstractmethod
    def max_speed(self) -> float:
        ...

    def describe(self) -> str:
        # Shared implementation that subclasses inherit
        return f"{self.make} {self.model} (max {self.max_speed()} km/h)"

# Good fit for Protocol: interface without shared state
class Comparable(Protocol):
    def __lt__(self, other: object) -> bool: ...
    def __eq__(self, other: object) -> bool: ...
\`\`\`
`,
  quiz: [
    {
      question: "What happens when you try to instantiate an abstract class directly?",
      options: [
        "It creates an instance but abstract methods raise NotImplementedError when called",
        "Python raises TypeError at instantiation time",
        "Python raises AttributeError when an abstract method is first called",
        "It creates the instance normally — abstractmethod is only for type checkers",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the key difference between ABC and Protocol?",
      options: [
        "ABC is faster than Protocol at runtime",
        "Protocol requires inheritance; ABC uses structural typing",
        "ABC requires inheritance from the base class; Protocol uses structural typing (duck typing) — no inheritance needed",
        "They are identical — Protocol is just newer syntax for ABC",
      ],
      correctIndex: 2,
    },
    {
      question: "What does `@runtime_checkable` enable for a Protocol?",
      options: [
        "Strict enforcement of method signatures at runtime",
        "Using isinstance() to check if an object structurally satisfies the Protocol",
        "Auto-generating implementations for missing methods",
        "Making the Protocol work with static type checkers",
      ],
      correctIndex: 1,
    },
  ],
};
