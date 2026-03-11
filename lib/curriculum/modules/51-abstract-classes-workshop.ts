import type { WorkshopModule } from "../types";

export const abstractClassesWorkshop: WorkshopModule = {
  type: "workshop",
  id: "51",
  slug: "abstract-classes-workshop",
  title: "Designing with Interfaces via Protocol",
  icon: "🎯",
  estimatedMinutes: 20,
  description: "Design flexible APIs using ABC and Protocol",
  steps: [
    {
      instruction:
        "Define a `Shape(ABC)` abstract base class with two abstract methods: `area(self) -> float` and `perimeter(self) -> float`. Then implement two concrete subclasses: `Circle(Shape)` with a `radius` attribute, and `Rectangle(Shape)` with `width` and `height`. Import `math` for `math.pi`.",
      hint: "from abc import ABC, abstractmethod. class Shape(ABC): @abstractmethod def area(self) -> float: ... @abstractmethod def perimeter(self) -> float: ... class Circle(Shape): def area(self): return math.pi * self.radius**2.",
      starterCode: `import math
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        ...

    @abstractmethod
    def perimeter(self) -> float:
        ...


class Circle(Shape):
    def __init__(self, radius: float) -> None:
        self.radius = radius

    def area(self) -> float:
        # TODO: pi * r^2
        pass

    def perimeter(self) -> float:
        # TODO: 2 * pi * r
        pass


class Rectangle(Shape):
    def __init__(self, width: float, height: float) -> None:
        self.width = width
        self.height = height

    def area(self) -> float:
        # TODO: width * height
        pass

    def perimeter(self) -> float:
        # TODO: 2 * (width + height)
        pass


# Test both shapes
c = Circle(5)
r = Rectangle(4, 6)
print(f"Circle area: {c.area():.2f}")          # 78.54
print(f"Circle perimeter: {c.perimeter():.2f}") # 31.42
print(f"Rectangle area: {r.area():.2f}")        # 24.00
print(f"Rectangle perimeter: {r.perimeter():.2f}") # 20.00

# Polymorphism
shapes: list[Shape] = [c, r, Circle(1), Rectangle(3, 3)]
total = sum(s.area() for s in shapes)
print(f"Total area: {total:.2f}")
`,
      validate: (code: string) => {
        return (
          code.includes("class Shape(ABC)") &&
          code.includes("@abstractmethod") &&
          code.includes("class Circle(Shape)") &&
          code.includes("class Rectangle(Shape)") &&
          code.includes("math.pi")
        );
      },
      successMessage:
        "ABC enforces the contract at class creation time. The moment you create `Circle`, Python checks that all abstract methods are implemented. This is earlier feedback than runtime errors from missing method calls.",
    },
    {
      instruction:
        "Demonstrate that instantiating `Shape` directly raises `TypeError`. Also show that a partial implementation (a subclass that only implements `area` but not `perimeter`) still can't be instantiated. Then show that a complete implementation works.",
      hint: "try: Shape() except TypeError as e: print(e). class IncompleteShape(Shape): def area(self): return 0.0  # no perimeter. try: IncompleteShape() except TypeError as e: print(e).",
      starterCode: `import math
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

    @abstractmethod
    def perimeter(self) -> float: ...


class IncompleteShape(Shape):
    """Only implements area, not perimeter — still abstract."""
    def area(self) -> float:
        return 0.0
    # Missing: perimeter


class CompleteShape(Shape):
    """Implements both — can be instantiated."""
    def area(self) -> float:
        return 1.0

    def perimeter(self) -> float:
        return 4.0


# Test 1: Shape itself can't be instantiated
print("Test 1: instantiate Shape directly")
try:
    s = Shape()
except TypeError as e:
    print(f"TypeError: {e}")

# Test 2: partial implementation also can't be instantiated
print("\\nTest 2: instantiate IncompleteShape")
try:
    inc = IncompleteShape()
except TypeError as e:
    print(f"TypeError: {e}")

# Test 3: complete implementation works
print("\\nTest 3: instantiate CompleteShape")
cs = CompleteShape()
print(f"area={cs.area()}, perimeter={cs.perimeter()}")

# Test 4: isinstance still recognizes concrete shapes as Shape
print(f"\\nisinstance(cs, Shape): {isinstance(cs, Shape)}")
`,
      validate: (code: string) => {
        return (
          code.includes("class Shape(ABC)") &&
          code.includes("TypeError") &&
          code.includes("IncompleteShape") &&
          code.includes("try:") &&
          code.includes("except TypeError")
        );
      },
      successMessage:
        "The TypeError is raised at instantiation time, not when the missing method is called. This is a key advantage over manual NotImplementedError raising — the error is immediate and clear.",
    },
    {
      instruction:
        "Define a `Serializable` Protocol with a `serialize(self) -> str` method. Then create two completely unrelated classes `JsonUser` and `XmlConfig` — each with a `serialize()` method but with no shared base class. Write a function `save_all(items: list[Serializable]) -> None` that calls serialize on each.",
      hint: "from typing import Protocol. class Serializable(Protocol): def serialize(self) -> str: ... No inheritance needed for JsonUser or XmlConfig — they just need a serialize() method.",
      starterCode: `from typing import Protocol
import json

class Serializable(Protocol):
    def serialize(self) -> str:
        ...


class JsonUser:
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age

    def serialize(self) -> str:
        # TODO: return JSON string of {"name": ..., "age": ...}
        pass


class XmlConfig:
    def __init__(self, key: str, value: str) -> None:
        self.key = key
        self.value = value

    def serialize(self) -> str:
        # TODO: return "<config key='...' value='...' />"
        pass


def save_all(items: list[Serializable]) -> None:
    """Save each item by serializing it."""
    for item in items:
        print(item.serialize())


# Neither class inherits from Serializable — structural typing at work
user = JsonUser("Alice", 30)
config = XmlConfig("debug", "true")

save_all([user, config])

# Verify they have no shared base (other than object)
print(f"\\nJsonUser bases: {JsonUser.__bases__}")
print(f"XmlConfig bases: {XmlConfig.__bases__}")
`,
      validate: (code: string) => {
        return (
          code.includes("class Serializable(Protocol)") &&
          code.includes("def serialize") &&
          code.includes("class JsonUser") &&
          code.includes("class XmlConfig") &&
          code.includes("def save_all")
        );
      },
      successMessage:
        "Protocol's structural typing is what makes Python's duck typing type-safe. Two unrelated classes both satisfy `Serializable` because they have the right method signature — no class hierarchy modification needed.",
    },
    {
      instruction:
        "Add `@runtime_checkable` to the `Serializable` Protocol and use `isinstance()` to check whether objects satisfy it. Show that objects with `serialize()` return True, and objects without it return False. Filter a mixed list to only process Serializable items.",
      hint: "from typing import Protocol, runtime_checkable. @runtime_checkable class Serializable(Protocol): def serialize(self) -> str: ... isinstance(obj, Serializable) returns True if obj has a serialize attribute (method existence only, not signature).",
      starterCode: `from typing import Protocol, runtime_checkable

@runtime_checkable
class Serializable(Protocol):
    def serialize(self) -> str:
        ...


class JsonUser:
    def __init__(self, name: str) -> None:
        self.name = name

    def serialize(self) -> str:
        return f'{{"name": "{self.name}"}}'


class Counter:
    def __init__(self) -> None:
        self.count = 0

    def increment(self) -> None:
        self.count += 1
    # No serialize() method


class LogEntry:
    def __init__(self, message: str) -> None:
        self.message = message

    def serialize(self) -> str:
        return f"LOG: {self.message}"


# Mixed collection of objects
objects = [
    JsonUser("Alice"),
    Counter(),
    LogEntry("Server started"),
    Counter(),
    JsonUser("Bob"),
]

# Use isinstance() with runtime_checkable Protocol to filter
print("Serializable objects:")
for obj in objects:
    if isinstance(obj, Serializable):
        print(f"  {type(obj).__name__}: {obj.serialize()}")

print("\\nNon-serializable objects:")
for obj in objects:
    if not isinstance(obj, Serializable):
        print(f"  {type(obj).__name__}")
`,
      validate: (code: string) => {
        return (
          code.includes("@runtime_checkable") &&
          code.includes("isinstance") &&
          code.includes("Serializable") &&
          code.includes("Protocol")
        );
      },
      successMessage:
        "`@runtime_checkable` bridges the gap between static type checking and runtime introspection. It's used in Python's own standard library — e.g., `typing.SupportsInt` and `typing.Sized` are runtime-checkable Protocols.",
    },
    {
      instruction:
        "Add a concrete `describe(self) -> str` method to the `Shape` ABC from step 1 that calls `self.area()` (abstract). Show that `describe()` is inherited by all concrete subclasses and works correctly because they implement `area()`. This demonstrates that ABCs can have both abstract and concrete methods.",
      hint: "In Shape(ABC), add: def describe(self) -> str: return f'{type(self).__name__} with area {self.area():.2f}'. This calls self.area() which each subclass implements. Concrete methods in ABCs are fully inherited.",
      starterCode: `import math
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        ...

    @abstractmethod
    def perimeter(self) -> float:
        ...

    def describe(self) -> str:
        """Concrete method that delegates to abstract methods."""
        # TODO: return f"{type(self).__name__} with area {self.area():.2f} and perimeter {self.perimeter():.2f}"
        pass

    def is_larger_than(self, other: "Shape") -> bool:
        """Another concrete method — compares areas."""
        return self.area() > other.area()


class Circle(Shape):
    def __init__(self, radius: float) -> None:
        self.radius = radius

    def area(self) -> float:
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        return 2 * math.pi * self.radius


class Rectangle(Shape):
    def __init__(self, width: float, height: float) -> None:
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)


# describe() is inherited — it calls the subclass's area() and perimeter()
shapes = [Circle(5), Rectangle(4, 6), Circle(2)]
for s in shapes:
    print(s.describe())

# is_larger_than() also works through inheritance
c = Circle(5)
r = Rectangle(4, 6)
print(f"\\nCircle(5) larger than Rectangle(4,6)? {c.is_larger_than(r)}")
print(f"Rectangle(4,6) larger than Circle(2)? {r.is_larger_than(Circle(2))}")
`,
      validate: (code: string) => {
        return (
          code.includes("class Shape(ABC)") &&
          code.includes("@abstractmethod") &&
          code.includes("def describe") &&
          code.includes("self.area()") &&
          code.includes("class Circle(Shape)") &&
          code.includes("class Rectangle(Shape)")
        );
      },
      successMessage:
        "Concrete methods in ABCs are a powerful pattern — shared behavior is defined once in the base class, while each subclass provides the specific values via abstract methods. This is the Template Method design pattern.",
    },
  ],
};
