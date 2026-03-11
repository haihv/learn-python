import type { LabModule } from "../types";

export const loopsLab: LabModule = {
  type: "lab",
  id: "12",
  slug: "loops-lab",
  title: "Loop Challenge",
  icon: "🧪",
  estimatedMinutes: 20,
  description: "Solve classic programming problems using loops",
  instructions: `## Loop Challenge

In this lab you will solve three classic programming problems using loops. Each answer should be printed to stdout.

### Task 1: FizzBuzz

Print numbers from 1 to 30. But:
- If a number is divisible by 3, print \`Fizz\` instead
- If a number is divisible by 5, print \`Buzz\` instead
- If divisible by both 3 and 5, print \`FizzBuzz\`
- Otherwise print the number

### Task 2: Sum of Even Numbers

Calculate and print the sum of all even numbers from 1 to 100 (inclusive).
Print the result as: \`Sum of evens: 2550\`

### Task 3: Find Primes up to N

Find all prime numbers up to 50. A prime number is a number greater than 1 that is only divisible by 1 and itself.
Print them on one line separated by spaces.

### Hints
- For FizzBuzz: check divisibility by 15 (3×5) first, then 3, then 5
- For even sum: use \`range(2, 101, 2)\` or check \`n % 2 == 0\`
- For primes: for each candidate n, check if any number from 2 to n-1 divides it evenly
`,
  starterCode: `# Task 1: FizzBuzz (1 to 30)
for i in range(1, 31):
    # TODO: Print FizzBuzz, Fizz, Buzz, or the number
    pass

# Task 2: Sum of even numbers 1-100
total = 0
# TODO: Sum all even numbers from 1 to 100
# Print: "Sum of evens: {total}"

# Task 3: Find primes up to 50
primes = []
for n in range(2, 51):
    # TODO: Check if n is prime and append to primes
    pass

print(" ".join(str(p) for p in primes))
`,
  solutionCode: `# Task 1: FizzBuzz (1 to 30)
for i in range(1, 31):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)

# Task 2: Sum of even numbers 1-100
total = sum(i for i in range(1, 101) if i % 2 == 0)
print(f"Sum of evens: {total}")

# Task 3: Find primes up to 50
primes = []
for n in range(2, 51):
    is_prime = True
    for divisor in range(2, n):
        if n % divisor == 0:
            is_prime = False
            break
    if is_prime:
        primes.append(n)

print(" ".join(str(p) for p in primes))
`,
  tests: [
    {
      name: "FizzBuzz output contains Fizz",
      description: "Output should contain 'Fizz' for multiples of 3",
      validate: (_code, stdout) => stdout.includes("Fizz"),
    },
    {
      name: "FizzBuzz output contains Buzz",
      description: "Output should contain 'Buzz' for multiples of 5",
      validate: (_code, stdout) => stdout.includes("Buzz"),
    },
    {
      name: "FizzBuzz output contains FizzBuzz",
      description: "Output should contain 'FizzBuzz' for multiples of 15",
      validate: (_code, stdout) => stdout.includes("FizzBuzz"),
    },
    {
      name: "Sum of evens is 2550",
      description: "Sum of all even numbers from 1 to 100 is 2550",
      validate: (_code, stdout) => stdout.includes("2550"),
    },
    {
      name: "Primes up to 50 are correct",
      description: "Output should contain the primes: 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47",
      validate: (_code, stdout) =>
        stdout.includes("2") &&
        stdout.includes("47") &&
        stdout.includes("13") &&
        stdout.includes("41"),
    },
  ],
};
