import type { LessonModule } from "../types";

export const iterators: LessonModule = {
  type: "lesson",
  id: "43",
  slug: "iterators",
  title: "Iterators: __iter__, __next__, iter(), next()",
  icon: "⏭️",
  estimatedMinutes: 15,
  content: `# Iterators: __iter__, __next__, iter(), next()

Every time you write \`for x in something:\`, Python is using the **iterator protocol** under the hood. Understanding it lets you create objects that work seamlessly with \`for\` loops, comprehensions, \`zip()\`, \`map()\`, and every other iteration context in Python.

## Iterable vs Iterator

These two terms are related but distinct:

- An **iterable** is any object you can loop over. It has \`__iter__()\` that returns an iterator.
- An **iterator** is the object that produces values one at a time. It has both \`__iter__()\` (returns \`self\`) and \`__next__()\` (returns the next value, or raises \`StopIteration\` when exhausted).

\`\`\`python
# A list is iterable but NOT an iterator
my_list = [1, 2, 3]
print(hasattr(my_list, '__iter__'))   # True
print(hasattr(my_list, '__next__'))   # False

# iter() creates an iterator from an iterable
it = iter(my_list)
print(hasattr(it, '__iter__'))        # True
print(hasattr(it, '__next__'))        # True
\`\`\`

## iter() and next() Built-ins

\`iter(obj)\` calls \`obj.__iter__()\` and returns the iterator. \`next(it)\` calls \`it.__next__()\`.

\`\`\`python
numbers = [10, 20, 30]
it = iter(numbers)

print(next(it))   # 10
print(next(it))   # 20
print(next(it))   # 30
# next(it)        # raises StopIteration

# next() accepts a default to avoid StopIteration
print(next(it, "done"))   # "done" (no exception)
\`\`\`

## How for Loops Use the Protocol

The \`for\` loop is syntactic sugar for the iterator protocol:

\`\`\`python
# This for loop:
for x in [1, 2, 3]:
    print(x)

# Is equivalent to:
_iter = iter([1, 2, 3])
while True:
    try:
        x = next(_iter)
    except StopIteration:
        break
    print(x)
\`\`\`

Python calls \`iter()\` on the object once, then calls \`next()\` repeatedly until \`StopIteration\` is raised. The exception is caught automatically — you never see it.

## Building a Custom Iterator

To make an iterator, implement both \`__iter__\` and \`__next__\`:

\`\`\`python
class Countdown:
    """Counts down from start to 1."""

    def __init__(self, start):
        self.start = start
        self.current = start

    def __iter__(self):
        # An iterator's __iter__ always returns itself
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value


# Works with for loop
for n in Countdown(5):
    print(n, end=" ")
# Output: 5 4 3 2 1

# Works with list(), sum(), max(), etc.
print(list(Countdown(3)))    # [3, 2, 1]
print(sum(Countdown(4)))     # 10  (4+3+2+1)
\`\`\`

## Iterables That Create Fresh Iterators

Notice that \`Countdown\` is *both* an iterable and an iterator — calling \`iter()\` on it returns itself. This means you can only iterate it once. Lists are different: each call to \`iter(list)\` creates a fresh, independent iterator:

\`\`\`python
lst = [1, 2, 3]
it1 = iter(lst)
it2 = iter(lst)   # independent iterator
next(it1)         # 1
next(it1)         # 2
next(it2)         # 1 (not affected by it1)

# Countdown exhausts itself
cd = Countdown(3)
print(list(cd))   # [3, 2, 1]
print(list(cd))   # [] — already exhausted!
\`\`\`

To make a reusable iterable that creates fresh iterators, separate the iterable class from the iterator class:

\`\`\`python
class CountdownIterable:
    """Reusable iterable — can loop over multiple times."""
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        # Create and return a fresh iterator each time
        return Countdown(self.start)

cd = CountdownIterable(3)
print(list(cd))   # [3, 2, 1]
print(list(cd))   # [3, 2, 1] — works again!
\`\`\`

## Infinite Iterators

An iterator doesn't have to end — it can yield values forever. Useful for sequences like natural numbers or repeating patterns:

\`\`\`python
class NaturalNumbers:
    """Yields 1, 2, 3, 4, ... forever."""
    def __init__(self):
        self.n = 0

    def __iter__(self):
        return self

    def __next__(self):
        self.n += 1
        return self.n

# Never use list() on an infinite iterator!
nats = NaturalNumbers()
print(next(nats))  # 1
print(next(nats))  # 2
print(next(nats))  # 3
\`\`\`

## itertools.islice to Limit Infinite Iterators

\`itertools.islice(it, n)\` lets you take just the first \`n\` items from any iterator — essential for working with infinite ones:

\`\`\`python
from itertools import islice

nats = NaturalNumbers()
first_10 = list(islice(nats, 10))
print(first_10)   # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Also works with step: islice(it, start, stop, step)
from itertools import islice, count
evens = islice(count(0, 2), 5)   # count() from itertools: infinite counter
print(list(evens))   # [0, 2, 4, 6, 8]
\`\`\`

## Practical Example: File Iterator

A classic real-world iterator is reading a large file line by line — you don't load the entire file into memory:

\`\`\`python
# File objects are both iterable and iterators
with open("data.txt") as f:
    for line in f:          # calls iter(f) then next(f) repeatedly
        process(line)

# Equivalent to:
with open("data.txt") as f:
    it = iter(f)
    while True:
        try:
            line = next(it)
        except StopIteration:
            break
        process(line)
\`\`\`

## Quick Reference

| Concept | Method/Function | Purpose |
|---------|----------------|---------|
| Make iterable | \`__iter__(self)\` | Return an iterator |
| Make iterator | \`__next__(self)\` | Return next value or raise \`StopIteration\` |
| Get iterator | \`iter(obj)\` | Call \`obj.__iter__()\` |
| Get next value | \`next(it)\` | Call \`it.__next__()\` |
| Limit iterator | \`itertools.islice(it, n)\` | Take first n items |
| Check exhausted | \`next(it, default)\` | Return default instead of raising |
`,
  quiz: [
    {
      question: "What is the difference between an iterable and an iterator?",
      options: [
        "They are the same thing — all iterables are also iterators",
        "An iterable has __iter__ that returns an iterator; an iterator also has __next__ and raises StopIteration when done",
        "An iterator can only be used once; an iterable can be used unlimited times",
        "Iterables are built-in types; iterators are always custom classes",
      ],
      correctIndex: 1,
    },
    {
      question: "What does an iterator's `__iter__` method return?",
      options: [
        "A new fresh iterator",
        "The first element of the sequence",
        "self — the iterator itself",
        "None",
      ],
      correctIndex: 2,
    },
    {
      question: "What happens when you call `next()` on an exhausted iterator?",
      options: [
        "It returns None",
        "It raises StopIteration",
        "It starts over from the beginning",
        "It raises IndexError",
      ],
      correctIndex: 1,
    },
  ],
};
