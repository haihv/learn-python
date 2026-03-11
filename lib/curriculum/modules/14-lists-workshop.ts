import type { WorkshopModule } from "../types";

export const listsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "14",
  slug: "lists-workshop",
  title: "List Manipulation & Sorting",
  icon: "🔧",
  estimatedMinutes: 20,
  description: "Practice advanced list operations",
  steps: [
    {
      instruction:
        "**Building lists dynamically**: Start with an empty list and use a loop with `.append()` to populate it with the squares of numbers 1 through 10. Then print the list and the total using `sum()`.",
      hint: `squares = []
for i in range(1, 11):
    squares.append(i ** 2)
print(squares)
print(f"Sum of squares: {sum(squares)}")`,
      starterCode: `# Build a list of squares using a loop and append()
squares = []
# TODO: Use a loop with range(1, 11) and append i**2

print(squares)
print(f"Sum of squares: {sum(squares)}")
`,
      validate: (code: string) =>
        code.includes(".append(") && code.includes("range("),
      successMessage:
        "This pattern — start with empty list, loop and append — is fundamental. In practice, you'd often use a list comprehension: squares = [i**2 for i in range(1, 11)]. Both are valid; comprehensions are more Pythonic for simple cases.",
    },
    {
      instruction:
        "**Sorting with a custom key**: You have a list of tuples representing students with (name, grade, age). Sort them first by grade (descending), then alphabetically by name for ties. Use the `key` parameter of `sorted()`.",
      hint: `students = [
    ("Charlie", 88, 20),
    ("Alice", 92, 19),
    ("Bob", 88, 21),
    ("Diana", 95, 18),
]

# Sort by grade descending, then name ascending
sorted_students = sorted(students, key=lambda s: (-s[1], s[0]))
for name, grade, age in sorted_students:
    print(f"{name}: {grade}")`,
      starterCode: `students = [
    ("Charlie", 88, 20),
    ("Alice", 92, 19),
    ("Bob", 88, 21),
    ("Diana", 95, 18),
]

# TODO: Sort by grade descending, then by name ascending for ties
# Hint: use key=lambda s: (-s[1], s[0])
sorted_students = students

for name, grade, age in sorted_students:
    print(f"{name}: {grade}")
`,
      validate: (code: string) =>
        code.includes("sorted(") && code.includes("lambda"),
      successMessage:
        "The trick of using negative values in the sort key (-s[1]) flips the sort order for that field without needing reverse=True. This is essential when you need mixed ascending/descending on multiple keys.",
    },
    {
      instruction:
        "**List slicing tricks**: Given a list of 10 numbers, use slicing to: (1) get the first 3 items, (2) get the last 3 items, (3) get every other item, (4) reverse the list — all without modifying the original.",
      hint: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

print(numbers[:3])     # First 3
print(numbers[-3:])    # Last 3
print(numbers[::2])    # Every other
print(numbers[::-1])   # Reversed`,
      starterCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# TODO: Print first 3 items using slicing
print("First 3:", )

# TODO: Print last 3 items using slicing
print("Last 3:", )

# TODO: Print every other item (0, 2, 4...) using step slicing
print("Every other:", )

# TODO: Print the list reversed using step slicing
print("Reversed:", )
`,
      validate: (code: string) =>
        code.includes("[:3]") && code.includes("[-3:]") && code.includes("[::-1]"),
      successMessage:
        "Slicing is one of Python's most expressive features. Remember the pattern [start:stop:step]. Omitting start/stop uses the list's bounds. A negative step reverses direction. These operations all create new lists — the original is untouched.",
    },
    {
      instruction:
        "**Removing duplicates while preserving order**: Given a list with duplicate values, write code to remove duplicates while keeping the first occurrence of each value. Print the result. (Hint: a set tracks what you've seen; iterate and only keep items not yet seen.)",
      hint: `items = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]

seen = set()
unique = []
for item in items:
    if item not in seen:
        unique.append(item)
        seen.add(item)

print(unique)  # [3, 1, 4, 5, 9, 2, 6]`,
      starterCode: `items = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]

# TODO: Remove duplicates while preserving the order of first appearances
# Use a set to track what you've seen
seen = set()
unique = []
# ... your loop here

print(unique)
# Expected: [3, 1, 4, 5, 9, 2, 6]
`,
      validate: (code: string) =>
        code.includes("set()") && code.includes(".append(") && code.includes(".add("),
      successMessage:
        "This set-based deduplication is O(n) and order-preserving. Note that list(set(items)) also removes duplicates but doesn't preserve order. In Python 3.7+, dicts maintain insertion order, so dict.fromkeys(items) is another clean option: list(dict.fromkeys(items)).",
    },
    {
      instruction:
        "**Flattening a nested list**: Given a 2D list (list of lists), flatten it into a single 1D list. Try two approaches: (1) a nested loop with `extend()`, and (2) a list comprehension.",
      hint: `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Method 1: nested loop
flat1 = []
for row in matrix:
    flat1.extend(row)
print(flat1)

# Method 2: list comprehension
flat2 = [item for row in matrix for item in row]
print(flat2)`,
      starterCode: `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Method 1: Use a loop and extend()
flat1 = []
# TODO: flatten matrix into flat1

print("Loop method:", flat1)

# Method 2: List comprehension
flat2 = []  # TODO: use [item for row in matrix for item in row]
print("Comprehension:", flat2)
`,
      validate: (code: string) =>
        code.includes(".extend(") && code.includes("for row in matrix"),
      successMessage:
        "Both approaches work! extend() adds all items from an iterable. The comprehension [item for row in matrix for item in row] reads as 'for each row, for each item in that row'. For deeply nested or irregular structures, consider itertools.chain.from_iterable(matrix) which is memory-efficient.",
    },
  ],
};
