import type { LabModule } from "../types";

export const functionsLab: LabModule = {
  type: "lab",
  id: "27",
  slug: "functions-lab",
  title: "Functions Lab",
  icon: "🧪",
  estimatedMinutes: 25,
  description: "Write pure functions to process and transform data",
  instructions: `# Functions Lab

In this lab you will implement four pure functions that transform and analyse data. Each function must be self-contained — no side effects, no global state.

## Functions to Implement

### 1. celsius_to_fahrenheit(c)
Convert a Celsius temperature to Fahrenheit. Formula: **F = C × 9/5 + 32**

### 2. is_palindrome(s)
Return \`True\` if the string \`s\` reads the same forwards and backwards, ignoring case and non-alphanumeric characters. For example: \`"A man a plan a canal Panama"\` is a palindrome.

### 3. flatten(lst)
Recursively flatten a deeply nested list into a single flat list. For example:
\`[1, [2, [3, 4], 5], [6, 7]]\` → \`[1, 2, 3, 4, 5, 6, 7]\`

### 4. group_by(lst, key_fn)
Group the items in \`lst\` into a dict where each key is the result of applying \`key_fn\` to an item, and each value is a list of all items that map to that key. Preserve insertion order within each group.

## Output Format

Your program must print exactly:

\`\`\`
=== Celsius to Fahrenheit ===
0°C = 32.0°F
100°C = 212.0°F
-40°C = -40.0°F

=== Palindrome Check ===
"racecar": True
"hello": False
"A man a plan a canal Panama": True

=== Flatten ===
[1, 2, 3, 4, 5, 6, 7]
[1, 2, 3, 4, 5]

=== Group By ===
odd: [1, 3, 5, 7, 9]
even: [2, 4, 6, 8, 10]
short: ['cat', 'dog', 'ox']
long: ['elephant', 'hippopotamus']
\`\`\`

## Tips
- For is_palindrome, use \`s.isalnum()\` to filter characters and \`.lower()\` to normalise
- For flatten, check \`isinstance(item, list)\` to decide whether to recurse
- For group_by, use \`setdefault\` or check membership before appending
`,
  starterCode: `# --- Function implementations ---

def celsius_to_fahrenheit(c):
    """Convert Celsius to Fahrenheit."""
    # TODO
    pass


def is_palindrome(s):
    """Return True if s is a palindrome (ignoring case and non-alphanumeric chars)."""
    # TODO
    pass


def flatten(lst):
    """Recursively flatten a nested list into a single flat list."""
    # TODO
    pass


def group_by(lst, key_fn):
    """Group items by the result of key_fn(item)."""
    # TODO
    pass


# --- Print results ---

print("=== Celsius to Fahrenheit ===")
for c in [0, 100, -40]:
    print(f"{c}°C = {celsius_to_fahrenheit(c)}°F")

print()
print("=== Palindrome Check ===")
for s in ["racecar", "hello", "A man a plan a canal Panama"]:
    print(f'"{s}": {is_palindrome(s)}')

print()
print("=== Flatten ===")
print(flatten([1, [2, [3, 4], 5], [6, 7]]))
print(flatten([1, [2, [3, [4, [5]]]]]))

print()
print("=== Group By ===")
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
grouped_nums = group_by(numbers, lambda n: "odd" if n % 2 != 0 else "even")
for key, vals in grouped_nums.items():
    print(f"{key}: {vals}")

words = ["cat", "elephant", "dog", "hippopotamus", "ox"]
grouped_words = group_by(words, lambda w: "short" if len(w) <= 3 else "long")
for key, vals in grouped_words.items():
    print(f"{key}: {vals}")
`,
  solutionCode: `# --- Function implementations ---

def celsius_to_fahrenheit(c):
    """Convert Celsius to Fahrenheit."""
    return c * 9 / 5 + 32


def is_palindrome(s):
    """Return True if s is a palindrome (ignoring case and non-alphanumeric chars)."""
    cleaned = [ch.lower() for ch in s if ch.isalnum()]
    return cleaned == cleaned[::-1]


def flatten(lst):
    """Recursively flatten a nested list into a single flat list."""
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result


def group_by(lst, key_fn):
    """Group items by the result of key_fn(item)."""
    groups = {}
    for item in lst:
        key = key_fn(item)
        groups.setdefault(key, []).append(item)
    return groups


# --- Print results ---

print("=== Celsius to Fahrenheit ===")
for c in [0, 100, -40]:
    print(f"{c}°C = {celsius_to_fahrenheit(c)}°F")

print()
print("=== Palindrome Check ===")
for s in ["racecar", "hello", "A man a plan a canal Panama"]:
    print(f'"{s}": {is_palindrome(s)}')

print()
print("=== Flatten ===")
print(flatten([1, [2, [3, 4], 5], [6, 7]]))
print(flatten([1, [2, [3, [4, [5]]]]]))

print()
print("=== Group By ===")
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
grouped_nums = group_by(numbers, lambda n: "odd" if n % 2 != 0 else "even")
for key, vals in grouped_nums.items():
    print(f"{key}: {vals}")

words = ["cat", "elephant", "dog", "hippopotamus", "ox"]
grouped_words = group_by(words, lambda w: "short" if len(w) <= 3 else "long")
for key, vals in grouped_words.items():
    print(f"{key}: {vals}")
`,
  tests: [
    {
      name: "Celsius to Fahrenheit conversions",
      description:
        "Output contains correct conversions: 32.0°F for 0°C, 212.0°F for 100°C, -40.0°F for -40°C",
      validate: (_code: string, stdout: string) =>
        stdout.includes("32.0°F") &&
        stdout.includes("212.0°F") &&
        stdout.includes("-40.0°F"),
    },
    {
      name: "Palindrome detection",
      description:
        "Output shows 'racecar': True, 'hello': False, and the long phrase as True",
      validate: (_code: string, stdout: string) =>
        stdout.includes('"racecar": True') &&
        stdout.includes('"hello": False') &&
        stdout.includes('"A man a plan a canal Panama": True'),
    },
    {
      name: "Flatten nested list",
      description:
        "Output contains the correctly flattened list [1, 2, 3, 4, 5, 6, 7]",
      validate: (_code: string, stdout: string) =>
        stdout.includes("[1, 2, 3, 4, 5, 6, 7]"),
    },
    {
      name: "Group by odd/even",
      description:
        "Output contains odd: [1, 3, 5, 7, 9] and even: [2, 4, 6, 8, 10]",
      validate: (_code: string, stdout: string) =>
        stdout.includes("odd: [1, 3, 5, 7, 9]") &&
        stdout.includes("even: [2, 4, 6, 8, 10]"),
    },
    {
      name: "Group by word length",
      description:
        "Output contains short words group and long words group printed correctly",
      validate: (_code: string, stdout: string) =>
        stdout.includes("short:") &&
        stdout.includes("long:") &&
        stdout.includes("elephant") &&
        stdout.includes("hippopotamus"),
    },
  ],
};
