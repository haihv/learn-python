import type { WorkshopModule } from "../types";

export const generatorsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "45",
  slug: "generators-workshop",
  title: "Lazy Pipelines with Generators",
  icon: "🔁",
  estimatedMinutes: 20,
  description: "Build memory-efficient data pipelines with generators",
  steps: [
    {
      instruction:
        "Write an infinite generator `count_from(n)` that yields `n`, `n+1`, `n+2`, ... forever. Then use `itertools.islice` to take only the first 5 values starting from 3. Print them as a list.",
      hint: "def count_from(n): while True: yield n; n += 1. Then: from itertools import islice; print(list(islice(count_from(3), 5)))",
      starterCode: `from itertools import islice

def count_from(n):
    # TODO: yield n, n+1, n+2, ... forever
    pass

# Use islice to take just the first 5 values starting from 3
result = list(islice(count_from(3), 5))
print(result)   # [3, 4, 5, 6, 7]

# Start from 10, take 4
result2 = list(islice(count_from(10), 4))
print(result2)  # [10, 11, 12, 13]
`,
      validate: (code: string) => {
        return (
          code.includes("def count_from") &&
          code.includes("yield") &&
          code.includes("islice") &&
          (code.includes("while True") || code.includes("while 1"))
        );
      },
      successMessage:
        "Infinite generators are safe because they only produce values when asked. `islice` is your key tool for taking a finite slice from an infinite stream without running forever.",
    },
    {
      instruction:
        "Write a generator `fibonacci()` that yields Fibonacci numbers indefinitely: 0, 1, 1, 2, 3, 5, 8, 13, .... Use `islice` to print the first 10 numbers.",
      hint: "def fibonacci(): a, b = 0, 1; while True: yield a; a, b = b, a + b. The assignment `a, b = b, a + b` swaps both at once — no temp variable needed.",
      starterCode: `from itertools import islice

def fibonacci():
    # TODO: yield 0, 1, 1, 2, 3, 5, 8, ... forever
    pass

# Print first 10 Fibonacci numbers
fibs = list(islice(fibonacci(), 10))
print(fibs)   # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Sum of first 20 Fibonacci numbers
total = sum(islice(fibonacci(), 20))
print(f"Sum of first 20: {total}")

# Find first Fibonacci number > 100
gen = fibonacci()
while True:
    f = next(gen)
    if f > 100:
        print(f"First Fibonacci > 100: {f}")
        break
`,
      validate: (code: string) => {
        return (
          code.includes("def fibonacci") &&
          code.includes("yield") &&
          (code.includes("a, b = b") || code.includes("a,b = b"))
        );
      },
      successMessage:
        "The `a, b = b, a + b` idiom computes both new values simultaneously before any assignment happens. This is a hallmark of Pythonic code — no temporary variables needed.",
    },
    {
      instruction:
        "Write a generator `lines_from_string(text)` that simulates reading lines from a file: split the text on `\\n`, strip each line, and yield only non-empty lines. Then write a second generator `uppercase_lines(lines)` that yields each line uppercased. Compose them.",
      hint: "def lines_from_string(text): for line in text.split('\\n'): stripped = line.strip(); if stripped: yield stripped. Then def uppercase_lines(lines): for line in lines: yield line.upper().",
      starterCode: `def lines_from_string(text):
    # TODO: split on \\n, strip each line, yield only non-empty ones
    pass

def uppercase_lines(lines):
    # TODO: yield each line uppercased
    pass

sample_text = """
  hello world

  python generators
    are cool

  lazy evaluation
"""

# Compose the two generators
pipeline = uppercase_lines(lines_from_string(sample_text))
for line in pipeline:
    print(line)
# Expected:
# HELLO WORLD
# PYTHON GENERATORS
# ARE COOL
# LAZY EVALUATION
`,
      validate: (code: string) => {
        return (
          code.includes("def lines_from_string") &&
          code.includes("def uppercase_lines") &&
          code.includes("yield") &&
          (code.includes(".strip()") || code.includes(".strip(")) &&
          code.includes(".upper()")
        );
      },
      successMessage:
        "Generator pipelines compose naturally — each step is a lazy transformation. Data flows through one item at a time with no intermediate lists, making this pattern ideal for large text files or streaming data.",
    },
    {
      instruction:
        "Build a 3-stage generator pipeline: `numbers(n)` yields integers 1..n; `squares(nums)` yields each squared; `even_only(nums)` filters to even numbers only. Print the result of composing all three for n=10.",
      hint: "def numbers(n): yield from range(1, n+1). def squares(nums): for n in nums: yield n*n. def even_only(nums): for n in nums: if n % 2 == 0: yield n.",
      starterCode: `def numbers(n):
    # TODO: yield 1, 2, ..., n
    pass

def squares(nums):
    # TODO: yield each number squared
    pass

def even_only(nums):
    # TODO: yield only even numbers
    pass

# Compose all three stages
pipeline = even_only(squares(numbers(10)))
result = list(pipeline)
print(result)   # [4, 16, 36, 64, 100]  (squares of even numbers 2,4,6,8,10)

# What is the sum?
total = sum(even_only(squares(numbers(10))))
print(f"Sum: {total}")   # 220
`,
      validate: (code: string) => {
        return (
          code.includes("def numbers") &&
          code.includes("def squares") &&
          code.includes("def even_only") &&
          code.includes("yield") &&
          code.includes("% 2")
        );
      },
      successMessage:
        "This three-stage pipeline mirrors how UNIX pipes work: each generator is a filter/transform, they compose by passing one into the next, and no intermediate lists are created. The data flows lazily from source to sink.",
    },
    {
      instruction:
        "Write an `accumulator()` generator that uses `send()`. It should: start with a total of 0; each time a value is sent, add it to the total and yield the new running total. Prime it with `next()` first, then send values 5, 3, 7, 10 and print each running total.",
      hint: "def accumulator(): total = 0; while True: value = yield total; total += value. After creating gen = accumulator(), call next(gen) to prime it (advance to the first yield). Then gen.send(5) returns 5, gen.send(3) returns 8, etc.",
      starterCode: `def accumulator():
    """Receive values via send(), yield the running total."""
    total = 0
    while True:
        # TODO: yield total, receive next value via yield expression
        pass


gen = accumulator()
next(gen)  # prime: advance to first yield

# Send values and print running totals
for value in [5, 3, 7, 10]:
    running_total = gen.send(value)
    print(f"Sent {value}, running total: {running_total}")
# Expected:
# Sent 5, running total: 5
# Sent 3, running total: 8
# Sent 7, running total: 15
# Sent 10, running total: 25
`,
      validate: (code: string) => {
        return (
          code.includes("def accumulator") &&
          code.includes("yield") &&
          code.includes(".send(") &&
          code.includes("next(gen)")
        );
      },
      successMessage:
        "Generators with `send()` are bidirectional coroutines — they both produce and consume values. This pattern underlies Python's async/await system, where coroutines are generators that cooperate with an event loop.",
    },
  ],
};
