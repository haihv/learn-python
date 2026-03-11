import type { LabModule } from "../types";

export const listsLab: LabModule = {
  type: "lab",
  id: "16",
  slug: "lists-lab",
  title: "List Processing Lab",
  icon: "🧪",
  estimatedMinutes: 20,
  description: "Process lists with Python's built-in tools",
  instructions: `## List Processing Lab

In this lab you will process a list of numbers using various Python list tools.

### Setup
Start with this list:
\`\`\`python
numbers = [34, 7, 23, 32, 5, 62, 13, 45, 8, 90, 17, 3]
\`\`\`

### Tasks

**Task 1: Statistics**
Print the minimum, maximum, and sum of the list:
\`\`\`
Min: 3, Max: 90, Sum: 339
\`\`\`

**Task 2: Sorted copy**
Create a sorted copy (ascending) and print it. The original should remain unchanged.
\`\`\`
Sorted: [3, 5, 7, 8, 13, 17, 23, 32, 34, 45, 62, 90]
\`\`\`

**Task 3: Filter large numbers**
Build a new list of numbers greater than 20 and print it.
\`\`\`
Over 20: [34, 23, 32, 62, 45, 90]
\`\`\`

**Task 4: Second and second-to-last**
Print the second element and the second-to-last element using indexing.
\`\`\`
Second: 7
Second-to-last: 17
\`\`\`

**Task 5: Reverse the filtered list**
Take the "over 20" list from Task 3, reverse it in-place, and print it.
\`\`\`
Reversed over 20: [90, 45, 62, 32, 23, 34]
\`\`\`
`,
  starterCode: `numbers = [34, 7, 23, 32, 5, 62, 13, 45, 8, 90, 17, 3]

# Task 1: Print min, max, sum
# Expected: "Min: 3, Max: 90, Sum: 339"

# Task 2: Sorted copy (don't modify original)
# Expected: "Sorted: [3, 5, 7, 8, 13, 17, 23, 32, 34, 45, 62, 90]"

# Task 3: Numbers greater than 20
# Expected: "Over 20: [34, 23, 32, 62, 45, 90]"

# Task 4: Second element and second-to-last
# Expected: "Second: 7" and "Second-to-last: 17"

# Task 5: Reverse the over-20 list in-place and print
# Expected: "Reversed over 20: [90, 45, 62, 32, 23, 34]"
`,
  solutionCode: `numbers = [34, 7, 23, 32, 5, 62, 13, 45, 8, 90, 17, 3]

# Task 1: Statistics
print(f"Min: {min(numbers)}, Max: {max(numbers)}, Sum: {sum(numbers)}")

# Task 2: Sorted copy
sorted_numbers = sorted(numbers)
print(f"Sorted: {sorted_numbers}")

# Task 3: Numbers greater than 20
over_20 = [n for n in numbers if n > 20]
print(f"Over 20: {over_20}")

# Task 4: Second and second-to-last
print(f"Second: {numbers[1]}")
print(f"Second-to-last: {numbers[-2]}")

# Task 5: Reverse the over-20 list in-place
over_20.reverse()
print(f"Reversed over 20: {over_20}")
`,
  tests: [
    {
      name: "Statistics are correct",
      description: "Min should be 3, Max 90, Sum 339",
      validate: (_code, stdout) =>
        stdout.includes("3") && stdout.includes("90") && stdout.includes("339"),
    },
    {
      name: "Sorted list is correct",
      description: "Sorted output should start with 3 and end with 90",
      validate: (_code, stdout) => stdout.includes("[3, 5, 7, 8, 13, 17, 23, 32, 34, 45, 62, 90]"),
    },
    {
      name: "Filtered list over 20 is correct",
      description: "Numbers over 20 should be printed",
      validate: (_code, stdout) => stdout.includes("Over 20:") && stdout.includes("62") && stdout.includes("90"),
    },
    {
      name: "Index access is used",
      description: "Code should use index [1] and [-2] for second and second-to-last",
      validate: (code, _stdout) => code.includes("[1]") && code.includes("[-2]"),
    },
    {
      name: "Reversed list is correct",
      description: "Reversed over-20 list should start with 90",
      validate: (_code, stdout) =>
        stdout.includes("Reversed over 20:") && stdout.includes("[90,"),
    },
  ],
};
