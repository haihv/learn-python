import type { LessonModule } from "../types";

export const logging: LessonModule = {
  type: "lesson",
  id: "82",
  slug: "logging",
  title: "logging: levels, handlers, formatters, getLogger",
  icon: "📝",
  estimatedMinutes: 15,
  content: `# Python Logging

The \`logging\` module is Python's built-in solution for recording program events. Replacing \`print()\` with logging gives you control over what gets recorded, where it goes, and how it's formatted — without changing your code.

## Why Use logging Instead of print()

\`print()\` goes to stdout and has no built-in way to filter by severity, route to files, or disable in production. The \`logging\` module provides all of this:

\`\`\`python
# Bad: print() in production code
def process_order(order_id):
    print(f"Processing order {order_id}")      # Can't disable
    print(f"DEBUG: internal state={state}")     # No severity

# Good: structured logging
import logging
logger = logging.getLogger(__name__)

def process_order(order_id):
    logger.info(f"Processing order {order_id}")
    logger.debug(f"Internal state: {state}")   # Disabled in production
\`\`\`

## Log Levels

Python defines five standard log levels, in increasing severity:

| Level | Value | When to use |
|-------|-------|-------------|
| \`DEBUG\` | 10 | Detailed diagnostic info — only useful for debugging |
| \`INFO\` | 20 | Confirmation that things are working as expected |
| \`WARNING\` | 30 | Something unexpected happened, but the program continues |
| \`ERROR\` | 40 | A serious problem — the program couldn't do something |
| \`CRITICAL\` | 50 | A fatal error — the program may not be able to continue |

\`\`\`python
import logging

logging.basicConfig(level=logging.DEBUG)

logging.debug("Loading config file")       # Detailed debug info
logging.info("Server started on port 8080") # Normal operations
logging.warning("Disk space below 10%")    # Potential problem
logging.error("Failed to connect to DB")   # Something broke
logging.critical("Out of memory!")         # Severe failure
\`\`\`

## logging.basicConfig()

The simplest setup — configures the root logger. Call this once, early in your program:

\`\`\`python
import logging

# Minimal: just set the level
logging.basicConfig(level=logging.INFO)

# With format and output file
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    filename="app.log",       # Write to file instead of stderr
    filemode="a",             # Append mode (default is 'a')
)
\`\`\`

**Important**: \`basicConfig()\` only works if the root logger has no handlers yet. It has no effect if called after logging has already been configured.

## Format String Variables

| Variable | Meaning |
|----------|---------|
| \`%(asctime)s\` | Human-readable time |
| \`%(name)s\` | Logger name |
| \`%(levelname)s\` | Level name (DEBUG, INFO, …) |
| \`%(message)s\` | The log message |
| \`%(filename)s\` | Source filename |
| \`%(lineno)d\` | Line number in source |
| \`%(funcName)s\` | Function name |

## logging.getLogger(__name__)

In any module, get a logger named after the module:

\`\`\`python
# In myapp/database.py
import logging

logger = logging.getLogger(__name__)   # Name: "myapp.database"

def connect(url):
    logger.info(f"Connecting to {url}")
    try:
        conn = create_connection(url)
        logger.debug("Connection established")
        return conn
    except ConnectionError as e:
        logger.error(f"Connection failed: {e}")
        raise
\`\`\`

Using \`__name__\` creates a hierarchy that mirrors your package structure. You can configure logging for \`myapp\` and it automatically applies to \`myapp.database\`, \`myapp.api\`, etc.

## Handlers — Where Logs Go

A **handler** sends log records to a destination. One logger can have multiple handlers:

\`\`\`python
import logging

logger = logging.getLogger("myapp")
logger.setLevel(logging.DEBUG)    # Logger processes all levels

# Handler 1: Print INFO and above to console
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Handler 2: Write all DEBUG+ to a file
file_handler = logging.FileHandler("debug.log")
file_handler.setLevel(logging.DEBUG)

logger.addHandler(console_handler)
logger.addHandler(file_handler)

logger.debug("Only in file")         # Goes to file only
logger.info("In both places")        # Goes to console and file
logger.error("Definitely in both")   # Goes to console and file
\`\`\`

## Formatters — How Logs Look

Attach a \`Formatter\` to a handler to control the output format:

\`\`\`python
import logging

# Different formats for different handlers
console_fmt = logging.Formatter("%(levelname)s: %(message)s")
file_fmt = logging.Formatter(
    "%(asctime)s [%(name)s] %(levelname)s %(filename)s:%(lineno)d — %(message)s"
)

console_handler = logging.StreamHandler()
console_handler.setFormatter(console_fmt)

file_handler = logging.FileHandler("app.log")
file_handler.setFormatter(file_fmt)
\`\`\`

## Logging Exceptions

Log exceptions with their full traceback:

\`\`\`python
try:
    result = risky_operation()
except ValueError as e:
    logger.exception("risky_operation failed")  # Logs ERROR + full traceback
    # Equivalent to: logger.error("...", exc_info=True)
\`\`\`

## Logger Propagation

By default, log records propagate up to parent loggers. The root logger is the ultimate parent:

\`\`\`python
# myapp.database logger propagates to myapp, then to root
# This is usually what you want — configure once at the root level

# Disable propagation if needed (rare)
logger.propagate = False
\`\`\`

## Logging Context with extra={}

Pass extra fields to add contextual information to log records:

\`\`\`python
import logging

logging.basicConfig(
    format="%(asctime)s [user=%(user)s] %(levelname)s %(message)s",
    level=logging.INFO,
)

logger = logging.getLogger(__name__)

def handle_request(user_id, action):
    logger.info(f"Action: {action}", extra={"user": user_id})
    # Output: 2024-01-15 10:30:00 [user=alice123] INFO Action: login

handle_request("alice123", "login")
\`\`\`

## Best Practices

1. **Never use \`print()\` in library code** — it pollutes user output. Use \`logging\`.
2. **Use \`logging.getLogger(__name__)\`** — not the root logger directly.
3. **Set levels on handlers, not messages** — one codebase, multiple deployment configurations.
4. **Log the why, not the what** — "Connection failed after 3 retries" not "Error occurred".
5. **Use lazy formatting**: \`logger.debug("Value: %s", expensive_repr)\` — the string isn't formatted if DEBUG is disabled.

\`\`\`python
# Efficient: string formatting only happens if DEBUG is enabled
logger.debug("Processing item: %s", item)

# Inefficient: always formats the string even if DEBUG is off
logger.debug(f"Processing item: {item}")
\`\`\`
`,
  quiz: [
    {
      question: "What is the correct order of Python logging levels from lowest to highest severity?",
      options: [
        "INFO, DEBUG, WARNING, ERROR, CRITICAL",
        "DEBUG, INFO, WARNING, ERROR, CRITICAL",
        "DEBUG, WARNING, INFO, ERROR, CRITICAL",
        "TRACE, DEBUG, INFO, WARNING, ERROR",
      ],
      correctIndex: 1,
    },
    {
      question: "Why should you use `logging.getLogger(__name__)` instead of using the root logger directly?",
      options: [
        "The root logger is deprecated in Python 3.10+",
        "It creates a named logger in the module hierarchy, enabling per-module filtering and configuration",
        "The root logger doesn't support file handlers",
        "getLogger(__name__) is faster because it bypasses the propagation chain",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the most efficient way to log a debug message that involves an expensive string operation?",
      options: [
        "logger.debug(f'Value: {expensive_fn()}')",
        "if logger.isEnabledFor(logging.DEBUG): logger.debug('Value: ' + expensive_fn())",
        "logger.debug('Value: %s', expensive_fn())",
        "logging.debug(str(expensive_fn()))",
      ],
      correctIndex: 2,
    },
  ],
};
