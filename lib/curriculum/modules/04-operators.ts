import type { LessonModule } from "../types";

export const operators: LessonModule = {
  type: "lesson",
  id: "04",
  slug: "operators",
  title: "Operators: Arithmetic, Comparison, Logical",
  icon: "➕",
  estimatedMinutes: 12,
  content: `# Operators: Arithmetic, Comparison, Logical

Operators are the symbols that tell Python to perform specific computations. Python has a rich set of operators that cover arithmetic, comparisons, logic, and more.

## Arithmetic Operators

\`\`\`python
a, b = 17, 5

print(a + b)   # 22  — addition
print(a - b)   # 12  — subtraction
print(a * b)   # 85  — multiplication
print(a / b)   # 3.4 — true division (always float)
print(a // b)  # 3   — floor division (rounds toward -∞)
print(a % b)   # 2   — modulo (remainder)
print(a ** b)  # 1419857 — exponentiation (17^5)
\`\`\`

### Floor Division and Modulo with Negatives

Floor division rounds **toward negative infinity**, not toward zero:

\`\`\`python
print(17 // 5)    #  3 (floor of  3.4)
print(-17 // 5)   # -4 (floor of -3.4, NOT -3!)
print(17 // -5)   # -4 (floor of -3.4)
print(-17 // -5)  #  3 (floor of  3.4)
\`\`\`

Modulo follows the sign of the divisor:
\`\`\`python
print(17 % 5)    #  2  (17 = 5*3 + 2)
print(-17 % 5)   #  3  (-17 = 5*(-4) + 3)
print(17 % -5)   # -3  (17 = -5*(-4) + -3)
\`\`\`

### Useful Arithmetic Patterns

\`\`\`python
# Check if a number is even/odd
print(42 % 2 == 0)   # True (even)
print(13 % 2 == 0)   # False (odd)

# Wrap around (like a clock)
hour = 23
next_hour = (hour + 1) % 24   # 0 (midnight)

# Integer square root
import math
print(math.isqrt(25))  # 5 (exact, no float rounding)
\`\`\`

## Comparison Operators

Comparison operators return \`True\` or \`False\`:

\`\`\`python
x, y = 10, 20

print(x == y)   # False — equal to
print(x != y)   # True  — not equal to
print(x < y)    # True  — less than
print(x > y)    # False — greater than
print(x <= y)   # True  — less than or equal
print(x >= y)   # False — greater than or equal

# Works with strings (lexicographic order)
print("apple" < "banana")   # True
print("Z" < "a")            # True (uppercase < lowercase in ASCII)
\`\`\`

### Chained Comparisons

Python supports chaining comparison operators naturally:

\`\`\`python
x = 5

# Mathematical-style chaining
print(1 < x < 10)      # True (equivalent to 1 < x and x < 10)
print(0 <= x <= 100)   # True
print(1 < x < 3)       # False

# This is much more readable than the alternative:
print(1 < x and x < 10)  # Same result, more verbose

# Chaining also works with ==
a = b = c = 5
print(a == b == c)  # True
\`\`\`

### Identity vs Equality

\`\`\`python
# == checks value equality
# is checks object identity (same object in memory)

a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # True  (same values)
print(a is b)   # False (different objects)
print(a is c)   # True  (same object)

# Always use "is" for None, True, False comparisons
x = None
print(x is None)     # Correct
print(x == None)     # Works but discouraged (linters will warn)
\`\`\`

## Logical Operators

\`\`\`python
print(True and True)    # True
print(True and False)   # False
print(False and True)   # False
print(False and False)  # False

print(True or True)     # True
print(True or False)    # True
print(False or True)    # True
print(False or False)   # False

print(not True)         # False
print(not False)        # True
\`\`\`

### Short-Circuit Evaluation

Python's \`and\` and \`or\` use short-circuit evaluation — they stop as soon as the result is determined:

\`\`\`python
# "and" stops at the first falsy value (or returns last value)
print(0 and 5)         # 0   (short-circuits: 0 is falsy)
print(3 and 5)         # 5   (returns last value: both truthy)
print("" and "hello")  # ""  (short-circuits: "" is falsy)

# "or" stops at the first truthy value (or returns last value)
print(0 or 5)          # 5   (0 is falsy, returns 5)
print(3 or 5)          # 3   (3 is truthy, short-circuits)
print("" or "hello")   # "hello"
print("" or 0)         # 0   (both falsy, returns last)
\`\`\`

### Practical Uses of Short-Circuit

\`\`\`python
# Default value pattern
name = user_input or "Anonymous"  # Use user_input if truthy, else "Anonymous"

# Guard before risky operation
result = data and data["key"]  # Only access key if data is truthy

# Conditional execution (avoid when possible — use if/else for clarity)
debug and print("Debug info:", value)
\`\`\`

## Bitwise Operators

Bitwise operators work on the binary representation of integers:

\`\`\`python
a = 0b1100   # 12 in binary
b = 0b1010   # 10 in binary

print(a & b)   # 0b1000 = 8   — AND: both bits must be 1
print(a | b)   # 0b1110 = 14  — OR: at least one bit is 1
print(a ^ b)   # 0b0110 = 6   — XOR: exactly one bit is 1
print(~a)      # -13           — NOT: flips all bits (-(a+1))
print(a << 1)  # 0b11000 = 24 — Left shift: multiply by 2
print(a >> 1)  # 0b0110 = 6   — Right shift: divide by 2
\`\`\`

Common bitwise patterns:
\`\`\`python
# Check if bit N is set
n = 0b10110
bit_2_set = bool(n & (1 << 2))   # True (bit 2 = 1)

# Set bit N
n |= (1 << 3)   # Set bit 3

# Clear bit N
n &= ~(1 << 1)  # Clear bit 1

# Toggle bit N
n ^= (1 << 0)   # Toggle bit 0
\`\`\`

## Operator Precedence

When operators appear together, Python uses precedence rules (highest to lowest):

| Precedence | Operators |
|-----------|-----------|
| Highest | \`**\` (exponentiation) |
| | \`~\`, unary \`+\`, unary \`-\` |
| | \`*\`, \`/\`, \`//\`, \`%\` |
| | \`+\`, \`-\` |
| | \`<<\`, \`>>\` |
| | \`&\` |
| | \`^\` |
| | \`|\` |
| | \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`, \`is\`, \`in\` |
| | \`not\` |
| | \`and\` |
| Lowest | \`or\` |

\`\`\`python
# Precedence examples
print(2 + 3 * 4)      # 14, not 20 (* before +)
print(2 ** 3 ** 2)    # 512, not 64 (** is right-associative: 2**(3**2) = 2**9)
print(not True or True)   # True (not True → False, then False or True → True)
print(not (True or True))  # False

# When in doubt, use parentheses for clarity
result = (a + b) * (c - d)
\`\`\`
`,
  quiz: [
    {
      question: "What is the result of -17 // 5 in Python?",
      options: ["-3", "-4", "3", "-3.4"],
      correctIndex: 1,
    },
    {
      question: "What does the expression (0 or 'default') evaluate to?",
      options: ["0", "True", "False", "'default'"],
      correctIndex: 3,
    },
    {
      question: "Which statement about chained comparisons like (1 < x < 10) is correct?",
      options: [
        "It is not valid Python syntax",
        "It is equivalent to (1 < x) < 10 (left to right)",
        "It is equivalent to (1 < x) and (x < 10)",
        "It only works with integer values",
      ],
      correctIndex: 2,
    },
  ],
};
