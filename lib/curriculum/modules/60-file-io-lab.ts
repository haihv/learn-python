import type { LabModule } from "../types";

export const fileIOLab: LabModule = {
  type: "lab",
  id: "60",
  slug: "file-io-lab",
  title: "File I/O Lab: Log Parser",
  icon: "🧪",
  estimatedMinutes: 25,
  description: "Parse and analyze a log file",
  instructions: `# Lab: Log Parser

In this lab you'll parse a multi-line log string (using \`io.StringIO\` to simulate file reading) and produce a summary report.

## The Log Format

Each log line follows this format:
\`\`\`
[TIMESTAMP] LEVEL: message
\`\`\`
Example: \`[2024-01-15 08:32:01] ERROR: Database connection timeout\`

Levels are: \`INFO\`, \`WARNING\`, \`ERROR\`, \`DEBUG\`

## Your Task

Write a \`parse_logs(log_data: str)\` function that:
1. Reads the log string line by line using \`io.StringIO\`
2. Counts total lines (excluding empty lines)
3. Counts occurrences of each log level
4. Collects all ERROR messages into a list
5. Extracts all timestamps into a list

Then call \`parse_logs(LOG_DATA)\` and print:
- Total line count
- Count per level
- List of error messages
- First and last timestamp

## Requirements

- Use \`io.StringIO\` to wrap the string and read it like a file
- Print \`Total lines: N\`
- Print \`ERROR count: N\`
- Print \`WARNING count: N\`
- Print \`INFO count: N\`
- Print each ERROR message on its own line prefixed with \`ERROR: \`
- Print \`First log: TIMESTAMP\` and \`Last log: TIMESTAMP\`
`,
  starterCode: `import io

LOG_DATA = """[2024-01-15 08:30:00] INFO: Application started
[2024-01-15 08:30:01] INFO: Connected to database
[2024-01-15 08:31:05] DEBUG: Cache miss for key user_42
[2024-01-15 08:31:10] INFO: User alice logged in
[2024-01-15 08:32:01] ERROR: Database connection timeout
[2024-01-15 08:32:02] WARNING: Retrying database connection (attempt 1/3)
[2024-01-15 08:32:05] WARNING: Retrying database connection (attempt 2/3)
[2024-01-15 08:32:08] INFO: Database connection restored
[2024-01-15 08:33:00] DEBUG: Processing request /api/users
[2024-01-15 08:33:01] INFO: Served 200 OK for /api/users
[2024-01-15 08:34:15] ERROR: Failed to send email: SMTP timeout
[2024-01-15 08:35:00] WARNING: Memory usage at 85%
[2024-01-15 08:36:00] INFO: Scheduled job 'cleanup' started
[2024-01-15 08:36:45] INFO: Scheduled job 'cleanup' completed
[2024-01-15 08:37:00] ERROR: Unhandled exception in worker thread
[2024-01-15 08:38:00] INFO: Application shutting down
"""


def parse_logs(log_data: str) -> None:
    # TODO: Use io.StringIO to read log_data like a file
    # TODO: Count total lines, count per level, collect errors, collect timestamps
    # TODO: Print the summary
    pass


parse_logs(LOG_DATA)
`,
  solutionCode: `import io

LOG_DATA = """[2024-01-15 08:30:00] INFO: Application started
[2024-01-15 08:30:01] INFO: Connected to database
[2024-01-15 08:31:05] DEBUG: Cache miss for key user_42
[2024-01-15 08:31:10] INFO: User alice logged in
[2024-01-15 08:32:01] ERROR: Database connection timeout
[2024-01-15 08:32:02] WARNING: Retrying database connection (attempt 1/3)
[2024-01-15 08:32:05] WARNING: Retrying database connection (attempt 2/3)
[2024-01-15 08:32:08] INFO: Database connection restored
[2024-01-15 08:33:00] DEBUG: Processing request /api/users
[2024-01-15 08:33:01] INFO: Served 200 OK for /api/users
[2024-01-15 08:34:15] ERROR: Failed to send email: SMTP timeout
[2024-01-15 08:35:00] WARNING: Memory usage at 85%
[2024-01-15 08:36:00] INFO: Scheduled job 'cleanup' started
[2024-01-15 08:36:45] INFO: Scheduled job 'cleanup' completed
[2024-01-15 08:37:00] ERROR: Unhandled exception in worker thread
[2024-01-15 08:38:00] INFO: Application shutting down
"""


def parse_logs(log_data: str) -> None:
    counts = {"INFO": 0, "WARNING": 0, "ERROR": 0, "DEBUG": 0}
    errors = []
    timestamps = []
    total_lines = 0

    with io.StringIO(log_data) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            total_lines += 1

            # Extract timestamp between [ ]
            if line.startswith("["):
                ts_end = line.index("]")
                timestamp = line[1:ts_end]
                timestamps.append(timestamp)
                rest = line[ts_end + 2:]  # skip "] "
            else:
                rest = line

            # Extract level
            for level in counts:
                if rest.startswith(level + ":"):
                    counts[level] += 1
                    if level == "ERROR":
                        message = rest[len(level) + 2:]
                        errors.append(message)
                    break

    print(f"Total lines: {total_lines}")
    print(f"ERROR count: {counts['ERROR']}")
    print(f"WARNING count: {counts['WARNING']}")
    print(f"INFO count: {counts['INFO']}")
    print(f"DEBUG count: {counts['DEBUG']}")
    print()
    for msg in errors:
        print(f"ERROR: {msg}")
    print()
    if timestamps:
        print(f"First log: {timestamps[0]}")
        print(f"Last log: {timestamps[-1]}")


parse_logs(LOG_DATA)
`,
  tests: [
    {
      name: "Total line count",
      description: "Output should report 16 total log lines",
      validate: (_code, stdout) => stdout.includes("Total lines: 16"),
    },
    {
      name: "Error count",
      description: "Output should report 3 ERROR entries",
      validate: (_code, stdout) => stdout.includes("ERROR count: 3"),
    },
    {
      name: "Warning count",
      description: "Output should report 3 WARNING entries",
      validate: (_code, stdout) => stdout.includes("WARNING count: 3"),
    },
    {
      name: "Error messages printed",
      description: "Each ERROR message should be printed with 'ERROR:' prefix",
      validate: (_code, stdout) =>
        stdout.includes("ERROR: Database connection timeout") &&
        stdout.includes("ERROR: Failed to send email") &&
        stdout.includes("ERROR: Unhandled exception"),
    },
    {
      name: "Timestamps extracted",
      description: "First and last timestamps should be printed",
      validate: (_code, stdout) =>
        stdout.includes("First log: 2024-01-15 08:30:00") &&
        stdout.includes("Last log: 2024-01-15 08:38:00"),
    },
  ],
};
