import type { LessonModule } from "../types";

export const sorting: LessonModule = {
  type: "lesson",
  id: "89",
  slug: "sorting",
  title: "sorted, key=, reverse, bisect, heapq",
  icon: "📊",
  estimatedMinutes: 15,
  content: `# Sorting in Python

Python gives you two complementary sorting tools — \`list.sort()\` which sorts in place, and the built-in \`sorted()\` which returns a brand-new list — plus two powerful stdlib modules, \`bisect\` and \`heapq\`, for maintaining ordered sequences efficiently.

---

## list.sort() vs sorted()

\`list.sort()\` mutates the list and returns \`None\`. \`sorted()\` accepts any iterable and always returns a new \`list\`.

\`\`\`python
numbers = [5, 2, 8, 1, 9, 3]

numbers.sort()          # Mutates in place
print(numbers)          # [1, 2, 3, 5, 8, 9]

original = [5, 2, 8, 1, 9, 3]
ordered = sorted(original)   # New list; original unchanged
print(original)              # [5, 2, 8, 1, 9, 3]
print(ordered)               # [1, 2, 3, 5, 8, 9]

# sorted() works on any iterable, not just lists
print(sorted("python"))      # ['h', 'n', 'o', 'p', 't', 'y']
print(sorted({3, 1, 4, 1}))  # [1, 3, 4]
\`\`\`

**Rule of thumb:** use \`.sort()\` when you own the list and want zero overhead; use \`sorted()\` when you need to preserve the original or are working with arbitrary iterables.

---

## The key= Parameter

Both \`sort()\` and \`sorted()\` accept a \`key\` argument — a callable that extracts the comparison value from each element. Python calls it once per element (not once per comparison), so it's O(n) overhead rather than O(n log n).

\`\`\`python
words = ["banana", "apple", "fig", "cherry", "date"]

# Sort by length
print(sorted(words, key=len))
# ['fig', 'date', 'apple', 'banana', 'cherry']

# Sort case-insensitively
mixed = ["Banana", "apple", "Fig", "cherry"]
print(sorted(mixed, key=str.lower))
# ['apple', 'Banana', 'cherry', 'Fig']

# Sort dicts by a field
people = [
    {"name": "Alice", "age": 30},
    {"name": "Bob",   "age": 25},
    {"name": "Carol", "age": 35},
]
by_age = sorted(people, key=lambda p: p["age"])
print([p["name"] for p in by_age])  # ['Bob', 'Alice', 'Carol']
\`\`\`

---

## operator.attrgetter and operator.itemgetter

The \`operator\` module provides pre-built key functions that are typically faster than equivalent lambdas because they're implemented in C.

\`\`\`python
from operator import attrgetter, itemgetter

# itemgetter — fastest for dicts and tuples
pairs = [(1, "z"), (3, "a"), (2, "m")]
print(sorted(pairs, key=itemgetter(1)))   # sort by second element
# [(3, 'a'), (2, 'm'), (1, 'z')]

# Works with multiple keys — returns a tuple for comparison
records = [("Alice", 30), ("Bob", 25), ("Alice", 25)]
print(sorted(records, key=itemgetter(0, 1)))
# [('Alice', 25), ('Alice', 30), ('Bob', 25)]

# attrgetter — for sorting objects by attribute
from dataclasses import dataclass

@dataclass
class Employee:
    name: str
    dept: str
    salary: int

employees = [
    Employee("Alice", "Eng", 120_000),
    Employee("Bob",   "HR",   80_000),
    Employee("Carol", "Eng",  95_000),
]

print(sorted(employees, key=attrgetter("salary")))
# sorted by salary ascending
\`\`\`

---

## reverse=True

Pass \`reverse=True\` to either \`sort()\` or \`sorted()\` to sort in descending order. This is slightly more efficient than reversing a sorted result because it avoids a second pass.

\`\`\`python
scores = [42, 17, 93, 55, 28]
print(sorted(scores, reverse=True))   # [93, 55, 42, 28, 17]

# Combined with key=
words = ["banana", "apple", "fig", "cherry"]
print(sorted(words, key=len, reverse=True))
# ['banana', 'cherry', 'apple', 'fig']
\`\`\`

---

## Multi-Level Sort (Tuple Keys)

Return a tuple from the key function to sort by multiple criteria. Python compares tuples element-by-element, falling through to the next element when earlier ones are equal.

\`\`\`python
employees = [
    {"name": "Alice", "dept": "Eng", "salary": 120_000},
    {"name": "Bob",   "dept": "HR",   "salary":  80_000},
    {"name": "Carol", "dept": "Eng",  "salary":  95_000},
    {"name": "Dave",  "dept": "HR",   "salary":  85_000},
]

# Sort by dept ascending, then salary descending within dept
# Negate salary to reverse just that level
result = sorted(
    employees,
    key=lambda e: (e["dept"], -e["salary"])
)
for e in result:
    print(f"{e['dept']:4}  {e['name']:6}  \${e['salary']:,}")
# Eng   Alice   $120,000
# Eng   Carol   $95,000
# HR    Dave    $85,000
# HR    Bob     $80,000
\`\`\`

You can only negate numeric keys. For strings, a common trick is a wrapper class that reverses the comparison, but multi-level string sorts usually just use two separate stable sorts (see below).

---

## Stability Guarantee

Python's sort is **stable**: equal elements retain their original relative order. This enables the "sort by lowest priority first, then sort by highest priority" idiom:

\`\`\`python
students = [
    {"name": "Zoe",   "grade": "A", "score": 95},
    {"name": "Alice", "grade": "A", "score": 88},
    {"name": "Bob",   "grade": "B", "score": 72},
    {"name": "Carol", "grade": "A", "score": 88},
]

# Sort by score first (secondary), then by grade (primary)
students.sort(key=lambda s: s["score"])   # step 1: sort by score
students.sort(key=lambda s: s["grade"])   # step 2: stable — ties keep score order

for s in students:
    print(s["name"], s["grade"], s["score"])
# Alice A 88 — Carol A 88 — Zoe A 95 — Bob B 72
\`\`\`

---

## bisect — Maintaining Sorted Order

The \`bisect\` module implements binary search on an already-sorted list. It avoids the need to re-sort after every insertion, giving O(log n) search and O(n) insertion.

\`\`\`python
import bisect

scores = [10, 20, 30, 40, 50]

# bisect_left: index where value could be inserted to keep order
# (leftmost position if duplicates exist)
print(bisect.bisect_left(scores, 30))   # 2  — before the existing 30

# bisect_right (alias: bisect): index after any existing equal values
print(bisect.bisect_right(scores, 30))  # 3  — after the existing 30

# insort — insert in correct position in O(n) due to list shift,
# but O(log n) for finding the position
bisect.insort(scores, 25)
print(scores)   # [10, 20, 25, 30, 40, 50]

bisect.insort(scores, 25)   # duplicates are fine
print(scores)   # [10, 20, 25, 25, 30, 40, 50]
\`\`\`

**When to use bisect:** maintaining a leaderboard, keeping a sorted event timeline, or any scenario where you insert into a sorted sequence far less often than you search it.

---

## heapq — Priority Queue (Min-Heap)

\`heapq\` implements a **min-heap** over a plain Python list. The smallest element is always at index 0. All operations are O(log n) except \`heapify\` which is O(n).

\`\`\`python
import heapq

heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)
heapq.heappush(heap, 2)

print(heap[0])               # 1 — smallest element always at index 0
print(heapq.heappop(heap))   # 1 — removes and returns the smallest
print(heapq.heappop(heap))   # 2
print(heap)                  # [3, 5]

# heapify: convert an existing list in O(n) — faster than n heappushes
data = [9, 4, 7, 2, 6, 1]
heapq.heapify(data)
print(data[0])   # 1
\`\`\`

### nlargest and nsmallest

\`\`\`python
import heapq

data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
print(heapq.nlargest(3, data))    # [9, 6, 5]
print(heapq.nsmallest(3, data))   # [1, 1, 2]

# With key=
records = [("Alice", 30), ("Bob", 25), ("Carol", 35)]
print(heapq.nlargest(2, records, key=lambda r: r[1]))
# [('Carol', 35), ('Alice', 30)]
\`\`\`

> For very small \`n\` (top-3 out of millions), \`nlargest/nsmallest\` uses a heap and is faster than sorting. For large \`n\`, \`sorted()\` wins.

### heapq with Tuples for Priority

Because heapq compares elements directly, tuples provide a natural way to attach priority to items. The first element is the sort key:

\`\`\`python
import heapq

task_queue = []
heapq.heappush(task_queue, (3, "low priority task"))
heapq.heappush(task_queue, (1, "urgent fix"))
heapq.heappush(task_queue, (2, "normal work"))
heapq.heappush(task_queue, (1, "another urgent"))

while task_queue:
    priority, task = heapq.heappop(task_queue)
    print(f"[{priority}] {task}")
# [1] another urgent
# [1] urgent fix
# [2] normal work
# [3] low priority task
\`\`\`

---

## When to Use Each

| Tool | Use case |
|------|----------|
| \`list.sort()\` | Sort a list you own; no copy needed |
| \`sorted()\` | Sort any iterable; preserve original |
| \`bisect.insort\` | Maintain a sorted list with frequent insertions |
| \`bisect_left/right\` | Binary search in O(log n) |
| \`heapq\` | Priority queue; repeatedly get the minimum |
| \`nlargest/nsmallest\` | Get top-k elements without full sort |
`,
  quiz: [
    {
      question:
        "What does `list.sort()` return?",
      options: [
        "A new sorted list",
        "None (it mutates the list in place)",
        "The sorted list and the original list as a tuple",
        "A sorted iterator",
      ],
      correctIndex: 1,
    },
    {
      question:
        "You have a list of 10 million numbers and need the 5 largest. Which is most efficient?",
      options: [
        "sorted(data, reverse=True)[:5]",
        "data.sort(reverse=True); data[:5]",
        "heapq.nlargest(5, data)",
        "bisect.insort for each element then slice",
      ],
      correctIndex: 2,
    },
    {
      question:
        "Which statement about Python's sort stability is correct?",
      options: [
        "Python's sort is unstable — equal elements may change relative order",
        "Python's sort is stable — equal elements keep their original relative order",
        "Python's sort is stable only when using key=",
        "Stability depends on the size of the list",
      ],
      correctIndex: 1,
    },
  ],
};
