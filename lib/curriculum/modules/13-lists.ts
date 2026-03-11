import type { LessonModule } from "../types";

export const lists: LessonModule = {
  type: "lesson",
  id: "13",
  slug: "lists",
  title: "Lists: Indexing, Slicing, Methods",
  icon: "📋",
  estimatedMinutes: 15,
  content: `# Lists: Indexing, Slicing, Methods

Lists are Python's most versatile built-in data structure. They're ordered, mutable sequences that can hold items of any type — including other lists.

## Creating Lists

\`\`\`python
# Empty list
empty = []
also_empty = list()

# List with initial values
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True, None]   # Different types allowed!

# From an iterable
chars = list("hello")        # ['h', 'e', 'l', 'l', 'o']
from_range = list(range(5))  # [0, 1, 2, 3, 4]

# Nested lists (2D)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
\`\`\`

## Indexing

Lists use zero-based indexing, just like strings:

\`\`\`python
fruits = ["apple", "banana", "cherry", "date"]
#          0          1          2        3   (positive)
#         -4         -3         -2       -1   (negative)

print(fruits[0])    # apple
print(fruits[2])    # cherry
print(fruits[-1])   # date (last item)
print(fruits[-2])   # cherry (second to last)

# Modify by index (lists are mutable!)
fruits[1] = "blueberry"
print(fruits)  # ['apple', 'blueberry', 'cherry', 'date']
\`\`\`

## Slicing

Slicing works identically to string slicing:

\`\`\`python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[2:5])    # [2, 3, 4]
print(numbers[:3])     # [0, 1, 2]
print(numbers[7:])     # [7, 8, 9]
print(numbers[::2])    # [0, 2, 4, 6, 8]
print(numbers[::-1])   # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

# Slicing creates a new list (shallow copy)
copy = numbers[:]
copy.append(99)
print(numbers)  # Unchanged
print(copy)     # [..., 99]

# Replace a slice
numbers[2:5] = [20, 30, 40]
print(numbers)  # [0, 1, 20, 30, 40, 5, 6, 7, 8, 9]

# Delete a slice
del numbers[2:5]
print(numbers)  # [0, 1, 5, 6, 7, 8, 9]
\`\`\`

## List Methods

### Adding Items

\`\`\`python
items = [1, 2, 3]

# append() — add one item to the end
items.append(4)
print(items)  # [1, 2, 3, 4]

# extend() — add all items from another iterable
items.extend([5, 6, 7])
print(items)  # [1, 2, 3, 4, 5, 6, 7]

# insert(index, value) — insert at a position
items.insert(0, 0)    # Insert 0 at index 0
print(items)          # [0, 1, 2, 3, 4, 5, 6, 7]
items.insert(-1, 99)  # Insert 99 before last item
print(items)          # [0, 1, 2, 3, 4, 5, 6, 99, 7]

# += is equivalent to extend()
items += [8, 9]
\`\`\`

### Removing Items

\`\`\`python
items = [1, 2, 3, 2, 4]

# remove(value) — removes FIRST occurrence of value
items.remove(2)
print(items)  # [1, 3, 2, 4]

# pop(index=-1) — removes and returns item at index
last = items.pop()      # Default: last item
print(last)   # 4
print(items)  # [1, 3, 2]

first = items.pop(0)    # Remove and return first item
print(first)  # 1

# del statement
del items[0]
del items[1:3]   # Delete a slice

# clear() — remove all items
items.clear()
print(items)  # []
\`\`\`

### Searching and Counting

\`\`\`python
fruits = ["apple", "banana", "cherry", "banana"]

# index(value) — index of first occurrence (ValueError if not found)
print(fruits.index("banana"))   # 1
print(fruits.index("banana", 2))  # 3 (search from index 2)

# count(value) — how many times value appears
print(fruits.count("banana"))   # 2
print(fruits.count("grape"))    # 0

# in operator — membership test
print("cherry" in fruits)       # True
print("grape" in fruits)        # False
print("grape" not in fruits)    # True
\`\`\`

### Sorting

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5]

# sort() — sort in place, returns None
numbers.sort()
print(numbers)  # [1, 1, 2, 3, 4, 5, 5, 6, 9]

numbers.sort(reverse=True)
print(numbers)  # [9, 6, 5, 5, 4, 3, 2, 1, 1]

# sorted() — returns new list, doesn't modify original
original = [3, 1, 4, 1, 5]
new_sorted = sorted(original)
print(original)    # [3, 1, 4, 1, 5]  (unchanged)
print(new_sorted)  # [1, 1, 3, 4, 5]

# Sort with a key function
words = ["banana", "Apple", "cherry", "date"]
words.sort(key=str.lower)   # Case-insensitive sort
print(words)

words.sort(key=len)         # Sort by length
print(words)

# Complex key
people = [("Alice", 30), ("Bob", 25), ("Charlie", 35)]
people.sort(key=lambda p: p[1])   # Sort by age
print(people)

# reverse() — reverse in place
numbers.reverse()
print(numbers)
\`\`\`

### Copying

\`\`\`python
original = [1, 2, 3]

# Shallow copy (three equivalent ways)
copy1 = original.copy()
copy2 = original[:]
copy3 = list(original)

# Modifying the copy doesn't affect the original
copy1.append(4)
print(original)  # [1, 2, 3]  (unchanged)
print(copy1)     # [1, 2, 3, 4]

# WARNING: shallow copy doesn't deep-copy nested lists
nested = [[1, 2], [3, 4]]
shallow = nested.copy()
shallow[0].append(99)
print(nested)   # [[1, 2, 99], [3, 4]]  (affected!)

# Deep copy when needed:
import copy
deep = copy.deepcopy(nested)
\`\`\`

## len() and Other Built-ins

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

print(len(numbers))    # 8
print(min(numbers))    # 1
print(max(numbers))    # 9
print(sum(numbers))    # 31
print(sorted(numbers)) # [1, 1, 2, 3, 4, 5, 6, 9]
\`\`\`

## Nested Lists

\`\`\`python
# 2D matrix
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

# Access element at row 1, column 2
print(matrix[1][2])   # 6

# Iterate rows
for row in matrix:
    print(row)

# Iterate all elements
for row in matrix:
    for element in row:
        print(element, end=" ")
    print()
\`\`\`
`,
  quiz: [
    {
      question: "What is the difference between list.sort() and sorted(list)?",
      options: [
        "sorted() is faster than list.sort()",
        "list.sort() modifies the original in-place, sorted() returns a new list",
        "sorted() only works with numbers, list.sort() works with anything",
        "They are identical — both return a new sorted list",
      ],
      correctIndex: 1,
    },
    {
      question: "What does list.pop() do when called with no arguments?",
      options: [
        "Removes and returns the first item",
        "Raises an IndexError",
        "Removes and returns the last item",
        "Returns but does not remove the last item",
      ],
      correctIndex: 2,
    },
    {
      question: "Which method would you use to add all items from one list to another?",
      options: [".append()", ".insert()", ".extend()", ".update()"],
      correctIndex: 2,
    },
  ],
};
