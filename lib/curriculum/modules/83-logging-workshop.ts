import type { WorkshopModule } from "../types";

export const loggingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "83",
  slug: "logging-workshop",
  title: "Structured Logging & Multiple Handlers",
  icon: "📊",
  estimatedMinutes: 20,
  description: "Set up professional logging with multiple handlers and formatters",
  steps: [
    {
      instruction:
        "Set up basic logging using `logging.basicConfig()`. Configure it with `level=logging.DEBUG` and `format='%(levelname)s:%(name)s:%(message)s'`. Then log one message at each level: DEBUG, INFO, WARNING, ERROR.",
      hint: "Call `logging.basicConfig(level=logging.DEBUG, format='%(levelname)s:%(name)s:%(message)s')` before any logging calls. Then use `logging.debug()`, `logging.info()`, `logging.warning()`, `logging.error()`.",
      starterCode: `import logging

# Configure basicConfig with DEBUG level and the format: "%(levelname)s:%(name)s:%(message)s"

# Log one message at each level:
# DEBUG: "Loading configuration"
# INFO: "Application started"
# WARNING: "Deprecated function called"
# ERROR: "Failed to open file"
`,
      validate: (code: string) =>
        code.includes("basicConfig") &&
        code.includes("logging.DEBUG") &&
        code.includes("logging.info") &&
        code.includes("logging.warning"),
      successMessage:
        "basicConfig is the quick way to set up logging for scripts — all log calls go through the root logger!",
    },
    {
      instruction:
        "Create a named logger with `logging.getLogger(__name__)`. Set its level to DEBUG. Log several messages using the named logger instead of the root logger. Notice how the logger name appears in the output.",
      hint: "Use `logger = logging.getLogger(__name__)` and `logger.setLevel(logging.DEBUG)`. Call `logger.debug()`, `logger.info()`, etc. The name will be `__main__` when run directly.",
      starterCode: `import logging

# Configure the root logger first
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Create a named logger for this module
# Set its level to DEBUG

# Use the named logger to log:
# debug: "Connecting to database"
# info: "User 'alice' logged in"
# warning: "Rate limit approaching: 90% used"
# error: "Payment gateway timeout"
`,
      validate: (code: string) =>
        code.includes("getLogger") &&
        code.includes("logger.") &&
        (code.includes("__name__") || code.includes('"') || code.includes("'")),
      successMessage:
        "Named loggers create a hierarchy — you can control entire subtrees of loggers with one configuration!",
    },
    {
      instruction:
        "Add multiple handlers to a logger: a `StreamHandler` (console) at INFO level and a `FileHandler` at DEBUG level. This way production consoles stay clean while the file captures everything.",
      hint: "Create `logger = logging.getLogger('myapp')`, `logger.setLevel(logging.DEBUG)`. Create two handlers: `StreamHandler()` with `setLevel(INFO)` and `FileHandler('app.log')` with `setLevel(DEBUG)`. Add both with `logger.addHandler()`.",
      starterCode: `import logging

logger = logging.getLogger("myapp")
logger.setLevel(logging.DEBUG)

# Create a StreamHandler for console output, set its level to INFO
console_handler = None  # TODO: create a handler that writes to the console, set its level to INFO

# Create a handler that writes to 'app.log', set its level to DEBUG
file_handler = None  # TODO: create a handler for a file named 'app.log', set its level to DEBUG

# Add both handlers to the logger
# TODO: register each handler on the logger object

# Test by logging at various levels — DEBUG should only go to file
logger.debug("This should only appear in app.log")
logger.info("This should appear in both console and file")
logger.error("This definitely appears everywhere")
`,
      validate: (code: string) =>
        code.includes("StreamHandler") &&
        code.includes("FileHandler") &&
        code.includes("addHandler"),
      successMessage:
        "Multiple handlers let you route logs to different destinations at different verbosity levels!",
    },
    {
      instruction:
        "Create a custom `Formatter` with a detailed format for the file handler and a minimal format for the console handler. Use `%(asctime)s`, `%(name)s`, `%(levelname)s`, `%(filename)s`, `%(lineno)d`, and `%(message)s` in the file format.",
      hint: "Create `Formatter` objects: `logging.Formatter('%(levelname)s: %(message)s')` for console and a longer format for the file. Attach with `handler.setFormatter(formatter)`.",
      starterCode: `import logging

logger = logging.getLogger("myapp")
logger.setLevel(logging.DEBUG)

# Console handler: minimal format "%(levelname)s: %(message)s"
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
# Create a format object for the console with minimal output and attach it to the handler
console_formatter = None  # TODO: create a format object with level and message fields
# TODO: attach console_formatter to console_handler using the appropriate method

# File handler: detailed format with asctime, name, levelname, filename, lineno, message
file_handler = logging.FileHandler("detailed.log")
file_handler.setLevel(logging.DEBUG)
# Create a format object for the file with all context fields and attach it to the handler
file_formatter = None  # TODO: create a format object including timestamp, logger name, level, file, line, and message
# TODO: attach file_formatter to file_handler using the appropriate method

logger.addHandler(console_handler)
logger.addHandler(file_handler)

logger.info("Application initialized")
logger.debug("Config loaded from /etc/app.conf")
logger.warning("Memory usage at 80%")
`,
      validate: (code: string) =>
        code.includes("Formatter") &&
        code.includes("setFormatter") &&
        code.includes("%(message)s"),
      successMessage:
        "Custom formatters give each handler its own style — terse for humans reading consoles, rich for machines parsing log files!",
    },
    {
      instruction:
        "Use the `extra={}` parameter to add contextual fields to log records. Set up a format that includes a `%(request_id)s` field, then log messages with different request IDs to simulate per-request logging.",
      hint: "Your format string should include `%(request_id)s`. Pass `extra={'request_id': 'abc123'}` to each logging call. You can also create a `logging.LoggerAdapter` to avoid repeating the extra dict.",
      starterCode: `import logging

# Set up a logger with a format that includes request_id
# Format: "%(asctime)s [%(request_id)s] %(levelname)s %(message)s"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(request_id)s] %(levelname)s %(message)s",
)
logger = logging.getLogger("webserver")

def handle_request(request_id, path):
    # Log each step, injecting the request_id context into the log record
    pass  # TODO: log "Request received: %s" with path, injecting {"request_id": request_id} as extra context
          # TODO: log "Sending response" with the same injected context

# Simulate two concurrent requests
handle_request("req-001", "/api/users")
handle_request("req-002", "/api/posts")

# Bonus: wrap the logger so you don't have to repeat the extra dict on every call
adapter = None  # TODO: create an adapter that pre-binds {"request_id": "req-003"} to the logger
adapter.info("Using LoggerAdapter for cleaner code")
`,
      validate: (code: string) =>
        code.includes("extra=") &&
        code.includes("request_id") &&
        code.includes("LoggerAdapter"),
      successMessage:
        "Contextual logging with extra= or LoggerAdapter makes it easy to correlate log entries across a single request or transaction!",
    },
  ],
};
