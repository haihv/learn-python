import type { LessonModule } from "../types";

export const generators: LessonModule = {
  type: "lesson",
  id: "44",
  slug: "generators",
  title: "Generators: yield, yield from, send()",
  icon: "🌊",
  estimatedMinutes: 15,
  content: `# Generators: yield, yield from, send()

Generators are one of Python's most elegant features. They let you write iterators with ordinary function syntax, produce values lazily (on demand), and compose powerful data pipelines — all while using dramatically less memory than building full lists.

## Generator Functions and yield

A **generator function** looks like a regular function but uses \`yield\` instead of \`return\`. When called, it doesn't execute immediately — it returns a **generator object** (which is an iterator):

\`\`\`python
def count_up(n):
    """Yields 1, 2, ..., n."""
    i = 1
    while i <= n:
        yield i
        i += 1

gen = count_up(3)
print(type(gen))    # <class 'generator'>
print(next(gen))    # 1
print(next(gen))    # 2
print(next(gen))    # 3
# next(gen)         # StopIteration
\`\`\`

Execution is **suspended** at each \`yield\`. The function's local state (variables, position in the code) is preserved between calls to \`next()\`.

## Generator Objects Are Iterators

Generator objects implement both \`__iter__\` and \`__next__\`, so they work everywhere iterators work:

\`\`\`python
def squares(n):
    for i in range(1, n + 1):
        yield i * i

# Works with for loops
for sq in squares(5):
    print(sq, end=" ")   # 1 4 9 16 25

# Works with list(), sum(), max(), zip(), etc.
print(list(squares(4)))  # [1, 4, 9, 16]
print(sum(squares(100))) # 338350
\`\`\`

## Lazy Evaluation — Values on Demand

The key advantage: a generator only computes the next value when you ask for it. This is called **lazy evaluation**:

\`\`\`python
def read_large_file(path):
    """Process a huge file one line at a time — never loads all at once."""
    with open(path) as f:
        for line in f:
            yield line.strip()

# Only one line in memory at any time
for line in read_large_file("huge.log"):
    if "ERROR" in line:
        print(line)
        break   # Stop after first error — rest of file never read
\`\`\`

## Memory Comparison: list vs generator

For large sequences, generators use O(1) memory while lists use O(n):

\`\`\`python
import sys

# List — all 1 million numbers in memory at once
big_list = [x * x for x in range(1_000_000)]
print(sys.getsizeof(big_list))       # ~8 MB

# Generator — only the current value in memory
big_gen = (x * x for x in range(1_000_000))
print(sys.getsizeof(big_gen))        # ~120 bytes!

# Both sum to the same result
print(sum(big_list) == sum(big_gen)) # True
\`\`\`

## Generator Expressions

Just as list comprehensions have a concise syntax, generators do too — use parentheses instead of brackets:

\`\`\`python
# List comprehension (eager, builds the list now)
squares_list = [x**2 for x in range(10)]

# Generator expression (lazy, computes on demand)
squares_gen = (x**2 for x in range(10))

# Generator expressions can be passed directly to functions
total = sum(x**2 for x in range(10))   # no extra parens needed
print(total)    # 285

# Can filter too
evens = (x for x in range(20) if x % 2 == 0)
print(list(evens))  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\`

## Generator State: Lifecycle

A generator moves through distinct states:

\`\`\`python
import inspect

def simple():
    yield 1
    yield 2

gen = simple()
print(inspect.getgeneratorstate(gen))   # GEN_CREATED

next(gen)   # advance to first yield
print(inspect.getgeneratorstate(gen))   # GEN_SUSPENDED

next(gen)   # advance to second yield
print(inspect.getgeneratorstate(gen))   # GEN_SUSPENDED

try:
    next(gen)   # exhaust the generator
except StopIteration:
    pass
print(inspect.getgeneratorstate(gen))   # GEN_CLOSED
\`\`\`

## yield from — Delegating to Sub-generators

\`yield from iterable\` delegates to another iterable, yielding all its values:

\`\`\`python
def chain(*iterables):
    """Like itertools.chain — concatenate multiple iterables."""
    for it in iterables:
        yield from it

print(list(chain([1, 2], [3, 4], [5])))   # [1, 2, 3, 4, 5]

def flatten(nested):
    """Flatten arbitrarily nested lists."""
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)   # recursive delegation
        else:
            yield item

data = [1, [2, [3, 4]], [5, 6]]
print(list(flatten(data)))   # [1, 2, 3, 4, 5, 6]
\`\`\`

\`yield from\` also properly handles \`send()\` and \`throw()\` calls by forwarding them to the sub-generator.

## send() — Passing Values Into a Generator

Generators are not just one-way pipes. You can send values back in with \`gen.send(value)\`. The \`yield\` expression receives the sent value:

\`\`\`python
def running_average():
    """Receive numbers via send(), yield the running average."""
    total = 0
    count = 0
    while True:
        value = yield (total / count if count > 0 else None)
        total += value
        count += 1

avg = running_average()
next(avg)        # Prime the generator — advance to first yield

print(avg.send(10))   # 10.0
print(avg.send(20))   # 15.0
print(avg.send(30))   # 20.0
\`\`\`

**Important**: You must call \`next(gen)\` (or \`gen.send(None)\`) first to advance to the first \`yield\` before you can \`send()\` a non-None value.

## Practical Uses

**Infinite sequences** without memory cost:
\`\`\`python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 8)))  # [0, 1, 1, 2, 3, 5, 8, 13]
\`\`\`

**Data pipelines** — chain transformations lazily:
\`\`\`python
def read_logs(filename):
    with open(filename) as f:
        yield from f

def filter_errors(lines):
    for line in lines:
        if "ERROR" in line:
            yield line

def parse_errors(lines):
    for line in lines:
        yield {"timestamp": line[:19], "message": line[20:]}

# Compose pipeline — only reads what it needs
pipeline = parse_errors(filter_errors(read_logs("app.log")))
for error in pipeline:
    print(error)
\`\`\`
`,
  quiz: [
    {
      question: "What does a generator function return when called?",
      options: [
        "The first yielded value",
        "A list of all yielded values",
        "A generator object (which is an iterator)",
        "None, and starts executing immediately",
      ],
      correctIndex: 2,
    },
    {
      question: "When is the body of a generator function first executed?",
      options: [
        "When the function is defined",
        "When the function is called (immediately)",
        "When next() is first called on the returned generator object",
        "When the generator is assigned to a variable",
      ],
      correctIndex: 2,
    },
    {
      question: "What is the purpose of `yield from subgenerator`?",
      options: [
        "It imports values from another module",
        "It delegates iteration to the subgenerator, yielding all its values and forwarding send()/throw() calls",
        "It yields the subgenerator object itself",
        "It is equivalent to return subgenerator",
      ],
      correctIndex: 1,
    },
  ],
};
