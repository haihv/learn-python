import type { LabModule } from "../types";

export const dictsLab: LabModule = {
  type: "lab",
  id: "20",
  slug: "dicts-lab",
  title: "Dictionary Challenge",
  icon: "🧪",
  estimatedMinutes: 20,
  description: "Solve word frequency and grouping problems with dicts",
  instructions: `# Dictionary Challenge

In this lab you will process a paragraph of text using Python dictionaries to extract useful statistics and structure.

## Tasks

### 1. Word Frequency Count
Count how many times each word appears in the paragraph. Normalize words to lowercase and strip punctuation before counting.

### 2. Most Common Word
Find the word that appears most frequently. If there is a tie, return the one that comes first alphabetically.

### 3. Group Words by First Letter
Build a dict mapping each starting letter to a **sorted list** of unique words beginning with that letter.

## Output Format

Your program must print exactly:

\`\`\`
=== Word Frequency ===
and: 3
the: 4
...  (all words, sorted alphabetically)

=== Most Common Word ===
the (4 times)

=== Words by First Letter ===
a: ['and', 'are', ...]
t: ['the', 'to', ...]
...  (only letters that have words, sorted)
\`\`\`

## Tips
- Use \`str.lower()\` and \`str.strip('.,!?;:\\"\\'')\` to normalise each word
- A dict comprehension or loop with \`.get()\` works well for counting
- \`sorted()\` on a dict's items lets you print in alphabetical order
- For grouping, initialise with \`setdefault(letter, [])\` or check membership first
`,
  starterCode: `paragraph = (
    "The quick brown fox jumps over the lazy dog. "
    "The dog barked at the fox, and the fox ran away. "
    "A quick brown cat also jumps, and the cat and the dog are friends."
)

# --- Task 1: Count word frequency ---
# Hint: split on whitespace, lowercase, strip punctuation
word_freq = {}
# TODO

# --- Task 2: Most common word ---
# Hint: iterate word_freq.items() and track the max
most_common = None
most_common_count = 0
# TODO

# --- Task 3: Group words by first letter ---
by_letter = {}
# TODO

# --- Print results ---
print("=== Word Frequency ===")
for word, count in sorted(word_freq.items()):
    print(f"{word}: {count}")

print()
print("=== Most Common Word ===")
print(f"{most_common} ({most_common_count} times)")

print()
print("=== Words by First Letter ===")
for letter in sorted(by_letter.keys()):
    print(f"{letter}: {sorted(by_letter[letter])}")
`,
  solutionCode: `paragraph = (
    "The quick brown fox jumps over the lazy dog. "
    "The dog barked at the fox, and the fox ran away. "
    "A quick brown cat also jumps, and the cat and the dog are friends."
)

# --- Task 1: Count word frequency ---
word_freq = {}
for raw_word in paragraph.split():
    word = raw_word.lower().strip('.,!?;:\\"\'')
    if word:
        word_freq[word] = word_freq.get(word, 0) + 1

# --- Task 2: Most common word ---
most_common = None
most_common_count = 0
for word, count in word_freq.items():
    if count > most_common_count or (count == most_common_count and word < most_common):
        most_common = word
        most_common_count = count

# --- Task 3: Group words by first letter ---
by_letter = {}
for word in word_freq:
    letter = word[0]
    by_letter.setdefault(letter, set()).add(word)

# --- Print results ---
print("=== Word Frequency ===")
for word, count in sorted(word_freq.items()):
    print(f"{word}: {count}")

print()
print("=== Most Common Word ===")
print(f"{most_common} ({most_common_count} times)")

print()
print("=== Words by First Letter ===")
for letter in sorted(by_letter.keys()):
    print(f"{letter}: {sorted(by_letter[letter])}")
`,
  tests: [
    {
      name: "Word frequency section printed",
      description: "Output contains the '=== Word Frequency ===' header",
      validate: (_code: string, stdout: string) =>
        stdout.includes("=== Word Frequency ==="),
    },
    {
      name: "Correct count for 'the'",
      description: "The word 'the' appears 5 times in the paragraph",
      validate: (_code: string, stdout: string) =>
        stdout.includes("the: 5"),
    },
    {
      name: "Correct count for 'and'",
      description: "The word 'and' appears 3 times in the paragraph",
      validate: (_code: string, stdout: string) =>
        stdout.includes("and: 3"),
    },
    {
      name: "Most common word identified",
      description: "Output correctly identifies 'the' as the most common word with 5 occurrences",
      validate: (_code: string, stdout: string) =>
        stdout.includes("the (5 times)"),
    },
    {
      name: "Words grouped by first letter",
      description: "Output contains the '=== Words by First Letter ===' section with at least 't:' and 'f:' entries",
      validate: (_code: string, stdout: string) =>
        stdout.includes("=== Words by First Letter ===") &&
        stdout.includes("t:") &&
        stdout.includes("f:"),
    },
  ],
};
