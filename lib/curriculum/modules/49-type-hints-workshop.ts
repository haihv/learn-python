import type { WorkshopModule } from "../types";

export const typeHintsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "49",
  slug: "type-hints-workshop",
  title: "TypeVar, Generic, Protocol (structural subtyping)",
  icon: "🔠",
  estimatedMinutes: 20,
  description: "Use advanced Python type system features",
  steps: [
    {
      instruction:
        "Define `T = TypeVar('T')` and write two generic functions: `identity(x: T) -> T` that returns its argument unchanged, and `first(items: list[T]) -> T` that returns the first element. Both should be typed so that the return type matches the input type — not `Any`.",
      hint: "from typing import TypeVar; T = TypeVar('T'). def identity(x: T) -> T: return x. def first(items: list[T]) -> T: return items[0]. TypeVar links the input and output type together.",
      starterCode: `from typing import TypeVar

# TODO: define T as a TypeVar
T = TypeVar('T')

def identity(x: T) -> T:
    """Return x unchanged. Return type matches input type."""
    # TODO: implement
    pass

def first(items: list[T]) -> T:
    """Return the first element of a list."""
    # TODO: implement
    pass


# Demonstrate that types are preserved
s: str = identity("hello")        # type is str, not Any
n: int = identity(42)              # type is int
f: float = identity(3.14)         # type is float

print(identity("hello"))   # hello
print(identity(42))        # 42
print(identity([1, 2, 3])) # [1, 2, 3]

print(first([10, 20, 30]))         # 10
print(first(["a", "b", "c"]))     # a
print(first([(1, 2), (3, 4)]))    # (1, 2)
`,
      validate: (code: string) => {
        return (
          code.includes("TypeVar") &&
          code.includes("T = TypeVar") &&
          code.includes("def identity") &&
          code.includes("def first") &&
          code.includes("-> T")
        );
      },
      successMessage:
        "TypeVar is what makes generic functions possible. Without it, you'd have to use `Any`, losing all type safety. With TypeVar, the type checker knows that if you pass a `str`, you get back a `str`.",
    },
    {
      instruction:
        "Write a `Stack(Generic[T])` class with `push(item: T) -> None`, `pop() -> T`, and `peek() -> T` methods, plus a `__len__` method. Raise `IndexError` from `pop` and `peek` when the stack is empty. Demonstrate it with both `Stack[int]` and `Stack[str]`.",
      hint: "from typing import Generic. class Stack(Generic[T]): def __init__(self): self._items: list[T] = []. def push(self, item: T) -> None: self._items.append(item). def pop(self) -> T: if not self._items: raise IndexError('empty'); return self._items.pop().",
      starterCode: `from typing import TypeVar, Generic

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        # TODO: add item to top of stack
        pass

    def pop(self) -> T:
        # TODO: remove and return top item; raise IndexError if empty
        pass

    def peek(self) -> T:
        # TODO: return top item without removing; raise IndexError if empty
        pass

    def __len__(self) -> int:
        return len(self._items)

    def __repr__(self) -> str:
        return f"Stack({self._items})"


# Integer stack
int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)
int_stack.push(3)
print(f"Stack: {int_stack}")
print(f"Peek: {int_stack.peek()}")
print(f"Pop: {int_stack.pop()}")
print(f"Len: {len(int_stack)}")

# String stack
str_stack: Stack[str] = Stack()
str_stack.push("hello")
str_stack.push("world")
print(f"\\nString stack: {str_stack}")
print(f"Pop: {str_stack.pop()}")

# Empty stack
try:
    empty: Stack[int] = Stack()
    empty.pop()
except IndexError as e:
    print(f"\\nIndexError: {e}")
`,
      validate: (code: string) => {
        return (
          code.includes("Generic[T]") &&
          code.includes("class Stack") &&
          code.includes("def push") &&
          code.includes("def pop") &&
          code.includes("def peek") &&
          code.includes("IndexError")
        );
      },
      successMessage:
        "Generic classes maintain type safety across all their methods. A `Stack[int]` will have `push` that only accepts `int` and `pop` that returns `int` — the type checker enforces consistency.",
    },
    {
      instruction:
        "Define a `Drawable` Protocol with a single method `draw(self) -> str`. Then create two completely unrelated classes `Circle` and `Square` (no common base class) that both implement `draw()`. Write a function `render_all(shapes: list[Drawable]) -> None` that calls `draw()` on each. Show that duck typing works with Protocols.",
      hint: "from typing import Protocol. class Drawable(Protocol): def draw(self) -> str: ... (ellipsis is the method body in a Protocol). Circle and Square don't need to inherit from Drawable — they just need a compatible draw() method.",
      starterCode: `from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> str:
        ...  # Protocol methods use ... as body


class Circle:
    def __init__(self, radius: float) -> None:
        self.radius = radius

    def draw(self) -> str:
        # TODO: return f"Circle(r={self.radius})"
        pass


class Square:
    def __init__(self, side: float) -> None:
        self.side = side

    def draw(self) -> str:
        # TODO: return f"Square(side={self.side})"
        pass


class Triangle:
    """Doesn't implement draw() — not Drawable."""
    def __init__(self, base: float, height: float) -> None:
        self.base = base
        self.height = height


def render_all(shapes: list[Drawable]) -> None:
    for shape in shapes:
        print(shape.draw())


# Circle and Square satisfy the Drawable protocol structurally
shapes = [Circle(5.0), Square(3.0), Circle(1.5)]
render_all(shapes)

# Works at runtime — Python doesn't check the Protocol type
print("\\nDirect calls:")
print(Circle(2.0).draw())
print(Square(4.0).draw())
`,
      validate: (code: string) => {
        return (
          code.includes("Protocol") &&
          code.includes("class Drawable") &&
          code.includes("def draw") &&
          code.includes("class Circle") &&
          code.includes("class Square") &&
          code.includes("def render_all") &&
          // ensure students actually implement draw() — not just leave pass
          (code.includes('return f"Circle') || code.includes("return f'Circle")) &&
          (code.includes('return f"Square') || code.includes("return f'Square"))
        );
      },
      successMessage:
        "Protocol enables structural subtyping (duck typing with type safety). Unlike ABC, classes don't need to inherit from `Drawable` — they just need to implement the right methods. This is how mypy checks for compatibility.",
    },
    {
      instruction:
        "Annotate a `transform(func: Callable[[int], str], values: list[int]) -> list[str]` function that applies `func` to each item in `values`. Then use `@overload` to type a `stringify` function that behaves differently depending on whether it receives an `int` or a `list[int]`.",
      hint: "from typing import Callable, overload. @overload def stringify(x: int) -> str: ... @overload def stringify(x: list[int]) -> list[str]: ... def stringify(x): (actual implementation). Use Callable[[int], str] for functions that take one int and return str.",
      starterCode: `from typing import Callable, overload

def transform(func: Callable[[int], str], values: list[int]) -> list[str]:
    """Apply func to each value and return list of results."""
    # TODO: apply func to each element in values and return the list of results
    pass


# @overload lets you declare multiple signatures for one function
@overload
def stringify(x: int) -> str: ...
@overload
def stringify(x: list[int]) -> list[str]: ...

def stringify(x):
    """Convert int to str, or list[int] to list[str]."""
    # TODO: if x is a list, return list of str(item) for each item; else return str(x)
    pass


# Test transform with a Callable
result = transform(str, [1, 2, 3])
print(f"transform(str, [1,2,3]): {result}")

result2 = transform(lambda n: f"#{n}", [10, 20, 30])
print(f"transform(lambda, [10,20,30]): {result2}")

# Test overloaded stringify
print(f"stringify(42): {stringify(42)!r}")
print(f"stringify([1, 2, 3]): {stringify([1, 2, 3])}")
`,
      validate: (code: string) => {
        // also verify students actually implement the bodies (not just leave pass)
        const hasTransformReturn = /def transform[^]*?return/.test(code);
        const hasStringifyReturn = /def stringify\(x\)[^]*?return/.test(code);
        return (
          code.includes("Callable") &&
          code.includes("@overload") &&
          code.includes("def stringify") &&
          code.includes("def transform") &&
          hasTransformReturn &&
          hasStringifyReturn
        );
      },
      successMessage:
        "`Callable[[ArgTypes], ReturnType]` precisely describes function types. `@overload` lets a single function have multiple typed signatures — the type checker picks the right one based on the argument types.",
    },
    {
      instruction:
        "Define a `UserDict` TypedDict with required fields `id: int`, `name: str`, `email: str`, and an `ExtraUserDict` that inherits from `UserDict` and adds optional fields `nickname: str` and `age: int` (using `total=False`). Write a function that accepts a `UserDict` and prints its fields.",
      hint: "from typing import TypedDict. class UserDict(TypedDict): id: int; name: str; email: str. class ExtraUserDict(UserDict, total=False): nickname: str; age: int. total=False makes all keys in that TypedDict optional.",
      starterCode: `from typing import TypedDict

class UserDict(TypedDict):
    # TODO: required fields: id (int), name (str), email (str)
    pass

class ExtraUserDict(UserDict, total=False):
    # TODO: optional fields: nickname (str), age (int)
    pass


def print_user(user: UserDict) -> None:
    """Print user info from a TypedDict."""
    print(f"User #{user['id']}: {user['name']} <{user['email']}>")


# Basic user — required fields only
alice: UserDict = {"id": 1, "name": "Alice", "email": "alice@example.com"}
print_user(alice)

# Extended user — with optional fields
bob: ExtraUserDict = {
    "id": 2,
    "name": "Bob",
    "email": "bob@example.com",
    "nickname": "Bobby",
    "age": 28,
}
print_user(bob)
print(f"  Nickname: {bob.get('nickname', 'n/a')}")
print(f"  Age: {bob.get('age', 'unknown')}")

# TypedDicts are just plain dicts at runtime
print(f"\\nType of alice: {type(alice)}")
print(f"isinstance check: {isinstance(alice, dict)}")
`,
      validate: (code: string) => {
        return (
          code.includes("TypedDict") &&
          code.includes("class UserDict") &&
          code.includes("class ExtraUserDict") &&
          code.includes("total=False") &&
          code.includes("def print_user")
        );
      },
      successMessage:
        "TypedDict gives dict-based data structures the same type safety as dataclasses, without changing the runtime representation. They're plain dicts with type metadata — perfect for JSON APIs and config objects.",
    },
  ],
};
