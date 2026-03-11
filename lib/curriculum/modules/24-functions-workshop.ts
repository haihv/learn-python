import type { WorkshopModule } from "../types";

export const functionsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "24",
  slug: "functions-workshop",
  title: "*args, **kwargs & Keyword-Only Params",
  icon: "🔨",
  estimatedMinutes: 20,
  description: "Master Python's flexible function signature features",
  steps: [
    {
      instruction:
        "Write a function `sum_all(*args)` that accepts any number of numeric arguments and returns their sum. It should return 0 when called with no arguments. Test it with several different call patterns.",
      hint: "def sum_all(*args): return sum(args). The *args syntax packs all positional arguments into a tuple called args.",
      starterCode: `def sum_all(*args):
    # TODO: return the sum of all arguments; 0 if none given
    pass

print(sum_all())              # 0
print(sum_all(1, 2, 3))       # 6
print(sum_all(10, 20, 30, 40))  # 100

# You can also unpack a list into positional args with *
numbers = [1, 2, 3, 4, 5]
print(sum_all(*numbers))      # 15
`,
      validate: (code: string) => {
        return (
          code.includes("def sum_all") &&
          code.includes("*args") &&
          (code.includes("sum(args)") || code.includes("sum(args") || code.includes("for"))
        );
      },
      successMessage:
        "*args collects all extra positional arguments into a tuple. It's perfect for variadic functions where the caller decides how many values to pass.",
    },
    {
      instruction:
        "Write a function `build_url(base, **params)` that constructs a URL by appending query parameters. For example, `build_url('https://api.example.com', page=1, limit=20)` should return `'https://api.example.com?page=1&limit=20'`.",
      hint: "Use **params to collect keyword arguments into a dict. Build the query string with '&'.join(f'{k}={v}' for k, v in params.items()).",
      starterCode: `def build_url(base, **params):
    # TODO: construct and return the full URL with query string
    pass

print(build_url("https://api.example.com"))
# https://api.example.com

print(build_url("https://api.example.com", page=1, limit=20))
# https://api.example.com?page=1&limit=20

print(build_url("https://search.example.com", q="python", sort="date", order="desc"))
# https://search.example.com?q=python&sort=date&order=desc
`,
      validate: (code: string) => {
        return (
          code.includes("def build_url") &&
          code.includes("**params") &&
          code.includes(".items()")
        );
      },
      successMessage:
        "**kwargs collects extra keyword arguments into a dict. It's widely used for flexible APIs, configuration objects, and decorator forwarding.",
    },
    {
      instruction:
        "Write a function `greet(name, *, loud=False, prefix='Hello')` using keyword-only parameters (parameters after the bare `*`). Keyword-only params MUST be passed by name, never positionally. Print several calls.",
      hint: "The bare * in the signature forces everything after it to be keyword-only. Callers must write greet('Alice', loud=True) not greet('Alice', True).",
      starterCode: `def greet(name, *, loud=False, prefix="Hello"):
    # TODO: return "{prefix}, {name}!" optionally uppercased when loud=True
    pass

print(greet("Alice"))                          # Hello, Alice!
print(greet("Bob", prefix="Good morning"))     # Good morning, Bob!
print(greet("Carol", loud=True))               # HELLO, CAROL!

# This should raise a TypeError (uncomment to verify):
# print(greet("Dave", True))   # TypeError: takes 1 positional argument
`,
      validate: (code: string) => {
        return (
          code.includes("def greet") &&
          code.includes("*, ") &&
          code.includes("loud") &&
          code.includes("prefix")
        );
      },
      successMessage:
        "Keyword-only params after * prevent positional misuse and make calls self-documenting. greet('Alice', loud=True) is immediately clear; greet('Alice', True) is ambiguous.",
    },
    {
      instruction:
        "Write a function `add(a, b, /)` using **positional-only** parameters (Python 3.8+). Positional-only params appear before the `/` and cannot be passed by name. Then also write `sub(a, b)` (normal) and compare how they are called.",
      hint: "def add(a, b, /): return a + b. Calling add(a=1, b=2) raises TypeError because a and b are positional-only.",
      starterCode: `# Positional-only parameters (before /)
def add(a, b, /):
    # TODO: return a + b
    pass

# Normal function for comparison
def sub(a, b):
    return a - b

print(add(10, 3))           # 13 — positional call, OK
print(sub(a=10, b=3))       # 7  — keyword call, OK for sub

# The line below would raise TypeError — uncomment to test:
# print(add(a=10, b=3))     # TypeError: got some positional-only arguments

print("add works positionally:", add(5, 2))
`,
      validate: (code: string) => {
        return (
          code.includes("def add") &&
          code.includes(", /)")
        );
      },
      successMessage:
        "Positional-only params (/) prevent callers from relying on argument names, which is important when parameter names may change or when mirroring C-extension signatures like built-in functions.",
    },
    {
      instruction:
        "Write a function `describe(pos_only, /, normal, *, kw_only)` that combines all three kinds: positional-only (before /), regular, and keyword-only (after *). Print a formatted string describing all three values.",
      hint: "def describe(pos_only, /, normal, *, kw_only): return f'pos={pos_only}, normal={normal}, kw={kw_only}'. Call it as describe(1, 2, kw_only=3) or describe(1, normal=2, kw_only=3).",
      starterCode: `def describe(pos_only, /, normal, *, kw_only):
    # TODO: return a formatted string showing all three params
    pass

# Both of these are valid calls:
print(describe(1, 2, kw_only=3))
# pos=1, normal=2, kw=3

print(describe(10, normal=20, kw_only=30))
# pos=10, normal=20, kw=30

# These would raise TypeError:
# describe(pos_only=1, normal=2, kw_only=3)  # pos_only is positional-only
# describe(1, 2, 3)                           # kw_only must be keyword
`,
      validate: (code: string) => {
        return (
          code.includes("def describe") &&
          code.includes(", /,") &&
          code.includes(", *,") &&
          code.includes("kw_only")
        );
      },
      successMessage:
        "The full signature / (positional-only), regular, * (keyword-only) gives you maximum control over how a function is called. Python's own built-ins like range() and open() use this pattern for stable, forward-compatible APIs.",
    },
  ],
};
