import type { LessonModule } from "../types";

export const loops: LessonModule = {
  type: "lesson",
  id: "10",
  slug: "loops",
  title: "for, while, range(), break, continue",
  icon: "🔄",
  estimatedMinutes: 15,
  content: `# for, while, range(), break, continue

Loops let you repeat code. Python has two loop types: \`for\` (iterate over a sequence) and \`while\` (repeat while a condition is true).

## The for Loop

\`for\` iterates over any iterable — strings, lists, ranges, dicts, etc.:

\`\`\`python
# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
# apple
# banana
# cherry

# Iterate over a string (characters)
for char in "Hello":
    print(char, end=" ")
# H e l l o

# Iterate over a dict (iterates keys by default)
person = {"name": "Alice", "age": 30}
for key in person:
    print(f"{key}: {person[key]}")

# Iterate keys and values together
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## range()

\`range()\` generates a sequence of integers. It's the go-to for index-based or count-based loops:

\`\`\`python
# range(stop) — 0 to stop-1
for i in range(5):
    print(i, end=" ")
# 0 1 2 3 4

# range(start, stop) — start to stop-1
for i in range(2, 7):
    print(i, end=" ")
# 2 3 4 5 6

# range(start, stop, step)
for i in range(0, 10, 2):
    print(i, end=" ")
# 0 2 4 6 8

# Count backwards
for i in range(10, 0, -1):
    print(i, end=" ")
# 10 9 8 7 6 5 4 3 2 1

# range() is memory-efficient — it generates values on demand
big = range(1_000_000)  # Doesn't allocate 1M integers
print(len(big))          # 1000000 (len works!)
print(big[500_000])      # 500000 (indexing works!)
\`\`\`

## while Loop

\`while\` repeats as long as its condition is truthy:

\`\`\`python
# Basic while loop
count = 0
while count < 5:
    print(count)
    count += 1   # Don't forget to update the condition!

# Process until a sentinel value
total = 0
while True:
    value = int(input("Enter number (0 to stop): "))
    if value == 0:
        break
    total += value
print(f"Total: {total}")

# Waiting for a condition
import time
attempts = 0
while not is_connected() and attempts < 3:
    connect()
    attempts += 1
    time.sleep(1)
\`\`\`

## break — Exit Early

\`break\` immediately exits the nearest enclosing loop:

\`\`\`python
# Find first even number
numbers = [1, 3, 5, 4, 7, 8]
for n in numbers:
    if n % 2 == 0:
        print(f"First even: {n}")
        break   # Stop as soon as we find it

# Exit a while loop
while True:
    response = input("Type 'quit' to exit: ")
    if response == "quit":
        break
    print(f"You typed: {response}")

# Break only exits the INNERMOST loop
for i in range(3):
    for j in range(3):
        if j == 1:
            break        # Exits only the inner loop
        print(f"({i},{j})", end=" ")
# (0,0) (1,0) (2,0)
\`\`\`

## continue — Skip to Next Iteration

\`continue\` skips the rest of the current iteration and moves to the next:

\`\`\`python
# Print only odd numbers
for i in range(10):
    if i % 2 == 0:
        continue    # Skip even numbers
    print(i, end=" ")
# 1 3 5 7 9

# Skip processing empty values
names = ["Alice", "", "Bob", None, "Charlie"]
for name in names:
    if not name:
        continue    # Skip falsy values
    print(f"Hello, {name}!")

# Filter in while loop
import random
while True:
    n = random.randint(1, 10)
    if n == 7:
        break
    if n % 2 == 0:
        continue    # Skip even numbers
    print(n, end=" ")
print("Got 7!")
\`\`\`

## else Clause on Loops

Python's loops have an optional \`else\` clause that runs **only if the loop completed without hitting break**:

\`\`\`python
# Searching with for/else — the else tells you "not found"
def find_prime_factor(n):
    for i in range(2, n):
        if n % i == 0:
            print(f"{n} is divisible by {i}")
            break
    else:
        # Only runs if no break was executed
        print(f"{n} is prime!")

find_prime_factor(15)   # 15 is divisible by 3
find_prime_factor(17)   # 17 is prime!

# while/else
attempts = 0
while attempts < 3:
    password = input("Password: ")
    if password == "secret":
        print("Access granted!")
        break
    attempts += 1
else:
    # Ran out of attempts without finding the right password
    print("Account locked!")
\`\`\`

The \`else\` runs when:
- \`for\` loop: the iterable was exhausted normally
- \`while\` loop: the condition became False

The \`else\` does NOT run when \`break\` was used.

## pass Statement

\`pass\` is a no-op — it does nothing. Use it as a placeholder:

\`\`\`python
# Placeholder while developing
for i in range(5):
    pass   # TODO: implement this

# Required syntactically (Python needs a body)
while waiting_for_input:
    pass   # Busy-wait (usually not ideal, but sometimes needed)

# Empty function or class body
def not_implemented_yet():
    pass

class EmptyClass:
    pass
\`\`\`

## Nested Loops

\`\`\`python
# Multiplication table
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:3}", end="")
    print()   # Newline after each row

# Iterating a 2D grid
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
for row in matrix:
    for cell in row:
        print(cell, end=" ")
    print()
\`\`\`

## Common Loop Patterns

\`\`\`python
# Accumulate a total
numbers = [1, 2, 3, 4, 5]
total = 0
for n in numbers:
    total += n
print(total)  # 15 (but sum(numbers) is better!)

# Build a list
squares = []
for n in range(1, 6):
    squares.append(n ** 2)
# [1, 4, 9, 16, 25] (but list comprehension is better!)

# Find maximum
data = [3, 1, 4, 1, 5, 9, 2, 6]
maximum = data[0]
for x in data:
    if x > maximum:
        maximum = x
# max(data) is better, but this shows the pattern
\`\`\`
`,
  quiz: [
    {
      question: "What does range(2, 10, 3) produce?",
      options: ["[2, 5, 8]", "[2, 3, 4, 5, 6, 7, 8, 9]", "[2, 4, 6, 8]", "[3, 6, 9]"],
      correctIndex: 0,
    },
    {
      question: "When does the else clause of a for loop execute?",
      options: [
        "Always, after the loop finishes",
        "Only when the loop body executed at least once",
        "Only when the loop completes without hitting break",
        "Only when the iterable was empty",
      ],
      correctIndex: 2,
    },
    {
      question: "What does the continue statement do in a loop?",
      options: [
        "Exits the loop immediately",
        "Skips the rest of the current iteration and moves to the next",
        "Continues to the outer loop",
        "Acts like pass — does nothing",
      ],
      correctIndex: 1,
    },
  ],
};
