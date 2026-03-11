import type { LessonModule } from "../types";

export const matchModule: LessonModule = {
  type: "lesson",
  id: "09b",
  slug: "match",
  title: "Structural Pattern Matching (match/case)",
  icon: "🎯",
  estimatedMinutes: 15,
  content: `# Structural Pattern Matching (match/case)

Introduced in Python 3.10, \`match/case\` is one of the most powerful additions to the language. It goes far beyond a simple switch statement — it can destructure data, match shapes, and guard on conditions.

## Basic Syntax

\`\`\`python
command = "quit"

match command:
    case "quit":
        print("Quitting...")
    case "help":
        print("Available commands: quit, help, status")
    case "status":
        print("System running normally")
    case _:
        print(f"Unknown command: {command}")
\`\`\`

The \`_\` wildcard is like \`else\` — it matches anything. Unlike \`if/elif\`, there is **no fallthrough** between cases (unlike C/Java switch).

## Matching Literals

You can match integers, floats, strings, booleans, and \`None\`:

\`\`\`python
def http_status(code: int) -> str:
    match code:
        case 200:
            return "OK"
        case 201:
            return "Created"
        case 400:
            return "Bad Request"
        case 401:
            return "Unauthorized"
        case 403:
            return "Forbidden"
        case 404:
            return "Not Found"
        case 500:
            return "Internal Server Error"
        case _:
            return "Unknown Status"

print(http_status(200))  # OK
print(http_status(404))  # Not Found
print(http_status(418))  # Unknown Status
\`\`\`

## OR Patterns (\`|\`)

Use \`|\` to match multiple values in one case:

\`\`\`python
def day_type(day: str) -> str:
    match day:
        case "Saturday" | "Sunday":
            return "Weekend"
        case "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday":
            return "Weekday"
        case _:
            return "Invalid day"

print(day_type("Saturday"))   # Weekend
print(day_type("Wednesday"))  # Weekday
\`\`\`

## Matching Sequences

Match against lists, tuples, and other sequences. Use \`*rest\` for variable-length sequences:

\`\`\`python
def describe_point(point):
    match point:
        case []:
            return "Empty"
        case [x]:
            return f"1D point at {x}"
        case [x, y]:
            return f"2D point at ({x}, {y})"
        case [x, y, z]:
            return f"3D point at ({x}, {y}, {z})"
        case [first, *rest]:
            return f"Starts with {first}, then {len(rest)} more"

print(describe_point([]))           # Empty
print(describe_point([5]))          # 1D point at 5
print(describe_point([1, 2]))       # 2D point at (1, 2)
print(describe_point([1, 2, 3]))    # 3D point at (1, 2, 3)
print(describe_point([1, 2, 3, 4])) # Starts with 1, then 3 more
\`\`\`

Note: the captured variables (\`x\`, \`y\`, \`z\`, \`rest\`) are available in the case body.

## Matching Mappings (Dicts)

Match dict-like objects by key presence and value:

\`\`\`python
def process_event(event: dict):
    match event:
        case {"type": "click", "button": button}:
            print(f"Mouse click: {button} button")
        case {"type": "keydown", "key": key}:
            print(f"Key pressed: {key}")
        case {"type": "resize", "width": w, "height": h}:
            print(f"Window resized to {w}x{h}")
        case {"type": str(t)}:
            print(f"Unknown event type: {t}")
        case _:
            print("Malformed event")

process_event({"type": "click", "button": "left"})
process_event({"type": "keydown", "key": "Enter"})
process_event({"type": "resize", "width": 1920, "height": 1080})
\`\`\`

Mapping patterns only check the specified keys — extra keys in the dict are allowed.

## Matching Class Instances

Match against class instances using \`ClassName(attr=pattern)\`:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

@dataclass
class Circle:
    center: Point
    radius: float

@dataclass
class Rectangle:
    top_left: Point
    bottom_right: Point

def describe_shape(shape):
    match shape:
        case Circle(center=Point(x=0, y=0), radius=r):
            return f"Circle centered at origin with radius {r}"
        case Circle(center=c, radius=r):
            return f"Circle at ({c.x}, {c.y}) with radius {r}"
        case Rectangle(top_left=Point(x=x1, y=y1), bottom_right=Point(x=x2, y=y2)):
            width = abs(x2 - x1)
            height = abs(y2 - y1)
            return f"Rectangle {width}x{height}"

print(describe_shape(Circle(Point(0, 0), 5)))
print(describe_shape(Circle(Point(3, 4), 2)))
\`\`\`

## Guard Clauses (if)

Add an \`if\` guard to a case for additional filtering:

\`\`\`python
def categorize(value):
    match value:
        case int(n) if n < 0:
            return "negative integer"
        case int(n) if n == 0:
            return "zero"
        case int(n) if n > 0:
            return "positive integer"
        case float(f) if f < 0:
            return "negative float"
        case float(f):
            return "non-negative float"
        case str(s) if len(s) == 0:
            return "empty string"
        case str(s):
            return f"string: {s!r}"
        case None:
            return "nothing"
        case _:
            return "unknown type"

print(categorize(-5))      # negative integer
print(categorize(0))       # zero
print(categorize(3.14))    # non-negative float
print(categorize(""))      # empty string
print(categorize("hello")) # string: 'hello'
\`\`\`

## Wildcard \`_\` and Capture Variables

\`\`\`python
# _ discards the value (wildcard — matches but doesn't bind)
match point:
    case [x, _]:          # Match 2-element list, capture first, ignore second
        print(f"x = {x}")
    case [_, _, z]:       # Match 3-element list, capture only third
        print(f"z = {z}")

# Using a name binds the matched value
match command.split():
    case ["go", direction]:           # Bind direction
        print(f"Going {direction}")
    case ["go", direction, speed]:    # Bind both
        print(f"Going {direction} at speed {speed}")
    case ["stop"]:
        print("Stopping")
    case [verb, *args]:               # Catch-all with capture
        print(f"Unknown command {verb!r} with args {args}")
\`\`\`

## When to Use match vs if/elif

Use \`match\` when:
- You're dispatching on the **structure** or **type** of data
- You need to destructure and capture parts of the data
- You have many cases based on a single value's identity

Use \`if/elif\` when:
- Conditions involve multiple variables
- You need more complex boolean logic
- Targeting Python < 3.10 for compatibility
`,
  quiz: [
    {
      question: "What Python version introduced the match/case statement?",
      options: ["Python 3.8", "Python 3.9", "Python 3.10", "Python 3.11"],
      correctIndex: 2,
    },
    {
      question: "In a match statement, what does the _ pattern do?",
      options: [
        "Raises an error if reached",
        "Matches any value without binding it",
        "Matches only None",
        "Is the same as break in a switch statement",
      ],
      correctIndex: 1,
    },
    {
      question: "How do you add an extra condition to a match case?",
      options: [
        "case value and condition:",
        "case value where condition:",
        "case value if condition:",
        "case value when condition:",
      ],
      correctIndex: 2,
    },
  ],
};
