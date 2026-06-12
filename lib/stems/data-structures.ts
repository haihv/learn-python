import type { Stem } from "./types";

export const dataStructuresStem: Stem = {
  id: "S2",
  slug: "stem-data-structures",
  domainId: "data-structures",
  title: "Built-in Data Structures",
  icon: "📦",
  oneLiner: "Choose a container by how you'll access it, not by what it holds.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the four workhorses",
      lead: "Lock in the containers and the one property that decides between them: cost.",
      terms: [
        { term: "list", reveal: "Ordered, mutable, indexed by position. append is amortized O(1); `x in lst` is O(n)." },
        { term: "dict", reveal: "Hash map of key→value. Average O(1) get/set/in. Keys must be hashable. Preserves insertion order (3.7+)." },
        { term: "set", reveal: "Unordered collection of unique hashable items. O(1) membership and dedup; no indexing." },
        { term: "tuple", reveal: "Immutable ordered sequence. Hashable if its items are — so it can be a dict key or set member." },
        { term: "hashable", reveal: "Has a stable hash() and __eq__. Required for set members and dict keys; immutable built-ins qualify." },
        { term: "amortized O(1)", reveal: "Most appends are O(1); the occasional resize is O(n), but averaged over many appends it's constant." },
        { term: "Big-O", reveal: "How cost grows with size n. The number you reason about before reaching for a structure." },
        { term: "contiguous memory", reveal: "A list stores references in one block, so indexing is O(1) but inserting at the front shifts everything: O(n)." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Watch the structure change with the operation",
      lead: "Tap each step of a dedup-and-count task to see why the right container shifts.",
      stages: [
        { label: "x in big_list", why: "A list scans every element: O(n). Doing it for m items is O(n·m) — quadratic and slow at scale." },
        { label: "seen = set(); x in seen", why: "Building the set is O(n) once; each membership test is then O(1) average. Lookups stop scaling with size." },
        { label: "need counts, not presence", why: "A set only knows 'is it here'. To count occurrences, switch to a dict (or Counter) mapping item→count." },
        { label: "need them ranked", why: "dicts keep insertion order, not sorted order. Counter.most_common() (or sorted with a key) gives frequency rank." },
      ],
      takeaway: "Match the structure to the operation you repeat most: lookup→set/dict, order→list, fixed record→tuple.",
    },
    {
      level: 3,
      verb: "use",
      title: "Reach for the right container",
      lead: "A checklist for the decisions you make every time you hold a collection.",
      checklist: [
        "Repeated membership tests? Convert the list to a set once, then test against the set.",
        "Counting things? Use collections.Counter instead of a hand-rolled dict with .get().",
        "Need a default value per key? collections.defaultdict(list) avoids the setdefault dance.",
        "Fixed-size heterogeneous record? Prefer a tuple or NamedTuple over a list.",
        "Never mutate a list while iterating it — build a new list or iterate over a copy.",
      ],
      codePeek: `from collections import Counter

words = "the cat the dog the cat".split()
counts = Counter(words)        # {'the': 3, 'cat': 2, 'dog': 1}
print(counts.most_common(1))   # [('the', 3)]`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Weigh access speed against memory",
      lead: "Every gain has a bill. Slide from list to dict/set; then settle the toggle.",
      slider: {
        leftLabel: "list",
        rightLabel: "dict / set",
        stops: [
          { at: 0, note: "list: O(1) indexing, but O(n) membership and remove-by-value. Best when you need order and positional access." },
          { at: 50, note: "Both cost memory. A dict/set carries hash-table overhead (more bytes per item) to buy O(1) lookup." },
          { at: 100, note: "dict/set: O(1) average membership and dedup, but no positional indexing and a higher constant-factor memory cost." },
        ],
      },
      toggle: {
        question: "You must look up records by ID thousands of times. Store them as…",
        optionA: "a list of (id, record) pairs",
        optionB: "a dict {id: record}",
        answer: "B",
        why: "List lookup is O(n) per query → O(n·q) total. A dict is O(1) average per query → O(q). For thousands of lookups the dict wins decisively.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Bust the 'it's all the same' myth",
      lead: "One claim is the tempting wrong answer. Spot it.",
      prompt: "Which statement about Python containers is correct?",
      options: [
        {
          text: "Checking `x in my_list` is about as fast as `x in my_set`.",
          correct: false,
          reveal: "✗ The tempting one — they read identically, but list membership is O(n) (linear scan) while set membership is O(1) average (hash lookup). At scale they diverge sharply.",
        },
        {
          text: "A set stores unique hashable items and gives O(1) average membership.",
          correct: true,
          reveal: "✓ Sets dedup for free and test membership in average constant time via a hash table.",
        },
        {
          text: "Tuples index faster than lists because they're immutable.",
          correct: false,
          reveal: "✗ Indexing is O(1) for both. Immutability buys hashability and safety, not faster indexing.",
        },
        {
          text: "Any object can be a dict key.",
          correct: false,
          reveal: "✗ Only hashable objects (stable hash + eq). A list or dict can't be a key; a tuple of immutables can.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a structure-aware pipeline",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "input", label: "Input", options: ["a log file", "an API response list", "a CSV of events"] },
        { id: "op", label: "Core operation", options: ["count by category", "dedup then look up", "top-N by frequency"] },
        { id: "justify", label: "Justified by", options: ["a Big-O note per step", "a timing benchmark", "a memory comparison"] },
      ],
      specTemplate: "A pipeline over {input} that does {op}, justified by {justify}.",
      buildCard: {
        title: "Frequency-count pipeline",
        deliverable:
          "A small pipeline that ingests records and picks the right structure at each stage — a set for dedup/membership, Counter/dict for tallies, a list only where order matters — with each choice justified by Big-O.",
        acceptance: [
          "Membership/dedup steps use a set, not repeated list scans.",
          "Tallies use collections.Counter or a dict, not manual counting bugs.",
          "A one-line Big-O note accompanies each structural choice.",
          "Top-N results come from Counter.most_common or sorted with a key.",
        ],
      },
    },
  ],
};
