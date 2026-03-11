import type { LessonModule } from "../types";

export const strings: LessonModule = {
  type: "lesson",
  id: "05",
  slug: "strings",
  title: "Strings: Methods, Slicing, Indexing",
  icon: "📝",
  estimatedMinutes: 15,
  content: `# Strings: Methods, Slicing, Indexing

Strings are one of the most-used types in Python. They're sequences of Unicode characters, which means you can index them, slice them, and iterate over them just like lists.

## Creating Strings

\`\`\`python
# Four quoting styles — all create str objects
single = 'Hello'
double = "World"
triple_single = '''Line 1
Line 2
Line 3'''
triple_double = """Also
multiline"""

# Raw strings: backslashes are literal
path = r"C:\\Users\\Alice\\Documents"
regex_pattern = r"\\d{3}-\\d{4}"

# Byte strings (not str): used for binary data
data = b"bytes data"
\`\`\`

## Indexing

Strings are zero-indexed. Use \`[index]\` to access individual characters:

\`\`\`python
s = "Python"
#    P y t h o n
#    0 1 2 3 4 5   (positive indices)
#   -6-5-4-3-2-1   (negative indices)

print(s[0])    # P  (first character)
print(s[5])    # n  (last character)
print(s[-1])   # n  (last character, negative index)
print(s[-2])   # o  (second to last)
print(s[6])    # IndexError: string index out of range
\`\`\`

## Slicing

Slicing extracts a substring using \`[start:stop:step]\`:

\`\`\`python
s = "Hello, World!"

# Basic slicing [start:stop] — stop is exclusive
print(s[0:5])    # Hello
print(s[7:12])   # World
print(s[:5])     # Hello (start defaults to 0)
print(s[7:])     # World! (stop defaults to end)
print(s[:])      # Hello, World! (full copy)

# Negative indices in slices
print(s[-6:])    # World!
print(s[-6:-1])  # World

# Step slicing [start:stop:step]
print(s[::2])    # Hlo ol!  (every 2nd character)
print(s[1::2])   # el,Wrd   (every 2nd, starting at index 1)

# Reverse a string with step=-1
print(s[::-1])   # !dlroW ,olleH
\`\`\`

## String Immutability

Strings cannot be changed in place. Every string "modification" creates a new string:

\`\`\`python
s = "hello"
# s[0] = "H"  # TypeError! Strings are immutable

# To "change" a string, create a new one
s = "H" + s[1:]   # "Hello"
print(s)

# This is also why string operations are safe to use in multiple places —
# they never modify the original
original = "hello"
upper = original.upper()
print(original)  # hello (unchanged)
print(upper)     # HELLO (new string)
\`\`\`

## len() and the in Operator

\`\`\`python
s = "Hello, World!"

print(len(s))           # 13 — number of characters

# in operator — membership test
print("Hello" in s)     # True
print("hello" in s)     # False (case-sensitive)
print("xyz" in s)       # False
print("xyz" not in s)   # True
\`\`\`

## Essential String Methods

Python's string methods return new strings — they never modify the original.

### Case Methods

\`\`\`python
s = "hello, WORLD!"

print(s.upper())        # HELLO, WORLD!
print(s.lower())        # hello, world!
print(s.capitalize())   # Hello, world! (first letter upper, rest lower)
print(s.title())        # Hello, World! (first letter of each word)
print(s.swapcase())     # HELLO, world! (swap upper/lower)
\`\`\`

### Whitespace Methods

\`\`\`python
s = "  hello world  "

print(s.strip())        # "hello world" (strip both ends)
print(s.lstrip())       # "hello world  " (strip left only)
print(s.rstrip())       # "  hello world" (strip right only)

# Strip specific characters
s2 = "***hello***"
print(s2.strip("*"))    # "hello"
print(s2.strip("*h"))   # "ello" (strips * and h from both ends)
\`\`\`

### Search Methods

\`\`\`python
s = "Hello, World!"

print(s.find("World"))       # 7 (index of first occurrence)
print(s.find("xyz"))         # -1 (not found, no exception)
print(s.index("World"))      # 7 (like find, but raises ValueError if not found)
print(s.rfind("l"))          # 10 (last occurrence)
print(s.count("l"))          # 3 (how many times "l" appears)

print(s.startswith("Hello")) # True
print(s.endswith("!"))       # True
print(s.startswith(("Hi", "Hello")))  # True (tuple of options)
\`\`\`

### Split and Join

\`\`\`python
# split() — split string into list
sentence = "The quick brown fox"
words = sentence.split()           # Split on whitespace
print(words)  # ['The', 'quick', 'brown', 'fox']

csv = "a,b,c,d"
parts = csv.split(",")             # Split on comma
print(parts)  # ['a', 'b', 'c', 'd']

# Limit splits with maxsplit
print("a:b:c:d".split(":", 2))    # ['a', 'b', 'c:d']

# splitlines() — split on line endings
text = "line1\\nline2\\nline3"
print(text.splitlines())           # ['line1', 'line2', 'line3']

# join() — join list into string (called on the separator)
words = ["Hello", "World"]
print(" ".join(words))    # Hello World
print("-".join(words))    # Hello-World
print("".join(words))     # HelloWorld

# Efficient string building
parts = [str(i) for i in range(5)]
result = ", ".join(parts)   # "0, 1, 2, 3, 4"
\`\`\`

### Replace

\`\`\`python
s = "I like cats. Cats are great. I have 3 cats."

print(s.replace("cats", "dogs"))           # All occurrences
print(s.replace("cats", "dogs", 2))        # Only first 2 occurrences
print(s.replace("I", "You"))               # Case-sensitive
\`\`\`

### Alignment and Padding

\`\`\`python
s = "hello"

print(s.center(11))         # "   hello   "
print(s.center(11, "*"))    # "***hello***"
print(s.ljust(10, "-"))     # "hello-----"
print(s.rjust(10, "-"))     # "-----hello"
print("42".zfill(5))        # "00042" (zero-pad numbers)
\`\`\`

### Testing Methods

\`\`\`python
print("hello".isalpha())      # True (all letters)
print("hello123".isalnum())   # True (letters and digits)
print("12345".isdigit())      # True (all digits)
print("   ".isspace())        # True (all whitespace)
print("Hello World".istitle())  # True (title case)
print("HELLO".isupper())      # True
print("hello".islower())      # True
\`\`\`

## Chaining Methods

Because methods return new strings, you can chain them:

\`\`\`python
result = "  Hello, World!  ".strip().lower().replace(",", "")
print(result)  # "hello world!"

# Process user input
user_input = "  Alice Smith  "
name = user_input.strip().title()
print(name)  # "Alice Smith"
\`\`\`

## String Multiplication

\`\`\`python
print("ha" * 3)    # hahaha
print("-" * 40)    # ----------------------------------------
print("=" * 20)    # ====================
\`\`\`
`,
  quiz: [
    {
      question: "What does \"Hello\"[-1] return?",
      options: ["H", "o", "IndexError", "e"],
      correctIndex: 1,
    },
    {
      question: "What does \"hello world\".split() return?",
      options: [
        "['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']",
        "['hello', 'world']",
        "'hello world'",
        "('hello', 'world')",
      ],
      correctIndex: 1,
    },
    {
      question: "What does \"-\".join([\"a\", \"b\", \"c\"]) return?",
      options: ["[\"a\", \"b\", \"c\"]", "\"a-b-c\"", "\"abc\"", "\"-a-b-c-\""],
      correctIndex: 1,
    },
  ],
};
