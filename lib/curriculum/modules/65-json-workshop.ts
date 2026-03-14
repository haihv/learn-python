import type { WorkshopModule } from "../types";

export const jsonWorkshop: WorkshopModule = {
  type: "workshop",
  id: "65",
  slug: "json-workshop",
  title: "Working with Nested JSON & Custom Encoding",
  icon: "🔧",
  estimatedMinutes: 20,
  description: "Master JSON serialization including custom types",
  steps: [
    {
      instruction:
        "Practice basic `json.dumps` and `json.loads`. Create a nested data structure representing a user profile (with nested address, list of hobbies, and optional fields set to None). Serialize it with pretty-printing and sorted keys, then deserialize it back and verify round-trip fidelity.",
      hint: "Use `json.dumps(data, indent=2, sort_keys=True)` for pretty output. Then `json.loads(json_str)` to deserialize. Compare original and restored with `==`.",
      starterCode: `import json

user = {
    "id": 42,
    "username": "alice_dev",
    "email": "alice@example.com",
    "age": 30,
    "active": True,
    "bio": None,
    "hobbies": ["python", "hiking", "photography"],
    "address": {
        "street": "123 Main St",
        "city": "Springfield",
        "country": "USA",
        "postal_code": "12345"
    },
    "scores": {"math": 95.5, "science": 88.0, "english": 92.3}
}

# TODO: serialize user to a JSON string with indent=2 and sort_keys=True
json_str = ""  # replace with json.dumps(...)
print(json_str)
print(f"\\nJSON length: {len(json_str)} characters")

# TODO: deserialize json_str back to a dict and verify round-trip fidelity
restored = {}  # replace with json.loads(...)
print(f"\\nRound-trip equal: {user == restored}")
print(f"Hobbies: {restored.get('hobbies')}")
print(f"City: {restored.get('address', {}).get('city')}")
print(f"Bio is None: {restored.get('bio') is None}")
`,
      validate: (code) =>
        code.includes("json.dumps") &&
        code.includes("json.loads") &&
        code.includes("indent"),
      successMessage:
        "Great! JSON round-trips work perfectly for Python's built-in types. Notice that None becomes null and True/False become true/false in JSON — json.loads converts them back automatically.",
    },
    {
      instruction:
        "Write a custom `JSONEncoder` subclass that handles `datetime`, `date`, and `set` objects. Also handle a simple dataclass. Test that your encoder serializes all these types without raising TypeError.",
      hint: "Subclass `json.JSONEncoder` and override `default(self, obj)`. Check `isinstance(obj, datetime)`, `isinstance(obj, set)`, etc. Pass your class as `cls=MyEncoder` to `json.dumps`.",
      starterCode: `import json
from datetime import datetime, date
from dataclasses import dataclass, asdict

@dataclass
class Point:
    x: float
    y: float

class SmartJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        # TODO: handle datetime -> {"__type__": "datetime", "value": obj.isoformat()}
        # TODO: handle date    -> {"__type__": "date",     "value": obj.isoformat()}
        # TODO: handle set     -> {"__type__": "set",      "values": sorted(obj)}
        # TODO: handle dataclasses (check __dataclass_fields__) -> asdict(obj)
        # Fall back to default for anything else
        return super().default(obj)

# Test data containing non-serializable types
data = {
    "created_at": datetime(2024, 6, 15, 14, 30, 0),
    "birth_date": date(1994, 3, 20),
    "unique_tags": {"python", "backend", "api"},
    "location": Point(37.7749, -122.4194),
    "count": 42,
    "active": True,
}

result = json.dumps(data, cls=SmartJSONEncoder, indent=2)
print(result)

# Verify it parses back
parsed = json.loads(result)
print(f"\\nType of created_at after parse: {type(parsed['created_at'])}")
print(f"Tags after parse: {parsed['unique_tags']['values']}")
print(f"Location x: {parsed['location']['x']}")
`,
      validate: (code) =>
        code.includes("json.JSONEncoder") &&
        code.includes("def default") &&
        code.includes("isinstance") &&
        code.includes("cls="),
      successMessage:
        "Excellent! Custom JSONEncoder is the cleanest pattern for handling non-standard types. Notice we tagged datetime/set with __type__ — that's a common pattern for enabling round-trip deserialization.",
    },
    {
      instruction:
        "Implement a custom `object_hook` to deserialize tagged JSON objects back into Python types. Using the output from the previous step (with `__type__` tags), write an `object_hook` that reconstructs `datetime`, `date`, and `set` objects during `json.loads`.",
      hint: "In your `object_hook` function, check if `'__type__'` is in the dict. Use `datetime.fromisoformat()` and `date.fromisoformat()` to reconstruct dates. Return `set(dct['values'])` for sets.",
      starterCode: `import json
from datetime import datetime, date

def smart_decoder(dct):
    """Convert tagged JSON objects back to Python types."""
    # TODO: check for a type tag in dct and reconstruct the right Python object:
    #   if the tag is "datetime", parse the "value" field as an ISO datetime
    #   if the tag is "date",     parse the "value" field as an ISO date
    #   if the tag is "set",      convert the "values" list to a Python set
    # If there is no tag, return dct unchanged
    pass

# Simulate JSON from an API that uses our tagging convention
json_input = """
{
    "event": "user_signup",
    "created_at": {"__type__": "datetime", "value": "2024-06-15T14:30:00"},
    "birth_date": {"__type__": "date", "value": "1994-03-20"},
    "permissions": {"__type__": "set", "values": ["read", "write", "admin"]},
    "metadata": {"source": "web", "ip": "192.168.1.1"}
}
"""

data = json.loads(json_input, object_hook=smart_decoder)

print(f"Event: {data['event']}")
print(f"Created: {data['created_at']} (type: {type(data['created_at']).__name__})")
print(f"Birth date: {data['birth_date']} (type: {type(data['birth_date']).__name__})")
print(f"Permissions: {data['permissions']} (type: {type(data['permissions']).__name__})")
print(f"Metadata: {data['metadata']}")

# Verify types
assert isinstance(data["created_at"], datetime)
assert isinstance(data["birth_date"], date)
assert isinstance(data["permissions"], set)
print("\\nAll type assertions passed!")
`,
      validate: (code) =>
        code.includes("object_hook") &&
        code.includes("fromisoformat") &&
        code.includes("__type__"),
      successMessage:
        "Perfect! object_hook + __type__ tagging creates a round-trip serialization system for custom types. This pattern powers many Python REST frameworks and configuration systems.",
    },
    {
      instruction:
        "Practice reading and writing JSON files. Write a function that reads a JSON config file (or creates a default one if it doesn't exist), updates specific keys, and writes it back. Use `io.StringIO` to simulate file I/O without touching the filesystem.",
      hint: "Use `io.StringIO` as a file-like object. `json.dump(data, f)` writes to it. `f.getvalue()` retrieves the string. `f.seek(0)` resets position for reading.",
      starterCode: `import json
import io

def load_or_create_config(json_str: str | None, defaults: dict) -> dict:
    """Parse existing JSON config or return defaults if empty/None."""
    # TODO: if json_str is falsy return a copy of defaults;
    # otherwise start with defaults, merge in the parsed json_str values, and return
    pass

def save_config(config: dict) -> str:
    """Serialize config to a JSON string."""
    # TODO: write config to a file-like buffer with pretty-printing (indent=2, sort_keys=True)
    # then return the buffer's string content
    pass

# Default configuration
DEFAULTS = {
    "host": "localhost",
    "port": 8080,
    "debug": False,
    "max_connections": 100,
    "log_level": "INFO",
}

# Simulate loading an existing partial config
existing_json = '{"port": 9000, "debug": true, "custom_key": "hello"}'
config = load_or_create_config(existing_json, DEFAULTS)
print("Loaded config:")
print(json.dumps(config, indent=2))

# Update and save
config["log_level"] = "DEBUG"
config["max_connections"] = 50
saved = save_config(config)
print("\\nSaved config:")
print(saved)

# Load from scratch (no existing config)
fresh = load_or_create_config(None, DEFAULTS)
print("\\nFresh config:")
print(json.dumps(fresh, indent=2))
`,
      validate: (code) =>
        code.includes("json.dump") &&
        code.includes("json.loads") &&
        code.includes("io.StringIO"),
      successMessage:
        "Well done! Using io.StringIO lets you test JSON file I/O without filesystem side effects. In production, replace the StringIO buffer with an actual file opened with open() — the json.dump/json.load API is identical.",
    },
    {
      instruction:
        "Handle JSON edge cases: NaN/Infinity, deeply nested structures, and large integers. Write code that demonstrates `allow_nan=False`, accesses deeply nested JSON using a safe getter, and shows that Python integers of any size survive JSON round-trips.",
      hint: "Use `json.dumps(data, allow_nan=False)` to enforce strict JSON. For safe nested access, use `.get()` chained calls or a helper. Python ints become JSON numbers without precision loss.",
      starterCode: `import json
import math

# Edge case 1: NaN and Infinity
print("=== NaN and Infinity ===")
nan_data = {"value": math.nan, "limit": math.inf}
lenient = json.dumps(nan_data)
print(f"Lenient (invalid JSON): {lenient}")

try:
    strict = json.dumps(nan_data, allow_nan=False)
except ValueError as e:
    print(f"Strict mode error: {e}")

# Replace NaN/inf before serializing
def sanitize(obj):
    # TODO: if obj is a dict, recursively sanitize each value
    # if obj is a float and is NaN or Inf (use math.isnan / math.isinf), return None
    # otherwise return obj unchanged
    pass

clean = json.dumps(sanitize(nan_data))
print(f"Sanitized: {clean}")

# Edge case 2: Deeply nested access
print("\\n=== Deep Nesting ===")
deep = {"a": {"b": {"c": {"d": {"value": 42}}}}}
deep_json = json.dumps(deep)
restored = json.loads(deep_json)

def deep_get(obj, *keys, default=None):
    # TODO: iterate through keys; if obj is not a dict return default,
    # otherwise advance obj = obj.get(key, default); return obj at the end
    pass

print(deep_get(restored, "a", "b", "c", "d", "value"))  # 42
print(deep_get(restored, "a", "x", "missing"))           # None

# Edge case 3: Large integers
print("\\n=== Large Integers ===")
big = {"factorial_20": math.factorial(20)}
serialized = json.dumps(big)
back = json.loads(serialized)
print(f"Round-trip correct: {big == back}")
print(f"20! = {back['factorial_20']}")
`,
      validate: (code) =>
        code.includes("allow_nan") &&
        code.includes("math.nan") &&
        code.includes("json.dumps") &&
        code.includes("json.loads"),
      successMessage:
        "Excellent! Understanding edge cases separates robust JSON handling from brittle code. always use allow_nan=False in production APIs, sanitize floats before serializing, and remember that Python's arbitrary-precision ints survive JSON round-trips perfectly.",
    },
  ],
};
