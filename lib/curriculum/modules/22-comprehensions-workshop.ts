import type { WorkshopModule } from "../types";

export const comprehensionsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "22",
  slug: "comprehensions-workshop",
  title: "Generator Expressions & Filtering",
  icon: "🔃",
  estimatedMinutes: 20,
  description: "Master generator expressions for memory-efficient iteration",
  steps: [
    {
      instruction:
        "Write a list comprehension that produces a list of squares of all **even** numbers from 1 to 20 (inclusive). Store it in `even_squares` and print it.",
      hint: "Use [x**2 for x in range(1, 21) if x % 2 == 0]. The `if` clause filters to even numbers before squaring.",
      starterCode: `# List comprehension: squares of even numbers 1-20
even_squares = # TODO

print(even_squares)
# Expected: [4, 16, 36, 64, 100, 144, 196, 256, 324, 400]
`,
      validate: (code: string) => {
        return (
          code.includes("for") &&
          code.includes("**2") &&
          code.includes("% 2") &&
          code.includes("even_squares")
        );
      },
      successMessage:
        "List comprehensions with filtering are clean and expressive. The if clause acts as a gate — only values satisfying it enter the output list.",
    },
    {
      instruction:
        "Given a dict `word_scores`, write a **dict comprehension** that inverts it (swapping keys and values), but **only** includes entries where the value is not None. Store the result in `score_to_word` and print it.",
      hint: "Use {v: k for k, v in word_scores.items() if v is not None}.",
      starterCode: `word_scores = {
    "alpha": 10,
    "beta": None,
    "gamma": 30,
    "delta": None,
    "epsilon": 50,
}

# Dict comprehension: invert, filtering out None values
score_to_word = # TODO

print(score_to_word)
# Expected: {10: 'alpha', 30: 'gamma', 50: 'epsilon'}
`,
      validate: (code: string) => {
        return (
          code.includes("for") &&
          code.includes(".items()") &&
          code.includes("is not None") &&
          code.includes("score_to_word")
        );
      },
      successMessage:
        "Dict comprehensions with filtering are a neat way to clean data while transforming it. The 'if v is not None' guard prevents None values from appearing as keys in the inverted dict.",
    },
    {
      instruction:
        "Write a **set comprehension** that produces the set of unique word lengths from the sentence below. Store it in `unique_lengths` and print it sorted.",
      hint: "Use {len(w) for w in sentence.split()}. A set comprehension automatically deduplicates.",
      starterCode: `sentence = "the quick brown fox jumps over the lazy dog the fox"

# Set comprehension: unique word lengths
unique_lengths = # TODO

print(sorted(unique_lengths))
# Expected: [3, 4, 5] (lengths of 'the'/'over'/'quick'/... etc.)
# Exact output may vary but no duplicates
`,
      validate: (code: string) => {
        return (
          code.includes("for") &&
          code.includes("len(") &&
          code.includes(".split") &&
          code.includes("unique_lengths")
        );
      },
      successMessage:
        "Set comprehensions shine when you only care about unique values. The deduplication happens automatically at element insertion time — no extra call to set() needed.",
    },
    {
      instruction:
        "Compute the **sum of squares** of all numbers from 1 to 1000 using a **generator expression** (not a list comprehension). Wrap it in `sum()` directly without creating a list. Print the result and compare the approach to a list comprehension.",
      hint: "sum(x**2 for x in range(1, 1001)) — the generator expression is (x**2 for x in ...), but you can omit the extra parentheses inside sum().",
      starterCode: `# Generator expression inside sum() — no intermediate list created
total = # TODO

print(f"Sum of squares 1..1000: {total}")
# Expected: 333833500

# For comparison, this would build the whole list in memory first:
# total_list = sum([x**2 for x in range(1, 1001)])
`,
      validate: (code: string) => {
        return (
          code.includes("sum(") &&
          code.includes("**2") &&
          code.includes("range(") &&
          !code.includes("sum([")  // should NOT use list comprehension
        );
      },
      successMessage:
        "Generator expressions are lazy — they produce one value at a time and never build the full list in memory. For sum(), min(), max(), or any iterable consumer, prefer a genexp over a list comprehension.",
    },
    {
      instruction:
        "Flatten the 2D matrix below into a 1D list using a **nested list comprehension**. Store the result in `flat` and print it.",
      hint: "Use [elem for row in matrix for elem in row]. Read left to right: outer loop is 'for row in matrix', inner is 'for elem in row'.",
      starterCode: `matrix = [
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9, 10, 11, 12],
]

# Nested comprehension: flatten to 1D
flat = # TODO

print(flat)
# Expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
`,
      validate: (code: string) => {
        return (
          code.includes("for") &&
          code.includes("matrix") &&
          code.includes("flat") &&
          /for .+ in [\s\S]*?for .+ in/.test(code)
        );
      },
      successMessage:
        "Nested comprehensions follow the same loop order as nested for loops written top-to-bottom. For deeper nesting (3+ levels), switch to explicit loops for readability.",
    },
  ],
};
