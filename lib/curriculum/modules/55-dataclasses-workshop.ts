import type { WorkshopModule } from "../types";

export const dataclassesWorkshop: WorkshopModule = {
  type: "workshop",
  id: "55",
  slug: "dataclasses-workshop",
  title: "Dataclass Patterns & field()",
  icon: "📋",
  estimatedMinutes: 20,
  description: "Master dataclass patterns for clean data modeling",
  steps: [
    {
      instruction:
        "Create a `Book` dataclass with fields: `title` (str), `author` (str), `year` (int), and `rating` (float, default 0.0). Print an instance to verify the auto-generated `__repr__`, and check that two Books with the same data are equal.",
      hint: "Use `@dataclass` and annotate each field. The decorator generates `__repr__` and `__eq__` automatically — no extra code needed.",
      starterCode: `from dataclasses import dataclass

# Define the Book dataclass here

# Create two identical books and one different book
book1 = Book("The Pragmatic Programmer", "Hunt & Thomas", 1999, 4.8)
book2 = Book("The Pragmatic Programmer", "Hunt & Thomas", 1999, 4.8)
book3 = Book("Clean Code", "Robert Martin", 2008, 4.5)

print(book1)
print(book1 == book2)  # Should be True
print(book1 == book3)  # Should be False
`,
      validate: (code) =>
        code.includes("@dataclass") &&
        code.includes("title: str") &&
        code.includes("author: str") &&
        code.includes("year: int") &&
        code.includes("rating: float"),
      successMessage:
        "Excellent! The @dataclass decorator generated __init__, __repr__, and __eq__ from your field annotations — no boilerplate needed.",
    },
    {
      instruction:
        "Create a `Playlist` dataclass with fields: `name` (str), `songs` (list[str]) using `field(default_factory=list)`, and `tags` (set[str]) using `field(default_factory=set)`. Add a method `add_song(song: str)` that appends to `self.songs`. Show that two Playlist instances do NOT share the same list.",
      hint: "Import `field` from `dataclasses`. Use `field(default_factory=list)` so each instance gets its own fresh list. Never use `songs: list = []` as the default — that shares one list across all instances.",
      starterCode: `from dataclasses import dataclass, field

# Define Playlist here

p1 = Playlist("Chill Vibes")
p2 = Playlist("Workout Mix")

p1.add_song("Lo-fi Beat")
p1.add_song("Rain Sounds")

print(p1.songs)  # ['Lo-fi Beat', 'Rain Sounds']
print(p2.songs)  # []  — p2 has its own empty list
print(p1 == p2)  # False
`,
      validate: (code) =>
        code.includes("default_factory=list") &&
        code.includes("default_factory=set") &&
        code.includes("def add_song") &&
        code.includes("self.songs.append"),
      successMessage:
        "Perfect! default_factory ensures each instance gets a fresh mutable container. This is one of the most important dataclass patterns to internalize.",
    },
    {
      instruction:
        "Create a frozen dataclass `Vector2D` with fields `x` (float) and `y` (float). Add methods `magnitude()` returning the Euclidean length and `__add__` that returns a new `Vector2D`. Demonstrate that the instance is immutable (try assigning to a field in a try/except block) and hashable (use it as a dict key).",
      hint: "Use `@dataclass(frozen=True)`. Since frozen dataclasses are hashable, they can be dictionary keys. Trying to assign to a field raises `FrozenInstanceError` — catch it with `except Exception as e`.",
      starterCode: `from dataclasses import dataclass
import math

# Define frozen Vector2D here

v1 = Vector2D(3.0, 4.0)
v2 = Vector2D(1.0, 2.0)

print(v1.magnitude())   # 5.0
print(v1 + v2)          # Vector2D(x=4.0, y=6.0)

# Demonstrate immutability
try:
    v1.x = 99.0
except Exception as e:
    print(f"Cannot modify: {e}")

# Use as dictionary key (hashable because frozen)
labels = {v1: "diagonal", v2: "small"}
print(labels[Vector2D(3.0, 4.0)])  # diagonal
`,
      validate: (code) =>
        code.includes("frozen=True") &&
        code.includes("def magnitude") &&
        code.includes("def __add__") &&
        code.includes("math.sqrt"),
      successMessage:
        "Great work! frozen=True gives you immutability and hashability simultaneously — ideal for value objects like coordinates, colors, and money amounts.",
    },
    {
      instruction:
        "Create a `Temperature` dataclass with a single field `celsius` (float). Use `__post_init__` to validate that the temperature is above absolute zero (-273.15°C). Add properties `fahrenheit` and `kelvin`. Test with valid and invalid values.",
      hint: "Define `__post_init__(self)` inside the class — it runs automatically after `__init__`. Raise `ValueError` if `self.celsius < -273.15`. Properties are defined with `@property` decorator just like in a regular class.",
      starterCode: `from dataclasses import dataclass

# Define Temperature dataclass with __post_init__ validation

t1 = Temperature(100.0)
print(f"{t1.celsius}°C = {t1.fahrenheit}°F = {t1.kelvin}K")

t2 = Temperature(0.0)
print(f"{t2.celsius}°C = {t2.fahrenheit}°F = {t2.kelvin}K")

# Test validation
try:
    bad = Temperature(-300.0)
except ValueError as e:
    print(f"Validation error: {e}")
`,
      validate: (code) =>
        code.includes("__post_init__") &&
        code.includes("raise ValueError") &&
        code.includes("-273.15") &&
        code.includes("@property") &&
        code.includes("fahrenheit") &&
        code.includes("kelvin"),
      successMessage:
        "Excellent! __post_init__ is the right place for validation logic — it runs after the generated __init__ assigns all fields, so you can inspect them and raise errors or compute derived values.",
    },
    {
      instruction:
        "Demonstrate dataclass inheritance by creating a base `Vehicle` dataclass with fields `make` (str), `model` (str), `year` (int). Then create `ElectricVehicle` extending `Vehicle` with additional fields `battery_kwh` (float) and `range_km` (float). Add a method `efficiency()` to `ElectricVehicle` returning km per kWh. Use `asdict()` to serialize an instance to a dict.",
      hint: "Just use regular class inheritance — `class ElectricVehicle(Vehicle)`. Both classes need the `@dataclass` decorator. Import `asdict` from `dataclasses`.",
      starterCode: `from dataclasses import dataclass, asdict

# Define Vehicle base dataclass

# Define ElectricVehicle subclass with efficiency() method

ev = ElectricVehicle(
    make="Tesla",
    model="Model 3",
    year=2024,
    battery_kwh=75.0,
    range_km=560.0
)

print(ev)
print(f"Efficiency: {ev.efficiency():.1f} km/kWh")
print(asdict(ev))
`,
      validate: (code) =>
        code.includes("class ElectricVehicle(Vehicle)") &&
        code.includes("@dataclass") &&
        code.includes("battery_kwh") &&
        code.includes("range_km") &&
        code.includes("def efficiency") &&
        code.includes("asdict"),
      successMessage:
        "Well done! Dataclass inheritance follows normal Python class inheritance. Each subclass decorator processes its own fields and combines them with inherited ones, giving you the full __init__ signature.",
    },
  ],
};
