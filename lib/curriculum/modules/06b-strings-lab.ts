import type { LabModule } from "../types";

export const stringsLab: LabModule = {
  type: "lab",
  id: "06b",
  slug: "strings-lab",
  title: "String Manipulation Challenge",
  icon: "🧪",
  estimatedMinutes: 20,
  description: "Manipulate strings using Python's built-in string methods",
  instructions: `## String Manipulation Challenge

In this lab you will write Python code that performs four string operations. Each result should be printed on its own line.

### Tasks

#### 1. Reverse a String
Given the string \`"Hello, Python!"\`, reverse it and print the result.
- Hint: Use slicing with a step of -1: \`s[::-1]\`

#### 2. Count Vowels
Given the string \`"Hello, Python!"\`, count how many vowels (a, e, i, o, u — both upper and lower case) it contains and print: \`Vowel count: X\`
- Hint: Loop over the string, or use \`sum()\` with a generator expression

#### 3. Capitalize Each Word
Given the string \`"the quick brown fox"\`, capitalize the first letter of each word and print the result.
- Hint: Use the \`.title()\` method

#### 4. Check Palindrome
Given the string \`"racecar"\`, check whether it is a palindrome (reads the same forwards and backwards) and print \`Is palindrome: True\` or \`Is palindrome: False\`.
- Hint: Compare the string to its reverse

### Expected Output
\`\`\`
!nohtyP ,olleH
Vowel count: 3
The Quick Brown Fox
Is palindrome: True
\`\`\`
`,
  starterCode: `# String Manipulation Challenge

# 1. Reverse a string
text = "Hello, Python!"
# TODO: Reverse 'text' and print it
reversed_text = text
print(reversed_text)

# 2. Count vowels
# TODO: Count vowels in 'text' (a, e, i, o, u — case insensitive)
# Print: "Vowel count: X"

# 3. Capitalize each word
sentence = "the quick brown fox"
# TODO: Capitalize each word and print

# 4. Check palindrome
word = "racecar"
# TODO: Check if 'word' is a palindrome and print "Is palindrome: True/False"
`,
  solutionCode: `# String Manipulation Challenge — Solution

# 1. Reverse a string
text = "Hello, Python!"
reversed_text = text[::-1]
print(reversed_text)

# 2. Count vowels
vowels = "aeiouAEIOU"
vowel_count = sum(1 for ch in text if ch in vowels)
print(f"Vowel count: {vowel_count}")

# 3. Capitalize each word
sentence = "the quick brown fox"
print(sentence.title())

# 4. Check palindrome
word = "racecar"
is_palindrome = word == word[::-1]
print(f"Is palindrome: {is_palindrome}")
`,
  tests: [
    {
      name: "Reversed string printed",
      description: "Output should contain the reversed version of 'Hello, Python!'",
      validate: (_code, stdout) => stdout.includes("!nohtyP ,olleH"),
    },
    {
      name: "Vowel count printed",
      description: "Output should contain 'Vowel count: 3'",
      validate: (_code, stdout) => stdout.includes("Vowel count: 3"),
    },
    {
      name: "Title case printed",
      description: "Output should contain 'The Quick Brown Fox'",
      validate: (_code, stdout) => stdout.includes("The Quick Brown Fox"),
    },
    {
      name: "Palindrome check printed",
      description: "Output should contain 'Is palindrome: True'",
      validate: (_code, stdout) => stdout.includes("Is palindrome: True"),
    },
    {
      name: "Slicing used for reverse",
      description: "Code should use slice notation [::-1] to reverse the string",
      validate: (code, _stdout) => code.includes("[::-1]"),
    },
  ],
};
