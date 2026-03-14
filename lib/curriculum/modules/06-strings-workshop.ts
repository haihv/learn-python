import type { WorkshopModule } from "../types";

export const stringsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "06",
  slug: "strings-workshop",
  title: "f-strings & String Formatting",
  icon: "🔤",
  estimatedMinutes: 20,
  description: "Master Python's f-strings, format(), and % formatting",
  steps: [
    {
      instruction:
        "**Basic f-strings**: Create two variables — `name` (a string with your name) and `age` (an integer). Then use an f-string to print a greeting: `Name: Alice, Age: 30`",
      hint: `name = "Alice"
age = 30
print(f"Name: {name}, Age: {age}")`,
      starterCode: `# Create variables and use an f-string
name = "Alice"
age = 30

# TODO: print using an f-string in format: "Name: Alice, Age: 30"
`,
      validate: (code: string) =>
        code.includes('f"') || code.includes("f'"),
      successMessage:
        "Great! f-strings (formatted string literals) are the most modern and readable way to embed variables in strings. The f prefix tells Python to evaluate expressions inside {}.",
    },
    {
      instruction:
        "**Format specifiers**: f-strings support powerful format specs inside `{}`. Print a float with 2 decimal places using `:.2f`, and an integer with zero-padding using `:05d`. Try: `f\"{3.14159:.2f}\"` and `f\"{42:05d}\"`",
      hint: `pi = 3.14159
num = 42
print(f"Pi rounded: {pi:.2f}")     # 3.14
print(f"Padded number: {num:05d}") # 00042`,
      starterCode: `pi = 3.14159
num = 42

# TODO: Print pi with 2 decimal places
# TODO: Print num as a 5-digit zero-padded integer
`,
      validate: (code: string) =>
        code.includes(":.2f") && code.includes(":05d"),
      successMessage:
        "Format specs are incredibly powerful! The pattern is {value:format}. Common formats: .2f (2 decimal float), 05d (5-wide zero-padded int), >10 (right-align in 10 chars), < (left-align), ^ (center).",
    },
    {
      instruction:
        "**str.format()**: Use the older `str.format()` method to build a sentence. Try: `\"Hello, {}! You are {} years old.\".format(name, age)` and also the named form: `\"Hello, {name}!\".format(name=name)`",
      hint: `name = "Bob"
age = 25
print("Hello, {}! You are {} years old.".format(name, age))
print("Hello, {name}! Age: {age}.".format(name=name, age=age))`,
      starterCode: `name = "Bob"
age = 25

# TODO: Use .format() with positional placeholders {}
# TODO: Use .format() with named placeholders {name}, {age}
`,
      validate: (code: string) =>
        /^[^#\n]*\.format\s*\(/m.test(code),
      successMessage:
        "str.format() is older but still widely used. Named placeholders ({name}) make code more self-documenting. f-strings are generally preferred for new code, but you'll see .format() in many existing codebases.",
    },
    {
      instruction:
        "**Multi-line strings and escape sequences**: Create a multi-line string using triple quotes that spans at least 3 lines. Then create a string that uses `\\n` to manually add a newline, and print both.",
      hint: `poem = """Roses are red,
Violets are blue,
Python is great,
And so are you!"""
print(poem)

manual = "Line 1\\nLine 2\\nLine 3"
print(manual)`,
      starterCode: `# TODO: Create a multi-line string using triple quotes (at least 3 lines)
poem = """

"""

# TODO: Create a string with manual \\n newlines
manual = ""

print(poem)
print(manual)
`,
      validate: (code: string) =>
        (code.includes('"""') || code.includes("'''")) &&
        code.includes("\\n") &&
        // starter has triple-quoted stub; require actual content (not just empty triple-quote)
        !/poem\s*=\s*"""\s*"""/s.test(code) &&
        // starter has manual = ""; require actual \n content in a non-empty string
        !/^[^#\n]*manual\s*=\s*""\s*$/m.test(code),
      successMessage:
        "Triple-quoted strings preserve newlines literally — great for long text, SQL queries, and docstrings. \\n is the escape sequence for a newline character and works in any string type.",
    },
    {
      instruction:
        "**Chaining string methods**: Take the string `\"  hello world  \"` and in a single expression: strip whitespace, then convert to title case. Store the result in `result` and print it. The output should be `Hello World`.",
      hint: `result = "  hello world  ".strip().title()
print(result)`,
      starterCode: `text = "  hello world  "

# TODO: Chain .strip() and .title() to get "Hello World"
result = text
print(result)
`,
      validate: (code: string) =>
        // require both on real code lines, not just the TODO comment
        /^[^#\n]*\.strip\s*\(\)/m.test(code) && /^[^#\n]*\.title\s*\(\)/m.test(code),
      successMessage:
        "Method chaining is an elegant Python pattern. Because each string method returns a new string, you can chain calls directly. Order matters: strip first (removes whitespace), then title (capitalizes words). If you called title first, the spaces would affect word detection.",
    },
  ],
};
