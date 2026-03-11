import type { WorkshopModule } from "../types";

export const sortingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "90",
  slug: "sorting-workshop",
  title: "Custom Sort Keys & Priority Queues",
  icon: "🔢",
  estimatedMinutes: 20,
  description: "Master sorting and priority queue patterns in Python",
  steps: [
    {
      instruction:
        "Sort a list of dictionaries first by age (ascending), then re-sort the same list by name (ascending). Print the result of each sort on its own line using a list comprehension to show just the names.",
      hint: "Use `sorted(people, key=lambda p: p['age'])` for the first sort and `sorted(people, key=lambda p: p['name'])` for the second. Python's sort is stable, so equal elements preserve their previous order.",
      starterCode: `people = [
    {"name": "Charlie", "age": 30},
    {"name": "Alice",   "age": 25},
    {"name": "Bob",     "age": 30},
    {"name": "Diana",   "age": 22},
    {"name": "Eve",     "age": 25},
]

# Sort by age ascending and print names
by_age = sorted(people, key=lambda p: p["age"])
print("By age:", [p["name"] for p in by_age])

# Sort by name ascending and print names
# by_name = ...
# print("By name:", ...)
`,
      validate: (code: string) =>
        code.includes("sorted") &&
        code.includes('key=') &&
        code.includes('"age"') &&
        code.includes('"name"'),
      successMessage:
        "The key= parameter is the heart of Python sorting. Every call to key= is made exactly once per element — efficient even for expensive computations.",
    },
    {
      instruction:
        "Sort a list of employee dicts by department (ascending) and then by salary (descending) within each department. Return a tuple from the key function: `(dept, -salary)`. Print each employee's name, department, and salary.",
      hint: "Negate the salary inside the tuple: `key=lambda e: (e['dept'], -e['salary'])`. The minus sign flips the numeric order without reversing the whole sort.",
      starterCode: `employees = [
    {"name": "Alice",  "dept": "Eng", "salary": 120_000},
    {"name": "Bob",    "dept": "HR",  "salary":  80_000},
    {"name": "Carol",  "dept": "Eng", "salary":  95_000},
    {"name": "Dave",   "dept": "HR",  "salary":  85_000},
    {"name": "Eve",    "dept": "Eng", "salary": 110_000},
    {"name": "Frank",  "dept": "Ops", "salary":  90_000},
]

# Sort by dept ascending, then salary descending within each dept
# result = sorted(employees, key=lambda e: ...)

# Print: name  dept  salary
# for e in result:
#     print(f"{e['name']:<8} {e['dept']:<4} \${e['salary']:,}")
`,
      validate: (code: string) =>
        code.includes("sorted") &&
        code.includes("dept") &&
        code.includes("salary") &&
        code.includes("-"),
      successMessage:
        "Negating a numeric key is the idiomatic way to mix ascending and descending levels in a single sort call. Remember this pattern — you'll use it often with data analysis.",
    },
    {
      instruction:
        "Use `operator.itemgetter` instead of a lambda to sort a list of tuples. Sort `records` (list of (name, score, level) tuples) first by score descending, then by level ascending using `itemgetter`. Compare the result to the lambda equivalent.",
      hint: "Import `from operator import itemgetter`. `itemgetter(1)` is equivalent to `lambda x: x[1]` but faster. To sort by score descending, you still need `reverse=True` or negate — `itemgetter` doesn't support negation directly, so use a lambda that wraps it: `key=lambda r: (-r[1], r[2])`.",
      starterCode: `from operator import itemgetter

records = [
    ("Alice",  88, 3),
    ("Bob",    95, 1),
    ("Carol",  88, 2),
    ("Dave",   72, 4),
    ("Eve",    95, 2),
]

# Sort by score descending, then level ascending
# Try itemgetter first for a single key, then use a lambda for the combined key

# 1. Sort by score only using itemgetter (ascending first to understand it)
by_score_asc = sorted(records, key=itemgetter(1))
print("By score asc:", [r[0] for r in by_score_asc])

# 2. Sort by (score DESC, level ASC) — use a lambda with negation
# result = sorted(records, key=lambda r: ...)
# for r in result:
#     print(f"{r[0]:<8} score={r[1]}  level={r[2]}")
`,
      validate: (code: string) =>
        code.includes("itemgetter") &&
        code.includes("sorted"),
      successMessage:
        "operator.itemgetter is a C-level function object — it avoids the overhead of calling a Python lambda on every element, which matters for large datasets.",
    },
    {
      instruction:
        "Use `bisect.insort` to maintain a sorted leaderboard. Start with an empty list and insert scores one by one. After each insertion, print the list. Then use `bisect.bisect_left` to find the rank of a given score (0-based index from the end).",
      hint: "Import `import bisect`. `bisect.insort(lst, value)` keeps the list sorted after each insert — O(log n) to find the position, O(n) for the actual list shift. `bisect.bisect_left(lst, score)` gives the number of elements *smaller* than score, which is the 0-based rank from the bottom.",
      starterCode: `import bisect

leaderboard = []

incoming_scores = [55, 90, 70, 55, 85, 100, 40, 70]

# Insert each score into leaderboard using bisect.insort
# Print the leaderboard after each insertion
for score in incoming_scores:
    bisect.insort(leaderboard, score)
    print(leaderboard)

# Find the rank (1-based, from the top) of score 70
# Hint: rank from bottom = bisect_left(leaderboard, 70)
# rank from top = len(leaderboard) - rank_from_bottom
target = 70
# rank = ...
# print(f"Score {target} is rank {rank} from the top")
`,
      validate: (code: string) =>
        code.includes("bisect.insort") || code.includes("insort("),
      successMessage:
        "bisect.insort is perfect for leaderboards, event timelines, and any scenario where you need a list that stays sorted as items arrive. The search is O(log n) — insertion shifts elements, so the bottleneck is the list shift, not the search.",
    },
    {
      instruction:
        "Implement a task scheduler using `heapq`. Push tasks as `(priority, task_name)` tuples (lower number = higher priority). Pop tasks in priority order and print them. Then add a tie-breaking mechanism using a counter so tasks with the same priority are processed in FIFO order.",
      hint: "Use `heapq.heappush(queue, (priority, task))` and `heapq.heappop(queue)`. For tie-breaking, use a 3-tuple: `(priority, counter, task)` where counter increments with each push — this ensures stable ordering among equal-priority tasks.",
      starterCode: `import heapq

# Basic priority queue
task_queue = []

tasks = [
    (3, "Write docs"),
    (1, "Fix prod outage"),
    (2, "Code review"),
    (1, "Rollback bad deploy"),
    (2, "Merge PR #42"),
    (3, "Update dependencies"),
]

# Push all tasks into the heap
for priority, name in tasks:
    heapq.heappush(task_queue, (priority, name))

print("Processing order (basic):")
while task_queue:
    priority, name = heapq.heappop(task_queue)
    print(f"  [{priority}] {name}")

# Now implement tie-breaking with a counter
# so equal-priority tasks are FIFO
print("\\nProcessing order (with FIFO tie-breaking):")
task_queue2 = []
counter = 0
for priority, name in tasks:
    # Push (priority, counter, name) — counter ensures stable ordering
    # counter += 1
    pass
`,
      validate: (code: string) =>
        code.includes("heapq.heappush") &&
        code.includes("heapq.heappop"),
      successMessage:
        "The (priority, counter, item) pattern is the standard recipe for a stable priority queue in Python. It appears in the official heapq docs. The counter acts as a tiebreaker without requiring the items themselves to be comparable.",
    },
  ],
};
