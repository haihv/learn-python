import type { LessonModule } from "../types";

export const basicTypes: LessonModule = {
  type: "lesson",
  id: "01b",
  slug: "basic-types",
  title: "Basic Types: int, float, str, bool, None",
  icon: "🔢",
  estimatedMinutes: 12,
  content: `# Basic Types: int, float, str, bool, None

Python has five fundamental built-in types that you'll use constantly. Understanding how they work — and how they differ from each other — is essential for writing correct Python code.

## Integers (\`int\`)

Integers are whole numbers with no decimal point. Python's integers have **arbitrary precision** — they can be as large as your memory allows, unlike C or Java where integers overflow.

\`\`\`python
x = 42
y = -17
z = 0

# Large integers — Python handles these natively
big = 10 ** 100  # Googol: a 1 followed by 100 zeros

# Integer arithmetic
print(10 + 3)   # 13
print(10 - 3)   # 7
print(10 * 3)   # 30
print(10 / 3)   # 3.3333... (always returns float)
print(10 // 3)  # 3 (floor division, returns int)
print(10 % 3)   # 1 (modulo/remainder)
print(10 ** 3)  # 1000 (exponentiation)
\`\`\`

Note that \`/\` always returns a float in Python 3, even if the result is a whole number:
\`\`\`python
print(10 / 2)   # 5.0 (float, not 5!)
print(10 // 2)  # 5 (int)
\`\`\`

You can write integer literals with underscores for readability:
\`\`\`python
population = 8_000_000_000   # 8 billion
hex_color = 0xFF5733         # Hexadecimal
binary = 0b1010              # Binary (= 10)
octal = 0o17                 # Octal (= 15)
\`\`\`

## Floating-Point Numbers (\`float\`)

Floats represent real numbers with a decimal point. Python uses IEEE 754 double-precision floating-point (64-bit).

\`\`\`python
pi = 3.14159
e = 2.71828
small = 0.001
scientific = 1.5e10   # 1.5 × 10^10 = 15,000,000,000
negative_exp = 2.5e-4 # 2.5 × 10^-4 = 0.00025
\`\`\`

### The Floating-Point Precision Trap

Floats cannot represent all decimal values exactly because they're stored in binary:

\`\`\`python
print(0.1 + 0.2)           # 0.30000000000000004 (!)
print(0.1 + 0.2 == 0.3)    # False (!)
\`\`\`

This is not a Python bug — it's how IEEE 754 works in all languages. To compare floats safely:

\`\`\`python
import math
print(math.isclose(0.1 + 0.2, 0.3))   # True

# Or use the decimal module for exact decimal arithmetic
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2")) # 0.3 (exactly)
\`\`\`

Special float values:
\`\`\`python
import math
print(math.inf)   # Infinity
print(-math.inf)  # Negative infinity
print(math.nan)   # Not a Number
print(math.isnan(math.nan))  # True
\`\`\`

## Strings (\`str\`)

Strings are sequences of Unicode characters. Python has no separate \`char\` type — a single character is just a string of length 1.

\`\`\`python
# Four ways to create strings
single = 'Hello'
double = "World"
triple_single = '''Multi
line'''
triple_double = """Also
multi-line"""

# Escape sequences
tab = "column1\\tcolumn2"    # Tab character
newline = "line1\\nline2"    # Newline character
quote = "She said \\"Hi\\""  # Escaped quote
backslash = "C:\\\\Users"    # Literal backslash

# Raw strings — backslashes are not escape characters
path = r"C:\\Users\\Alice"   # r prefix = raw string
regex = r"\\d+\\.\\d+"       # Useful for regex patterns
\`\`\`

String immutability — you cannot change a string in place:
\`\`\`python
s = "hello"
# s[0] = "H"  # TypeError: 'str' object does not support item assignment
s = "H" + s[1:]  # Create a new string instead
print(s)  # Hello
\`\`\`

## Booleans (\`bool\`)

Booleans represent truth values. In Python, \`bool\` is actually a subclass of \`int\`:

\`\`\`python
t = True
f = False

# Booleans are integers!
print(True + True)    # 2
print(True * 5)       # 5
print(False + 1)      # 1

# Comparison operators return booleans
print(5 > 3)          # True
print(5 == 5)         # True
print("a" < "b")      # True (lexicographic)

# Logical operators
print(True and False) # False
print(True or False)  # True
print(not True)       # False
\`\`\`

### Truthiness and Falsiness

Every Python value has a boolean interpretation. These values are **falsy** (evaluate to False):

\`\`\`python
# All of these are falsy:
bool(False)    # False
bool(0)        # False (integer zero)
bool(0.0)      # False (float zero)
bool("")       # False (empty string)
bool([])       # False (empty list)
bool({})       # False (empty dict)
bool(None)     # False

# Everything else is truthy:
bool(1)        # True
bool(-1)       # True (any non-zero number)
bool("hi")     # True (any non-empty string)
bool([0])      # True (non-empty list, even if it contains falsy values)
\`\`\`

## None

\`None\` is Python's null value — it represents the absence of a value. It's the single instance of the \`NoneType\` class.

\`\`\`python
result = None
print(result)         # None
print(type(result))   # <class 'NoneType'>

# Functions that don't return a value implicitly return None
def greet(name):
    print(f"Hello, {name}!")
    # No return statement

value = greet("Alice")  # Prints: Hello, Alice!
print(value)            # None

# Always use "is None" for None checks, not "== None"
if result is None:
    print("No result")

if result is not None:
    print("Got a result!")
\`\`\`

## The \`type()\` Function

\`type()\` returns the type of any value:

\`\`\`python
print(type(42))       # <class 'int'>
print(type(3.14))     # <class 'float'>
print(type("hello"))  # <class 'str'>
print(type(True))     # <class 'bool'>
print(type(None))     # <class 'NoneType'>
print(type([1, 2]))   # <class 'list'>
\`\`\`

## \`isinstance()\` — Type Checking

\`isinstance()\` is the preferred way to check types because it handles inheritance:

\`\`\`python
print(isinstance(42, int))      # True
print(isinstance(3.14, float))  # True
print(isinstance("hi", str))    # True
print(isinstance(True, bool))   # True
print(isinstance(True, int))    # True! (bool is a subclass of int)

# Check multiple types at once
x = 42
print(isinstance(x, (int, float)))  # True (is it int OR float?)
\`\`\`

## Type Coercion / Conversion

You can convert between types using built-in functions:

\`\`\`python
# int() — converts to integer
print(int(3.9))      # 3 (truncates, doesn't round)
print(int("42"))     # 42
print(int("0xFF", 16))  # 255 (base 16)
print(int("1010", 2))   # 10 (base 2)
# int("hello")       # ValueError!

# float() — converts to float
print(float(42))     # 42.0
print(float("3.14")) # 3.14
# float("abc")       # ValueError!

# str() — converts to string
print(str(42))       # "42"
print(str(3.14))     # "3.14"
print(str(True))     # "True"
print(str(None))     # "None"

# bool() — converts to boolean
print(bool(0))       # False
print(bool(1))       # True
print(bool(""))      # False
print(bool("hi"))    # True
\`\`\`

## Summary Table

| Type | Example | Mutable? | Notes |
|------|---------|----------|-------|
| \`int\` | \`42\` | No | Arbitrary precision |
| \`float\` | \`3.14\` | No | IEEE 754 double |
| \`str\` | \`"hello"\` | No | Unicode characters |
| \`bool\` | \`True\` | No | Subclass of int |
| \`NoneType\` | \`None\` | No | Singleton |

All basic types are **immutable** — operations on them always create new objects rather than modifying in place.
`,
  quiz: [
    {
      question: "What is the result of 10 / 2 in Python 3?",
      options: ["5 (int)", "5.0 (float)", "4 (int)", "TypeError"],
      correctIndex: 1,
    },
    {
      question: "Which of these values is falsy in Python?",
      options: ["[0]", "\"False\"", "0.0", "-1"],
      correctIndex: 2,
    },
    {
      question: "What is the correct way to check if a variable x is None?",
      options: ["x == None", "x is None", "type(x) == NoneType", "x.isNone()"],
      correctIndex: 1,
    },
  ],
};
