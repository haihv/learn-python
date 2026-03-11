import type { LessonModule } from "../types";

export const dataclasses: LessonModule = {
  type: "lesson",
  id: "54",
  slug: "dataclasses",
  title: "@dataclass: fields, frozen, __post_init__",
  icon: "🗃️",
  estimatedMinutes: 15,
  content: `# Python Dataclasses

The \`@dataclass\` decorator, introduced in Python 3.7 (PEP 557), automatically generates boilerplate special methods like \`__init__\`, \`__repr__\`, and \`__eq__\` based on class-level field annotations. This lets you define data-holding classes cleanly, without writing repetitive initialization code.

## The Problem Dataclasses Solve

Before dataclasses, a simple data-holding class required a lot of ceremony:

\`\`\`python
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point(x={self.x!r}, y={self.y!r})"

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y
\`\`\`

With \`@dataclass\`, this collapses to:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1)        # Point(x=1.0, y=2.0)
print(p1 == p2)  # True
\`\`\`

The decorator reads the annotated class variables and generates \`__init__\`, \`__repr__\`, and \`__eq__\` for you.

## Generated Methods

By default, \`@dataclass\` generates three methods:

- **\`__init__\`**: Accepts all fields as parameters and assigns them.
- **\`__repr__\`**: Returns a string like \`ClassName(field=value, ...)\`.
- **\`__eq__\`**: Compares all fields for equality.

You can control what gets generated with decorator parameters:

\`\`\`python
@dataclass(repr=True, eq=True, order=False, frozen=False)
class Config:
    host: str
    port: int
    debug: bool = False
\`\`\`

Setting \`order=True\` generates \`__lt__\`, \`__le__\`, \`__gt__\`, \`__ge__\` so instances can be sorted.

## Default Values

Fields can have default values. Fields with defaults must come after fields without:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Server:
    host: str
    port: int = 8080
    debug: bool = False
    timeout: float = 30.0

s = Server("localhost")
print(s)  # Server(host='localhost', port=8080, debug=False, timeout=30.0)
\`\`\`

## The \`field()\` Function

For more complex defaults and field configuration, use \`field()\`:

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Student:
    name: str
    grades: list[float] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)
    _id: int = field(default=0, repr=False, compare=False)

s1 = Student("Alice")
s2 = Student("Alice")
s1.grades.append(95.0)
print(s1.grades)  # [95.0]
print(s2.grades)  # []  — separate list, not shared!
print(s1 == s2)   # True — _id excluded from compare
\`\`\`

Key \`field()\` parameters:
- **\`default\`**: A static default value (for immutable types).
- **\`default_factory\`**: A zero-argument callable called to produce the default. Use this for mutable defaults like lists and dicts — never set \`default=[]\` directly.
- **\`repr\`**: Include this field in \`__repr__\` output (default \`True\`).
- **\`compare\`**: Include this field in \`__eq__\` and ordering comparisons (default \`True\`).
- **\`init\`**: Include this field as a parameter in \`__init__\` (default \`True\`).

## Frozen Dataclasses

Setting \`frozen=True\` makes instances immutable — attempting to assign to any field raises a \`FrozenInstanceError\`:

\`\`\`python
from dataclasses import dataclass

@dataclass(frozen=True)
class Color:
    r: int
    g: int
    b: int

    def to_hex(self) -> str:
        return f"#{self.r:02x}{self.g:02x}{self.b:02x}"

red = Color(255, 0, 0)
print(red.to_hex())  # #ff0000
red.r = 100          # FrozenInstanceError: cannot assign to field 'r'
\`\`\`

Frozen dataclasses are also **hashable** by default (since their fields can't change), which means they can be used as dictionary keys or in sets:

\`\`\`python
palette = {Color(255, 0, 0): "red", Color(0, 255, 0): "green"}
print(palette[Color(255, 0, 0)])  # red
\`\`\`

## \`__post_init__\` for Validation

\`__post_init__\` is called by the generated \`__init__\` after all fields have been assigned. Use it for validation and computed fields:

\`\`\`python
from dataclasses import dataclass, field
from datetime import date

@dataclass
class DateRange:
    start: date
    end: date

    def __post_init__(self):
        if self.end < self.start:
            raise ValueError(f"end ({self.end}) must be >= start ({self.start})")

    @property
    def days(self) -> int:
        return (self.end - self.start).days

dr = DateRange(date(2024, 1, 1), date(2024, 12, 31))
print(dr.days)  # 365

bad = DateRange(date(2024, 6, 1), date(2024, 1, 1))  # ValueError
\`\`\`

### InitVar: Parameters That Don't Become Fields

\`InitVar\` lets you accept parameters in \`__init__\` that are passed to \`__post_init__\` but not stored as fields:

\`\`\`python
from dataclasses import dataclass, field, InitVar

@dataclass
class Circle:
    radius: float
    unit: InitVar[str] = "m"
    area: float = field(init=False)

    def __post_init__(self, unit: str):
        self.area = 3.14159 * self.radius ** 2
        if unit == "cm":
            self.area /= 10000

c = Circle(5.0, unit="m")
print(c.area)   # 78.53975
print(c.unit)   # AttributeError — unit is not a field
\`\`\`

## Dataclass Inheritance

Dataclasses support inheritance. Child classes can add new fields, but fields with defaults in the parent cause an issue if the child tries to add fields without defaults after them:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Animal:
    name: str
    sound: str

@dataclass
class Dog(Animal):
    breed: str
    friendly: bool = True

    def speak(self) -> str:
        return f"{self.name} says {self.sound}!"

d = Dog(name="Rex", sound="Woof", breed="Labrador")
print(d.speak())  # Rex says Woof!
print(d)          # Dog(name='Rex', sound='Woof', breed='Labrador', friendly=True)
\`\`\`

## \`asdict()\` and \`astuple()\`

The \`dataclasses\` module provides utility functions to convert instances to plain Python structures:

\`\`\`python
from dataclasses import dataclass, asdict, astuple

@dataclass
class Address:
    street: str
    city: str
    country: str = "USA"

addr = Address("123 Main St", "Springfield")

print(asdict(addr))
# {'street': '123 Main St', 'city': 'Springfield', 'country': 'USA'}

print(astuple(addr))
# ('123 Main St', 'Springfield', 'USA')
\`\`\`

\`asdict()\` is particularly useful for serializing to JSON:

\`\`\`python
import json
from dataclasses import dataclass, asdict

@dataclass
class Product:
    name: str
    price: float
    in_stock: bool = True

p = Product("Widget", 9.99)
print(json.dumps(asdict(p), indent=2))
# {
#   "name": "Widget",
#   "price": 9.99,
#   "in_stock": true
# }
\`\`\`

## Dataclass vs namedtuple vs Plain Class

| Feature | \`@dataclass\` | \`namedtuple\` | Plain class |
|---------|--------------|-------------|------------|
| Mutable | Yes (or frozen) | No | Yes |
| Auto \`__repr__\` | Yes | Yes | No |
| Auto \`__eq__\` | Yes | Yes | No |
| Hashable | Only if frozen | Yes | No (by default) |
| Default values | Yes (field()) | Limited | Yes |
| Inheritance | Full support | Limited | Full support |
| Type hints | Required | Optional | Optional |
| \`__post_init__\` | Yes | No | N/A |

Use \`@dataclass\` for mutable records with validation. Use \`namedtuple\` for lightweight immutable records where memory is critical. Use plain classes when you need full control or the object has complex behavior beyond data storage.
`,
  quiz: [
    {
      question:
        "Why should you use `field(default_factory=list)` instead of `field(default=[])` for a list field in a dataclass?",
      options: [
        "field(default=[]) raises a SyntaxError",
        "Using a mutable default value like [] would be shared across all instances; default_factory creates a new list for each instance",
        "field(default=[]) is slower at runtime",
        "default_factory is required for all non-primitive types",
      ],
      correctIndex: 1,
    },
    {
      question: "What does setting `frozen=True` on a dataclass enable?",
      options: [
        "The dataclass fields are frozen at the module level and cannot be imported",
        "Instances become immutable and hashable, raising FrozenInstanceError on field assignment",
        "The class can only be instantiated once (singleton pattern)",
        "All fields default to None and cannot be overridden",
      ],
      correctIndex: 1,
    },
    {
      question:
        "When is `__post_init__` called in a dataclass?",
      options: [
        "Before __init__ assigns fields, allowing you to set initial values",
        "Only when you explicitly call it with super().__post_init__()",
        "By the generated __init__ after all fields have been assigned, useful for validation and computed fields",
        "When the instance is garbage collected, similar to __del__",
      ],
      correctIndex: 2,
    },
  ],
};
