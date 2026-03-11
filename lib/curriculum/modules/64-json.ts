import type { LessonModule } from "../types";

export const jsonModule: LessonModule = {
  type: "lesson",
  id: "64",
  slug: "json",
  title: "json.dumps, json.loads, JSONEncoder, JSONDecoder",
  icon: "📄",
  estimatedMinutes: 12,
  content: `# JSON in Python

JSON (JavaScript Object Notation) is the universal data exchange format for web APIs and configuration files. Python's built-in \`json\` module handles serialization (Python → JSON string) and deserialization (JSON string → Python) with no extra dependencies.

## Basic Serialization: \`json.dumps\`

\`json.dumps\` converts a Python object to a JSON string:

\`\`\`python
import json

data = {
    "name": "Alice",
    "age": 30,
    "active": True,
    "score": 9.5,
    "tags": ["python", "developer"],
    "address": None,
}

# Basic serialization
compact = json.dumps(data)
print(compact)
# {"name": "Alice", "age": 30, "active": true, "score": 9.5, "tags": ["python", "developer"], "address": null}

# Pretty-printed with indentation
pretty = json.dumps(data, indent=2)
print(pretty)
# {
#   "name": "Alice",
#   "age": 30,
#   ...
# }

# Sort keys alphabetically
sorted_json = json.dumps(data, sort_keys=True, indent=2)
\`\`\`

### Python ↔ JSON Type Mapping

| Python | JSON |
|--------|------|
| \`dict\` | object \`{}\` |
| \`list\`, \`tuple\` | array \`[]\` |
| \`str\` | string |
| \`int\`, \`float\` | number |
| \`True\` | \`true\` |
| \`False\` | \`false\` |
| \`None\` | \`null\` |

## Basic Deserialization: \`json.loads\`

\`json.loads\` parses a JSON string back into Python objects:

\`\`\`python
import json

json_str = '{"name": "Bob", "age": 25, "scores": [88, 92, 95]}'

data = json.loads(json_str)
print(type(data))          # <class 'dict'>
print(data["name"])        # Bob
print(data["scores"][1])   # 92

# JSON arrays become Python lists
json_arr = '[1, 2, 3, "hello", true, null]'
result = json.loads(json_arr)
print(result)  # [1, 2, 3, 'hello', True, None]
\`\`\`

## File I/O: \`json.dump\` and \`json.load\`

For reading and writing JSON files, use \`json.dump\` and \`json.load\` (no 's') which work with file objects:

\`\`\`python
import json

config = {"host": "localhost", "port": 5432, "database": "mydb"}

# Write to file
with open("config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2)

# Read from file
with open("config.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)

print(loaded["port"])  # 5432
\`\`\`

## Handling Non-Serializable Types

By default, \`json.dumps\` raises \`TypeError\` for types it doesn't know about:

\`\`\`python
import json
from datetime import datetime

data = {"created_at": datetime.now()}
json.dumps(data)  # TypeError: Object of type datetime is not JSON serializable
\`\`\`

### The \`default\` Parameter

Pass a function that converts unknown types to serializable ones:

\`\`\`python
import json
from datetime import datetime, date
from decimal import Decimal

def json_default(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

data = {
    "created_at": datetime(2024, 1, 15, 10, 30, 0),
    "date": date(2024, 1, 15),
    "price": Decimal("9.99"),
}

result = json.dumps(data, default=json_default, indent=2)
print(result)
# {
#   "created_at": "2024-01-15T10:30:00",
#   "date": "2024-01-15",
#   "price": 9.99
# }
\`\`\`

### Custom \`JSONEncoder\` Subclass

For reusable encoding logic, subclass \`json.JSONEncoder\`:

\`\`\`python
import json
from datetime import datetime, date
from decimal import Decimal
from dataclasses import dataclass, asdict

@dataclass
class Product:
    name: str
    price: Decimal
    created: date

class AppJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return str(obj)  # preserve precision as string
        if hasattr(obj, "__dataclass_fields__"):
            return asdict(obj)
        return super().default(obj)

p = Product("Widget", Decimal("9.99"), date(2024, 1, 15))
result = json.dumps(p, cls=AppJSONEncoder, indent=2)
print(result)
# {
#   "name": "Widget",
#   "price": "9.99",
#   "created": "2024-01-15"
# }
\`\`\`

## Custom Decoding with \`object_hook\`

\`object_hook\` is called on every JSON object (dict) during parsing, letting you convert dicts back to custom types:

\`\`\`python
import json
from datetime import datetime

def parse_dates(dct):
    """Convert any string value that looks like an ISO date to datetime."""
    for key, value in dct.items():
        if isinstance(value, str):
            try:
                dct[key] = datetime.fromisoformat(value)
            except ValueError:
                pass
    return dct

json_str = '{"name": "Alice", "joined": "2024-01-15T10:30:00", "age": 30}'
data = json.loads(json_str, object_hook=parse_dates)

print(data["joined"])           # 2024-01-15 10:30:00
print(type(data["joined"]))     # <class 'datetime.datetime'>
print(type(data["age"]))        # <class 'int'>  — not converted
\`\`\`

## Common Pitfalls

### \`NaN\` and \`Infinity\`

Python's \`float('nan')\` and \`float('inf')\` are not valid JSON, but Python's \`json\` module serializes them by default (as \`NaN\` and \`Infinity\`). Many JSON parsers reject these:

\`\`\`python
import json
import math

data = {"value": math.nan}
print(json.dumps(data))  # {"value": NaN}  — invalid JSON!

# Strict mode raises ValueError for nan/inf
json.dumps(data, allow_nan=False)  # ValueError: Out of range float values
\`\`\`

### Datetime Is Not Serializable

Always handle datetime explicitly:

\`\`\`python
import json
from datetime import datetime

# This fails:
# json.dumps({"ts": datetime.now()})

# This works:
now = datetime.now()
json.dumps({"ts": now.isoformat()})  # Use isoformat()
\`\`\`

### Integer Keys Become Strings

JSON only supports string keys. Dict keys that are integers get silently converted:

\`\`\`python
import json

data = {1: "one", 2: "two"}
serialized = json.dumps(data)
print(serialized)  # {"1": "one", "2": "two"}

restored = json.loads(serialized)
print(restored)      # {"1": "one", "2": "two"}  — keys are strings now!
print(1 in restored) # False — key 1 (int) is gone
\`\`\`
`,
  quiz: [
    {
      question: "What is the difference between `json.dumps` and `json.dump`?",
      options: [
        "json.dumps is for dictionaries only; json.dump works for any Python type",
        "json.dumps returns a JSON string; json.dump writes to a file object",
        "json.dump is deprecated; always use json.dumps",
        "json.dumps requires an encoding parameter; json.dump does not",
      ],
      correctIndex: 1,
    },
    {
      question: "What does the `object_hook` parameter in `json.loads` do?",
      options: [
        "It validates that the JSON object matches a schema before parsing",
        "It is called for every JSON array found in the document",
        "It is called for every JSON object (dict) during parsing, allowing you to convert dicts to custom Python types",
        "It defines fallback values for missing keys in the JSON object",
      ],
      correctIndex: 2,
    },
    {
      question: "What happens when you call `json.dumps({1: 'one', 2: 'two'})`?",
      options: [
        "A TypeError is raised because JSON object keys must be strings",
        "The integer keys are silently converted to strings: {\"1\": \"one\", \"2\": \"two\"}",
        "The output uses integer keys: {1: \"one\", 2: \"two\"}",
        "The dict is converted to a JSON array of [key, value] pairs",
      ],
      correctIndex: 1,
    },
  ],
};
