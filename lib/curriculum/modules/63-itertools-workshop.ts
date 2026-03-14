import type { WorkshopModule } from "../types";

export const itertoolsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "63",
  slug: "itertools-workshop",
  title: "Combining Itertools for Data Pipelines",
  icon: "⚙️",
  estimatedMinutes: 20,
  description: "Build efficient data pipelines using itertools",
  steps: [
    {
      instruction:
        "Use `itertools.chain` and `itertools.islice` to flatten and sample from multiple data sources. Combine three lists of numbers using `chain.from_iterable`, then use `islice` to take only the first 8 elements from the combined stream. Also use `accumulate` to compute the running sum.",
      hint: "Use `itertools.chain.from_iterable([list1, list2, list3])` to flatten. Use `itertools.islice(iterator, n)` to limit. `itertools.accumulate(iterable)` yields running totals.",
      starterCode: `import itertools

batch_a = [10, 20, 30, 40]
batch_b = [50, 60, 70, 80]
batch_c = [90, 100, 110, 120]

# TODO: flatten all three batches into a single lazy stream using chain
all_data = None  # replace with the appropriate itertools call

# TODO: take only the first 8 elements from all_data using islice
first_eight = []  # replace with list(...)
print("First 8:", first_eight)

# TODO: compute the running sum of first_eight using accumulate
running_sum = []  # replace with list(...)
print("Running sum:", running_sum)

# TODO: compute the running max of first_eight — pass max as the second arg to accumulate
running_max = []  # replace with list(...)
print("Running max:", running_max)

# Combine chain and islice in a pipeline
stream = itertools.chain.from_iterable([batch_a, batch_b, batch_c])
every_other = list(itertools.islice(stream, 0, 12, 2))  # step=2
print("Every other:", every_other)
`,
      validate: (code) =>
        code.includes("itertools.chain") &&
        code.includes("islice") &&
        code.includes("accumulate"),
      successMessage:
        "Excellent! chain.from_iterable flattens nested iterables and islice slices any iterator without loading it into memory. These are the fundamental plumbing tools of itertools pipelines.",
    },
    {
      instruction:
        "Use `itertools.product` to generate test cases. Create a test matrix for a function that takes a `size` ('small', 'medium', 'large') and `format` ('json', 'csv', 'xml'). Then use `itertools.combinations` to find all unique pairs of test cases to compare against each other.",
      hint: "Use `itertools.product(sizes, formats)` for the matrix. Then use `itertools.combinations(test_cases, 2)` for pairs. Remember combinations don't repeat and order doesn't matter.",
      starterCode: `import itertools

sizes = ["small", "medium", "large"]
formats = ["json", "csv", "xml"]
priorities = ["high", "low"]

# TODO: generate the cartesian product of sizes x formats (hint: itertools has a function for this)
test_matrix = []  # replace with the full list
print(f"Test matrix ({len(test_matrix)} cases):")
for size, fmt in test_matrix:
    print(f"  size={size}, format={fmt}")

print()

# TODO: find all unique 2-element pairings of test_matrix entries (no repeated or reversed pairs)
pairs = []  # replace with the full list
print(f"Pairwise comparisons: {len(pairs)}")
print("First 3 pairs:")
for pair in pairs[:3]:
    print(f"  {pair[0]} vs {pair[1]}")

print()

# TODO: generate the cartesian product of all three lists (sizes x formats x priorities)
full_matrix = []  # replace with the full list
print(f"Full matrix size: {len(full_matrix)}")  # 3 * 3 * 2 = 18
`,
      validate: (code) =>
        code.includes("itertools.product") &&
        code.includes("itertools.combinations"),
      successMessage:
        "Great! Product generates all test configurations automatically — no nested loops needed. Combinations finds all unique pairs for cross-compatibility testing. These are standard tools in testing and experimentation.",
    },
    {
      instruction:
        "Use `itertools.groupby` to analyze sales data. Sort a list of sales records by category, then group them. For each category, calculate the total revenue and average sale amount. Use a proper sort before groupby.",
      hint: "Sort with `sorted(records, key=lambda r: r['category'])` BEFORE calling groupby with the same key. `list(group)` consumes the group iterator — do this before moving to the next group.",
      starterCode: `import itertools

sales = [
    {"category": "Electronics", "product": "Laptop", "amount": 999.99},
    {"category": "Books", "product": "Python Cookbook", "amount": 45.00},
    {"category": "Electronics", "product": "Mouse", "amount": 29.99},
    {"category": "Clothing", "product": "T-Shirt", "amount": 19.99},
    {"category": "Books", "product": "Design Patterns", "amount": 52.00},
    {"category": "Electronics", "product": "Keyboard", "amount": 79.99},
    {"category": "Clothing", "product": "Hoodie", "amount": 59.99},
    {"category": "Books", "product": "Clean Code", "amount": 38.00},
    {"category": "Clothing", "product": "Jeans", "amount": 89.99},
]

# TODO: step 1 — sort sales by "category" before grouping (groupby needs sorted input)
sorted_sales = sales  # replace with the built-in sort call

print("Sales by Category:")
print("-" * 50)

# TODO: step 2 — call itertools.groupby on sorted_sales keyed by category
# Inside the loop, immediately convert the group iterator to a list, then compute total and avg
# Replace the stub below with your groupby loop
pass
`,
      validate: (code) =>
        code.includes("itertools.groupby") &&
        code.includes("sorted") &&
        code.includes("list(group)"),
      successMessage:
        "Perfect! The sorted-then-groupby pattern is fundamental. Always consume the group with list() before the next iteration, because groupby shares the underlying iterator — reading the next group invalidates the previous one.",
    },
    {
      instruction:
        "Build a round-robin scheduler using `itertools.cycle` combined with `itertools.islice`. Create a list of worker names, cycle through them to assign tasks, then use `takewhile` to process items from a data stream until a stop condition is met.",
      hint: "Use `itertools.cycle(workers)` for endless rotation. Pair it with `zip(tasks, itertools.cycle(workers))` to assign. Use `itertools.takewhile(predicate, iterable)` to stop when the condition fails.",
      starterCode: `import itertools

workers = ["Alice", "Bob", "Carol", "David"]
tasks = [f"task_{i:02d}" for i in range(1, 15)]

# TODO: pair each task with a worker by cycling through the workers list endlessly
print("Task Assignments (round-robin):")
assignments = []  # replace with the correct list
for task, worker in assignments:
    print(f"  {task} -> {worker}")

print()

# Process a stream until we hit a sentinel value (-1 means stop)
measurements = [15, 22, 18, 25, 30, 42, 38, -1, 12, 8]

# TODO: collect values from measurements while they are >= 0 (stop at the sentinel)
valid = []  # replace with the correct list
print(f"Valid measurements: {valid}")
print(f"Count: {len(valid)}, Average: {sum(valid)/len(valid):.1f}")

print()

# Skip low readings at the start (warm-up period)
readings = [2, 3, 1, 4, 15, 22, 18, 5, 3]
# TODO: skip values < 10 from the start, then keep the rest
significant = []  # replace with the correct list
print(f"After warm-up: {significant}")
`,
      validate: (code) =>
        code.includes("itertools.cycle") &&
        (code.includes("takewhile") || code.includes("dropwhile")),
      successMessage:
        "Well done! cycle is perfect for round-robin distribution, and takewhile/dropwhile give you predicate-based stream slicing. These patterns appear in task schedulers, stream processors, and data validation pipelines.",
    },
    {
      instruction:
        "Build a complete data analysis pipeline using multiple itertools functions together. Given a list of student scores: flatten nested grade lists, filter out failing grades using `takewhile` after sorting, find all passing grade pairs using `combinations`, and compute a running average using `accumulate`.",
      hint: "Chain the operations: `chain.from_iterable` to flatten, `sorted` then `dropwhile` to skip failing grades, `combinations` for pairs, `accumulate` with a running average formula.",
      starterCode: `import itertools

# Nested grade data from multiple classes
class_grades = [
    [85, 92, 78, 95, 62],
    [73, 88, 91, 55, 79],
    [96, 84, 67, 90, 83],
]

# Step 1: Flatten all grades into a single list
all_grades = []  # TODO: flatten class_grades using the appropriate itertools function
print(f"All grades: {sorted(all_grades)}")

# Step 2: Get passing grades (>= 70) — sort first, then skip the failing ones
sorted_grades = sorted(all_grades)
passing = []  # TODO: skip grades < 70 from the front of sorted_grades using itertools
print(f"Passing grades ({len(passing)}): {passing}")

# Step 3: Find all unique 2-element pairings of A-grade scores (>= 90)
a_grades = [g for g in all_grades if g >= 90]
a_pairs = []  # TODO: generate all unique pairs from a_grades using itertools
print(f"A-grade pairs: {a_pairs}")

# Step 4: Running totals of passing grades
running_totals = []  # TODO: produce a running sum of passing using itertools
running_avgs = [total / (i + 1) for i, total in enumerate(running_totals)]
print("Running averages:", [round(a, 1) for a in running_avgs])

# Step 5: All (period, band) report slot combinations
bands = ["A (90-100)", "B (80-89)", "C (70-79)"]
periods = ["Q1", "Q2", "Q3", "Q4"]
report_slots = []  # TODO: generate all (period, band) pairs using itertools
print(f"\\nReport slots: {len(report_slots)}")
for slot in report_slots[:6]:
    print(f"  {slot[0]} - {slot[1]}")
`,
      validate: (code) =>
        code.includes("chain.from_iterable") &&
        code.includes("combinations") &&
        code.includes("accumulate") &&
        (code.includes("dropwhile") || code.includes("takewhile") || code.includes("product")),
      successMessage:
        "Outstanding! You've combined multiple itertools functions into a data pipeline. This compositional approach — chaining lazy iterators — is how Python handles large-scale data processing efficiently without loading everything into memory.",
    },
  ],
};
