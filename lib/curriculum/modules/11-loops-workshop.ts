import type { WorkshopModule } from "../types";

export const loopsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "11",
  slug: "loops-workshop",
  title: "Iterating with enumerate() and zip()",
  icon: "🔢",
  estimatedMinutes: 20,
  description: "Master Python's powerful iteration tools",
  steps: [
    {
      instruction:
        "**enumerate()**: Use `enumerate()` to loop over a list and print each item with its index, like `0: apple`. Without enumerate, you'd need a manual counter. With it, you get both the index and value in one step.",
      hint: `fruits = ["apple", "banana", "cherry", "date"]
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# Start counting from 1 instead of 0
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")`,
      starterCode: `fruits = ["apple", "banana", "cherry", "date"]

# TODO: Use enumerate() to print each fruit with its index
# Expected output:
# 0: apple
# 1: banana
# 2: cherry
# 3: date
`,
      validate: (code: string) => code.includes("enumerate("),
      successMessage:
        "enumerate() is the Pythonic way to get an index while iterating. It returns (index, value) pairs. The start parameter lets you begin counting from any number — useful for 1-based display.",
    },
    {
      instruction:
        "**zip()**: Use `zip()` to iterate two lists simultaneously — pairing names with scores. `zip()` stops at the shortest iterable. Print each pair like `Alice: 95`.",
      hint: `names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 72]

for name, score in zip(names, scores):
    print(f"{name}: {score}")

# zip() with more than 2 iterables
for a, b, c in zip([1,2,3], [4,5,6], [7,8,9]):
    print(a, b, c)`,
      starterCode: `names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 72]

# TODO: Use zip() to pair names with scores and print each
# Expected:
# Alice: 95
# Bob: 87
# Charlie: 72
`,
      validate: (code: string) => code.includes("zip("),
      successMessage:
        "zip() is perfect for parallel iteration. It creates an iterator of tuples. Use list(zip(a, b)) to materialize it. For strict length matching (raise error if unequal length), use zip(a, b, strict=True) in Python 3.10+.",
    },
    {
      instruction:
        "**reversed() and sorted()**: Use `reversed()` to iterate a list backwards, and `sorted()` to iterate in sorted order — both without modifying the original list. Print the fruits in reverse order, then in alphabetical order.",
      hint: `fruits = ["banana", "apple", "date", "cherry"]

print("Reversed:")
for fruit in reversed(fruits):
    print(fruit)

print("\\nSorted:")
for fruit in sorted(fruits):
    print(fruit)

# Sort in reverse
for fruit in sorted(fruits, reverse=True):
    print(fruit)`,
      starterCode: `fruits = ["banana", "apple", "date", "cherry"]

# TODO: Print fruits in reversed order using reversed()
print("Reversed:")


# TODO: Print fruits in sorted order using sorted()
print("Sorted:")
`,
      validate: (code: string) =>
        code.includes("reversed(") && code.includes("sorted("),
      successMessage:
        "reversed() and sorted() return iterators/lists without modifying the original. Compare with list.reverse() and list.sort() which modify in-place. The key parameter of sorted() is very powerful: sorted(words, key=len) sorts by word length.",
    },
    {
      instruction:
        "**enumerate + zip together**: You have two lists of equal length. Use both enumerate AND zip to print a numbered table of name-score pairs. Format: `1. Alice — 95 points`",
      hint: `names = ["Alice", "Bob", "Charlie", "Diana"]
scores = [95, 87, 72, 88]

for i, (name, score) in enumerate(zip(names, scores), start=1):
    print(f"{i}. {name} — {score} points")`,
      starterCode: `names = ["Alice", "Bob", "Charlie", "Diana"]
scores = [95, 87, 72, 88]

# TODO: Use enumerate(zip(...), start=1) to print a numbered table
# Expected:
# 1. Alice — 95 points
# 2. Bob — 87 points
# 3. Charlie — 72 points
# 4. Diana — 88 points
`,
      validate: (code: string) =>
        code.includes("enumerate(") && code.includes("zip("),
      successMessage:
        "Combining enumerate and zip is very common in Python. Notice the tuple unpacking in for i, (name, score) in enumerate(zip(...)). The parentheses are needed because zip yields (name, score) tuples, and we're nesting that inside enumerate's (i, item) tuple.",
    },
    {
      instruction:
        "**itertools.chain and zip_longest**: Sometimes you need to iterate over multiple iterables in sequence, or zip iterables of different lengths. Use `itertools.chain` to chain two lists, and `itertools.zip_longest` to zip lists of different lengths (filling missing values with a default).",
      hint: `import itertools

# chain: iterate multiple iterables in sequence
list1 = [1, 2, 3]
list2 = [4, 5, 6]
for x in itertools.chain(list1, list2):
    print(x, end=" ")
# 1 2 3 4 5 6

# zip_longest: zip with fillvalue for shorter iterables
names = ["Alice", "Bob", "Charlie"]
scores = [95, 87]  # shorter list!
for name, score in itertools.zip_longest(names, scores, fillvalue=0):
    print(f"{name}: {score}")
# Alice: 95
# Bob: 87
# Charlie: 0`,
      starterCode: `import itertools

# TODO: Use itertools.chain to print all items from both lists in sequence
first_half = ["a", "b", "c"]
second_half = ["d", "e", "f"]
# Expected: a b c d e f


# TODO: Use itertools.zip_longest with fillvalue="N/A" to zip these unequal lists
names = ["Alice", "Bob", "Charlie"]
cities = ["New York", "London"]
# Expected:
# Alice — New York
# Bob — London
# Charlie — N/A
`,
      validate: (code: string) =>
        code.includes("itertools.chain") && code.includes("zip_longest"),
      successMessage:
        "itertools is one of Python's most useful standard library modules. chain is great for combining iterables without creating intermediate lists. zip_longest solves the 'unequal length' problem that regular zip handles by truncating.",
    },
  ],
};
