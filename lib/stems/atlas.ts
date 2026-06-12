import type { Atlas } from "./types";

// Step 0 of the method: map the field. Python carved into 8 domains, each with
// a Create-level deliverable decided up front. The "one idea" is the single
// thing the whole language refines — for Python, the object model.
export const atlas: Atlas = {
  field: "Python",
  oneIdea: "Everything is an object, and a name is just a label tied to one.",
  oneIdeaExpanded:
    "A variable is not a box that holds a value — it is a name bound to an " +
    "object that lives elsewhere. Assignment rebinds the name; it never " +
    "copies the object. Once you see that, mutability, identity, default " +
    "arguments, and copying all stop being surprises.",
  domains: [
    {
      id: "data-model",
      title: "The Object Model",
      icon: "🧬",
      blurb:
        "Names, objects, identity vs. equality, and mutability — the layer everything else sits on.",
      createDeliverable:
        "An immutable Money value object with correct __eq__/__hash__, gated by a property test.",
      stemSlug: "stem-object-model",
    },
    {
      id: "data-structures",
      title: "Built-in Data Structures",
      icon: "📦",
      blurb:
        "list, dict, set, tuple — their cost models and when each is the right reach.",
      createDeliverable:
        "A frequency-count pipeline that picks the right structure at each step, justified by Big-O.",
      stemSlug: "stem-data-structures",
    },
    {
      id: "functions",
      title: "Functions & Scope",
      icon: "🔁",
      blurb:
        "First-class functions, closures, *args/**kwargs, and the LEGB scope rule.",
      createDeliverable:
        "A retry decorator with configurable backoff, preserving the wrapped function's metadata.",
      stemSlug: "stem-functions",
    },
    {
      id: "oop",
      title: "Classes & Protocols",
      icon: "🏛️",
      blurb:
        "Dunder methods, dataclasses, properties, and duck typing over rigid inheritance.",
      createDeliverable:
        "A Vector type implementing the numeric protocol so it works with +, *, and len().",
      stemSlug: "stem-oop",
    },
    {
      id: "iteration",
      title: "Iteration & Laziness",
      icon: "🌀",
      blurb:
        "Iterators, generators, comprehensions, and why lazy beats eager at scale.",
      createDeliverable:
        "A streaming log parser that processes a multi-GB file in constant memory.",
      stemSlug: "stem-iteration",
    },
    {
      id: "errors",
      title: "Errors & Resources",
      icon: "🛡️",
      blurb:
        "Exceptions as control flow, context managers, and cleaning up deterministically.",
      createDeliverable:
        "A transactional file-writer context manager that rolls back on failure.",
      stemSlug: "stem-errors",
    },
    {
      id: "concurrency",
      title: "Concurrency",
      icon: "⚡",
      blurb:
        "The GIL, threads vs. asyncio vs. processes, and matching the model to the bottleneck.",
      createDeliverable:
        "A concurrent URL fetcher that picks asyncio for I/O-bound work and proves the speedup.",
      stemSlug: "stem-concurrency",
    },
    {
      id: "tooling",
      title: "Testing & Tooling",
      icon: "🔧",
      blurb:
        "pytest, type hints, profiling — the production concerns that keep code honest.",
      createDeliverable:
        "A tested, type-checked module with a profiling report justifying one optimization.",
      stemSlug: "stem-tooling",
    },
  ],
};
