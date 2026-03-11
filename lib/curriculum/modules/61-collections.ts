import type { LessonModule } from "../types";

export const collections: LessonModule = {
  type: "lesson",
  id: "61",
  slug: "collections",
  title: "Counter, defaultdict, deque, namedtuple, OrderedDict",
  icon: "🗄️",
  estimatedMinutes: 15,
  content: `# Python Collections Module

The \`collections\` module provides specialized container datatypes that solve common programming problems more elegantly than plain \`dict\`, \`list\`, or \`tuple\`. Each type is designed for a specific use case.

## \`collections.Counter\`

\`Counter\` counts hashable objects. It's a \`dict\` subclass where elements are keys and counts are values:

\`\`\`python
from collections import Counter

# Count characters in a string
c = Counter("abracadabra")
print(c)
# Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})

# Count words
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
word_count = Counter(words)
print(word_count)
# Counter({'apple': 3, 'banana': 2, 'cherry': 1})

# most_common(n) — top n elements by count
print(word_count.most_common(2))
# [('apple', 3), ('banana', 2)]

# Missing keys return 0 (not KeyError)
print(word_count["mango"])  # 0
\`\`\`

### Counter Arithmetic

Counters support set-like operations:

\`\`\`python
from collections import Counter

votes_day1 = Counter({"Alice": 30, "Bob": 20, "Carol": 15})
votes_day2 = Counter({"Alice": 10, "Bob": 25, "David": 5})

combined = votes_day1 + votes_day2
# Counter({'Alice': 40, 'Bob': 45, 'Carol': 15, 'David': 5})

difference = votes_day1 - votes_day2
# Counter({'Carol': 15, 'Alice': 20})  — only positive counts

intersection = votes_day1 & votes_day2  # min of each
union = votes_day1 | votes_day2         # max of each

# Update with new counts
votes_day1.update(["Alice", "Alice", "Bob"])
print(votes_day1["Alice"])  # 32
\`\`\`

## \`collections.defaultdict\`

\`defaultdict\` extends \`dict\` with a factory function for missing keys, eliminating the need for \`setdefault()\` or \`if key not in d\` checks:

\`\`\`python
from collections import defaultdict

# Group words by first letter
words = ["apple", "banana", "avocado", "blueberry", "cherry", "apricot"]

# Without defaultdict:
groups = {}
for word in words:
    key = word[0]
    if key not in groups:
        groups[key] = []
    groups[key].append(word)

# With defaultdict:
groups = defaultdict(list)
for word in words:
    groups[word[0]].append(word)  # No key check needed!

print(dict(groups))
# {'a': ['apple', 'avocado', 'apricot'], 'b': ['banana', 'blueberry'], 'c': ['cherry']}
\`\`\`

The factory function can be any callable:

\`\`\`python
from collections import defaultdict

# defaultdict(int) — missing keys default to 0
char_freq = defaultdict(int)
for char in "hello world":
    char_freq[char] += 1  # No need to initialize!

# defaultdict(set) — missing keys default to empty set
connections = defaultdict(set)
connections["Alice"].add("Bob")
connections["Alice"].add("Carol")
connections["Bob"].add("Alice")

# Nested defaultdict
from collections import defaultdict
nested = defaultdict(lambda: defaultdict(int))
nested["math"]["Alice"] += 95
nested["math"]["Bob"] += 87
\`\`\`

## \`collections.deque\`

\`deque\` (double-ended queue) supports efficient O(1) append and pop from both ends. Regular lists have O(n) cost for \`insert(0, x)\` and \`pop(0)\`:

\`\`\`python
from collections import deque

d = deque([1, 2, 3])

# Append to either end — O(1)
d.append(4)       # [1, 2, 3, 4]
d.appendleft(0)   # [0, 1, 2, 3, 4]

# Pop from either end — O(1)
d.pop()           # returns 4, deque: [0, 1, 2, 3]
d.popleft()       # returns 0, deque: [1, 2, 3]

# Rotate
d = deque([1, 2, 3, 4, 5])
d.rotate(2)       # [4, 5, 1, 2, 3]  — rotate right
d.rotate(-2)      # [1, 2, 3, 4, 5]  — rotate left
\`\`\`

### \`maxlen\`: Bounded Deque

The \`maxlen\` parameter creates a fixed-size deque — old items are automatically discarded when new ones are added:

\`\`\`python
from collections import deque

# Keep only the last 5 log entries
recent_logs = deque(maxlen=5)

for i in range(10):
    recent_logs.append(f"Event {i}")

print(list(recent_logs))
# ['Event 5', 'Event 6', 'Event 7', 'Event 8', 'Event 9']
# Event 0-4 were automatically discarded
\`\`\`

This is perfect for sliding windows, recent-items caches, and undo history.

## \`collections.namedtuple\`

\`namedtuple\` creates a tuple subclass with named fields — lightweight, immutable records without the weight of a full class:

\`\`\`python
from collections import namedtuple

# Create the type
Point = namedtuple("Point", ["x", "y"])
Color = namedtuple("Color", "r g b")  # space-separated string also works

p = Point(1.0, 2.0)
print(p.x, p.y)     # 1.0 2.0
print(p[0], p[1])   # 1.0 2.0 — still a tuple
print(p)            # Point(x=1.0, y=2.0)

# Immutable — this raises AttributeError:
# p.x = 5

# _replace() creates a new instance with changed fields
p2 = p._replace(x=10.0)
print(p2)  # Point(x=10.0, y=2.0)

# _asdict() converts to OrderedDict
print(p._asdict())  # {'x': 1.0, 'y': 2.0}
\`\`\`

Use \`namedtuple\` when you need immutable records that should be memory-efficient and tuple-compatible. For mutable records or validation, prefer \`@dataclass\`.

## \`collections.OrderedDict\`

Before Python 3.7, regular \`dict\` did not guarantee insertion order. \`OrderedDict\` was the solution. Since Python 3.7+, regular dicts maintain insertion order, but \`OrderedDict\` still has one advantage: \`move_to_end()\`:

\`\`\`python
from collections import OrderedDict

od = OrderedDict()
od["first"] = 1
od["second"] = 2
od["third"] = 3

print(list(od.keys()))  # ['first', 'second', 'third']

od.move_to_end("first")
print(list(od.keys()))  # ['second', 'third', 'first']

od.move_to_end("third", last=False)  # Move to front
print(list(od.keys()))  # ['third', 'second', 'first']
\`\`\`

\`OrderedDict\` is useful for LRU cache implementations and when you specifically need \`move_to_end\` semantics.

## \`collections.ChainMap\`

\`ChainMap\` groups multiple dictionaries into a single view. Lookups search through the maps in order:

\`\`\`python
from collections import ChainMap

defaults = {"color": "blue", "font": "Arial", "size": 12}
user_prefs = {"color": "red", "size": 14}
session = {"color": "green"}

# Later maps are searched after earlier ones
config = ChainMap(session, user_prefs, defaults)

print(config["color"])  # "green" — from session (first map)
print(config["font"])   # "Arial" — falls through to defaults
print(config["size"])   # 14 — from user_prefs

# Updates only modify the first map
config["font"] = "Helvetica"
print(config.maps[0])  # {"color": "green", "font": "Helvetica"}
print(defaults)        # unchanged
\`\`\`

\`ChainMap\` is ideal for layered configuration (env > config file > defaults) without copying data.

## Quick Reference

| Type | Use Case | Key Feature |
|------|----------|-------------|
| \`Counter\` | Count occurrences | \`most_common()\`, arithmetic |
| \`defaultdict\` | Group/accumulate | Auto-initializes missing keys |
| \`deque\` | Queue/stack | O(1) both-end ops, \`maxlen\` |
| \`namedtuple\` | Lightweight records | Named fields, still a tuple |
| \`OrderedDict\` | Ordered mapping | \`move_to_end()\` |
| \`ChainMap\` | Layered config | Multi-dict view |
`,
  quiz: [
    {
      question: "What does `Counter('aabbc')['z']` return?",
      options: [
        "KeyError — 'z' is not in the Counter",
        "None",
        "0 — Counter returns 0 for missing keys instead of raising KeyError",
        "'' — an empty string as the default",
      ],
      correctIndex: 2,
    },
    {
      question: "A `deque` with `maxlen=3` currently holds `[1, 2, 3]`. What happens when you call `d.append(4)`?",
      options: [
        "An IndexError is raised because the deque is full",
        "The value 4 is ignored",
        "The deque becomes [1, 2, 3, 4] and maxlen is automatically increased",
        "The oldest item (1) is discarded and the deque becomes [2, 3, 4]",
      ],
      correctIndex: 3,
    },
    {
      question: "Why use `defaultdict(list)` instead of a regular `dict` when grouping items?",
      options: [
        "defaultdict(list) is faster for all operations",
        "It automatically initializes missing keys with an empty list, eliminating the need for if-key-not-in-dict checks",
        "defaultdict guarantees items are sorted alphabetically",
        "defaultdict(list) prevents duplicate values from being added",
      ],
      correctIndex: 1,
    },
  ],
};
