import type { LessonModule } from "../types";

export const lambdaBuiltins: LessonModule = {
  type: "lesson",
  id: "28",
  slug: "lambda-builtins",
  title: "lambda, map(), filter(), sorted() key=",
  icon: "λ",
  estimatedMinutes: 15,
  content: `# Lambda Functions & Built-in Higher-Order Functions

Python provides powerful tools for functional-style programming without needing to import anything extra. Lambda functions, combined with built-ins like \`map()\`, \`filter()\`, \`sorted()\`, and \`zip()\`, let you write concise, expressive data transformations.

## Lambda Functions

A **lambda** is an anonymous function — a function defined without a name. It's useful when you need a short function for a single use and don't want to define a full \`def\` block.

### Syntax

\`\`\`python
lambda parameters: expression
\`\`\`

The body is a **single expression** that is automatically returned. No \`return\` keyword, no multiple statements.

\`\`\`python
# Regular function
def double(x):
    return x * 2

# Equivalent lambda
double = lambda x: x * 2

print(double(5))   # 10

# Multi-parameter lambda
add = lambda x, y: x + y
print(add(3, 4))   # 7

# Lambda with conditional expression
clamp = lambda x, lo, hi: lo if x < lo else (hi if x > hi else x)
print(clamp(15, 0, 10))  # 10
print(clamp(-5, 0, 10))  # 0
print(clamp(5, 0, 10))   # 5
\`\`\`

Lambdas are most powerful when passed directly to another function rather than assigned to a variable. When you assign a lambda to a name, a regular \`def\` is usually cleaner.

## map() — Transform Every Element

\`map(function, iterable)\` applies a function to every element of an iterable and returns a **lazy iterator**.

\`\`\`python
numbers = [1, 2, 3, 4, 5]

# Double every number
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)  # [2, 4, 6, 8, 10]

# Convert strings to integers
strings = ["10", "20", "30"]
ints = list(map(int, strings))
print(ints)  # [10, 20, 30]

# map() with multiple iterables — stops at the shortest
a = [1, 2, 3]
b = [10, 20, 30]
sums = list(map(lambda x, y: x + y, a, b))
print(sums)  # [11, 22, 33]

# Equivalent list comprehension (often preferred for readability)
doubled_comp = [x * 2 for x in numbers]
\`\`\`

\`map()\` is lazy — it only computes values when you iterate over them, which saves memory for large datasets. Wrap in \`list()\` only when you need all values at once.

## filter() — Keep Only Matching Elements

\`filter(function, iterable)\` keeps only elements for which the function returns \`True\`.

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Keep only even numbers
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4, 6, 8, 10]

# Keep strings longer than 3 characters
words = ["hi", "hello", "hey", "howdy", "ok"]
long_words = list(filter(lambda w: len(w) > 3, words))
print(long_words)  # ['hello', 'howdy']

# filter(None, iterable) removes falsy values
mixed = [0, 1, "", "hello", None, [], [1, 2], False, True]
truthy = list(filter(None, mixed))
print(truthy)  # [1, 'hello', [1, 2], True]
\`\`\`

## sorted() with key=

\`sorted(iterable, key=None, reverse=False)\` returns a new sorted list. The \`key\` parameter is a function applied to each element to determine its sort order.

\`\`\`python
# Sort strings by length
words = ["banana", "apple", "kiwi", "cherry", "fig"]
by_length = sorted(words, key=lambda w: len(w))
print(by_length)  # ['fig', 'kiwi', 'apple', 'banana', 'cherry']

# Sort in reverse
by_length_desc = sorted(words, key=lambda w: len(w), reverse=True)
print(by_length_desc)  # ['banana', 'cherry', 'apple', 'kiwi', 'fig']

# Sort list of dicts
people = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
    {"name": "Charlie", "age": 35},
]
by_age = sorted(people, key=lambda p: p["age"])
print([p["name"] for p in by_age])  # ['Bob', 'Alice', 'Charlie']

# Sort by multiple criteria: first by length, then alphabetically
words = ["dog", "cat", "fish", "ant", "bee"]
multi_sort = sorted(words, key=lambda w: (len(w), w))
print(multi_sort)  # ['ant', 'bee', 'cat', 'dog', 'fish']

# .sort() sorts in-place (mutates the list)
nums = [3, 1, 4, 1, 5]
nums.sort(reverse=True)
print(nums)  # [5, 4, 3, 1, 1]
\`\`\`

## reversed() — Reverse Any Sequence

\`reversed()\` returns a lazy iterator over the sequence in reverse order.

\`\`\`python
nums = [1, 2, 3, 4, 5]
print(list(reversed(nums)))  # [5, 4, 3, 2, 1]

# Works on any sequence, not just lists
for ch in reversed("hello"):
    print(ch, end="")  # olleh
print()

# For a reversed sorted list:
words = ["banana", "apple", "cherry"]
print(list(reversed(sorted(words))))  # ['cherry', 'banana', 'apple']
# Cleaner: sorted(..., reverse=True)
\`\`\`

## zip() — Pair Elements Together

\`zip(*iterables)\` pairs up elements from multiple iterables into tuples. Stops at the shortest.

\`\`\`python
names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 92]

for name, score in zip(names, scores):
    print(f"{name}: {score}")
# Alice: 95
# Bob: 87
# Charlie: 92

# Create a dict from two lists
grade_dict = dict(zip(names, scores))
print(grade_dict)  # {'Alice': 95, 'Bob': 87, 'Charlie': 92}

# zip() with unequal lengths stops at shortest
a = [1, 2, 3, 4, 5]
b = ["a", "b", "c"]
print(list(zip(a, b)))  # [(1, 'a'), (2, 'b'), (3, 'c')]

# Use itertools.zip_longest to fill missing values
from itertools import zip_longest
print(list(zip_longest(a, b, fillvalue="-")))
# [(1, 'a'), (2, 'b'), (3, 'c'), (4, '-'), (5, '-')]

# Unzip using zip(*pairs)
pairs = [(1, "a"), (2, "b"), (3, "c")]
numbers, letters = zip(*pairs)
print(numbers)  # (1, 2, 3)
print(letters)  # ('a', 'b', 'c')
\`\`\`

## enumerate() — Index + Value Together

\`enumerate(iterable, start=0)\` yields \`(index, value)\` pairs.

\`\`\`python
fruits = ["apple", "banana", "cherry"]

for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
# 0: apple
# 1: banana
# 2: cherry

# Start counting from 1
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")
# 1. apple
# 2. banana
# 3. cherry
\`\`\`

## any() and all()

\`any(iterable)\` returns \`True\` if **at least one** element is truthy. \`all(iterable)\` returns \`True\` if **every** element is truthy.

\`\`\`python
nums = [1, 2, 3, 4, 5]

print(any(x > 4 for x in nums))   # True  (5 > 4)
print(all(x > 0 for x in nums))   # True  (all positive)
print(all(x > 3 for x in nums))   # False (1, 2, 3 are not > 3)

# Short-circuits: stops at first True (any) or first False (all)
# Useful for validation
passwords = ["abc123", "password", "Str0ng!"]
has_number = any(c.isdigit() for p in passwords for c in p)
print(has_number)  # True
\`\`\`

## sum(), min(), max() with key=

These built-ins also accept a \`key=\` argument:

\`\`\`python
words = ["hi", "hello", "hey"]

print(min(words, key=len))   # "hi"   (shortest)
print(max(words, key=len))   # "hello" (longest)

# sum() doesn't take key, but works on any numeric iterable
print(sum([1, 2, 3, 4, 5]))  # 15
print(sum(range(1, 101)))    # 5050

# min/max on dicts
people = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
youngest = min(people, key=lambda p: p["age"])
print(youngest["name"])  # Bob
\`\`\`

## Combining These Tools

The real power comes from chaining these functions together:

\`\`\`python
data = [
    {"name": "Alice", "score": 92},
    {"name": "Bob", "score": 45},
    {"name": "Charlie", "score": 78},
    {"name": "Diana", "score": 88},
]

# Get names of students who passed (score >= 60), sorted by score descending
passing = sorted(
    filter(lambda s: s["score"] >= 60, data),
    key=lambda s: s["score"],
    reverse=True,
)
names = list(map(lambda s: s["name"], passing))
print(names)  # ['Alice', 'Diana', 'Charlie']

# Or using a generator expression (often more readable):
names2 = [
    s["name"]
    for s in sorted(data, key=lambda s: s["score"], reverse=True)
    if s["score"] >= 60
]
print(names2)  # ['Alice', 'Diana', 'Charlie']
\`\`\`

When to use \`map()\`/\`filter()\` vs list comprehensions: both are valid. Comprehensions are often more readable for simple cases. \`map()\`/\`filter()\` are more functional-style and can be composed more easily in pipelines.
`,
  quiz: [
    {
      question: "What does `list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5]))` return?",
      options: [
        "[1, 3, 5]",
        "[2, 4]",
        "[True, False, True, False, True]",
        "[0, 2, 4]",
      ],
      correctIndex: 1,
    },
    {
      question: "Which built-in function pairs elements from multiple iterables into tuples?",
      options: ["map()", "enumerate()", "zip()", "filter()"],
      correctIndex: 2,
    },
    {
      question: "What does `sorted(['banana', 'apple', 'kiwi'], key=len)` return?",
      options: [
        "['apple', 'banana', 'kiwi']",
        "['kiwi', 'apple', 'banana']",
        "['banana', 'apple', 'kiwi']",
        "['apple', 'kiwi', 'banana']",
      ],
      correctIndex: 1,
    },
  ],
};
