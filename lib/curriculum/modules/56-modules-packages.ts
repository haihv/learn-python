import type { LessonModule } from "../types";

export const modulesPackages: LessonModule = {
  type: "lesson",
  id: "56",
  slug: "modules-packages",
  title: "import, from, __name__, packages, __init__.py",
  icon: "📦",
  estimatedMinutes: 15,
  content: `# Python Modules & Packages

Python's module system is how code is organized and reused. A **module** is any \`.py\` file. A **package** is a directory containing an \`__init__.py\` file. Understanding how Python finds and loads code is essential for building larger projects.

## The \`import\` Statement

The simplest way to use another module:

\`\`\`python
import math
import os
import sys

print(math.pi)         # 3.141592653589793
print(math.sqrt(16))   # 4.0
print(os.getcwd())     # /current/working/directory
\`\`\`

When you write \`import math\`, Python:
1. Searches \`sys.path\` for a file or package named \`math\`
2. Executes the module's code (once — subsequent imports use the cached version in \`sys.modules\`)
3. Binds the name \`math\` in your local namespace to the module object

## \`from module import name\`

Import specific names directly into your namespace:

\`\`\`python
from math import sqrt, pi, floor
from os.path import join, exists, dirname

print(sqrt(25))        # 5.0  — no math. prefix needed
print(pi)              # 3.141592653589793
print(join("/home", "user", "file.txt"))  # /home/user/file.txt
\`\`\`

The wildcard form \`from math import *\` imports all names not starting with underscore, but this is discouraged because it pollutes your namespace and makes it hard to tell where names come from.

## Aliasing with \`as\`

Rename imports to avoid conflicts or shorten long names:

\`\`\`python
import numpy as np              # Community convention
import pandas as pd             # Community convention
import matplotlib.pyplot as plt # Community convention

from datetime import datetime as dt
from collections import defaultdict as dd

now = dt.now()
print(now.strftime("%Y-%m-%d"))
\`\`\`

The \`as\` keyword works for both \`import\` and \`from ... import\`:

\`\`\`python
from os.path import join as path_join
result = path_join("/usr", "local", "bin")
\`\`\`

## The \`__name__\` Variable

Every Python module has a built-in \`__name__\` attribute. When a module is run directly as a script, \`__name__\` is set to \`"__main__"\`. When imported by another module, \`__name__\` is the module's file name (without \`.py\`).

This enables the classic guard pattern:

\`\`\`python
# greet.py
def greet(name: str) -> str:
    return f"Hello, {name}!"

def main():
    print(greet("World"))

if __name__ == "__main__":
    # This block only runs when you execute: python greet.py
    # It does NOT run when another file does: import greet
    main()
\`\`\`

This pattern lets a file be both an importable module and a runnable script. It's one of Python's most important idioms.

## Packages: Modules in Directories

A **package** is a directory containing an \`__init__.py\` file (which can be empty):

\`\`\`
myapp/
├── __init__.py          # Makes myapp a package
├── config.py
├── utils/
│   ├── __init__.py      # Makes utils a sub-package
│   ├── strings.py
│   └── numbers.py
└── models/
    ├── __init__.py
    └── user.py
\`\`\`

Import from the package:

\`\`\`python
import myapp.config
from myapp.utils import strings
from myapp.models.user import User
\`\`\`

## \`__init__.py\`: The Package Initializer

\`__init__.py\` runs when the package is imported. You can use it to:

1. **Re-export names** for a cleaner public API:
\`\`\`python
# myapp/__init__.py
from .models.user import User
from .models.product import Product
from .config import Settings

# Now users can do: from myapp import User
# Instead of: from myapp.models.user import User
\`\`\`

2. **Run initialization code** (connect to DB, load config, etc.)

3. **Define \`__all__\`** to control what \`from package import *\` exports

## Relative Imports

Inside a package, you can use relative imports with dot notation:

\`\`\`python
# myapp/utils/strings.py

# Absolute import
from myapp.config import Settings

# Relative import (. means current package = myapp/utils)
from . import numbers          # imports myapp/utils/numbers.py
from .numbers import format_num

# .. means one level up (= myapp/)
from ..config import Settings
from ..models.user import User
\`\`\`

Relative imports only work inside packages — not in top-level scripts. They make refactoring easier since package internals don't need to know the package's name.

## \`__all__\`: Controlling Public API

Define \`__all__\` as a list of strings to specify what names are exported:

\`\`\`python
# utils/strings.py
__all__ = ["slugify", "truncate", "capitalize_words"]

def slugify(text: str) -> str:
    return text.lower().replace(" ", "-")

def truncate(text: str, max_len: int) -> str:
    return text[:max_len] + "..." if len(text) > max_len else text

def capitalize_words(text: str) -> str:
    return " ".join(word.capitalize() for word in text.split())

def _internal_helper():  # leading _ signals it's private
    pass
\`\`\`

When someone does \`from utils.strings import *\`, only the names in \`__all__\` are imported.

## \`sys.path\`: How Python Finds Modules

Python searches for modules in this order:
1. The directory of the script being run (or current directory in the REPL)
2. Directories in the \`PYTHONPATH\` environment variable
3. Installation-dependent default locations (site-packages, stdlib)

You can inspect and modify \`sys.path\` at runtime:

\`\`\`python
import sys

print(sys.path)  # List of directories Python searches

# Add a custom directory (useful for dev setups)
sys.path.insert(0, "/path/to/my/libs")
\`\`\`

## \`importlib\`: Dynamic Imports

For dynamic imports (when you don't know the module name until runtime), use \`importlib\`:

\`\`\`python
import importlib

# Import a module by name string
module_name = "json"
json = importlib.import_module(module_name)
print(json.dumps({"key": "value"}))

# Import a specific attribute from a module
loads = getattr(importlib.import_module("json"), "loads")
data = loads('{"answer": 42}')
\`\`\`

This is used internally by plugin systems, dependency injection frameworks, and test runners.

## Module Caching

Python caches imported modules in \`sys.modules\`. Subsequent \`import\` statements for the same module return the cached version without re-executing the module file:

\`\`\`python
import sys
import json

print("json" in sys.modules)  # True — already cached

# Force a reload (rarely needed — use carefully)
import importlib
importlib.reload(json)
\`\`\`

## Best Practices

- **Group imports**: stdlib first, then third-party, then local imports
- **Use absolute imports** in application code for clarity
- **Use relative imports** inside packages for internal references
- **Always use the \`__name__ == "__main__"\` guard** in scripts
- **Define \`__all__\`** in modules that are meant to be public APIs
- **Avoid circular imports** — restructure code if modules import each other
`,
  quiz: [
    {
      question: "What is the value of `__name__` when a Python file is run directly as a script (e.g., `python myscript.py`)?",
      options: [
        '"myscript"',
        '"myscript.py"',
        '"__main__"',
        '"__script__"',
      ],
      correctIndex: 2,
    },
    {
      question: "What is the purpose of `__init__.py` in a Python package directory?",
      options: [
        "It stores the package version and is required for pip to install the package",
        "It marks the directory as a Python package and runs when the package is imported; it can re-export names for a cleaner public API",
        "It lists all modules in the package so Python can find them without searching the filesystem",
        "It defines the entry point for the package when run with python -m",
      ],
      correctIndex: 1,
    },
    {
      question: "In a relative import like `from ..utils import helper`, what does `..` mean?",
      options: [
        "Import from the project root directory",
        "Import from the Python standard library",
        "Go up two directory levels from the current file's package",
        "Go up one directory level to the parent package",
      ],
      correctIndex: 3,
    },
  ],
};
