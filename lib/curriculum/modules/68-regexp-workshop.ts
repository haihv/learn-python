import type { WorkshopModule } from "../types";

export const regexpWorkshop: WorkshopModule = {
  type: "workshop",
  id: "68",
  slug: "regexp-workshop",
  title: "Capturing Groups & Named Patterns",
  icon: "🎯",
  estimatedMinutes: 20,
  description: "Master regex patterns for text processing",
  steps: [
    {
      instruction:
        "Use `re.findall` with `r'\\d+'` to extract all numbers from a string. The text contains a mix of integers and words. Print the list of extracted number strings, then also compute their sum by converting each to an integer.",
      hint: "Use `re.findall(r'\\d+', text)` to get a list of digit-sequence strings. Convert each to int with a list comprehension: `[int(n) for n in numbers]` before summing.",
      starterCode: `import re

text = "I have 3 cats, 12 fish, and 1 dog. That's 42 legs in total counting 4 per animal."

# Extract all number strings using re.findall with r'\\d+'
numbers = None  # TODO: use re.findall with the digit pattern to get all number strings
print(f"Found numbers: {numbers}")

# Convert and sum
total = None  # TODO: sum each item in numbers after converting to int
print(f"Sum of all numbers: {total}")
`,
      validate: (code) =>
        code.includes("re.findall") && code.includes("\\d+"),
      successMessage:
        "Nice work! re.findall(r'\\d+', text) is one of the most useful regex one-liners in Python. It grabs every contiguous sequence of digit characters as a separate string. Notice it captures '42' as one token, not '4' and '2' separately.",
    },
    {
      instruction:
        "Use `re.search` with capturing groups to parse the date string `'2024-01-15'` into its year, month, and day components. Access each component using `m.group(1)`, `m.group(2)`, and `m.group(3)`.",
      hint: "Wrap each part in parentheses: `r'(\\d{4})-(\\d{2})-(\\d{2})'`. After matching, `m.group(0)` is the full match, `m.group(1)` is year, `m.group(2)` is month, `m.group(3)` is day.",
      starterCode: `import re

date_str = "2024-01-15"

# Pattern with three capturing groups — wrap year, month, day each in (...)
pattern = r'(\\d{4})-(\\d{2})-(\\d{2})'

m = None  # TODO: search pattern in date_str — use re.search and store the match object
if m:
    print(f"Full match: {m.group(0)}")
    year  = None  # TODO: extract the year using the first capturing group
    month = None  # TODO: extract the month using the second capturing group
    day   = None  # TODO: extract the day using the third capturing group
    print(f"Year:  {year}")
    print(f"Month: {month}")
    print(f"Day:   {day}")
    print(f"All groups: {m.groups()}")
`,
      validate: (code) =>
        code.includes("re.search") &&
        code.includes("group(1)") &&
        code.includes("group(2)") &&
        code.includes("group(3)"),
      successMessage:
        "Great! Capturing groups let you extract structured data from unstructured text in one step. m.groups() returns all captured strings as a tuple — handy for unpacking: year, month, day = m.groups()",
    },
    {
      instruction:
        "Rewrite the date parser using **named groups** with the syntax `(?P<name>...)`. Access the captured parts by name using `m.group('year')`, and also call `m.groupdict()` to see the full dictionary of named captures.",
      hint: "Use `r'(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})'`. After matching, `m.group('year')` gives the year. `m.groupdict()` returns `{'year': ..., 'month': ..., 'day': ...}`.",
      starterCode: `import re

date_str = "Meeting scheduled for 2024-01-15 at noon"

# Named groups make patterns self-documenting — use (?P<name>...) syntax
# TODO: write a pattern with named groups for year (4 digits), month (2), day (2)
pattern = None

m = re.search(pattern, date_str)
if m:
    year  = None  # TODO: access the 'year' named group via m.group(...)
    month = None  # TODO: access the 'month' named group via m.group(...)
    day   = None  # TODO: access the 'day' named group via m.group(...)
    print(f"Year:  {year}")
    print(f"Month: {month}")
    print(f"Day:   {day}")

    parsed = None  # TODO: call the method on m that returns all named captures as a dict
    print(f"\\nParsed dict: {parsed}")
    print(f"ISO format: {parsed['year']}-{parsed['month']}-{parsed['day']}")
`,
      validate: (code) =>
        code.includes("?P<year>") &&
        code.includes("?P<month>") &&
        code.includes("?P<day>") &&
        code.includes("groupdict"),
      successMessage:
        "Named groups are a Python-specific regex extension that greatly improves readability. They're especially valuable in long patterns — m.group('email') is far clearer than m.group(7). Named groups also work as back-references: (?P=name) matches the same text again.",
    },
    {
      instruction:
        "Use `re.sub` to censor email addresses in a block of text. Replace the local part (everything before the `@`) with `***`, leaving the domain visible. For example, `alice@example.com` should become `***@example.com`.",
      hint: "Use a pattern like `r'[\\w.+-]+(@[\\w-]+\\.[\\w.]+)'` with a capturing group around the domain. In the replacement, use `r'***\\1'` to keep the domain. Or use a lambda replacement function.",
      starterCode: `import re

text = """
Please contact support@helpdesk.org for billing issues.
For technical problems, email dev.team+bugs@company.co.uk or noreply@service.io.
Do not reply to auto@generated.net.
"""

# Replace the local part of every email with ***
# Capture the @ + domain so we can keep it: r'[\\w.+-]+(@[\\w-]+\\.[\\w.]+)'
censored = None  # TODO: call re.sub with the email pattern and r'***\\1' replacement

print("Original:")
print(text)
print("Censored:")
print(censored)
`,
      validate: (code) =>
        code.includes("re.sub") &&
        code.includes("***") &&
        code.includes("@"),
      successMessage:
        "Excellent! re.sub with backreferences is a powerful redaction tool. The replacement string \\1 (or r'\\1') refers to whatever group(1) captured. You can also use a lambda: re.sub(pattern, lambda m: '***' + m.group(1), text) for more complex logic.",
    },
    {
      instruction:
        "Compile a pattern with `re.compile` and use `re.finditer` to find all words that start with a capital letter in a sentence. Print each word along with its start position in the string.",
      hint: "Compile `r'\\b[A-Z][a-z]*\\b'` with `re.compile`. Then call `.finditer(text)` on the compiled pattern. Each match object `m` gives you `m.group()` for the word and `m.start()` for its position.",
      starterCode: `import re

text = "Alice and Bob visited Paris and London last Summer for a Python Conference."

# Compile the pattern once — efficient for repeated use
# TODO: use the module-level function that pre-compiles a regex pattern object
capital_word = None  # hint: the pattern matches a capital letter followed by lowercase letters

print("Capitalized words and their positions:")
# TODO: call the iterator method on capital_word that yields match objects, then loop
for m in []:  # replace [] with the correct iterator call
    pos = None  # TODO: get the match start position from m
    print(f"  '{m.group()}' at position {pos}")

# Also count them
all_capitals = None  # TODO: call the findall method on capital_word to get all matches
print(f"\\nTotal capitalized words: {len(all_capitals)}")
print(f"Words: {all_capitals}")
`,
      validate: (code) =>
        code.includes("re.compile") &&
        code.includes("finditer") &&
        code.includes("m.start()"),
      successMessage:
        "Well done! re.compile + finditer is the right combination when you need both efficiency (one compilation) and position data. In production code, module-level compiled patterns (ALL_CAPS names) are a common and idiomatic Python convention.",
    },
  ],
};
