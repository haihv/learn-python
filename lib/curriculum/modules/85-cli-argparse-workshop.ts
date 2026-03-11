import type { WorkshopModule } from "../types";

export const cliArgparseWorkshop: WorkshopModule = {
  type: "workshop",
  id: "85",
  slug: "cli-argparse-workshop",
  title: "Building a Multi-Command CLI Tool",
  icon: "🔨",
  estimatedMinutes: 20,
  description: "Build a multi-command CLI tool with argparse",
  steps: [
    {
      instruction:
        "Create a basic argument parser. Build a script that accepts one positional argument `filename` and one optional flag `--verbose` (`-v`). Parse the args and print: `'Processing: {filename}'`, and if verbose, also print `'Verbose mode enabled'`.",
      hint: "Use `argparse.ArgumentParser()`, then `add_argument('filename')` and `add_argument('-v', '--verbose', action='store_true')`. Call `args = parser.parse_args()` and check `args.verbose`.",
      starterCode: `import argparse

parser = argparse.ArgumentParser(description="Process a file")

# Add a positional argument 'filename'
# Add an optional flag '--verbose' / '-v' with action='store_true'

args = parser.parse_args()

# Print "Processing: {args.filename}"
# If verbose: print "Verbose mode enabled"
`,
      validate: (code: string) =>
        code.includes("ArgumentParser") &&
        code.includes("add_argument") &&
        code.includes("store_true") &&
        code.includes("parse_args"),
      successMessage:
        "Your first CLI parser! Run it with: python script.py myfile.txt --verbose",
    },
    {
      instruction:
        "Add positional arguments with type conversion. Create a CLI that takes `name` (string), `age` (int), and `salary` (float) as positional arguments. Print a summary: `'{name} is {age} years old earning \${salary:.2f}/year'`. If the user passes a non-integer for age, argparse should reject it automatically.",
      hint: "Use `type=int` and `type=float` in add_argument(). argparse handles conversion and error messages automatically — no try/except needed.",
      starterCode: `import argparse

parser = argparse.ArgumentParser(description="Employee record tool")

# Add positional argument 'name' (str)
# Add positional argument 'age' (int)
# Add positional argument 'salary' (float)

args = parser.parse_args()

# Print: "{name} is {age} years old earning \${salary:.2f}/year"
`,
      validate: (code: string) =>
        code.includes("type=int") &&
        code.includes("type=float") &&
        code.includes("add_argument"),
      successMessage:
        "Type conversion in argparse is automatic — invalid types print a helpful error and exit!",
    },
    {
      instruction:
        "Add optional arguments with defaults and `choices=`. Build a file converter CLI: `--input-format` defaults to `'csv'`, `--output-format` defaults to `'json'`, both restricted to `['csv', 'json', 'xml']`. Also add `--limit` (int, default 100) and `--dry-run` (store_true).",
      hint: "Use `choices=['csv', 'json', 'xml']` and `default='csv'` in add_argument(). argparse rejects values not in choices. For optional int args use `type=int, default=100`.",
      starterCode: `import argparse

parser = argparse.ArgumentParser(description="File format converter")

# Positional: input_file
parser.add_argument("input_file", help="Source file to convert")

# Optional: --input-format, choices=['csv','json','xml'], default='csv'
# Optional: --output-format, choices=['csv','json','xml'], default='json'
# Optional: --limit, type=int, default=100, help="Max records to convert"
# Optional: --dry-run, action=store_true

args = parser.parse_args()

print(f"Converting {args.input_file}")
print(f"  From: {args.input_format}")
print(f"  To:   {args.output_format}")
print(f"  Limit: {args.limit} records")
if args.dry_run:
    print("  (Dry run — no files written)")
`,
      validate: (code: string) =>
        code.includes("choices=") &&
        code.includes("default=") &&
        code.includes("store_true"),
      successMessage:
        "choices= gives you automatic validation with a clear error message listing valid options!",
    },
    {
      instruction:
        "Add subcommands to create a `todo` CLI tool with two subcommands: `add` (takes a `task` string and optional `--priority` with choices low/medium/high) and `list` (takes optional `--filter` with choices all/pending/done). Print what each subcommand would do.",
      hint: "Use `subparsers = parser.add_subparsers(dest='command', required=True)`. Then `add_parser = subparsers.add_parser('add')` and `add_parser.add_argument('task')`. Check `args.command` to dispatch.",
      starterCode: `import argparse

parser = argparse.ArgumentParser(prog="todo", description="Simple todo manager")
subparsers = parser.add_subparsers(dest="command", required=True)

# Subcommand: add
# - positional argument: task (str)
# - optional: --priority, choices=['low','medium','high'], default='medium'

# Subcommand: list
# - optional: --filter, choices=['all','pending','done'], default='all'

args = parser.parse_args()

if args.command == "add":
    print(f"Adding task: '{args.task}' with priority: {args.priority}")
elif args.command == "list":
    print(f"Listing {args.filter} todos")
`,
      validate: (code: string) =>
        code.includes("add_subparsers") &&
        code.includes("add_parser") &&
        code.includes("args.command"),
      successMessage:
        "Subcommands let you build tools like git or docker — one binary with many distinct behaviors!",
    },
    {
      instruction:
        "Add type validation with a custom type function. Create a CLI that takes `--port` (must be 1024–65535), `--host` (default 'localhost'), and `--workers` (must be a positive integer, default 4). The custom type functions should raise `argparse.ArgumentTypeError` for invalid values.",
      hint: "Define functions like `def valid_port(value): ivalue = int(value); if not 1024 <= ivalue <= 65535: raise argparse.ArgumentTypeError(...)`. Pass them as `type=valid_port`.",
      starterCode: `import argparse

def valid_port(value):
    # Convert to int, raise ArgumentTypeError if not in range 1024-65535
    pass

def positive_int(value):
    # Convert to int, raise ArgumentTypeError if <= 0
    pass

parser = argparse.ArgumentParser(description="Server configuration")

# --port: type=valid_port, default=8080
# --host: type=str, default='localhost'
# --workers: type=positive_int, default=4

args = parser.parse_args()
print(f"Starting server on {args.host}:{args.port} with {args.workers} workers")
`,
      validate: (code: string) =>
        code.includes("ArgumentTypeError") &&
        code.includes("type=valid_port") &&
        code.includes("type=positive_int"),
      successMessage:
        "Custom type functions give you rich validation with helpful error messages — much cleaner than checking after parse_args()!",
    },
  ],
};
