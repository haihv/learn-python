import type { Stem } from "./types";

export const functionsStem: Stem = {
  id: "S3",
  slug: "stem-functions",
  domainId: "functions",
  title: "Functions & Scope",
  icon: "🔁",
  oneLiner: "Functions are objects you can pass, return, and close over — scope decides what names they see.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the function vocabulary",
      lead: "Eight words that turn functions from 'callable blocks' into a tool you compose with.",
      terms: [
        { term: "first-class", reveal: "Functions are objects: assign them to names, pass them as arguments, return them, store them in lists." },
        { term: "closure", reveal: "A nested function that captures and remembers variables from its enclosing scope, even after that scope returns." },
        { term: "free variable", reveal: "A name used in a function but defined in an enclosing scope — what a closure captures." },
        { term: "LEGB", reveal: "Name lookup order: Local, Enclosing, Global, Built-in. Python searches these in turn." },
        { term: "*args", reveal: "Collects extra positional arguments into a tuple, so a function can take any number of positionals." },
        { term: "**kwargs", reveal: "Collects extra keyword arguments into a dict. Pairs with *args for fully flexible signatures." },
        { term: "default argument", reveal: "A fallback value in the signature, evaluated once at def time — which is why a mutable default is a trap." },
        { term: "higher-order function", reveal: "Takes or returns functions: map, sorted's key=, and decorators are all higher-order." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a closure that remembers",
      lead: "Tap each step of a counter factory to see where the captured state lives.",
      stages: [
        { label: "def make_counter():", why: "Defines a factory. Nothing runs yet; each call will create its own fresh scope." },
        { label: "    count = 0", why: "A local in make_counter's scope. It will become a free variable for the inner function." },
        { label: "    def inc(): nonlocal count; count += 1", why: "inc closes over count. `nonlocal` lets it rebind the enclosing variable instead of creating a new local." },
        { label: "    return inc", why: "make_counter returns the inner function. Its enclosing scope is gone, but count lives on — captured by the closure." },
      ],
      takeaway: "A closure keeps its enclosing variables alive; `nonlocal` is what lets it mutate them.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put functions to work",
      lead: "A checklist for the patterns you'll reach for this week.",
      checklist: [
        "Need to remember state between calls without a class? A closure over a nonlocal variable does it.",
        "Accept flexible arguments with def f(*args, **kwargs); forward them with f(*args, **kwargs).",
        "Reassigning a module global inside a function needs `global`; an enclosing scope needs `nonlocal`.",
        "Pass behavior, not flags: take a key=func or callback instead of a mode string.",
        "Late-binding trap: closures capture the variable, not its value — bind loop vars with a default (lambda x=x: ...).",
      ],
      codePeek: `def make_multiplier(n):
    def mul(x):
        return x * n   # n is captured from the enclosing scope
    return mul

times3 = make_multiplier(3)
print(times3(10))  # 30`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Closure or class?",
      lead: "Both carry state. Slide to see the shift; then settle the toggle.",
      slider: {
        leftLabel: "Closure",
        rightLabel: "Class",
        stops: [
          { at: 0, note: "Closure: lightweight, captures a few variables, one obvious call. Perfect for a single bit of remembered state." },
          { at: 50, note: "Both hold state. A closure hides it (harder to inspect or serialize); a class names it on self (discoverable, testable)." },
          { at: 100, note: "Class: explicit attributes, multiple methods, easy to subclass and test. Worth it once state or behavior grows." },
        ],
      },
      toggle: {
        question: "You need five small callbacks that each remember one number. Reach for…",
        optionA: "five closures",
        optionB: "one class with five methods",
        answer: "A",
        why: "For a single captured value and one call each, closures are lighter and clearer. Reach for a class when state grows or several methods must share it.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Spot the late-binding flaw",
      lead: "Read the snippet, then judge the output. The intuitive answer is the wrong one.",
      prompt: "What does this print? funcs = [lambda: i for i in range(3)]; print([f() for f in funcs])",
      options: [
        {
          text: "[0, 1, 2]",
          correct: false,
          reveal: "✗ The intuitive-but-wrong answer. Each lambda captures the variable i, not its value at creation time.",
        },
        {
          text: "[2, 2, 2]",
          correct: true,
          reveal: "✓ Late binding: all three lambdas share the same i, which ends at 2. Fix with `lambda i=i: i` to bind per iteration.",
        },
        {
          text: "[] (empty)",
          correct: false,
          reveal: "✗ The comprehension builds three lambdas; calling each returns a value.",
        },
        {
          text: "Raises NameError",
          correct: false,
          reveal: "✗ i is in scope via the closure; there's no error — just the surprising shared-variable result.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a retry decorator",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "target", label: "Wrap", options: ["a flaky network call", "a slow pure function", "any function"] },
        { id: "policy", label: "Retry policy", options: ["fixed delay", "exponential backoff", "backoff + jitter"] },
        { id: "preserve", label: "Preserve", options: ["name & docstring (functools.wraps)", "the original signature", "nothing extra"] },
      ],
      specTemplate: "A retry decorator for {target} using {policy}, preserving {preserve}.",
      buildCard: {
        title: "Retry decorator",
        deliverable:
          "A decorator that retries the wrapped function on exception with configurable attempts and backoff, using functools.wraps so the function keeps its __name__ and __doc__.",
        acceptance: [
          "Implemented as a decorator factory: @retry(attempts=3, base_delay=0.1).",
          "Re-raises the last exception after exhausting all attempts.",
          "Uses functools.wraps so introspection still sees the original function.",
          "Delay grows between attempts (base_delay * 2**n) rather than hammering.",
        ],
      },
    },
  ],
};
