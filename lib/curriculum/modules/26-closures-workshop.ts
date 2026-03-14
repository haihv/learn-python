import type { WorkshopModule } from "../types";

export const closuresWorkshop: WorkshopModule = {
  type: "workshop",
  id: "26",
  slug: "closures-workshop",
  title: "Building Closure-Based Utilities",
  icon: "🛠️",
  estimatedMinutes: 20,
  description: "Build useful utilities using Python closures",
  steps: [
    {
      instruction:
        "Write a `make_counter()` function that returns a tuple of two functions: `increment` and `reset`. `increment` should increase an internal count by 1 and return it. `reset` should set the count back to 0. Use `nonlocal` to modify the shared state.",
      hint: "Define count=0 in make_counter, then use 'nonlocal count' inside both increment and reset. Return (increment, reset).",
      starterCode: `def make_counter():
    count = 0

    def increment():
        # TODO: nonlocal + increment count
        pass

    def reset():
        # TODO: nonlocal + set count to 0
        pass

    return increment, reset

inc, rst = make_counter()
print(inc())   # 1
print(inc())   # 2
print(inc())   # 3
rst()
print(inc())   # 1
`,
      validate: (code: string) => {
        // Require actual nonlocal statement, not just mention in a comment
        const hasNonlocal = /^[ \t]*nonlocal/m.test(code);
        return (
          code.includes("def make_counter") &&
          hasNonlocal &&
          code.includes("count") &&
          (code.includes("return increment, reset") ||
            (code.includes("return") && code.includes("reset")))
        );
      },
      successMessage:
        "nonlocal is the key ingredient that lets inner functions mutate the enclosing scope's variables. Without it, count += 1 would create a brand-new local variable and raise UnboundLocalError.",
    },
    {
      instruction:
        "Write a `make_multiplier(n)` factory that returns a function. The returned function should accept one argument `x` and return `x * n`. Create multipliers for 3 and 7 and verify them.",
      hint: "def make_multiplier(n): def multiply(x): return x * n; return multiply. 'n' is captured as a free variable.",
      starterCode: `def make_multiplier(n):
    # TODO: return a function that multiplies its argument by n
    pass

triple = make_multiplier(3)
septuple = make_multiplier(7)

print(triple(5))     # 15
print(septuple(4))   # 28
print(triple(septuple(2)))  # 42  (triple(14))
`,
      validate: (code: string) => {
        return (
          code.includes("def make_multiplier") &&
          code.includes("return") &&
          code.includes("def ") &&
          (code.includes("* n") || code.includes("*n"))
        );
      },
      successMessage:
        "Each call to make_multiplier creates a fresh closure with its own captured 'n'. triple and septuple are independent functions that remember different values.",
    },
    {
      instruction:
        "Write a `once(func)` higher-order function that wraps `func` and ensures it is executed at most once. Subsequent calls should return the same result that the first call produced, without calling `func` again.",
      hint: "Use a mutable closure: has_run=False, result=None. On first call set has_run=True and store result. Return result on all subsequent calls.",
      starterCode: `def once(func):
    has_run = False
    result = None

    def wrapper(*args, **kwargs):
        nonlocal has_run, result
        # TODO: call func only on the first invocation
        pass

    return wrapper

def expensive_init():
    print("Initialising... (should only run once)")
    return 42

init = once(expensive_init)

val1 = init()   # Prints: Initialising...
val2 = init()   # Prints nothing
val3 = init()   # Prints nothing

print(val1, val2, val3)   # 42 42 42
`,
      validate: (code: string) => {
        return (
          code.includes("def once") &&
          code.includes("nonlocal") &&
          code.includes("has_run") &&
          code.includes("wrapper") &&
          (code.includes("if has_run") || code.includes("if not has_run"))
        );
      },
      successMessage:
        "once() is a classic closure pattern. The captured has_run flag acts as a one-shot latch. This pattern appears in singleton initialisation, event handlers, and lazy configuration loading.",
    },
    {
      instruction:
        "Write a `simple_memoize(func)` function that caches results of `func` using a dict closure keyed by the call's arguments. Then use it on a recursive Fibonacci function to speed it up.",
      hint: "cache = {} in simple_memoize. In wrapper, check if args in cache. If not, compute and store: cache[args] = func(*args). Return cache[args].",
      starterCode: `def simple_memoize(func):
    cache = {}

    def wrapper(*args):
        # TODO: return cached result or compute and store it
        pass

    return wrapper

@simple_memoize
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))   # 55
print(fib(30))   # 832040
print(fib(40))   # 102334155  (fast because of memoization)
`,
      validate: (code: string) => {
        return (
          code.includes("def simple_memoize") &&
          code.includes("cache") &&
          code.includes("args") &&
          code.includes("wrapper") &&
          code.includes("cache[args]")
        );
      },
      successMessage:
        "The cache dict is a free variable that persists for the lifetime of the wrapper closure. This is exactly how functools.lru_cache works conceptually — a dict mapping argument tuples to return values.",
    },
    {
      instruction:
        "Demonstrate the classic late-binding closure bug, then fix it two ways: (1) using a default argument to capture the current loop value, and (2) using a factory function. Print results for both fixes to show they produce 0, 1, 2, 3, 4.",
      hint: "Bug: [lambda: i for i in range(5)]. Fix 1: lambda i=i: i. Fix 2: def make(i): return lambda: i.",
      starterCode: `# --- Buggy version ---
buggy = [lambda: i for i in range(5)]
print("Buggy:", [f() for f in buggy])
# Prints: [4, 4, 4, 4, 4]  — all see the final value of i

# --- Fix 1: default argument captures current value ---
# TODO: create 'fixed1' list using default argument trick

print("Fix 1:", [f() for f in fixed1])
# Should print: [0, 1, 2, 3, 4]

# --- Fix 2: factory function creates a new scope ---
def make_getter(i):
    # TODO: return a function that returns i
    pass

fixed2 = [make_getter(i) for i in range(5)]
print("Fix 2:", [f() for f in fixed2])
# Should print: [0, 1, 2, 3, 4]
`,
      validate: (code: string) => {
        return (
          code.includes("lambda i=i") &&
          code.includes("def make_getter") &&
          code.includes("fixed1") &&
          code.includes("fixed2")
        );
      },
      successMessage:
        "Both fixes work because they bind 'i' at the time the closure is created — not when it is called. The default-argument trick is concise; the factory function is more explicit and easier to understand at a glance.",
    },
  ],
};
