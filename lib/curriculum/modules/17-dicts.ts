import type { LessonModule } from "../types";

export const dicts: LessonModule = {
  type: "lesson",
  id: "17",
  slug: "dicts",
  title: "Dictionaries: CRUD, Iteration, Methods",
  icon: "📖",
  estimatedMinutes: 15,
  content: `# Dictionaries: CRUD, Iteration, Methods

A dictionary is Python's built-in hash map — a collection of **key-value pairs** where each key is unique. Dicts are ordered (insertion order preserved since Python 3.7), mutable, and extremely fast for lookup, insertion, and deletion.

## Creating Dictionaries

\`\`\`python
# Literal syntax — most common
person = {"name": "Alice", "age": 30, "city": "Berlin"}

# dict() constructor — useful when keys are valid identifiers
person = dict(name="Alice", age=30, city="Berlin")

# From a list of (key, value) pairs
pairs = [("a", 1), ("b", 2), ("c", 3)]
d = dict(pairs)

# Empty dict
empty = {}
also_empty = dict()

# Keys can be any hashable type: str, int, tuple...
mixed_keys = {1: "one", (2, 3): "tuple key", "str": 42}
\`\`\`

## CRUD Operations

### Read

\`\`\`python
person = {"name": "Alice", "age": 30}

# Direct access — raises KeyError if key missing
print(person["name"])   # Alice

# .get(key, default) — safe access, returns None (or default) if missing
print(person.get("city"))           # None
print(person.get("city", "unknown"))  # unknown

# Membership test — O(1) average time
print("age" in person)     # True
print("email" in person)   # False
print("email" not in person)  # True
\`\`\`

### Create / Update

\`\`\`python
person = {"name": "Alice"}

# Assign to a new key — creates it
person["email"] = "alice@example.com"

# Assign to existing key — overwrites value
person["name"] = "Alice Smith"

# .update() — merge another dict (or iterable of pairs) in-place
person.update({"age": 30, "city": "Berlin"})
person.update(job="engineer")   # keyword arguments also work

# .setdefault(key, default) — set only if key NOT already present
person.setdefault("age", 99)    # 30 — key exists, no change
person.setdefault("score", 0)   # 0  — key absent, inserts it
\`\`\`

### Delete

\`\`\`python
person = {"name": "Alice", "age": 30, "city": "Berlin"}

# del statement — raises KeyError if missing
del person["city"]

# .pop(key, default) — removes AND returns the value
age = person.pop("age")          # 30
missing = person.pop("x", None)  # None (safe — default prevents KeyError)

# .popitem() — removes and returns the LAST inserted (key, value) pair
# Useful for processing a dict destructively in LIFO order
key, val = person.popitem()

# .clear() — remove all items
person.clear()
print(person)  # {}
\`\`\`

## Iterating Dictionaries

\`\`\`python
scores = {"Alice": 95, "Bob": 82, "Carol": 91}

# Iterate keys (default behaviour)
for name in scores:
    print(name)

# Iterate only keys explicitly
for name in scores.keys():
    print(name)

# Iterate only values
for score in scores.values():
    print(score)

# Iterate key-value pairs — the most useful pattern
for name, score in scores.items():
    print(f"{name}: {score}")

# Build a new dict while iterating
passed = {name: score for name, score in scores.items() if score >= 90}
print(passed)  # {'Alice': 95, 'Carol': 91}
\`\`\`

## Dict Comprehensions

Dict comprehensions mirror list comprehensions but produce a dict:

\`\`\`python
# { key_expr: val_expr for var in iterable if condition }

# Square mapping
squares = {n: n**2 for n in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Invert a dict (swap keys and values)
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}

# Filter + transform
prices = {"apple": 0.5, "banana": 0.3, "cherry": 2.0}
expensive = {item: price for item, price in prices.items() if price > 0.4}
# {'apple': 0.5, 'cherry': 2.0}
\`\`\`

## Merging Dicts (Python 3.9+)

Python 3.9 introduced the **merge** (\`|\`) and **update** (\`|=\`) operators for dicts, making merge code much cleaner:

\`\`\`python
defaults = {"color": "red", "size": "M", "stock": 100}
overrides = {"color": "blue", "stock": 50}

# | creates a NEW merged dict (right side wins on conflicts)
merged = defaults | overrides
print(merged)  # {'color': 'blue', 'size': 'M', 'stock': 50}

# |= updates in-place (like dict.update() but more readable)
defaults |= overrides
print(defaults)  # {'color': 'blue', 'size': 'M', 'stock': 50}

# Before Python 3.9, you'd use:
merged_old = {**defaults, **overrides}  # unpacking — still valid
\`\`\`

## Useful Methods Summary

| Method | What it does |
|---|---|
| \`d[key]\` | Get value (KeyError if missing) |
| \`d.get(key, default)\` | Safe get |
| \`d[key] = val\` | Set / overwrite |
| \`del d[key]\` | Delete (KeyError if missing) |
| \`d.pop(key, default)\` | Remove and return value |
| \`d.popitem()\` | Remove and return last pair |
| \`d.update(other)\` | Merge in-place |
| \`d.setdefault(key, val)\` | Set only if absent |
| \`d.copy()\` | Shallow copy |
| \`d.keys()\` | View of all keys |
| \`d.values()\` | View of all values |
| \`d.items()\` | View of all (key, val) pairs |
| \`d.clear()\` | Remove all items |
| \`key in d\` | Membership test O(1) |

## Key Rules to Remember

- **Keys must be hashable** — strings, numbers, tuples are fine; lists and dicts are not.
- **Values can be anything** — lists, other dicts, functions, objects.
- \`.copy()\` is a **shallow** copy — nested objects are still shared. Use \`copy.deepcopy()\` when nesting matters.
- Dict views (\`.keys()\`, \`.values()\`, \`.items()\`) are **live** — they reflect changes made to the dict after the view was created.

\`\`\`python
# Live view demo
d = {"x": 1, "y": 2}
keys_view = d.keys()
d["z"] = 3
print(keys_view)  # dict_keys(['x', 'y', 'z']) — includes 'z'!
\`\`\`
`,
  quiz: [
    {
      question:
        "What is the difference between d['key'] and d.get('key') when the key does not exist?",
      options: [
        "d['key'] returns None; d.get('key') raises a KeyError",
        "d['key'] raises a KeyError; d.get('key') returns None by default",
        "Both raise a KeyError",
        "Both return None — they are identical",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Which method inserts a key with a default value ONLY if the key is not already present?",
      options: [".update()", ".insert()", ".setdefault()", ".put()"],
      correctIndex: 2,
    },
    {
      question:
        "Given d = {'a': 1, 'b': 2}, what does {'a': 0} | d produce in Python 3.9+?",
      options: [
        "{'a': 0, 'b': 2} — left side wins",
        "{'a': 1, 'b': 2} — right side wins",
        "{'a': 0} — only left keys are kept",
        "A TypeError — dicts cannot be merged with |",
      ],
      correctIndex: 1,
    },
  ],
};
