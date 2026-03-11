import type { LessonModule } from "../types";

export const intro: LessonModule = {
  type: "lesson",
  id: "01",
  slug: "intro",
  title: "Introduction to Python",
  icon: "🐍",
  estimatedMinutes: 10,
  content: `# Introduction to Python

Python is one of the world's most popular programming languages, and for good reason. Created by Guido van Rossum and first released in 1991, Python was designed with a clear philosophy: code should be readable, and there should be one obvious way to do things. Today, Python powers everything from Instagram's backend to NASA's data analysis pipelines.

## What Makes Python Special?

Python stands out from other languages in several key ways:

**Readability first.** Python uses indentation to define code blocks instead of curly braces. This forces you to write visually clean code by default.

**Batteries included.** Python ships with an enormous standard library. Need to parse JSON, send HTTP requests, work with dates, or do matrix math? There's almost certainly a built-in module for it.

**Versatile.** Python excels at web development (Django, FastAPI), data science (NumPy, pandas), machine learning (PyTorch, TensorFlow), automation/scripting, and system administration.

**Dynamic typing.** You don't declare variable types. Python figures out types at runtime, making exploratory coding fast and flexible.

## Python vs Other Languages

| Feature | Python | JavaScript | Java |
|---------|--------|-----------|------|
| Typing | Dynamic | Dynamic | Static |
| Syntax | Indentation | Curly braces | Curly braces |
| Execution | Interpreted | JIT/Interpreted | Compiled to bytecode |
| Primary use | General purpose | Web/Node | Enterprise |

## Anatomy of a Python Script

Let's look at a simple Python script and break down each piece:

\`\`\`python
# This is a comment - Python ignores everything after #

# The print() function outputs text to the terminal
print("Hello, World!")

# Variables don't need type declarations
name = "Alice"
age = 30

# Indentation (4 spaces) defines code blocks
if age >= 18:
    print(f"{name} is an adult")  # This line is inside the if block
    print("Welcome!")             # So is this one
print("This is outside the if")  # Back to no indentation = outside the block
\`\`\`

### The \`print()\` Function

\`print()\` is your primary tool for output. It accepts multiple arguments separated by commas:

\`\`\`python
print("Hello", "World")          # Hello World
print("Hello", "World", sep="-") # Hello-World
print("Line 1", end=" ")         # Doesn't add newline
print("Line 2")                  # Line 1 Line 2
\`\`\`

### Comments

Comments explain your *why*, not your *what*. Python ignores everything from \`#\` to the end of the line:

\`\`\`python
# This is a single-line comment

x = 42  # Inline comment after code

# Multi-line comments are just multiple single-line comments
# There's no official block comment syntax in Python,
# though triple-quoted strings are sometimes used informally
\`\`\`

### Indentation Rules

Python is strict about indentation. Use **4 spaces** (not tabs) as the Python community standard:

\`\`\`python
if True:
    print("Inside block")  # 4 spaces
    if True:
        print("Nested")    # 8 spaces
print("Outside")           # 0 spaces
\`\`\`

Mixing tabs and spaces causes a \`TabError\`. Configure your editor to insert spaces when you press Tab.

## The Python REPL

REPL stands for **Read-Eval-Print Loop**. Open a terminal and type \`python3\` to start it:

\`\`\`
$ python3
Python 3.12.0 (main, ...)
>>> 2 + 2
4
>>> name = "Python"
>>> print(f"Hello, {name}!")
Hello, Python!
>>> exit()
\`\`\`

The REPL is perfect for experimenting. Each expression you type is evaluated immediately and its result displayed. Use \`exit()\` or Ctrl+D to quit.

## Running Python Scripts

Save your code in a \`.py\` file and run it from the terminal:

\`\`\`bash
# Create a file called hello.py with your code
python3 hello.py

# Run with arguments
python3 myscript.py arg1 arg2

# Make a script executable on Unix (add #!/usr/bin/env python3 as first line)
chmod +x myscript.py
./myscript.py
\`\`\`

## Python 3 vs Python 2

Python 2 reached end-of-life on January 1, 2020. **Always use Python 3.** Key differences:

- \`print\` is a function in Python 3: \`print("hello")\` not \`print "hello"\`
- Division works correctly: \`7 / 2 = 3.5\` in Python 3, \`3\` in Python 2
- Strings are Unicode by default in Python 3
- \`range()\` returns an iterator in Python 3, a list in Python 2

Check your version with:
\`\`\`bash
python3 --version
# Python 3.12.0
\`\`\`

## The Standard Library

Python's standard library is massive. Here are some essential modules you'll use frequently:

\`\`\`python
import os          # Operating system interface: file paths, environment variables
import sys         # System-specific parameters: argv, stdin, stdout
import math        # Mathematical functions: sqrt, floor, ceil, pi
import random      # Random number generation
import datetime    # Date and time manipulation
import json        # JSON encoding and decoding
import re          # Regular expressions
import pathlib     # Object-oriented file paths
import collections # Specialized container types: Counter, defaultdict, deque
import itertools   # Efficient iterators: chain, product, combinations
import functools   # Higher-order functions: reduce, partial, cache
\`\`\`

You'll explore many of these modules as you progress through this course. The standard library is one of Python's greatest strengths — most common programming tasks don't require any third-party packages.

## Your First Real Script

Here's a script that demonstrates several Python concepts working together:

\`\`\`python
#!/usr/bin/env python3
"""A simple greeting script that demonstrates Python basics."""

import datetime

# Get the current hour to determine time of day
current_hour = datetime.datetime.now().hour

# Choose greeting based on time
if current_hour < 12:
    greeting = "Good morning"
elif current_hour < 17:
    greeting = "Good afternoon"
else:
    greeting = "Good evening"

# Get user's name
name = input("What's your name? ")

# Print personalized greeting
print(f"{greeting}, {name}! Welcome to Python.")
print(f"The current time is {datetime.datetime.now().strftime('%H:%M')}.")
\`\`\`

This script imports a module, uses conditionals, takes user input, and formats output — all core Python concepts you'll master in this course.
`,
  quiz: [
    {
      question: "What character does Python use to mark the beginning of a comment?",
      options: ["//", "/*", "#", "--"],
      correctIndex: 2,
    },
    {
      question: "What does REPL stand for in the context of Python's interactive shell?",
      options: [
        "Run-Execute-Print-Loop",
        "Read-Eval-Print-Loop",
        "Read-Execute-Process-Log",
        "Runtime-Evaluation-Processing-Layer",
      ],
      correctIndex: 1,
    },
    {
      question: "Which Python version should you use for new projects today?",
      options: [
        "Python 2, because it's more stable",
        "Python 2.7, the last Python 2 release",
        "Python 3, because Python 2 reached end-of-life",
        "Either version works fine",
      ],
      correctIndex: 2,
    },
  ],
};
