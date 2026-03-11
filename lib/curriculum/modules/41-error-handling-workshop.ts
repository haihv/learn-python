import type { WorkshopModule } from "../types";

export const errorHandlingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "41",
  slug: "error-handling-workshop",
  title: "raise, Custom Exceptions, Exception Chaining",
  icon: "⚠️",
  estimatedMinutes: 20,
  description: "Master Python's full exception system",
  steps: [
    {
      instruction:
        "Write a `validate_age(age)` function that raises `ValueError` with a descriptive message if `age < 0` or `age > 150`. If the age is valid, return it. Test your function with ages: -1, 200, 25, 0, and 150.",
      hint: "Use `if age < 0: raise ValueError('Age cannot be negative')` and `if age > 150: raise ValueError('Age is unrealistically large')`. Wrap calls in try/except to see the messages.",
      starterCode: `def validate_age(age):
    # TODO: raise ValueError if age < 0 or age > 150
    # Otherwise return age
    pass

# Test with various values
test_ages = [-1, 200, 25, 0, 150]
for age in test_ages:
    try:
        result = validate_age(age)
        print(f"validate_age({age}) -> {result}")
    except ValueError as e:
        print(f"validate_age({age}) -> ValueError: {e}")
`,
      validate: (code: string) => {
        return (
          code.includes("raise ValueError") &&
          code.includes("def validate_age") &&
          (code.includes("age < 0") || code.includes("0 > age")) &&
          (code.includes("age > 150") || code.includes("150 < age"))
        );
      },
      successMessage:
        "Raising built-in exceptions with clear messages is the foundation of defensive programming. The message becomes the str(e) that callers see — make it descriptive and actionable.",
    },
    {
      instruction:
        "Define a custom `ValidationError` exception class that inherits from `Exception`. Give it a `field` attribute (set in `__init__`) that stores the name of the field that failed validation. Raise it in a `validate_user(data)` function that checks that `data['name']` is non-empty and `data['email']` contains '@'. Print `err.field` in the except block.",
      hint: "class ValidationError(Exception): def __init__(self, message, field): super().__init__(message) then self.field = field. Raise it as: raise ValidationError('Name is required', field='name').",
      starterCode: `class ValidationError(Exception):
    def __init__(self, message, field):
        super().__init__(message)
        self.field = field


def validate_user(data):
    # TODO: check data['name'] is non-empty string
    # TODO: check data['email'] contains '@'
    # Raise ValidationError with appropriate message and field name
    return True


# Test cases
test_data = [
    {"name": "Alice", "email": "alice@example.com"},
    {"name": "", "email": "bob@example.com"},
    {"name": "Charlie", "email": "not-an-email"},
]

for data in test_data:
    try:
        validate_user(data)
        print(f"Valid: {data}")
    except ValidationError as err:
        print(f"ValidationError on field '{err.field}': {err}")
`,
      validate: (code: string) => {
        return (
          code.includes("class ValidationError(Exception)") &&
          code.includes("self.field") &&
          code.includes("super().__init__") &&
          code.includes("raise ValidationError")
        );
      },
      successMessage:
        "Custom exception classes let callers distinguish your errors from generic ones and inspect structured metadata like `field`. This is standard in web frameworks, ORMs, and validation libraries.",
    },
    {
      instruction:
        "Practice exception chaining with `raise ... from ...`. Write a `load_config(path)` function that tries to open and parse a JSON-like config (just use `int()` on a string). When a low-level error occurs, raise a `RuntimeError('Failed to load config')` chained from the original error using `raise RuntimeError(...) from e`. Then inspect `__cause__` on the caught exception.",
      hint: "Use `raise RuntimeError('Failed to load config') from e` inside an except block. The resulting exception has `.__cause__` pointing to the original. Python's traceback shows 'The above exception was the direct cause of...'.",
      starterCode: `def load_config(raw_value):
    """Simulate loading a config value that must be an integer."""
    try:
        # Simulate parsing — this will fail if raw_value isn't a number
        return int(raw_value)
    except ValueError as e:
        # TODO: raise RuntimeError chained from e
        pass


# Test with a bad value
try:
    result = load_config("not-a-number")
except RuntimeError as err:
    print(f"RuntimeError: {err}")
    print(f"Caused by: {err.__cause__}")
    print(f"Cause type: {type(err.__cause__).__name__}")
    print(f"Cause message: {err.__cause__}")

# Test with a good value
result = load_config("42")
print(f"\\nLoaded config value: {result}")
`,
      validate: (code: string) => {
        return (
          code.includes("raise RuntimeError") &&
          code.includes(" from ") &&
          code.includes("__cause__")
        );
      },
      successMessage:
        "Exception chaining (`raise X from Y`) preserves the full causal chain. It tells users 'this high-level error happened because of this low-level error'. The `__cause__` attribute lets programmatic inspection of the chain.",
    },
    {
      instruction:
        "Implement a logging middleware pattern: write a `safe_execute(func, *args)` function that calls `func(*args)`, and if any exception occurs, prints `'[LOG] Error: <message>'` and then re-raises the same exception using bare `raise` (no argument). Verify the exception still propagates after logging.",
      hint: "Use `except Exception as e: print(f'[LOG] Error: {e}') then raise` (bare raise re-raises the active exception without losing the traceback). The caller still receives the exception.",
      starterCode: `def safe_execute(func, *args):
    """Call func(*args), log any exception, then re-raise it."""
    try:
        return func(*args)
    except Exception as e:
        # TODO: print "[LOG] Error: <message>" then re-raise
        pass


def risky_divide(a, b):
    return a / b

def risky_parse(text):
    return int(text)


# Test 1: ZeroDivisionError
try:
    result = safe_execute(risky_divide, 10, 0)
except ZeroDivisionError as e:
    print(f"Caller caught: ZeroDivisionError: {e}")

print()

# Test 2: ValueError
try:
    result = safe_execute(risky_parse, "hello")
except ValueError as e:
    print(f"Caller caught: ValueError: {e}")

print()

# Test 3: success case
result = safe_execute(risky_divide, 10, 2)
print(f"Success: {result}")
`,
      validate: (code: string) => {
        // After replacing "raise <identifier>" with "raise X", a bare `raise`
        // on its own line will still match /raise\s*$/m — confirming it's present
        const hasBareRaise = /raise\s*$/m.test(
          code.replace(/raise\s+\w/g, "raise X")
        );
        return (
          code.includes("def safe_execute") &&
          code.includes("[LOG]") &&
          hasBareRaise &&
          code.includes("except Exception")
        );
      },
      successMessage:
        "Bare `raise` re-raises the current exception with its original traceback intact. This is critical for logging middleware — you observe the exception without swallowing it or altering the stack trace.",
    },
    {
      instruction:
        "Write a `suppress_errors(*exc_types)` context manager class (using `__enter__` / `__exit__`) that suppresses only the specified exception types and lets all others propagate. Test it by suppressing `ValueError` but not `TypeError`.",
      hint: "__exit__(self, exc_type, exc_val, exc_tb): if exc_type is not None and issubclass(exc_type, self.exc_types): return True  # suppress. Return False (or None) otherwise. Store exc_types as a tuple in __init__.",
      starterCode: `class suppress_errors:
    def __init__(self, *exc_types):
        self.exc_types = exc_types

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: suppress exception if it's one of self.exc_types
        # Return True to suppress, False/None to propagate
        pass


# Test 1: ValueError is suppressed
print("Test 1: suppressing ValueError")
with suppress_errors(ValueError):
    int("not a number")  # raises ValueError — should be suppressed
print("Continued after ValueError was suppressed")

# Test 2: ZeroDivisionError is also suppressed when listed
print("\\nTest 2: suppressing ZeroDivisionError")
with suppress_errors(ValueError, ZeroDivisionError):
    result = 1 / 0
print("Continued after ZeroDivisionError was suppressed")

# Test 3: TypeError is NOT suppressed
print("\\nTest 3: TypeError propagates")
try:
    with suppress_errors(ValueError):
        result = 1 + "oops"  # TypeError — should NOT be suppressed
except TypeError as e:
    print(f"TypeError propagated correctly: {e}")
`,
      validate: (code: string) => {
        return (
          code.includes("class suppress_errors") &&
          code.includes("__enter__") &&
          code.includes("__exit__") &&
          code.includes("exc_type") &&
          (code.includes("issubclass") || code.includes("exc_types")) &&
          code.includes("return True")
        );
      },
      successMessage:
        "Context managers for error suppression are a powerful pattern — Python's own `contextlib.suppress` works exactly this way. Returning `True` from `__exit__` tells Python the exception has been handled.",
    },
  ],
};
