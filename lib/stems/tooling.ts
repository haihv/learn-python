import type { Stem } from "./types";

export const toolingStem: Stem = {
  id: "S8",
  slug: "stem-tooling",
  domainId: "tooling",
  title: "Testing & Tooling",
  icon: "🔧",
  oneLiner: "Tests, types, and profiles keep code honest — and tell you where you're allowed to optimize.",
  estimatedMinutes: 30,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the tooling vocabulary",
      lead: "The words behind code you can trust and change without fear.",
      terms: [
        { term: "pytest", reveal: "The de-facto test runner: plain `assert`, rich failure output, fixtures, and parametrization with little boilerplate." },
        { term: "fixture", reveal: "Reusable setup/teardown handed to tests via arguments — a temp dir, a DB connection, sample data." },
        { term: "parametrize", reveal: "Run one test function across many input/expected pairs with @pytest.mark.parametrize." },
        { term: "assert", reveal: "pytest rewrites assert so `assert x == y` reports both values on failure — no assertEqual zoo needed." },
        { term: "type hint", reveal: "An annotation (x: int, -> str) documenting intent and letting tools catch type errors before runtime." },
        { term: "mypy", reveal: "A static type checker that reads your hints and flags mismatches without running the code." },
        { term: "profiling", reveal: "Measuring where time/memory actually goes (cProfile, timeit) instead of guessing." },
        { term: "premature optimization", reveal: "Tuning before measuring — usually optimizing the wrong thing. Profile first." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a bug to a fix you trust",
      lead: "Tap each step from a bug report to a change you can prove is correct.",
      stages: [
        { label: "write a failing test", why: "Captures the exact input and expected output. Red proves the bug exists and that you understand it." },
        { label: "fix until it goes green", why: "Now you have evidence the fix works for that case — not just a hopeful edit." },
        { label: "add parametrized edge cases", why: "Empty input, negatives, boundaries. Cheap to add, and they guard against regressions forever." },
        { label: "run mypy + suite in CI", why: "Types catch a class of errors tests don't; CI makes 'works on my machine' irrelevant." },
      ],
      takeaway: "A failing test first turns 'I think it's fixed' into 'here's proof it's fixed and stays fixed.'",
    },
    {
      level: 3,
      verb: "use",
      title: "Keep code honest",
      lead: "A checklist for tests, types, and measured optimization.",
      checklist: [
        "Reproduce a bug with a failing test before fixing it — red, then green.",
        "Use @pytest.mark.parametrize for tables of cases instead of copy-pasted test functions.",
        "Add type hints to public signatures; run mypy (or pyright) in CI.",
        "Profile with cProfile/timeit before optimizing; let the data pick the hot spot.",
        "Optimize only the measured bottleneck, then re-measure to confirm the win.",
      ],
      codePeek: `import pytest

@pytest.mark.parametrize('n,expected', [(0, 1), (1, 1), (5, 120)])
def test_factorial(n, expected):
    assert factorial(n) == expected`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Readable or optimized?",
      lead: "Both have a place. Slide to see the cost; then settle the toggle.",
      slider: {
        leftLabel: "Readable code",
        rightLabel: "Optimized code",
        stops: [
          { at: 0, note: "Readable: clear, simple, obviously correct. The right default — most code isn't hot, and clarity is cheaper to maintain." },
          { at: 50, note: "They can coexist, but optimization often trades clarity for speed. Spend that only on code the profiler flagged." },
          { at: 100, note: "Optimized: faster, but usually denser and harder to change. Justify it with a before/after number on a real bottleneck." },
        ],
      },
      toggle: {
        question: "A function feels slow. Your first move is to…",
        optionA: "rewrite the loop in a clever, vectorized way",
        optionB: "profile it to find where the time actually goes",
        answer: "B",
        why: "Intuition about hot spots is usually wrong. Profiling shows the real bottleneck — often it's elsewhere, and you'd have optimized code that didn't matter.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Bust the 'types replace tests' myth",
      lead: "One claim conflates two different safety nets. Spot it.",
      prompt: "Which statement about testing and typing in Python is correct?",
      options: [
        {
          text: "If mypy passes, you don't really need runtime tests.",
          correct: false,
          reveal: "✗ Tempting, but types check shape, not behavior — mypy can't tell you your factorial returns the wrong number. Types and tests catch different bugs.",
        },
        {
          text: "pytest lets you use plain `assert` and still get detailed failure output.",
          correct: true,
          reveal: "✓ pytest rewrites assert statements to report the operands, so `assert a == b` shows both values — no assertEqual needed.",
        },
        {
          text: "Type hints change runtime behavior and slow code down.",
          correct: false,
          reveal: "✗ Hints are essentially ignored at runtime (barring tools that introspect them); they're for humans and static checkers.",
        },
        {
          text: "You should optimize first, then profile to confirm.",
          correct: false,
          reveal: "✗ Backwards — profile first so you optimize the actual bottleneck, not a guess.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build an honest module",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "module", label: "Subject", options: ["a parser", "a small data pipeline", "a pricing function"] },
        { id: "depth", label: "Tests", options: ["parametrized happy + edge cases", "property-based tests", "golden-file tests"] },
        { id: "perf", label: "Then", options: ["profile and optimize one hot spot", "add type hints + mypy", "both"] },
      ],
      specTemplate: "A tested, typed {module} with {depth}, then {perf}.",
      buildCard: {
        title: "Honest module",
        deliverable:
          "A small module that is fully type-hinted and tested with pytest (happy path + edge cases via parametrize), with a profiling report that justifies exactly one optimization by a before/after measurement.",
        acceptance: [
          "Public functions have type hints; mypy/pyright passes.",
          "The pytest suite covers the happy path and edge cases via parametrize.",
          "A profiling run (cProfile/timeit) identifies the hot spot.",
          "One optimization is justified by a before/after timing, with tests still green.",
        ],
      },
    },
  ],
};
