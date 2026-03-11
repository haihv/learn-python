import type { LessonModule } from "../types";

export const regexpModule: LessonModule = {
  type: "lesson",
  id: "67",
  slug: "regexp",
  title: "re module: match, search, findall, groups, flags",
  icon: "🔍",
  estimatedMinutes: 15,
  content: `# Regular Expressions in Python

Regular expressions (regex) are a powerful mini-language for describing text patterns. Python's built-in \`re\` module gives you everything you need to search, extract, replace, and split strings.

## Raw Strings for Patterns

Always write regex patterns as **raw strings** with the \`r\` prefix:

\`\`\`python
import re

# Without raw string: backslashes must be escaped
pattern = "\\\\d+"  # matches one or more digits

# With raw string: cleaner and less error-prone
pattern = r"\\d+"   # same thing, much cleaner
\`\`\`

The \`r\` prefix tells Python not to process backslash escape sequences, so \`r"\\d"\` is literally backslash-d — exactly what the regex engine expects.

## re.match vs re.search

These two functions look similar but behave very differently:

- **\`re.match(pattern, string)\`** — only matches at the **start** of the string (anchored)
- **\`re.search(pattern, string)\`** — scans the **entire** string, returns the first match anywhere

\`\`\`python
import re

text = "The price is 42 dollars"

# match only looks at the beginning
m = re.match(r"\\d+", text)
print(m)  # None — the string doesn't START with a digit

# search scans the whole string
m = re.search(r"\\d+", text)
print(m)        # <re.Match object ...>
print(m.group()) # "42"
print(m.start()) # 13  (position where match begins)
print(m.end())   # 15  (position after match)
print(m.span())  # (13, 15)
\`\`\`

Both return \`None\` when there is no match — always check before calling \`.group()\`.

## re.findall — All Matches as a List

\`re.findall\` returns **all non-overlapping matches** as a list of strings:

\`\`\`python
import re

text = "Call 555-1234 or 555-9876 for support"

# All digit sequences
numbers = re.findall(r"\\d+", text)
print(numbers)  # ['555', '1234', '555', '9876']

# All phone-number patterns
phones = re.findall(r"\\d{3}-\\d{4}", text)
print(phones)   # ['555-1234', '555-9876']
\`\`\`

When the pattern contains a capturing group, \`findall\` returns a list of the **captured text** instead of full matches. With multiple groups it returns a list of tuples.

## re.finditer — Iterator of Match Objects

\`re.finditer\` is like \`findall\` but returns an **iterator of Match objects**, giving you position information too:

\`\`\`python
import re

text = "Cats are great. Dogs are great too."

for m in re.finditer(r"[A-Z][a-z]+", text):
    print(f"Found '{m.group()}' at position {m.start()}-{m.end()}")
# Found 'Cats' at position 0-4
# Found 'Dogs' at position 16-20
\`\`\`

Use \`finditer\` instead of \`findall\` whenever you need match positions or other Match object attributes.

## re.sub — Replace Matches

\`re.sub(pattern, replacement, string)\` replaces every match with \`replacement\`:

\`\`\`python
import re

# Simple replacement
result = re.sub(r"\\s+", " ", "too   many    spaces")
print(result)  # "too many spaces"

# Use \\1, \\2, ... to reference captured groups in replacement
text = "John Smith, Jane Doe"
result = re.sub(r"(\\w+) (\\w+)", r"\\2, \\1", text)
print(result)  # "Smith, John, Doe, Jane"

# Limit replacements with count=
result = re.sub(r"a", "X", "banana", count=2)
print(result)  # "bXnXna"
\`\`\`

You can also pass a **callable** as the replacement — it receives the Match object and returns the replacement string.

## re.split — Split on a Pattern

\`re.split\` splits a string on every occurrence of the pattern:

\`\`\`python
import re

# Split on one or more whitespace characters
parts = re.split(r"\\s+", "  hello   world  ")
print(parts)  # ['', 'hello', 'world', '']

# Split on comma with optional surrounding spaces
parts = re.split(r"\\s*,\\s*", "one, two,three ,four")
print(parts)  # ['one', 'two', 'three', 'four']
\`\`\`

## re.compile — Reuse Patterns

Compiling a pattern once and reusing it is faster when the same pattern is used many times:

\`\`\`python
import re

# Compile once
EMAIL_RE = re.compile(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+")

emails = [
    "contact alice@example.com here",
    "or bob@corp.org for sales",
]
for line in emails:
    m = EMAIL_RE.search(line)
    if m:
        print(m.group())
# alice@example.com
# bob@corp.org
\`\`\`

A compiled pattern has the same methods as the \`re\` module (\`.match\`, \`.search\`, \`.findall\`, etc.).

## Capturing Groups

Parentheses \`()\` create **capturing groups** that you can extract individually:

\`\`\`python
import re

# Single group
m = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", "Date: 2024-03-15")
if m:
    print(m.group(0))  # full match: "2024-03-15"
    print(m.group(1))  # first group: "2024"
    print(m.group(2))  # second group: "03"
    print(m.group(3))  # third group: "15"
    print(m.groups())  # all groups: ('2024', '03', '15')
\`\`\`

## Named Groups — \`(?P<name>...)\`

Named groups make patterns self-documenting and let you access captures by name:

\`\`\`python
import re

pattern = r"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})"
m = re.search(pattern, "Today is 2024-03-15.")
if m:
    print(m.group("year"))   # "2024"
    print(m.group("month"))  # "03"
    print(m.group("day"))    # "15"
    print(m.groupdict())     # {'year': '2024', 'month': '03', 'day': '15'}
\`\`\`

## Non-Capturing Groups — \`(?:...)\`

Use \`(?:...)\` when you need grouping for alternation or repetition but don't need to capture:

\`\`\`python
import re

# Matches "colour" or "color" without capturing the "u?"
m = re.search(r"colo(?:u?)r", "I like colour and color")
print(m.group())  # "colour"

# findall returns whole matches (not group captures) when no capturing groups
all_matches = re.findall(r"colo(?:u?)r", "colour and color")
print(all_matches)  # ['colour', 'color']
\`\`\`

## Flags

Flags modify how the pattern engine behaves:

| Flag | Short | Effect |
|------|-------|--------|
| \`re.IGNORECASE\` | \`re.I\` | Case-insensitive matching |
| \`re.MULTILINE\` | \`re.M\` | \`^\` and \`$\` match start/end of each line |
| \`re.DOTALL\` | \`re.S\` | \`.\` matches newlines too |
| \`re.VERBOSE\` | \`re.X\` | Allow whitespace and comments in pattern |

\`\`\`python
import re

# IGNORECASE
print(re.findall(r"python", "Python PYTHON python", re.I))
# ['Python', 'PYTHON', 'python']

# MULTILINE — ^ and $ match line starts/ends
text = "line1\\nline2\\nline3"
print(re.findall(r"^\\w+", text, re.M))
# ['line1', 'line2', 'line3']

# DOTALL — . now matches newlines
m = re.search(r"start.+end", "start\\nmiddle\\nend", re.S)
print(m.group() if m else "no match")
# "start\\nmiddle\\nend"

# VERBOSE — use whitespace and # comments for readability
phone_pattern = re.compile(r"""
    \\(?           # optional opening paren
    (\\d{3})       # area code
    [)\\s-]?       # separator
    (\\d{3})       # exchange
    [-\\s]?        # separator
    (\\d{4})       # number
""", re.VERBOSE)
\`\`\`

## Common Patterns

\`\`\`python
import re

# Email address (simplified)
EMAIL = r"[\\w.+-]+@[\\w-]+\\.[\\w.]+"

# URL (http/https)
URL = r"https?://[\\w./-]+"

# US phone number (various formats)
PHONE = r"\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}"

# ISO date
DATE = r"\\d{4}-\\d{2}-\\d{2}"

# Positive integer
INT = r"\\b\\d+\\b"

text = "Email alice@corp.com, visit https://example.com, call 555-867-5309"
print(re.findall(EMAIL, text))   # ['alice@corp.com']
print(re.findall(URL, text))     # ['https://example.com']
print(re.findall(PHONE, text))   # ['555-867-5309']
\`\`\`

## Greedy vs Non-Greedy

By default, quantifiers (\`*\`, \`+\`, \`?\`, \`{n,m}\`) are **greedy** — they match as much as possible. Add \`?\` to make them **non-greedy** (lazy):

\`\`\`python
import re

html = "<b>bold</b> and <i>italic</i>"

# Greedy: matches from first < to last >
greedy = re.findall(r"<.+>", html)
print(greedy)   # ['<b>bold</b> and <i>italic</i>']

# Non-greedy: matches each tag separately
lazy = re.findall(r"<.+?>", html)
print(lazy)     # ['<b>', '</b>', '<i>', '</i>']
\`\`\`

Non-greedy quantifiers are essential when parsing structured text like HTML, XML, or log lines where you need the **shortest** possible match.
`,
  quiz: [
    {
      question:
        "What is the key difference between re.match() and re.search()?",
      options: [
        "re.match() returns all matches; re.search() returns only the first",
        "re.match() only matches at the start of the string; re.search() scans the entire string",
        "re.match() is case-sensitive; re.search() is case-insensitive",
        "re.match() returns a list; re.search() returns a Match object",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What does the pattern r'(?P<year>\\d{4})' create in a regex?",
      options: [
        "A non-capturing group named 'year' that matches exactly 4 digits",
        "A capturing group named 'year' that matches exactly 4 digits",
        "A lookahead assertion for the string 'year'",
        "A comment inside the pattern for documentation purposes",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Given text = 'aaa bbb aaa', what does re.findall(r'a+', text) return?",
      options: [
        "['aaa']",
        "['a', 'a', 'a', 'a', 'a', 'a']",
        "['aaa', 'aaa']",
        "'aaa bbb aaa'",
      ],
      correctIndex: 2,
    },
  ],
};
