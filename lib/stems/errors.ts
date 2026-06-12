import type { Stem } from "./types";

export const errorsStem: Stem = {
  id: "S6",
  slug: "stem-errors",
  domainId: "errors",
  title: "Errors & Resources",
  icon: "🛡️",
  oneLiner: "Exceptions are control flow, and context managers guarantee cleanup — even when they fire.",
  estimatedMinutes: 30,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the error vocabulary",
      lead: "The words behind robust failure handling and deterministic cleanup.",
      terms: [
        { term: "exception", reveal: "An object raised to signal an error, unwinding the stack until something catches it." },
        { term: "traceback", reveal: "The stack trace showing where an exception was raised and the call chain that led there." },
        { term: "try / except / else / finally", reveal: "try guards code; except handles failures; else runs if no exception; finally always runs." },
        { term: "raise", reveal: "Throws an exception. A bare `raise` inside except re-raises the current one, preserving its traceback." },
        { term: "raise from", reveal: "`raise New() from err` chains exceptions so the original cause is shown, not hidden." },
        { term: "context manager", reveal: "An object usable with `with` that sets up and tears down a resource via __enter__/__exit__." },
        { term: "__enter__ / __exit__", reveal: "__enter__ acquires (and returns the resource); __exit__ releases it — and runs even if the block raises." },
        { term: "EAFP", reveal: "'Easier to Ask Forgiveness than Permission' — try the operation and handle the exception, rather than pre-checking (LBYL)." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Watch cleanup survive an exception",
      lead: "Tap each step of a with-block that raises halfway through.",
      stages: [
        { label: "with open('f') as file:", why: "__enter__ runs, opening the file and binding it to `file`. The resource is now acquired." },
        { label: "    data = file.read()", why: "Normal work. If this raised (say, a decode error), control would jump straight toward __exit__." },
        { label: "    raise ValueError('bad')", why: "An exception propagates. The block stops here — but the `with` is not done: cleanup still owes you." },
        { label: "(implicit __exit__)", why: "__exit__ runs no matter what, closing the file. It returns False, so the ValueError keeps propagating to the caller." },
      ],
      takeaway: "__exit__ always runs — that's why `with` beats manual close(): cleanup survives exceptions.",
    },
    {
      level: 3,
      verb: "use",
      title: "Handle failure deliberately",
      lead: "A checklist for catching the right things and cleaning up reliably.",
      checklist: [
        "Catch the narrowest exception that fits — `except Exception:` hides bugs; never use a bare `except:`.",
        "Acquiring a resource (file, lock, connection)? Use `with`, not manual acquire/release.",
        "Re-raising after logging? Use bare `raise` to keep the traceback; use `raise X from e` to add context.",
        "Structure with try/except/else: risky line in try, success path in else, cleanup in finally.",
        "Prefer EAFP (try/except) over LBYL pre-checks that can race or duplicate work.",
      ],
      codePeek: `from contextlib import contextmanager

@contextmanager
def tag(name):
    print(f'<{name}>')
    try:
        yield                 # the body of the with-block runs here
    finally:
        print(f'</{name}>')   # always closes, even on error

with tag('b'):
    print('hi')`,
    },
    {
      level: 4,
      verb: "compare",
      title: "EAFP or LBYL?",
      lead: "Both handle the bad case. Slide to see the trade; then settle the toggle.",
      slider: {
        leftLabel: "EAFP (try/except)",
        rightLabel: "LBYL (check first)",
        stops: [
          { at: 0, note: "EAFP: just do it and catch failure. No race between check and use, less duplicate logic — the Pythonic default." },
          { at: 50, note: "Both cover the failure. EAFP costs a try frame; LBYL costs an extra check that can still go stale." },
          { at: 100, note: "LBYL: check preconditions before acting. Clear for cheap checks, but state can change between check and use (TOCTOU)." },
        ],
      },
      toggle: {
        question: "Reading a dict key that is almost always present, in a hot loop. Prefer…",
        optionA: "try: d[k] except KeyError",
        optionB: "if k in d: d[k]",
        answer: "A",
        why: "When the key is nearly always there, the exception almost never fires, so EAFP pays only for the rare miss — while LBYL pays for an extra membership check on every single iteration.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Spot the finally flaw",
      lead: "Read the snippet and judge what it returns. The intuitive answer is wrong.",
      prompt: "A function does `try: return 1` then `finally: return 2`. What does it return?",
      options: [
        {
          text: "1 — the try's return wins.",
          correct: false,
          reveal: "✗ The intuitive answer. But finally runs before the function truly returns, and its own `return 2` overrides the pending return 1.",
        },
        {
          text: "2 — finally's return overrides.",
          correct: true,
          reveal: "✓ A return in finally replaces any pending return or exception from the try. (Which is exactly why returning from finally is a footgun.)",
        },
        {
          text: "It raises because of two returns.",
          correct: false,
          reveal: "✗ Multiple returns are legal; no error. finally simply gets the last word.",
        },
        {
          text: "None",
          correct: false,
          reveal: "✗ finally explicitly returns 2, so it's not None.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a transactional context manager",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "resource", label: "Resource", options: ["a file write", "a DB transaction", "a temp directory"] },
        { id: "fail", label: "On failure", options: ["roll back changes", "delete partial output", "release the lock"] },
        { id: "impl", label: "Built with", options: ["a class (__enter__/__exit__)", "@contextmanager", "contextlib.ExitStack"] },
      ],
      specTemplate: "A context manager for {resource} that, on failure, will {fail}, built with {impl}.",
      buildCard: {
        title: "Transactional context manager",
        deliverable:
          "A context manager that wraps a file write so a failure mid-write rolls back to the original (or removes the partial file), leaving no half-written state — cleanup guaranteed by __exit__.",
        acceptance: [
          "Implements __enter__/__exit__ (or @contextmanager with try/finally).",
          "On success, changes are committed (e.g. an atomic rename into place).",
          "On exception, the original file is untouched / the partial output is removed.",
          "__exit__ returns False so unexpected exceptions still propagate.",
        ],
      },
    },
  ],
};
