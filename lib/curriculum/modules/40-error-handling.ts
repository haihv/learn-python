import type { LessonModule } from "../types";

export const errorHandling: LessonModule = {
  type: "lesson",
  id: "40",
  slug: "error-handling",
  title: "try / except / finally / else",
  icon: "🛡️",
  estimatedMinutes: 12,
  content: `# Error Handling: try / except / finally / else

Errors are normal in programming. Files don't exist, network requests fail, users enter invalid input. Python's exception system lets you handle these situations gracefully instead of crashing.

## Basic try / except

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Program continues after the except block
print("Continuing...")
\`\`\`

Code in the \`try\` block runs until either it completes or an exception is raised. If an exception matches an \`except\` clause, that clause runs. If no \`except\` matches, the exception propagates up.

## Catching Specific Exceptions

Always catch the most specific exception you can:

\`\`\`python
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None

def parse_age(text):
    try:
        age = int(text)
        if age < 0 or age > 150:
            raise ValueError(f"Unrealistic age: {age}")
        return age
    except ValueError as e:
        print(f"Invalid age: {e}")
        return None

print(parse_age("25"))    # 25
print(parse_age("abc"))   # Invalid age: invalid literal for int()...
print(parse_age("-5"))    # Invalid age: Unrealistic age: -5
\`\`\`

## except as e — Accessing the Exception Object

\`\`\`python
try:
    with open("nonexistent.txt") as f:
        content = f.read()
except FileNotFoundError as e:
    print(f"File error: {e}")
    print(f"Filename: {e.filename}")
    print(f"Error code: {e.errno}")
except PermissionError as e:
    print(f"Permission denied: {e}")
\`\`\`

The exception object \`e\` gives you access to the error message and any exception-specific attributes.

## Multiple except Clauses

\`\`\`python
def safe_get(lst, index):
    try:
        return lst[index]
    except IndexError:
        print(f"Index {index} is out of range")
        return None
    except TypeError:
        print(f"Index must be an integer, got {type(index).__name__}")
        return None

safe_get([1, 2, 3], 10)   # Index 10 is out of range
safe_get([1, 2, 3], "a")  # Index must be an integer, got str
\`\`\`

You can also catch multiple exceptions in one clause:

\`\`\`python
try:
    value = int(input("Enter a number: "))
except (ValueError, EOFError) as e:
    print(f"Input error: {e}")
\`\`\`

## The else Clause

The \`else\` block runs only if the \`try\` block completed **without raising an exception**. It's ideal for code that should run on success but that you don't want inside the \`try\` block:

\`\`\`python
def read_config(path):
    try:
        f = open(path)
    except FileNotFoundError:
        print(f"Config file {path!r} not found, using defaults")
        return {}
    else:
        # Only runs if open() succeeded
        data = f.read()
        f.close()
        return parse_config(data)

# Why else instead of putting code in try?
# If parse_config() raises an exception, we want it to propagate —
# not be caught by the except FileNotFoundError clause.
\`\`\`

## The finally Clause

The \`finally\` block **always runs**, whether an exception occurred or not. Use it for cleanup:

\`\`\`python
def process_file(path):
    f = None
    try:
        f = open(path)
        data = f.read()
        return data.upper()
    except FileNotFoundError:
        print(f"File not found: {path}")
        return None
    finally:
        if f is not None:
            f.close()      # Always close the file
            print("File closed")

# Note: in practice, use 'with' statements instead of finally for files
# The above is a demonstration of the finally pattern
\`\`\`

\`finally\` runs even if:
- The \`try\` block raises an unhandled exception
- The \`except\` block raises a new exception
- A \`return\` or \`break\` statement is executed

## Complete Structure

All four clauses together:

\`\`\`python
try:
    # Code that might raise an exception
    result = risky_operation()
except SpecificError as e:
    # Handle the specific error
    print(f"Expected error: {e}")
except (AnotherError, YetAnotherError):
    # Handle multiple exception types
    pass
except Exception as e:
    # Catch-all for unexpected exceptions (use sparingly)
    print(f"Unexpected error: {e}")
    raise   # Re-raise — don't silently swallow unexpected errors
else:
    # Runs only if no exception occurred in try
    process_result(result)
finally:
    # Always runs — cleanup
    cleanup()
\`\`\`

## Exception Hierarchy

Python exceptions form a hierarchy. Catching a parent class catches all subclasses:

\`\`\`
BaseException
├── SystemExit
├── KeyboardInterrupt
├── GeneratorExit
└── Exception
    ├── ArithmeticError
    │   ├── ZeroDivisionError
    │   └── OverflowError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── ValueError
    ├── TypeError
    ├── AttributeError
    ├── NameError
    ├── OSError
    │   ├── FileNotFoundError
    │   ├── PermissionError
    │   └── TimeoutError
    └── RuntimeError
\`\`\`

\`\`\`python
# Catching LookupError catches both IndexError and KeyError
try:
    d = {"key": "value"}
    print(d["missing"])    # KeyError
    print([1, 2][5])       # IndexError
except LookupError as e:
    print(f"Lookup failed: {e}")
\`\`\`

## Common Exceptions Quick Reference

| Exception | When it occurs |
|-----------|---------------|
| \`ValueError\` | Correct type, wrong value: \`int("abc")\` |
| \`TypeError\` | Wrong type: \`1 + "2"\` |
| \`KeyError\` | Missing dict key: \`d["missing"]\` |
| \`IndexError\` | List index out of range: \`lst[100]\` |
| \`AttributeError\` | Attribute doesn't exist: \`obj.missing\` |
| \`FileNotFoundError\` | File doesn't exist |
| \`ZeroDivisionError\` | Division by zero |
| \`NameError\` | Variable not defined |
| \`StopIteration\` | Iterator exhausted |
| \`RuntimeError\` | Generic runtime error |

## Best Practices

**Do:** Catch specific exceptions. Handle errors at the appropriate level. Use \`else\` for success-path code. Use \`finally\` for cleanup (though context managers are often better).

**Don't:** Use bare \`except:\` (catches even \`KeyboardInterrupt\`). Silently swallow exceptions (\`except: pass\`). Catch \`Exception\` unless you re-raise or log it.

\`\`\`python
# Bad: swallows all errors silently
try:
    result = compute()
except:
    pass

# Better: catch specific exceptions, log or re-raise
try:
    result = compute()
except ValueError as e:
    log.warning(f"Invalid input: {e}")
    result = default_value
except Exception as e:
    log.error(f"Unexpected error: {e}")
    raise  # Re-raise unexpected errors
\`\`\`
`,
  quiz: [
    {
      question: "When does the `else` clause in a try/except run?",
      options: [
        "When any exception is raised in the try block",
        "Only when a specific exception is caught",
        "Only when the try block completes without raising any exception",
        "Always, after the except block runs",
      ],
      correctIndex: 2,
    },
    {
      question: "What is the key difference between catching `Exception` vs bare `except:`?",
      options: [
        "There is no difference — they catch the same exceptions",
        "Bare `except:` also catches SystemExit and KeyboardInterrupt which inherit from BaseException, not Exception",
        "`except Exception` is invalid Python syntax",
        "Bare `except:` only catches runtime errors",
      ],
      correctIndex: 1,
    },
    {
      question: "When does the `finally` block run?",
      options: [
        "Only when an exception is raised",
        "Only when no exception is raised",
        "Only after a successful except clause",
        "Always — whether an exception occurred or not",
      ],
      correctIndex: 3,
    },
  ],
};
