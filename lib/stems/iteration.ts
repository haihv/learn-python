import type { Stem } from "./types";

export const iterationStem: Stem = {
  id: "S5",
  slug: "stem-iteration",
  domainId: "iteration",
  title: "Iteration & Laziness",
  icon: "🌀",
  oneLiner: "Lazy beats eager — iterators produce values one at a time, so size stops mattering.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the iteration protocol",
      lead: "The handful of words that explain every for-loop and generator.",
      terms: [
        { term: "iterable", reveal: "Anything you can loop over — provides __iter__ returning an iterator. Lists, dicts, files, strings." },
        { term: "iterator", reveal: "The object that produces values one at a time via __next__, and returns itself from __iter__." },
        { term: "__iter__", reveal: "Returns an iterator. A for-loop calls it once at the start to get something to pull from." },
        { term: "__next__", reveal: "Returns the next value, or raises StopIteration when exhausted. The engine of every loop." },
        { term: "generator", reveal: "A function containing `yield` — calling it returns a lazy iterator that resumes where it left off." },
        { term: "yield", reveal: "Suspends a generator, handing back a value and freezing its state until the next __next__." },
        { term: "lazy evaluation", reveal: "Computing values only when requested, so you never materialize the whole sequence in memory." },
        { term: "StopIteration", reveal: "The signal that an iterator is exhausted; for-loops catch it to end the loop." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a lazy pipeline over a huge file",
      lead: "Tap each step to see when work actually happens (spoiler: as late as possible).",
      stages: [
        { label: "lines = (l for l in open('big.log'))", why: "A generator expression. It opens the file but reads nothing yet — fully lazy." },
        { label: "errors = (l for l in lines if 'ERROR' in l)", why: "Chains another lazy generator. Still zero lines read; it's just a recipe." },
        { label: "first10 = islice(errors, 10)", why: "Asks for only the first 10 matches. Work can now begin, but it's bounded." },
        { label: "for e in first10: print(e)", why: "Iterating pulls lines one at a time through the whole chain. Memory stays flat regardless of file size." },
      ],
      takeaway: "Chaining generators builds a pipeline that processes one item at a time — constant memory, any size.",
    },
    {
      level: 3,
      verb: "use",
      title: "Default to lazy",
      lead: "A checklist for trading memory and eagerness away when you don't need them.",
      checklist: [
        "Building a list just to loop once? Use a generator expression (parens, not brackets) and skip the allocation.",
        "Need only the first few results? itertools.islice — don't compute the rest.",
        "Returning a sequence you consume once? Make the function a generator with yield.",
        "Remember: an iterator is single-use. Once exhausted (or partly consumed), it won't restart.",
        "Compose lazily with itertools (chain, takewhile, groupby) instead of building intermediate lists.",
      ],
      codePeek: `import itertools

def read_batches(f, n=1000):
    while batch := list(itertools.islice(f, n)):
        yield batch          # one chunk at a time, constant memory

with open('big.log') as f:
    for batch in read_batches(f):
        process(batch)`,
    },
    {
      level: 4,
      verb: "compare",
      title: "List or generator?",
      lead: "Both iterate. Slide to see what you trade; then settle the toggle.",
      slider: {
        leftLabel: "List (eager)",
        rightLabel: "Generator (lazy)",
        stops: [
          { at: 0, note: "List: all values in memory at once. Re-iterable, indexable, len() works — but O(n) memory and you pay upfront." },
          { at: 50, note: "Both iterate. A list trades memory for random access and reuse; a generator trades reuse for flat memory." },
          { at: 100, note: "Generator: one value at a time, O(1) memory, can even model infinite streams — but single-use, no len(), no indexing." },
        ],
      },
      toggle: {
        question: "You'll loop over the results twice and need len(). Use…",
        optionA: "a generator",
        optionB: "a list",
        answer: "B",
        why: "A generator is single-use and has no len(); iterating it twice yields nothing the second time. When you need reuse, indexing, or length, materialize a list.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Spot the exhaustion flaw",
      lead: "Read the snippet and judge the output. The obvious answer is the wrong one.",
      prompt: "What prints? g = (x*x for x in range(3)); print(list(g)); print(list(g))",
      options: [
        {
          text: "[0, 1, 4] then [0, 1, 4]",
          correct: false,
          reveal: "✗ The natural guess. A generator is exhausted after the first full iteration — the second list(g) sees nothing left.",
        },
        {
          text: "[0, 1, 4] then []",
          correct: true,
          reveal: "✓ Generators are single-use. The first list(g) consumes it; the second finds it exhausted and returns [].",
        },
        {
          text: "Raises StopIteration on the second call",
          correct: false,
          reveal: "✗ list() catches StopIteration internally; it simply returns an empty list — no error surfaces.",
        },
        {
          text: "[] then [0, 1, 4]",
          correct: false,
          reveal: "✗ Order isn't reversed; the first consumption gets the values.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a streaming processor",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "source", label: "Stream", options: ["a multi-GB log file", "a paginated API", "a sensor feed"] },
        { id: "transform", label: "Transform", options: ["filter then map", "batch into chunks", "running aggregate"] },
        { id: "bound", label: "Bounded by", options: ["islice(n)", "takewhile(pred)", "a time budget"] },
      ],
      specTemplate: "A lazy pipeline over {source} that does {transform}, bounded by {bound}.",
      buildCard: {
        title: "Streaming processor",
        deliverable:
          "A generator pipeline that processes a data source larger than memory in constant space — chaining lazy filter/map/batch steps and bounding the work, never materializing the whole input.",
        acceptance: [
          "Input is consumed lazily (generators / itertools), not read into one big list.",
          "Memory stays flat as input size grows (verify on a large input).",
          "Each stage is a generator or generator expression composed into a pipeline.",
          "Work is bounded (islice/takewhile) rather than always draining the source.",
        ],
      },
    },
  ],
};
