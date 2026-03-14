import type { LabModule } from "../types";

export const decoratorsLab: LabModule = {
  type: "lab",
  id: "33",
  slug: "decorators-lab",
  title: "Decorator Challenge",
  icon: "🧪",
  estimatedMinutes: 25,
  description: "Build a logging decorator with configurable behavior",
  instructions: `# Decorator Challenge: Configurable Logger

Build a decorator system that provides configurable, structured logging for function calls.

## Requirements

### 1. \`audit_log(action, category="GENERAL")\` — Decorator Factory

Create a decorator factory \`audit_log(action, category="GENERAL")\` that logs each call with:
- The action label
- The category
- Function name
- Arguments passed
- Return value
- Execution time

Each log entry should be printed to stdout in this exact format:
\`\`\`
[CATEGORY] ACTION | fn=function_name | args=(...) | result=... | time=0.0012s
\`\`\`

### 2. \`rate_limit(calls_per_second)\` — Rate Limiting Decorator

Create a decorator \`rate_limit(calls_per_second)\` that raises a \`RuntimeError("Rate limit exceeded")\` if the function is called more times per second than allowed.

Track the last call time using a closure variable. If the interval since the last call is less than \`1 / calls_per_second\` seconds, raise the error.

### 3. Compose Both Decorators

Apply both decorators to a \`process_payment(amount, currency)\` function:

\`\`\`python
@audit_log("PAYMENT", category="FINANCE")
@rate_limit(calls_per_second=2)
def process_payment(amount, currency="USD"):
    return f"Processed {currency} {amount:.2f}"
\`\`\`

### 4. Metadata Preservation

Verify that \`process_payment.__name__\` is \`"process_payment"\` (not \`"wrapper"\`).

## Starter Code

\`\`\`python
import time
from functools import wraps

def audit_log(action, category="GENERAL"):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = func(*args, **kwargs)
            elapsed = time.perf_counter() - start
            print(
                f"[{category}] {action} | fn={func.__name__} | "
                f"args={args} | result={result!r} | time={elapsed:.4f}s"
            )
            return result
        return wrapper
    return decorator

def rate_limit(calls_per_second):
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]  # use list so closure can mutate it

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            if now - last_called[0] < min_interval:
                raise RuntimeError("Rate limit exceeded")
            last_called[0] = now
            return func(*args, **kwargs)
        return wrapper
    return decorator

@audit_log("PAYMENT", category="FINANCE")
@rate_limit(calls_per_second=2)
def process_payment(amount, currency="USD"):
    """Process a payment transaction."""
    return f"Processed {currency} {amount:.2f}"

# Test normal usage
print(process_payment(100.00))
time.sleep(0.6)
print(process_payment(50.00, "EUR"))

# Test rate limiting
try:
    process_payment(200.00)  # Rapid call — may be rate limited
    process_payment(300.00)  # Should definitely be rate limited
except RuntimeError as e:
    print(f"Rate limited: {e}")

# Verify metadata
print(f"Name: {process_payment.__name__}")
print(f"Doc:  {process_payment.__doc__}")
\`\`\`
`,
  starterCode: `import time
from functools import wraps

def audit_log(action, category="GENERAL"):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # TODO: time the call, print log line, return result
            pass
        return wrapper
    return decorator

def rate_limit(calls_per_second):
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # TODO: check rate limit, raise RuntimeError if exceeded,
            # update last_called, call and return func
            pass
        return wrapper
    return decorator

@audit_log("PAYMENT", category="FINANCE")
@rate_limit(calls_per_second=2)
def process_payment(amount, currency="USD"):
    """Process a payment transaction."""
    return f"Processed {currency} {amount:.2f}"

print(process_payment(100.00))
time.sleep(0.6)
print(process_payment(50.00, "EUR"))

try:
    process_payment(200.00)
    process_payment(300.00)
except RuntimeError as e:
    print(f"Rate limited: {e}")

print(f"Name: {process_payment.__name__}")
print(f"Doc:  {process_payment.__doc__}")
`,
  tests: [
    {
      name: "audit_log produces output",
      description: "The audit_log decorator should print a log line containing the action and category",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("FINANCE") && stdout.includes("PAYMENT");
      },
    },
    {
      name: "Processed payment appears in output",
      description: "process_payment should return a string with 'Processed' and the amount",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("Processed USD 100.00") || stdout.includes("Processed");
      },
    },
    {
      name: "Rate limit error is raised and caught",
      description: "Calling process_payment too rapidly should raise RuntimeError with 'Rate limit exceeded'",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("Rate limited") || stdout.includes("Rate limit exceeded");
      },
    },
    {
      name: "Metadata is preserved on decorated function",
      description: "process_payment.__name__ should be 'process_payment', not 'wrapper'",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("process_payment") && !stdout.includes("Name: wrapper");
      },
    },
    {
      name: "Docstring is preserved",
      description: "process_payment.__doc__ should contain the original docstring",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("Process a payment transaction") || stdout.includes("Doc:");
      },
    },
  ],
  solutionCode: `import time
from functools import wraps

def audit_log(action, category="GENERAL"):
    """Decorator factory that logs function calls with timing."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = func(*args, **kwargs)
            elapsed = time.perf_counter() - start
            print(
                f"[{category}] {action} | fn={func.__name__} | "
                f"args={args} | result={result!r} | time={elapsed:.4f}s"
            )
            return result
        return wrapper
    return decorator

def rate_limit(calls_per_second):
    """Decorator factory that enforces a maximum call rate."""
    min_interval = 1.0 / calls_per_second
    # List wrapper allows mutation from within the closure
    last_called = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            if now - last_called[0] < min_interval:
                raise RuntimeError("Rate limit exceeded")
            last_called[0] = now
            return func(*args, **kwargs)
        return wrapper
    return decorator

@audit_log("PAYMENT", category="FINANCE")
@rate_limit(calls_per_second=2)
def process_payment(amount, currency="USD"):
    """Process a payment transaction."""
    return f"Processed {currency} {amount:.2f}"

print(process_payment(100.00))
time.sleep(0.6)
print(process_payment(50.00, "EUR"))

try:
    process_payment(200.00)
    process_payment(300.00)
except RuntimeError as e:
    print(f"Rate limited: {e}")

print(f"Name: {process_payment.__name__}")
print(f"Doc:  {process_payment.__doc__}")
`,
};
