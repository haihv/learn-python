import type { WorkshopModule } from "../types";

export const dictsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "18",
  slug: "dicts-workshop",
  title: "Working with Nested Dicts",
  icon: "🗂️",
  estimatedMinutes: 20,
  description: "Build and traverse nested dictionary structures",
  steps: [
    {
      instruction:
        "Build a student registry as a dict mapping student names to a nested dict with 'grade' (str) and 'score' (int). Add Alice (grade='A', score=95) and Bob (grade='B', score=82). Use `setdefault` to add Carol only if she doesn't already exist (grade='A', score=91). Print the registry.",
      hint: "Use registry.setdefault('Carol', {'grade': 'A', 'score': 91}) — it inserts Carol only when the key is absent.",
      starterCode: `registry = {}

# Add Alice and Bob directly
# TODO

# Use setdefault to add Carol
# TODO

print(registry)
`,
      validate: (code: string) => {
        // require setdefault on a real code line (not the "# Use setdefault" comment in starter)
        return (
          /^[^#\n]*\.setdefault\s*\(/m.test(code) &&
          code.includes('"Alice"') &&
          code.includes('"Bob"') &&
          code.includes('"Carol"')
        );
      },
      successMessage:
        "Well done! setdefault is perfect for 'insert if absent' patterns — it avoids overwriting existing entries.",
    },
    {
      instruction:
        "Given the registry from the previous step, safely access the score of a student called 'Diana' (who doesn't exist) using `.get()` with a sensible default. Then access Alice's score using two chained dict lookups. Print both results.",
      hint: "For Diana: registry.get('Diana', {}).get('score', 0). For Alice: registry['Alice']['score'] or registry.get('Alice', {}).get('score').",
      starterCode: `registry = {
    "Alice": {"grade": "A", "score": 95},
    "Bob":   {"grade": "B", "score": 82},
    "Carol": {"grade": "A", "score": 91},
}

# Safe access for a missing student
diana_score = # TODO

# Access Alice's score
alice_score = # TODO

print(f"Diana's score: {diana_score}")
print(f"Alice's score: {alice_score}")
`,
      validate: (code: string) => {
        return (
          code.includes(".get(") &&
          code.includes("Diana") &&
          code.includes("Alice") &&
          (code.includes("alice_score") || code.includes("Alice"))
        );
      },
      successMessage:
        "Chaining .get() calls is the idiomatic way to safely navigate nested dicts without risking KeyError or TypeError.",
    },
    {
      instruction:
        "Write a function `invert_dict(d)` that swaps the keys and values of a dictionary. For example, {'a': 1, 'b': 2} becomes {1: 'a', 2: 'b'}. Use a dict comprehension. Test it with the sample dict below.",
      hint: "Use {v: k for k, v in d.items()} inside the function body.",
      starterCode: `def invert_dict(d):
    # TODO: return a new dict with keys and values swapped
    pass

original = {"red": "#FF0000", "green": "#00FF00", "blue": "#0000FF"}
inverted = invert_dict(original)
print(inverted)
# Expected: {'#FF0000': 'red', '#00FF00': 'green', '#0000FF': 'blue'}
`,
      validate: (code: string) => {
        return (
          code.includes("def invert_dict") &&
          code.includes(".items()") &&
          (code.includes("for k, v") || code.includes("for v, k"))
        );
      },
      successMessage:
        "Dict comprehensions with .items() make inversion a one-liner. Note: this only works correctly when values are unique.",
    },
    {
      instruction:
        "Write a `word_frequency(sentence)` function that returns a dict mapping each word (lowercased) to how many times it appears in the sentence. Use `.get()` or `setdefault` to accumulate counts. Test it with the sample sentence.",
      hint: "Split the sentence with sentence.lower().split(), then for each word do counts[word] = counts.get(word, 0) + 1.",
      starterCode: `def word_frequency(sentence):
    counts = {}
    # TODO: split the sentence into words and count each one
    return counts

sentence = "the cat sat on the mat and the cat sat"
freq = word_frequency(sentence)
print(freq)
# Expected: {'the': 3, 'cat': 2, 'sat': 2, 'on': 1, 'mat': 1, 'and': 1}
`,
      validate: (code: string) => {
        return (
          code.includes("def word_frequency") &&
          code.includes(".split") &&
          (code.includes(".get(") || code.includes("setdefault")) &&
          code.includes("counts")
        );
      },
      successMessage:
        "This is a classic dict accumulator pattern. In production you'd use collections.Counter, but building it manually deepens understanding.",
    },
    {
      instruction:
        "Merge two config dicts using `|=`. Start with `base_config` and apply `user_config` on top (user settings win). Then manually resolve a conflict: if both dicts define 'timeout', keep the larger value. Print the final merged config.",
      hint: "Merge with base_config |= user_config. Then check: if 'timeout' is in both, compare them before merging or fix it after.",
      starterCode: `base_config = {
    "timeout": 30,
    "retries": 3,
    "debug": False,
    "host": "localhost",
}

user_config = {
    "timeout": 10,   # user set a shorter timeout — we want to keep the larger!
    "debug": True,
    "port": 8080,
}

# Merge user_config into base_config (user wins on most keys)
# TODO

# Conflict resolution: keep the larger timeout
# TODO

print(base_config)
# Expected: timeout=30 (kept larger), debug=True, retries=3, host='localhost', port=8080
`,
      validate: (code: string) => {
        return (
          (code.includes("|=") || code.includes(".update(")) &&
          code.includes("timeout") &&
          (code.includes("max(") || code.includes(">") || code.includes("if "))
        );
      },
      successMessage:
        "Merging with |= is clean and readable. Conflict resolution logic on top keeps business rules explicit and maintainable.",
    },
  ],
};
