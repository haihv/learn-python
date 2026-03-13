import type { WorkshopModule } from "../types";

export const modulesPackagesWorkshop: WorkshopModule = {
  type: "workshop",
  id: "57",
  slug: "modules-packages-workshop",
  title: "Creating a Package with Relative Imports",
  icon: "📦",
  estimatedMinutes: 20,
  description: "Understand how Python's module and package system works",
  steps: [
    {
      instruction:
        "Explore the basics of `import` and `from ... import`. Write code that imports `math` and uses `math.sqrt`, `math.ceil`, and `math.pi`. Then use `from math import` to import `factorial` and `gcd` directly. Also alias `statistics` as `stats` and print the mean of a list.",
      hint: "Use `import math` for the full module. Use `from math import factorial, gcd` to import names directly. Use `import statistics as stats` for the alias.",
      starterCode: `# Part 1: Regular import
import math
print(math.sqrt(144))    # 12.0
print(math.ceil(4.3))    # 5
print(math.pi)           # 3.141592653589793

# Part 2: from ... import
from math import factorial, gcd
print(factorial(6))      # 720
print(gcd(48, 18))       # 6

# Part 3: aliased import
import statistics as stats
data = [10, 20, 30, 40, 50]
print(stats.mean(data))   # 30
print(stats.median(data)) # 30
print(stats.stdev(data))  # ~14.14
`,
      validate: (code) =>
        code.includes("import math") &&
        code.includes("from math import") &&
        code.includes("import statistics as stats") &&
        code.includes("factorial") &&
        code.includes("gcd"),
      successMessage:
        "Great! You now know the three main import styles: full module import, selective import, and aliased import. Each has its place depending on readability and namespace clarity.",
    },
    {
      instruction:
        "Demonstrate the `__name__ == '__main__'` guard. Write a module with a function `compute_area(radius)` that returns the area of a circle, and a `main()` function that calls it. Wrap the `main()` call in the `if __name__ == '__main__':` guard. Then show what happens when you import it (simulate by calling the function directly without the guard running).",
      hint: "The guard `if __name__ == '__main__':` prevents code from running when the file is imported. Define the function, define main(), then use the guard to call main().",
      starterCode: `import math

def compute_area(radius: float) -> float:
    """Calculate the area of a circle."""
    return math.pi * radius ** 2

def compute_circumference(radius: float) -> float:
    """Calculate the circumference of a circle."""
    return 2 * math.pi * radius

def main():
    for r in [1, 5, 10]:
        area = compute_area(r)
        circ = compute_circumference(r)
        print(f"radius={r}: area={area:.2f}, circumference={circ:.2f}")

# This only runs when executed directly, not when imported
if __name__ == "__main__":
    main()

# Demonstrate the module's __name__ value
print(f"This module's __name__ is: {__name__}")
`,
      validate: (code) =>
        code.includes('if __name__ == "__main__"') ||
        code.includes("if __name__ == '__main__'"),
      successMessage:
        "The __name__ == '__main__' guard is one of Python's most important idioms. It lets the same file work as both an importable library and a runnable script.",
    },
    {
      instruction:
        "Use `__all__` to define a module's public API. Create a simulated module by defining several functions in your script, then set `__all__` to only expose some of them. Print `__all__` to confirm. Also show how `dir()` on a module shows its contents.",
      hint: "Define `__all__ = ['public_func1', 'public_func2']` at the top of your 'module'. Functions starting with `_` are conventionally private. `dir()` called on the current module can be done via `dir()` inside the module.",
      starterCode: `# Simulating a module's public API with __all__

__all__ = ["add", "multiply", "format_result"]

def add(a: float, b: float) -> float:
    return a + b

def multiply(a: float, b: float) -> float:
    return a * b

def format_result(value: float, label: str = "Result") -> str:
    return f"{label}: {value:.4f}"

def _validate_inputs(*args):
    """Private helper — not in __all__, not part of public API."""
    for arg in args:
        if not isinstance(arg, (int, float)):
            raise TypeError(f"Expected number, got {type(arg).__name__}")

# Inspect the public API
print("Public API:", __all__)
print("All names:", [n for n in dir() if not n.startswith("_")])

# Use the public functions
result = add(10, 5)
print(format_result(result, "Sum"))

result = multiply(10, 5)
print(format_result(result, "Product"))
`,
      validate: (code) =>
        code.includes("__all__") &&
        code.includes("def add") &&
        code.includes("def multiply") &&
        (code.includes("_validate") || code.includes("def _")),
      successMessage:
        "Excellent! __all__ gives module authors control over what's considered public. It's documentation and enforcement in one — when someone does `from mymodule import *`, only __all__ items come through.",
    },
    {
      instruction:
        "Explore `sys.path` and `sys.modules`. Print the current `sys.path` to see where Python looks for modules. Then import a few modules and check `sys.modules` to see the cache. Show that importing the same module twice doesn't re-execute it by adding a counter variable.",
      hint: "Use `sys.path` to see the search path list. Check `sys.modules` (it's a dict) to see cached modules. Import `json` and check `'json' in sys.modules`.",
      starterCode: `import sys

# Show where Python searches for modules
print("Python module search path:")
for i, path in enumerate(sys.path):
    print(f"  [{i}] {path}")

print()

# Import some modules and check the cache
import json
import math

print("Modules in sys.modules (sample):")
stdlib_modules = [name for name in sys.modules if '.' not in name and not name.startswith('_')]
for name in sorted(stdlib_modules)[:10]:
    print(f"  {name}")

print()
print(f"'json' cached: {'json' in sys.modules}")
print(f"'math' cached: {'math' in sys.modules}")

# Demonstrate that re-import uses the cache
import json as json2
print(f"json is json2: {json is json2}")  # True — same object
`,
      validate: (code) =>
        code.includes("sys.path") &&
        code.includes("sys.modules") &&
        code.includes("import sys"),
      successMessage:
        "Perfect! sys.path reveals Python's module search strategy, and sys.modules shows how Python caches imports for efficiency. Understanding these internals helps diagnose import errors and circular import issues.",
    },
    {
      instruction:
        "Use `importlib` for a dynamic import. Write code that stores module names in a list and imports them dynamically using `importlib.import_module()`. Then use `getattr()` to dynamically call a function from the imported module. This pattern is common in plugin systems.",
      hint: "Use `importlib.import_module('module_name')` with a string. Then use `getattr(module, 'function_name')` to get the function. Call it like any other function.",
      starterCode: `import importlib

# Dynamic import — module name determined at runtime
module_names = ["math", "statistics", "random"]

for name in module_names:
    module = importlib.import_module(name)
    print(f"Imported: {name} (type: {type(module).__name__})")

# Dynamic function call using getattr
operations = [
    ("math", "sqrt", [144]),
    ("math", "factorial", [6]),
    ("statistics", "mean", [[1, 2, 3, 4, 5]]),
]

print()
for mod_name, func_name, args in operations:
    module = importlib.import_module(mod_name)
    func = getattr(module, func_name)
    result = func(*args)
    print(f"{mod_name}.{func_name}({args[0]}) = {result}")

# Check if a module is already cached (was imported before)
print()
print(f"'math' already in sys.modules: {'math' in __import__('sys').modules}")
`,
      validate: (code) =>
        code.includes("importlib") &&
        code.includes("import_module") &&
        code.includes("getattr"),
      successMessage:
        "Excellent! Dynamic imports with importlib are the foundation of plugin architectures, CLI frameworks, and test discovery systems. You can load any module by name string at runtime.",
    },
  ],
};
