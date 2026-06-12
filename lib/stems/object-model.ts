import type { Stem } from "./types";

// The reference stem. Domain: the object model. One idea: a name is a label
// bound to an object, not a box. Climbs all six Bloom levels.
export const objectModelStem: Stem = {
  id: "S1",
  slug: "stem-object-model",
  domainId: "data-model",
  title: "The Object Model",
  icon: "🧬",
  oneLiner: "A variable is a name bound to an object — never a box that holds it.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the vocabulary",
      lead: "Lock in the eight words that make every later surprise predictable.",
      terms: [
        { term: "object", reveal: "A value in memory with an identity, a type, and a value. Everything in Python is one." },
        { term: "name", reveal: "A label in a namespace bound to an object. Assignment binds names; it does not copy objects." },
        { term: "binding", reveal: "Connecting a name to an object with `=`. The object existed before and may have other names." },
        { term: "identity", reveal: "The object's address, returned by id(). Tested with `is`. Two equal objects can have different identities." },
        { term: "equality", reveal: "Whether two objects represent the same value, tested with `==` (calls __eq__). Distinct from identity." },
        { term: "mutable", reveal: "Can change in place after creation: list, dict, set. The same object, mutated through any name, changes for all names." },
        { term: "immutable", reveal: "Cannot change after creation: int, str, tuple, frozenset. 'Changing' one actually rebinds the name to a new object." },
        { term: "reference semantics", reveal: "Passing or assigning hands over a reference to the same object, not a copy. The root of every aliasing bug." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace an aliasing bug",
      lead: "Tap each step of `a = [1, 2]; b = a; b.append(3)` and watch why a changes too.",
      stages: [
        { label: "a = [1, 2]", why: "Python builds one list object [1, 2] in memory and binds the name `a` to it. `a` is a label, not a container." },
        { label: "b = a", why: "No copy happens. The single list object now has two labels, `a` and `b`. `a is b` is True." },
        { label: "b.append(3)", why: "append mutates the one shared object in place. There is still only one list — now [1, 2, 3]." },
        { label: "print(a)", why: "`a` and `b` name the same object, so `a` is [1, 2, 3] too. The 'spooky' change is just two names on one mutable object." },
      ],
      takeaway: "Assignment never copies. To get an independent list, copy explicitly: b = a[:] or list(a).",
    },
    {
      level: 3,
      verb: "use",
      title: "Defuse the shared-state traps",
      lead: "A checklist you'd run on any function that takes or returns a mutable.",
      checklist: [
        "Never use a mutable default argument (def f(x, acc=[])). The default is created once and shared across all calls.",
        "Use `def f(x, acc=None): acc = acc or []` so each call gets a fresh list.",
        "Before mutating an argument, decide: is mutating the caller's object intended? If not, copy first.",
        "Use `is` only for singletons (None, True, False); use `==` for value comparison.",
        "Reach for copy.deepcopy() only when a shallow copy would still share nested mutables.",
      ],
      codePeek: `def add_item(item, basket=None):
    # Fresh list per call — no shared default
    basket = basket if basket is not None else []
    basket.append(item)
    return basket

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['b'] — not ['a', 'b']`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Weigh copy depth and container choice",
      lead: "Every gain has a bill. Slide to see the cost of copying deeper; then settle the toggle.",
      slider: {
        leftLabel: "Share (no copy)",
        rightLabel: "Deep copy",
        stops: [
          { at: 0, note: "Alias: zero cost, zero memory — but every mutation is visible through every name. Fast and dangerous." },
          { at: 50, note: "Shallow copy (list(a)): a new outer object, but nested objects are still shared. Cheap, fixes top-level aliasing only." },
          { at: 100, note: "deepcopy: fully independent, including nested mutables — but O(n) time and memory, and breaks on cycles unless handled." },
        ],
      },
      toggle: {
        question: "You need a fixed set of config keys to use as dict keys. Reach for…",
        optionA: "a list of strings",
        optionB: "a tuple (or frozenset) of strings",
        answer: "B",
        why: "dict keys must be hashable, and only immutable objects are reliably hashable. A list can't be a key; a tuple/frozenset can.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Bust the most common beginner myth",
      lead: "One of these claims is the tempting wrong answer most people believe. Spot it.",
      prompt: "Which statement about `==` and `is` is correct?",
      options: [
        {
          text: "`a == b` being True guarantees `a is b` is True.",
          correct: false,
          reveal: "✗ False — the seductive one. Two distinct lists [1] == [1] are equal but not identical. Equality compares values; identity compares addresses.",
        },
        {
          text: "`a is b` being True guarantees `a == b` is True (for normal objects).",
          correct: true,
          reveal: "✓ True — if two names point at the same object, comparing it to itself is equal (barring pathological __eq__ like float('nan')).",
        },
        {
          text: "Small integers like 256 are never cached, so `x = 256; y = 256; x is y` is always False.",
          correct: false,
          reveal: "✗ False — CPython caches small ints (−5..256), so that `is` is often True. It's an implementation detail you must never rely on.",
        },
        {
          text: "Strings are mutable, so `s += '!'` changes the original string object.",
          correct: false,
          reveal: "✗ False — strings are immutable; `s += '!'` builds a new string and rebinds `s`. The original is untouched.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build an immutable value object",
      lead: "Compose your spec, then commit to the real build card.",
      choices: [
        { id: "scope", label: "Value type", options: ["Money (amount + currency)", "Point (x, y)", "SemVer (major.minor.patch)"] },
        { id: "behavior", label: "Equality by", options: ["all fields", "a normalized form", "an explicit key"] },
        { id: "check", label: "Gated by", options: ["a hypothesis property test", "a pytest parametrize suite", "a hash/eq invariant test"] },
      ],
      specTemplate: "An immutable {scope}, equal by {behavior}, gated by {check}.",
      buildCard: {
        title: "Immutable value object",
        deliverable:
          "A frozen dataclass (or __slots__ + properties) whose instances are hashable, compare by value, and reject mutation — usable as a dict key.",
        acceptance: [
          "Two instances with equal fields satisfy both `==` and equal hash().",
          "Attempting to set an attribute raises (frozen).",
          "Instances work correctly as set members and dict keys.",
          "A property test asserts: a == b implies hash(a) == hash(b).",
        ],
      },
    },
  ],
};
