import type { LessonModule } from "../types";

export const controlFlow: LessonModule = {
  type: "lesson",
  id: "08",
  slug: "control-flow",
  title: "if / elif / else & Ternary Expressions",
  icon: "🔀",
  estimatedMinutes: 12,
  content: `# if / elif / else & Ternary Expressions

Control flow is how your program makes decisions. Python's \`if\` statement evaluates conditions and runs different code blocks depending on the result.

## Basic if / elif / else

\`\`\`python
temperature = 25

if temperature > 30:
    print("It's hot!")
elif temperature > 20:
    print("It's warm.")
elif temperature > 10:
    print("It's cool.")
else:
    print("It's cold!")

# Output: It's warm.
\`\`\`

Key syntax rules:
- The condition is followed by a colon \`:\`
- The body is **indented** (4 spaces by convention)
- \`elif\` is short for "else if" — you can have any number of them
- \`else\` is optional and catches everything else
- Only the **first** matching branch runs

## Indentation Rules

Python uses indentation to define blocks. This is not cosmetic — it is the syntax:

\`\`\`python
x = 10

if x > 5:
    print("Greater than 5")   # Block 1 — 4 spaces
    print("Still in block")   # Block 1 — still 4 spaces
print("Outside if")           # Not in any block — 0 spaces

# Nested blocks
if x > 0:
    print("Positive")         # 4 spaces
    if x > 5:
        print("Greater than 5")   # 8 spaces
    print("Still in outer if")    # 4 spaces
print("Outside everything")   # 0 spaces
\`\`\`

## Truthiness: Truthy and Falsy Values

Python's \`if\` doesn't require an explicit boolean — it evaluates the **truthiness** of any value:

\`\`\`python
# All of these are FALSY (behave like False in conditions):
if 0:         print("never")    # 0 is falsy
if 0.0:       print("never")    # 0.0 is falsy
if "":        print("never")    # Empty string is falsy
if []:        print("never")    # Empty list is falsy
if {}:        print("never")    # Empty dict is falsy
if ():        print("never")    # Empty tuple is falsy
if None:      print("never")    # None is falsy
if False:     print("never")    # False is falsy

# All of these are TRUTHY (behave like True):
if 1:         print("yes")      # Any non-zero number
if -1:        print("yes")      # Negative numbers too
if "hi":      print("yes")      # Non-empty string
if [0]:       print("yes")      # Non-empty list (even if items are falsy!)
if {"a": 1}:  print("yes")      # Non-empty dict

# Practical use of truthiness
name = input("Enter name: ")
if name:                         # True if name is not empty
    print(f"Hello, {name}!")
else:
    print("No name provided")
\`\`\`

## Ternary Expressions (Conditional Expressions)

Python's ternary operator lets you write a simple if/else on a single line:

\`\`\`python
# Syntax: value_if_true if condition else value_if_false

age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # adult

# Works with any expression
x = 10
abs_x = x if x >= 0 else -x   # Equivalent to abs(x)

# Use in f-strings
is_member = True
print(f"Access: {'granted' if is_member else 'denied'}")

# Nesting ternaries (use sparingly — readability suffers)
score = 75
grade = "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "F"
print(grade)  # C

# Prefer if/elif/else for more than 2 outcomes
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
\`\`\`

## Nested if Statements

\`\`\`python
def classify_number(n):
    if n > 0:
        if n % 2 == 0:
            return "positive even"
        else:
            return "positive odd"
    elif n < 0:
        return "negative"
    else:
        return "zero"

print(classify_number(4))   # positive even
print(classify_number(7))   # positive odd
print(classify_number(-3))  # negative
print(classify_number(0))   # zero
\`\`\`

Deep nesting makes code hard to read. Prefer **early returns** to flatten logic:

\`\`\`python
# Deeply nested (hard to read)
def process(data):
    if data is not None:
        if len(data) > 0:
            if data[0] > 0:
                return data[0] * 2

# Flat with early returns (easier to read)
def process(data):
    if data is None:
        return None
    if len(data) == 0:
        return None
    if data[0] <= 0:
        return None
    return data[0] * 2
\`\`\`

## Chained Comparisons

Python lets you chain comparisons naturally:

\`\`\`python
x = 5

# Pythonic chained comparison
if 1 < x < 10:
    print("x is between 1 and 10")

# Check valid age range
age = 25
if 0 <= age <= 150:
    print("Valid age")

# Check multiple equality
a = b = c = 5
if a == b == c:
    print("All equal")

# Any number of comparisons can be chained
if 0 < x <= 10 < 100:
    print("Chained three comparisons")
\`\`\`

## Checking Multiple Conditions

\`\`\`python
username = "alice"
password = "secret"

# Multiple conditions with and
if username == "alice" and password == "secret":
    print("Login successful")

# Multiple conditions with or
day = "Saturday"
if day == "Saturday" or day == "Sunday":
    print("Weekend!")

# More Pythonic way to check membership
if day in ("Saturday", "Sunday"):
    print("Weekend!")

# Complex conditions — parentheses help readability
if (score >= 60 and attendance >= 80) or has_special_permission:
    print("Student passes")
\`\`\`

## Common Patterns

\`\`\`python
# Pattern: default value
def greet(name=None):
    if name is None:
        name = "Guest"
    print(f"Hello, {name}!")

# Equivalent with ternary:
def greet(name=None):
    name = name if name is not None else "Guest"
    print(f"Hello, {name}!")

# Pattern: guard clause (validate inputs early)
def divide(a, b):
    if b == 0:
        return None   # or raise ValueError
    return a / b

# Pattern: flag variable
found = False
for item in items:
    if item == target:
        found = True
        break

if found:
    print("Found it!")
\`\`\`
`,
  quiz: [
    {
      question: "Which of the following values is TRUTHY in Python?",
      options: ["[]", "0", "\"\"", "[0]"],
      correctIndex: 3,
    },
    {
      question: "What is the correct syntax for a ternary expression in Python?",
      options: [
        "condition ? value_true : value_false",
        "value_true if condition else value_false",
        "if condition then value_true else value_false",
        "condition and value_true or value_false",
      ],
      correctIndex: 1,
    },
    {
      question: "How many elif clauses can an if statement have?",
      options: ["At most 1", "At most 2", "At most 8", "Any number"],
      correctIndex: 3,
    },
  ],
};
