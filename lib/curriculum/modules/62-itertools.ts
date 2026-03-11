import type { LessonModule } from "../types";

export const itertoolsModule: LessonModule = {
  type: "lesson",
  id: "62",
  slug: "itertools",
  title: "chain, product, combinations, permutations, groupby",
  icon: "🔗",
  estimatedMinutes: 15,
  content: `# Python itertools

The \`itertools\` module provides memory-efficient building blocks for working with iterators. These functions produce results lazily — they generate values on demand rather than building entire lists in memory. This matters enormously when working with large datasets.

## Why Itertools?

Instead of building a list like \`[(x, y) for x in range(1000) for y in range(1000)]\` (1,000,000 tuples in memory), you can iterate over \`itertools.product(range(1000), range(1000))\` and produce one pair at a time.

## \`itertools.chain\`

Chains multiple iterables together into a single stream:

\`\`\`python
import itertools

# Concatenate multiple iterables without creating new lists
result = list(itertools.chain([1, 2], [3, 4], [5, 6]))
print(result)  # [1, 2, 3, 4, 5, 6]

# chain.from_iterable — flatten a nested structure
nested = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
flat = list(itertools.chain.from_iterable(nested))
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Useful for combining results from multiple sources
logs_jan = ["login at 9am", "logout at 5pm"]
logs_feb = ["login at 8am", "error at 10am"]
all_logs = itertools.chain(logs_jan, logs_feb)
for entry in all_logs:
    print(entry)
\`\`\`

## \`itertools.product\`

Cartesian product — every combination of elements from multiple iterables:

\`\`\`python
import itertools

# All pairs from two lists
suits = ["♠", "♥", "♦", "♣"]
ranks = ["A", "K", "Q", "J", "10"]
cards = list(itertools.product(ranks, suits))
print(len(cards))    # 20
print(cards[:4])     # [('A', '♠'), ('A', '♥'), ('A', '♦'), ('A', '♣')]

# repeat parameter — product with itself
dice = list(itertools.product(range(1, 7), repeat=2))
print(len(dice))     # 36 — all possible dice rolls
print(sum(a + b for a, b in dice) / len(dice))  # 7.0 — expected value

# Test configurations
environments = ["dev", "staging", "prod"]
db_sizes = ["small", "large"]
configs = list(itertools.product(environments, db_sizes))
print(configs)
# [('dev', 'small'), ('dev', 'large'), ('staging', 'small'), ...]
\`\`\`

## \`itertools.combinations\`

All combinations of r elements from an iterable (order doesn't matter, no repetition):

\`\`\`python
import itertools

players = ["Alice", "Bob", "Carol", "David"]

# All 2-player teams
teams = list(itertools.combinations(players, 2))
print(teams)
# [('Alice', 'Bob'), ('Alice', 'Carol'), ('Alice', 'David'),
#  ('Bob', 'Carol'), ('Bob', 'David'), ('Carol', 'David')]
print(len(teams))  # 6  — C(4,2) = 4!/(2!*2!) = 6

# For lottery: choose 6 from 49
import math
total_lottery_combos = math.comb(49, 6)
print(f"Lottery odds: 1 in {total_lottery_combos:,}")  # 1 in 13,983,816

# combinations_with_replacement — can repeat elements
flavors = ["vanilla", "chocolate", "strawberry"]
scoops = list(itertools.combinations_with_replacement(flavors, 2))
print(scoops)
# includes ('vanilla', 'vanilla'), ('chocolate', 'chocolate'), etc.
\`\`\`

## \`itertools.permutations\`

All orderings of r elements (order matters):

\`\`\`python
import itertools

# All 3-letter arrangements from A, B, C
perms = list(itertools.permutations("ABC", 3))
print(perms)
# [('A', 'B', 'C'), ('A', 'C', 'B'), ('B', 'A', 'C'), ...]
print(len(perms))  # 6 — P(3,3) = 3! = 6

# Anagram finder
word = "ACE"
anagrams = {"".join(p) for p in itertools.permutations(word)}
print(sorted(anagrams))  # ['ACE', 'AEC', 'CAE', 'CEA', 'EAC', 'ECA']

# Top 3 finishers in a race
runners = ["Alice", "Bob", "Carol", "David"]
podiums = list(itertools.permutations(runners, 3))
print(f"Possible podium orders: {len(podiums)}")  # 24
\`\`\`

## \`itertools.groupby\`

Groups consecutive elements by a key function. **Important**: the input must be sorted by the same key, or you'll get multiple groups for the same key value:

\`\`\`python
import itertools

# Group consecutive equal values
data = [1, 1, 2, 2, 2, 3, 1, 1]
for key, group in itertools.groupby(data):
    print(key, list(group))
# 1 [1, 1]
# 2 [2, 2, 2]
# 3 [3]
# 1 [1, 1]   <-- note: 1 appears again as a separate group

# For distinct groups, sort first
people = [
    {"name": "Alice", "dept": "Engineering"},
    {"name": "Bob", "dept": "Marketing"},
    {"name": "Carol", "dept": "Engineering"},
    {"name": "David", "dept": "Marketing"},
]

# Sort by key first!
sorted_people = sorted(people, key=lambda p: p["dept"])
for dept, members in itertools.groupby(sorted_people, key=lambda p: p["dept"]):
    names = [m["name"] for m in members]
    print(f"{dept}: {names}")
# Engineering: ['Alice', 'Carol']
# Marketing: ['Bob', 'David']
\`\`\`

## \`itertools.islice\`

Slices an iterator (like \`s[start:stop:step]\` but for any iterable):

\`\`\`python
import itertools

def infinite_counter(start=0):
    n = start
    while True:
        yield n
        n += 1

# Take only the first 5 values from an infinite generator
first_five = list(itertools.islice(infinite_counter(), 5))
print(first_five)  # [0, 1, 2, 3, 4]

# Skip first 10, take next 5
middle = list(itertools.islice(infinite_counter(), 10, 15))
print(middle)  # [10, 11, 12, 13, 14]

# Process a file in chunks without loading it all
def chunks(iterable, size):
    it = iter(iterable)
    while True:
        chunk = list(itertools.islice(it, size))
        if not chunk:
            break
        yield chunk

for chunk in chunks(range(10), 3):
    print(chunk)
# [0, 1, 2]
# [3, 4, 5]
# [6, 7, 8]
# [9]
\`\`\`

## \`itertools.cycle\`

Cycles through an iterable indefinitely:

\`\`\`python
import itertools

# Assign tasks in round-robin
workers = ["Alice", "Bob", "Carol"]
tasks = ["task_1", "task_2", "task_3", "task_4", "task_5", "task_6", "task_7"]

assignments = list(zip(tasks, itertools.cycle(workers)))
for task, worker in assignments:
    print(f"{task} -> {worker}")
# task_1 -> Alice
# task_2 -> Bob
# task_3 -> Carol
# task_4 -> Alice  (cycles back)
# ...
\`\`\`

## \`itertools.accumulate\`

Produces running totals (or any running aggregate):

\`\`\`python
import itertools
import operator

prices = [10, 5, 20, 15, 8]

# Running sum (default)
running_total = list(itertools.accumulate(prices))
print(running_total)  # [10, 15, 35, 50, 58]

# Running maximum
running_max = list(itertools.accumulate(prices, max))
print(running_max)  # [10, 10, 20, 20, 20]

# Compound interest (running product)
rates = [1.05, 1.05, 1.05, 1.05, 1.05]  # 5% per year
growth = list(itertools.accumulate(rates, operator.mul, initial=1000))
print([round(v, 2) for v in growth])
# [1000, 1050.0, 1102.5, 1157.63, 1215.51, 1276.28]
\`\`\`

## \`itertools.takewhile\` and \`itertools.dropwhile\`

Stop or skip elements based on a predicate:

\`\`\`python
import itertools

data = [2, 4, 6, 8, 3, 10, 12]  # even numbers, then an odd one

# takewhile — yield while condition is true, stop at first failure
evens_only = list(itertools.takewhile(lambda x: x % 2 == 0, data))
print(evens_only)  # [2, 4, 6, 8]  — stops at 3

# dropwhile — skip while condition is true, yield rest
after_odd = list(itertools.dropwhile(lambda x: x % 2 == 0, data))
print(after_odd)  # [3, 10, 12]  — starts at first odd number
\`\`\`

## Combining Itertools: A Data Pipeline

\`\`\`python
import itertools

# Find all unique pairs of numbers from two ranges
# where their product is > 10 and both are odd
evens = range(1, 6, 2)   # [1, 3, 5]
odds = range(2, 8, 2)    # [2, 4, 6]

result = [
    (a, b, a * b)
    for a, b in itertools.product(evens, odds)
    if a * b > 10
]
print(result)
# [(3, 4, 12), (3, 6, 18), (5, 4, 20), (5, 6, 30)]
\`\`\`
`,
  quiz: [
    {
      question: "What is the key requirement for `itertools.groupby` to produce correct groups?",
      options: [
        "The iterable must contain only hashable elements",
        "The iterable must be sorted by the same key used for grouping, otherwise the same key may appear in multiple separate groups",
        "You must pass a list; generators are not supported",
        "Each group must contain at least 2 elements",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the difference between `itertools.combinations(['a','b','c'], 2)` and `itertools.permutations(['a','b','c'], 2)`?",
      options: [
        "combinations includes ('a','a') while permutations does not",
        "combinations returns tuples and permutations returns lists",
        "combinations treats order as irrelevant so ('a','b') and ('b','a') are the same; permutations treats them as different",
        "There is no difference — they produce identical output",
      ],
      correctIndex: 2,
    },
    {
      question: "Why is `itertools.islice(my_generator, 5)` preferred over converting the generator to a list and slicing?",
      options: [
        "islice produces a list while the slice syntax produces a generator",
        "islice only consumes 5 elements from the generator without materializing all elements, which is essential for infinite generators",
        "The slice syntax [:5] does not work on generators in Python 3",
        "islice is faster because it uses C-level array indexing",
      ],
      correctIndex: 1,
    },
  ],
};
