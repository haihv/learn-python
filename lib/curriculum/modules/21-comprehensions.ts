import type { LessonModule } from "../types";

export const comprehensions: LessonModule = {
  type: "lesson",
  id: "21",
  slug: "comprehensions",
  title: "List, Dict & Set Comprehensions",
  icon: "⚡",
  estimatedMinutes: 15,
  content: `# List, Dict & Set Comprehensions

Comprehensions are Python's concise syntax for building new collections from existing iterables. They are faster than equivalent \`for\` loops (the iteration is done in C under the hood) and, when kept simple, dramatically improve readability.

## List Comprehension

\`\`\`python
# Syntax: [expression for variable in iterable]
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With a filter condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Transform strings
words = ["hello", "world", "python"]
upper = [w.upper() for w in words]
# ['HELLO', 'WORLD', 'PYTHON']

# From another comprehension result
first_chars = [w[0] for w in words if len(w) > 4]
# ['h', 'w', 'p']
\`\`\`

Equivalent \`for\` loop for comparison:

\`\`\`python
# These are identical in result:
result = []
for x in range(10):
    if x % 2 == 0:
        result.append(x**2)

result = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

## Dict Comprehension

\`\`\`python
# Syntax: {key_expr: val_expr for variable in iterable}
squares_map = {x: x**2 for x in range(6)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Filter entries
words = ["cat", "elephant", "dog", "hippopotamus"]
long_words = {w: len(w) for w in words if len(w) > 4}
# {'elephant': 8, 'hippopotamus': 12}

# Invert a dict (swap keys and values)
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}

# Normalise keys to lowercase
raw = {"Name": "Alice", "AGE": 30}
normalised = {k.lower(): v for k, v in raw.items()}
# {'name': 'Alice', 'age': 30}
\`\`\`

## Set Comprehension

\`\`\`python
# Syntax: {expression for variable in iterable}
unique_lengths = {len(w) for w in ["cat", "dog", "elephant", "ox", "cat"]}
# {2, 3, 8}  — no duplicate 3 from "cat" appearing twice

# Extract unique first characters
sentence = "the quick brown fox"
initials = {w[0] for w in sentence.split()}
# {'t', 'q', 'b', 'f'}
\`\`\`

## Nested Comprehensions

You can nest comprehensions to work with 2D structures. Keep readability in mind — more than two levels is usually a sign to use a regular loop.

\`\`\`python
# Flatten a 2D matrix
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [elem for row in matrix for elem in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
# Reading order: "for each row in matrix, for each elem in row"

# Build a multiplication table as a dict of tuples
mult_table = {(i, j): i * j for i in range(1, 4) for j in range(1, 4)}
# {(1,1):1, (1,2):2, ..., (3,3):9}

# Transpose a matrix (rows become columns)
matrix = [[1, 2, 3], [4, 5, 6]]
transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1, 4], [2, 5], [3, 6]]
\`\`\`

## Filtering with if

The \`if\` clause comes at the **end** of the comprehension and acts as a filter — only items passing the condition are included:

\`\`\`python
numbers = range(-5, 6)

positives = [n for n in numbers if n > 0]           # [1, 2, 3, 4, 5]
even_pos  = [n for n in numbers if n > 0 if n % 2 == 0]  # [2, 4]

# You can also use a ternary expression in the output expression
# (this is NOT filtering — every element is included, just transformed)
signs = ["pos" if n > 0 else "neg" if n < 0 else "zero" for n in numbers]
\`\`\`

## Walrus Operator (:=) in Comprehensions

Python 3.8+ allows capturing a sub-expression with \`:=\` (walrus operator) to avoid computing it twice:

\`\`\`python
# Without walrus — process_item() called twice
results = [process_item(x) for x in data if process_item(x) is not None]

# With walrus — process_item() called once per element
results = [y for x in data if (y := process_item(x)) is not None]
\`\`\`

The walrus operator is especially useful when the filtering predicate and the value you want to keep are the same computation.

## Performance: Comprehensions vs map/filter

Comprehensions are generally the preferred Pythonic style, but map/filter with simple callables can be marginally faster for very large datasets:

\`\`\`python
import timeit

data = list(range(1_000_000))

# List comprehension
t1 = timeit.timeit(lambda: [x * 2 for x in data], number=10)

# map with lambda (still creates a list via list())
t2 = timeit.timeit(lambda: list(map(lambda x: x * 2, data)), number=10)

# map with a named function (fastest — no lambda overhead)
def double(x): return x * 2
t3 = timeit.timeit(lambda: list(map(double, data)), number=10)

print(f"Comprehension: {t1:.3f}s")
print(f"map+lambda:    {t2:.3f}s")
print(f"map+function:  {t3:.3f}s")
\`\`\`

In practice the difference is small. **Prefer comprehensions** for readability unless profiling shows a bottleneck.

## Readability Guidelines

**Do use comprehensions when:**
- The logic is a simple transformation or filter
- The result fits on one line (≤ 79 characters)
- There are at most two \`for\` clauses

**Avoid comprehensions when:**
- The loop body has side effects (printing, writing to a file, modifying external state)
- The logic is complex enough that a \`for\` loop with comments would be clearer
- You need the overhead of exception handling inside the loop

\`\`\`python
# BAD: side effects inside comprehension — confusing and easy to break
[print(x) for x in range(10)]   # Works but is an antipattern

# GOOD: use a regular for loop for side effects
for x in range(10):
    print(x)
\`\`\`
`,
  quiz: [
    {
      question:
        "What does [x for x in range(10) if x % 2 == 0] produce?",
      options: [
        "[0, 2, 4, 6, 8]",
        "[1, 3, 5, 7, 9]",
        "[0, 1, 2, 3, 4]",
        "[2, 4, 6, 8, 10]",
      ],
      correctIndex: 0,
    },
    {
      question:
        "What is the correct syntax for a dict comprehension that maps each number to its cube for numbers 1-5?",
      options: [
        "[n: n**3 for n in range(1, 6)]",
        "{n: n**3 for n in range(1, 6)}",
        "{n**3 for n in range(1, 6)}",
        "dict([n, n**3 for n in range(1, 6)])",
      ],
      correctIndex: 1,
    },
    {
      question:
        "In a nested list comprehension [elem for row in matrix for elem in row], which loop runs first (outermost)?",
      options: [
        "'for elem in row' — inner loop runs first",
        "'for row in matrix' — left-to-right, outer loop first",
        "Both run simultaneously",
        "The order depends on the size of the matrix",
      ],
      correctIndex: 1,
    },
  ],
};
