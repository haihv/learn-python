import type { WorkshopModule } from "../types";

export const propertiesWorkshop: WorkshopModule = {
  type: "workshop",
  id: "53",
  slug: "properties-workshop",
  title: "Computed Properties & Validation",
  icon: "✅",
  estimatedMinutes: 20,
  description: "Use @property to add validation and computed attributes to classes",
  steps: [
    {
      instruction:
        "Create a `Temperature` class that stores the temperature in Celsius internally (`_celsius`). Add a `celsius` property with a getter and setter (setter validates: must be >= -273.15). Add a `fahrenheit` read-only computed property that converts Celsius to Fahrenheit (`F = C * 9/5 + 32`). Show that changing `celsius` automatically changes `fahrenheit`.",
      hint: "@property def celsius(self): return self._celsius. @celsius.setter def celsius(self, value): if value < -273.15: raise ValueError(...); self._celsius = value. @property def fahrenheit(self): return self._celsius * 9/5 + 32.",
      starterCode: `class Temperature:
    def __init__(self, celsius: float = 0.0) -> None:
        self.celsius = celsius  # Goes through the setter

    @property
    def celsius(self) -> float:
        # TODO: return stored temperature
        pass

    @celsius.setter
    def celsius(self, value: float) -> None:
        # TODO: validate >= -273.15 (absolute zero), store in self._celsius
        pass

    @property
    def fahrenheit(self) -> float:
        # TODO: return self._celsius * 9/5 + 32
        pass


# Test basic usage
t = Temperature(100)
print(f"100°C = {t.fahrenheit:.1f}°F")   # 212.0°F

t.celsius = 0
print(f"0°C = {t.fahrenheit:.1f}°F")     # 32.0°F

t.celsius = 37
print(f"37°C = {t.fahrenheit:.1f}°F")    # 98.6°F

# Test validation
try:
    t.celsius = -300
except ValueError as e:
    print(f"ValueError: {e}")

# fahrenheit is read-only
try:
    t.fahrenheit = 100
except AttributeError as e:
    print(f"AttributeError: can't set fahrenheit directly")
`,
      validate: (code: string) => {
        return (
          code.includes("class Temperature") &&
          code.includes("@property") &&
          code.includes("@celsius.setter") &&
          code.includes("fahrenheit") &&
          (code.includes("-273.15") || code.includes("-273")) &&
          code.includes("9/5") || code.includes("9 / 5")
        );
      },
      successMessage:
        "Properties make the class interface clean — callers write `t.celsius = 37` and get automatic validation. The fahrenheit property is always in sync because it computes from the stored celsius value on demand.",
    },
    {
      instruction:
        "Create a `Person` class with a `name: str` attribute and an `age: int` property. The age setter should raise `ValueError` if `age < 0` or `age > 150`. The getter returns the stored age. Add a `birth_year` read-only property that returns `2024 - self.age`.",
      hint: "@property def age(self) -> int: return self._age. @age.setter def age(self, value: int) -> None: if value < 0 or value > 150: raise ValueError(f'Invalid age: {value}'); self._age = value.",
      starterCode: `class Person:
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age  # Goes through the setter

    @property
    def age(self) -> int:
        # TODO: return self._age
        pass

    @age.setter
    def age(self, value: int) -> None:
        # TODO: validate 0 <= age <= 150, store in self._age
        pass

    @property
    def birth_year(self) -> int:
        # TODO: return 2024 - self.age
        pass

    def __repr__(self) -> str:
        return f"Person(name={self.name!r}, age={self.age})"


# Normal usage
alice = Person("Alice", 30)
print(alice)
print(f"Born in: {alice.birth_year}")

alice.age = 31
print(f"After birthday: {alice}")

# Boundary values
p = Person("Baby", 0)
print(f"Newborn birth year: {p.birth_year}")

p_old = Person("Elder", 150)
print(f"Elder: {p_old}")

# Invalid ages
for bad_age in [-1, 151, -100]:
    try:
        Person("Test", bad_age)
    except ValueError as e:
        print(f"ValueError for age={bad_age}: {e}")
`,
      validate: (code: string) => {
        return (
          code.includes("class Person") &&
          code.includes("@property") &&
          code.includes("@age.setter") &&
          code.includes("birth_year") &&
          code.includes("ValueError") &&
          (code.includes("age < 0") || code.includes("value < 0"))
        );
      },
      successMessage:
        "Validation in setters catches errors at write time rather than later when the bad data causes a confusing failure. Notice that `__init__` uses `self.age = age` (not `self._age`) so the setter's validation runs from the very start.",
    },
    {
      instruction:
        "Build a `Circle` class where `radius` has a getter and setter (validate >= 0). Add `area` and `circumference` as read-only computed properties using `math.pi`. Show that `area` and `circumference` update automatically when `radius` changes.",
      hint: "@property def area(self): import math; return math.pi * self._radius ** 2. @property def circumference(self): import math; return 2 * math.pi * self._radius. No setters for area or circumference.",
      starterCode: `import math

class Circle:
    def __init__(self, radius: float) -> None:
        self.radius = radius  # through setter

    @property
    def radius(self) -> float:
        # TODO: return self._radius
        pass

    @radius.setter
    def radius(self, value: float) -> None:
        # TODO: validate >= 0, store in self._radius
        pass

    @property
    def area(self) -> float:
        # TODO: math.pi * r^2
        pass

    @property
    def circumference(self) -> float:
        # TODO: 2 * math.pi * r
        pass

    def __repr__(self) -> str:
        return f"Circle(radius={self.radius}, area={self.area:.4f})"


c = Circle(5)
print(c)
print(f"Area: {c.area:.4f}")
print(f"Circumference: {c.circumference:.4f}")

c.radius = 10
print(f"\\nAfter radius=10:")
print(f"Area: {c.area:.4f}")           # 314.1593
print(f"Circumference: {c.circumference:.4f}")  # 62.8318

# Read-only test
try:
    c.area = 0
except AttributeError:
    print("\\nCan't set area directly (read-only)")

# Validation test
try:
    c.radius = -5
except ValueError as e:
    print(f"ValueError: {e}")
`,
      validate: (code: string) => {
        return (
          code.includes("class Circle") &&
          code.includes("@property") &&
          code.includes("@radius.setter") &&
          code.includes("def area") &&
          code.includes("def circumference") &&
          code.includes("math.pi")
        );
      },
      successMessage:
        "Read-only computed properties are a clean way to expose derived values. Unlike stored attributes, they're always computed from the source of truth (`_radius`), so they're never stale.",
    },
    {
      instruction:
        "Add `__slots__ = ('x', 'y')` to a simple `Point` class. Verify that you can set `x` and `y` normally but attempting to set `z` raises `AttributeError`. Also verify that `Point` instances don't have a `__dict__`.",
      hint: "class Point: __slots__ = ('x', 'y'). def __init__(self, x, y): self.x = x; self.y = y. try: p.z = 3 except AttributeError: print('no z allowed'). hasattr(p, '__dict__') should be False.",
      starterCode: `class Point:
    __slots__ = ('x', 'y')

    def __init__(self, x: float, y: float) -> None:
        self.x = x
        self.y = y

    def __repr__(self) -> str:
        return f"Point({self.x}, {self.y})"

    def distance_to(self, other: "Point") -> float:
        import math
        return math.sqrt((self.x - other.x)**2 + (self.y - other.y)**2)


p = Point(3.0, 4.0)
print(p)

# Allowed attributes work normally
p.x = 10.0
print(f"After p.x = 10: {p}")

# Unknown attribute is blocked
print(f"\\nHas __dict__? {hasattr(p, '__dict__')}")   # False

try:
    p.z = 5.0
except AttributeError as e:
    print(f"AttributeError: {e}")

try:
    p.label = "origin"
except AttributeError as e:
    print(f"AttributeError: {e}")

# Functionality still works
p1 = Point(0.0, 0.0)
p2 = Point(3.0, 4.0)
print(f"\\nDistance: {p1.distance_to(p2)}")   # 5.0
`,
      validate: (code: string) => {
        return (
          code.includes("__slots__") &&
          code.includes("class Point") &&
          code.includes("AttributeError") &&
          (code.includes("__dict__") || code.includes("hasattr"))
        );
      },
      successMessage:
        "Slots eliminate the per-instance `__dict__`, saving ~200 bytes per instance and preventing accidental attribute creation from typos. Essential for classes where you create millions of instances (geometry, game entities, data records).",
    },
    {
      instruction:
        "Manually implement a lazy cached property on a `DataProcessor` class. The `processed` property should compute an expensive result the first time it's accessed, store it in `self._processed_cache`, and return the cache on subsequent calls. Print a message when the computation runs so you can verify it only runs once.",
      hint: "@property def processed(self): if self._processed_cache is None: print('Computing...'); self._processed_cache = expensive_computation(); return self._processed_cache. Initialize self._processed_cache = None in __init__.",
      starterCode: `class DataProcessor:
    def __init__(self, data: list[int]) -> None:
        self.data = data
        self._processed_cache = None  # Lazy cache

    @property
    def processed(self) -> list[int]:
        # TODO: if cache is None, compute and store; then return cache
        # Print "Computing processed data..." on first access
        pass

    @property
    def summary(self) -> dict:
        # TODO: return dict with min, max, mean of self.processed
        # This also uses a lazy pattern via processed property
        pass


processor = DataProcessor([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])

print("First access:")
result = processor.processed
print(f"Result: {result}")

print("\\nSecond access (should NOT recompute):")
result2 = processor.processed
print(f"Result: {result2}")

print("\\nSummary:")
print(processor.summary)

# Verify they're the same object (no copy)
print(f"\\nSame object? {result is result2}")
`,
      validate: (code: string) => {
        return (
          code.includes("class DataProcessor") &&
          code.includes("@property") &&
          code.includes("_processed_cache") &&
          (code.includes("is None") || code.includes("== None")) &&
          code.includes("def processed")
        );
      },
      successMessage:
        "Manual lazy caching is the pattern behind `functools.cached_property` (Python 3.8+). The key insight: the cache is `None` initially, and the property populates it on first access. All subsequent accesses skip the computation entirely.",
    },
  ],
};
