import type { LessonModule } from "../types";

export const sets: LessonModule = {
  type: "lesson",
  id: "19",
  slug: "sets",
  title: "Sets: Operations, Membership, Frozenset",
  icon: "🔵",
  estimatedMinutes: 12,
  content: `# Sets: Operations, Membership, Frozenset

A **set** is an unordered collection of **unique, hashable** items. Sets excel at two things: eliminating duplicates and fast membership testing. Under the hood Python implements sets as hash tables, giving O(1) average-time for add, remove, and membership checks regardless of how large the set grows.

## Creating Sets

\`\`\`python
# Literal syntax — use curly braces with values (NOT an empty dict!)
primes = {2, 3, 5, 7, 11}

# From any iterable — duplicates are silently dropped
unique = set([1, 2, 2, 3, 3, 3])
print(unique)  # {1, 2, 3}

# From a string — unique characters
chars = set("mississippi")
print(chars)   # {'m', 'i', 's', 'p'}  (order may vary)

# Empty set — MUST use set(), not {} (that creates an empty dict)
empty = set()
print(type(empty))  # <class 'set'>

# Elements must be hashable — lists and dicts are rejected
# bad = {[1, 2], [3, 4]}  # TypeError: unhashable type: 'list'
\`\`\`

## Adding and Removing Elements

\`\`\`python
colors = {"red", "green", "blue"}

# add() — add a single element; no effect if already present
colors.add("yellow")
colors.add("red")     # duplicate — set unchanged
print(colors)         # {'red', 'green', 'blue', 'yellow'}

# remove(elem) — raises KeyError if elem not found
colors.remove("green")

# discard(elem) — like remove() but SAFE: no error if elem missing
colors.discard("green")   # Already gone — no exception raised
colors.discard("purple")  # Not in set — also fine

# pop() — removes and returns an ARBITRARY element (sets are unordered)
item = colors.pop()

# clear() — remove all elements
colors.clear()
\`\`\`

The key difference: **\`remove()\` raises \`KeyError\`** on a missing element; **\`discard()\` silently does nothing**. Prefer \`discard()\` when you're not sure whether the element exists.

## Set Operations

Sets support all classical mathematical set operations with both method syntax and operators:

\`\`\`python
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

# Union — all elements from either set
print(a | b)               # {1, 2, 3, 4, 5, 6, 7, 8}
print(a.union(b))          # same

# Intersection — only elements in both
print(a & b)               # {4, 5}
print(a.intersection(b))   # same

# Difference — in a but NOT in b
print(a - b)               # {1, 2, 3}
print(a.difference(b))     # same

# Symmetric difference — in either but NOT in both
print(a ^ b)                         # {1, 2, 3, 6, 7, 8}
print(a.symmetric_difference(b))     # same
\`\`\`

### Update Variants (in-place)

\`\`\`python
a = {1, 2, 3}
b = {3, 4, 5}

a |= b          # union in-place
a &= b          # intersection in-place
a -= b          # difference in-place
a ^= b          # symmetric difference in-place

# Method equivalents
a.update(b)                         # same as |=
a.intersection_update(b)            # same as &=
a.difference_update(b)              # same as -=
a.symmetric_difference_update(b)    # same as ^=
\`\`\`

## Subset and Superset Tests

\`\`\`python
evens = {2, 4, 6, 8, 10}
small_evens = {2, 4}
odds = {1, 3, 5}

# issubset — are all elements of small_evens in evens?
print(small_evens.issubset(evens))      # True
print(small_evens <= evens)             # True (operator form)
print(small_evens < evens)              # True (PROPER subset — not equal)

# issuperset — does evens contain all elements of small_evens?
print(evens.issuperset(small_evens))    # True
print(evens >= small_evens)             # True
print(evens > small_evens)              # True (proper superset)

# isdisjoint — do they share NO elements?
print(evens.isdisjoint(odds))           # True (no overlap)
print(evens.isdisjoint(small_evens))    # False (they share 2 and 4)
\`\`\`

## Frozenset — Immutable Sets

A **frozenset** is an immutable version of a set. Once created it cannot be modified — no \`add()\`, \`remove()\`, or update operations. Because it is immutable and hashable, a frozenset **can be used as a dictionary key or stored inside another set**.

\`\`\`python
fs = frozenset([1, 2, 3, 4])
print(fs)   # frozenset({1, 2, 3, 4})

# All read operations work normally
print(2 in fs)       # True
print(fs & {2, 3})   # frozenset({2, 3})

# Modification raises AttributeError
# fs.add(5)      # AttributeError: 'frozenset' object has no attribute 'add'

# Use as a dict key (regular sets cannot be used this way)
graph_edges = {
    frozenset({"A", "B"}): 5,
    frozenset({"B", "C"}): 3,
}
print(graph_edges[frozenset({"A", "B"})])  # 5

# Frozensets inside a set
nested = {frozenset({1, 2}), frozenset({3, 4})}
\`\`\`

## Membership Testing: O(1) vs O(n)

This is sets' killer feature. Python looks up items in a set via hash, so membership testing does **not** slow down as the collection grows.

\`\`\`python
import time

big_list = list(range(10_000_000))
big_set  = set(big_list)

target = 9_999_999

# List: must scan up to 10 million elements — O(n)
start = time.perf_counter()
_ = target in big_list
print(f"List lookup: {time.perf_counter() - start:.4f}s")   # ~0.1s

# Set: hash lookup — O(1)
start = time.perf_counter()
_ = target in big_set
print(f"Set lookup: {time.perf_counter() - start:.6f}s")    # ~0.000001s
\`\`\`

## When to Use Sets

| Situation | Use |
|---|---|
| Remove duplicates from a list | \`list(set(lst))\` |
| Fast membership test (thousands+ items) | \`set\` |
| Find common/unique items between sequences | Set operations |
| Need an immutable, hashable set | \`frozenset\` |
| Need ordered unique items | Keep a list + a set for dedup |

\`\`\`python
# Common pattern: deduplicate while preserving order
seen = set()
unique_ordered = []
for item in [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]:
    if item not in seen:
        seen.add(item)
        unique_ordered.append(item)
print(unique_ordered)  # [3, 1, 4, 5, 9, 2, 6]
\`\`\`
`,
  quiz: [
    {
      question:
        "What is the difference between set.remove(x) and set.discard(x)?",
      options: [
        "remove() adds x if missing; discard() does nothing",
        "Both raise KeyError when x is not in the set",
        "remove() raises KeyError when x is missing; discard() does nothing silently",
        "discard() raises KeyError when x is missing; remove() does nothing",
      ],
      correctIndex: 2,
    },
    {
      question:
        "Why can a frozenset be used as a dictionary key, but a regular set cannot?",
      options: [
        "frozenset is ordered, which dicts require",
        "frozenset is immutable and therefore hashable; mutable sets are not hashable",
        "frozenset is a subclass of dict; regular set is not",
        "Only frozensets support the in operator needed for key lookup",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Which set operation returns elements that are in either set but NOT in both?",
      options: ["Union (|)", "Intersection (&)", "Difference (-)", "Symmetric difference (^)"],
      correctIndex: 3,
    },
  ],
};
