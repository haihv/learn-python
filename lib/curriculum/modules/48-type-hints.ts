import type { LessonModule } from "../types";

export const typeHints: LessonModule = {
  type: "lesson",
  id: "48",
  slug: "type-hints",
  title: "Type Annotations: list, dict, Optional, Union, Any",
  icon: "📐",
  estimatedMinutes: 15,
  content: `# Type Annotations: list, dict, Optional, Union, Any

Python is dynamically typed — you don't have to declare types. But **type hints** let you annotate your code with type information that static analysis tools (mypy, pyright, Pylance) can check, IDEs can use for autocompletion, and readers can use to understand intent. Crucially, they are not enforced at runtime.

## Basic Variable Annotations

\`\`\`python
# Variable annotations — not enforced, just documentation
name: str = "Alice"
age: int = 30
score: float = 9.5
active: bool = True

# You can annotate without assigning (useful in class bodies)
class Point:
    x: float
    y: float
\`\`\`

## Function Parameter and Return Types

\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"

def add(a: int, b: int) -> int:
    return a + b

def process(data: list) -> None:
    for item in data:
        print(item)

# Arrow -> None means the function returns nothing (implicitly None)
\`\`\`

## list[int], dict[str, int] — Generic Types (Python 3.9+)

Since Python 3.9, you can use built-in types directly as generics. Before 3.9, you had to import \`List\`, \`Dict\`, etc. from \`typing\`:

\`\`\`python
# Python 3.9+ — use built-in types
def sum_list(numbers: list[int]) -> int:
    return sum(numbers)

def word_count(text: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for word in text.split():
        counts[word] = counts.get(word, 0) + 1
    return counts

# Nested generics
matrix: list[list[float]] = [[1.0, 2.0], [3.0, 4.0]]
registry: dict[str, list[int]] = {"primes": [2, 3, 5, 7]}

# Pre-3.9 style (still valid):
from typing import List, Dict
def old_style(numbers: List[int]) -> Dict[str, int]:
    ...
\`\`\`

## Optional[str] — Values That Can Be None

\`Optional[X]\` is shorthand for \`Union[X, None]\` — the value is either \`X\` or \`None\`:

\`\`\`python
from typing import Optional

def find_user(user_id: int) -> Optional[str]:
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)   # returns str or None

result = find_user(1)   # type: Optional[str]
if result is not None:
    print(result.upper())  # safe: narrowed to str

# Python 3.10+: use X | None directly (no import needed)
def find_user_modern(user_id: int) -> str | None:
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)
\`\`\`

## Union[int, str] — Multiple Possible Types

\`Union[X, Y]\` means the value can be either \`X\` or \`Y\`:

\`\`\`python
from typing import Union

def parse_value(raw: str) -> Union[int, float, str]:
    try:
        return int(raw)
    except ValueError:
        try:
            return float(raw)
        except ValueError:
            return raw

# Python 3.10+ union syntax with |
def parse_value_modern(raw: str) -> int | float | str:
    ...

# Accept multiple input types
def display(value: Union[int, str, None]) -> str:
    if value is None:
        return "(none)"
    return str(value)
\`\`\`

## Any — Opt Out of Type Checking

\`Any\` is compatible with every type. Use it sparingly — overusing \`Any\` defeats the purpose of type hints:

\`\`\`python
from typing import Any

def log(value: Any) -> None:
    print(repr(value))

# Useful for truly dynamic code
def deep_merge(a: dict[str, Any], b: dict[str, Any]) -> dict[str, Any]:
    result = dict(a)
    for key, val in b.items():
        if key in result and isinstance(result[key], dict):
            result[key] = deep_merge(result[key], val)
        else:
            result[key] = val
    return result
\`\`\`

## tuple[int, ...] and Callable

\`\`\`python
from typing import Callable

# Fixed-length tuple: exactly (int, str, bool)
coords: tuple[int, int] = (10, 20)
record: tuple[str, int, bool] = ("Alice", 30, True)

# Variable-length homogeneous tuple: tuple[int, ...]
scores: tuple[int, ...] = (90, 85, 92, 78)

# Callable[[arg_types], return_type]
def apply(func: Callable[[int], str], value: int) -> str:
    return func(value)

def apply_binary(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

apply(str, 42)          # ok
apply_binary(max, 3, 7) # ok
\`\`\`

## Type Aliases

Give complex types a name for readability:

\`\`\`python
from typing import TypeAlias

# Simple alias (Python 3.10+ with TypeAlias, or just assignment)
Vector: TypeAlias = list[float]
Matrix: TypeAlias = list[list[float]]
JsonValue: TypeAlias = str | int | float | bool | None | list | dict

def dot_product(a: Vector, b: Vector) -> float:
    return sum(x * y for x, y in zip(a, b))
\`\`\`

## TypedDict — Typed Dictionaries

When a dict has a fixed structure (like a JSON object), \`TypedDict\` describes it precisely:

\`\`\`python
from typing import TypedDict

class User(TypedDict):
    id: int
    name: str
    email: str

# Optional keys require total=False or inheriting from a partial TypedDict
class PartialUser(TypedDict, total=False):
    nickname: str
    avatar_url: str

class FullUser(User, PartialUser):
    pass

user: User = {"id": 1, "name": "Alice", "email": "alice@example.com"}
# mypy will error if required key is missing or type is wrong
\`\`\`

## from __future__ import annotations — Deferred Evaluation

For forward references and performance, you can defer evaluation of annotations (all become strings at definition time):

\`\`\`python
from __future__ import annotations

class Node:
    def __init__(self, value: int, next: Node | None = None):
        # Without the import, "Node" would be a NameError here
        # because the class isn't fully defined yet
        self.value = value
        self.next = next
\`\`\`

## Runtime vs Static — Hints Are Not Enforced

**Type hints are documentation for tools, not runtime enforcement:**

\`\`\`python
def add(a: int, b: int) -> int:
    return a + b

# Python happily runs this — no runtime error
result = add("hello", " world")
print(result)   # "hello world"

# Type hints live in __annotations__ at runtime
print(add.__annotations__)
# {'a': <class 'int'>, 'b': <class 'int'>, 'return': <class 'int'>}
\`\`\`

Use **mypy** or **pyright** for static checking:
\`\`\`bash
mypy my_file.py           # type-check a file
pyright my_file.py        # alternative checker
\`\`\`
`,
  quiz: [
    {
      question: "What does `Optional[str]` mean in type hints?",
      options: [
        "The parameter is optional and can be omitted",
        "The value is either a str or None",
        "The value must be a subclass of str",
        "The annotation itself is optional and may be skipped",
      ],
      correctIndex: 1,
    },
    {
      question: "In Python 3.9+, how do you annotate a list of integers without importing from `typing`?",
      options: [
        "List[int]",
        "list<int>",
        "list[int]",
        "Array[int]",
      ],
      correctIndex: 2,
    },
    {
      question: "What happens at runtime if you pass a string to a function annotated to accept `int`?",
      options: [
        "Python raises a TypeError immediately",
        "Python silently converts the string to an integer",
        "Nothing — type hints are not enforced at runtime",
        "Python prints a warning but continues",
      ],
      correctIndex: 2,
    },
  ],
};
