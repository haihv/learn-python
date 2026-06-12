import type { Stem } from "./types";

export const oopStem: Stem = {
  id: "S4",
  slug: "stem-oop",
  domainId: "oop",
  title: "Classes & Protocols",
  icon: "🏛️",
  oneLiner: "Protocols over inheritance — Python cares what an object can do, not what it is.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the OOP vocabulary",
      lead: "The words behind Python's 'duck typing first, inheritance second' style.",
      terms: [
        { term: "dunder method", reveal: "A __double_underscore__ method that hooks into syntax — __len__ powers len(), __add__ powers +." },
        { term: "__init__", reveal: "The initializer, run after the object exists, to set up instance attributes. (The real constructor is __new__.)" },
        { term: "__repr__", reveal: "The unambiguous debug string; aim for something that could recreate the object." },
        { term: "duck typing", reveal: "Python uses an object based on the methods it has, not its declared type — 'if it quacks, it's a duck'." },
        { term: "dataclass", reveal: "@dataclass auto-generates __init__, __repr__, and __eq__ from typed field declarations." },
        { term: "property", reveal: "Turns a method into attribute access (obj.area) with optional validation — no getArea()." },
        { term: "protocol", reveal: "An informal (or typing.Protocol) interface defined by the methods an object implements: iterable, context manager, etc." },
        { term: "__eq__ / __hash__", reveal: "Define value equality and hashing together — override __eq__ without a consistent __hash__ and instances break in sets." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Teach the + operator your type",
      lead: "Tap each step of making a Vector work with Python's syntax.",
      stages: [
        { label: "class Vector: __init__(self, x, y)", why: "Stores components. By itself, v1 + v2 raises TypeError — Python doesn't know how to add your objects." },
        { label: "def __add__(self, other)", why: "Now `v1 + v2` dispatches to __add__. You taught the + operator what addition means for your type." },
        { label: "def __repr__(self)", why: "print(v) and the REPL now show 'Vector(1, 2)' instead of an unhelpful <object at 0x…>." },
        { label: "def __eq__(self, other)", why: "v1 == v2 now compares by value. (Add __hash__ too if you want vectors in a set.)" },
      ],
      takeaway: "Implement the dunder for the syntax you want; Python wires the operator to your method.",
    },
    {
      level: 3,
      verb: "use",
      title: "Model data the Pythonic way",
      lead: "A checklist for writing classes that feel native.",
      checklist: [
        "Just bundling typed data? Use @dataclass — it writes __init__/__repr__/__eq__ for you.",
        "Want computed, validated attributes? Use @property, not getX()/setX().",
        "Define __repr__ on every class you'll debug; make it unambiguous.",
        "Override __eq__? Then define __hash__ too (or set __hash__ = None to stay intentionally unhashable).",
        "Don't inherit just to share code — prefer composition or a shared protocol.",
      ],
      codePeek: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p)                 # Point(x=1, y=2)
print(p == Point(1, 2))  # True`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Inheritance or composition?",
      lead: "Both reuse code. Slide to see the coupling shift; then settle the toggle.",
      slider: {
        leftLabel: "Inheritance",
        rightLabel: "Composition",
        stops: [
          { at: 0, note: "Inheritance: a subclass reuses and overrides a base. Clean for true is-a relationships; brittle when used only to share code." },
          { at: 50, note: "Both reuse behavior. Inheritance couples you to the parent's internals; composition couples only to a small interface." },
          { at: 100, note: "Composition: hold other objects and delegate. More flexible, easier to test and swap — duck typing makes it cheap." },
        ],
      },
      toggle: {
        question: "You need a Stack that reuses list operations. Better to…",
        optionA: "subclass list",
        optionB: "hold a list as an attribute",
        answer: "B",
        why: "Subclassing list exposes 40+ methods (including ones that break stack invariants, like insert). Composition exposes only push/pop and protects the invariant.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Bust the 'needs a base class' myth",
      lead: "One claim carries a habit from other languages. Spot it.",
      prompt: "Which statement about Python OOP is correct?",
      options: [
        {
          text: "To work in a for loop, an object must inherit from an Iterable base class.",
          correct: false,
          reveal: "✗ The Java-flavored instinct. Python uses duck typing: implement __iter__ (or __getitem__) and it's iterable — no base class required.",
        },
        {
          text: "Implementing __len__ makes len(obj) work on your object.",
          correct: true,
          reveal: "✓ len() calls __len__. Implement the dunder and the built-in just works — the protocol approach in action.",
        },
        {
          text: "@dataclass makes a class immutable by default.",
          correct: false,
          reveal: "✗ A plain @dataclass is mutable; you need @dataclass(frozen=True) for immutability.",
        },
        {
          text: "A @property must always define a setter.",
          correct: false,
          reveal: "✗ A property can be read-only — define only the getter and assignment raises AttributeError.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a protocol-driven type",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "type", label: "Type", options: ["Vector2D", "Temperature", "Matrix"] },
        { id: "ops", label: "Protocol", options: ["+ and * (numeric)", "len() and indexing", "== and hashing"] },
        { id: "guard", label: "Validated by", options: ["a property", "__post_init__", "a type check in the dunder"] },
      ],
      specTemplate: "A {type} implementing {ops}, validated via {guard}.",
      buildCard: {
        title: "Protocol-driven type",
        deliverable:
          "A Vector type implementing the numeric protocol (__add__, __mul__, __eq__, __repr__) so it works naturally with +, *, and == — plus __len__ or indexing where it makes sense.",
        acceptance: [
          "v1 + v2 and scalar * v return new Vectors (no mutation).",
          "__repr__ is unambiguous; __eq__ compares by value.",
          "If __eq__ is defined, __hash__ is consistent (or the type is intentionally unhashable).",
          "Works with the built-ins it claims to support (e.g. len(v) if __len__ exists).",
        ],
      },
    },
  ],
};
