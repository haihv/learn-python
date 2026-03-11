import type { LessonModule } from "../types";

export const cliArgparse: LessonModule = {
  type: "lesson",
  id: "84",
  slug: "cli-argparse",
  title: "argparse: add_argument, subcommands, types",
  icon: "⌨️",
  estimatedMinutes: 15,
  content: `# Building CLIs with argparse

Python's \`argparse\` module is the standard library solution for parsing command-line arguments. It automatically generates help text, handles errors gracefully, and supports complex argument patterns without manual string parsing.

## Why argparse Over sys.argv?

\`sys.argv\` gives you raw strings. \`argparse\` gives you typed, validated, documented arguments:

\`\`\`python
# Fragile: manual sys.argv parsing
import sys
if len(sys.argv) < 3:
    print("Usage: script.py name age")
    sys.exit(1)
name = sys.argv[1]
age = int(sys.argv[2])  # No error handling

# Better: argparse handles all of this
import argparse
parser = argparse.ArgumentParser()
parser.add_argument("name")
parser.add_argument("age", type=int)
args = parser.parse_args()
# Automatically prints usage, converts types, reports errors
\`\`\`

## Creating a Parser

\`\`\`python
import argparse

parser = argparse.ArgumentParser(
    prog="mytool",                        # Program name (default: script filename)
    description="A useful command-line tool",
    epilog="Example: mytool --verbose input.txt output.txt",
)
\`\`\`

## Positional Arguments

Positional arguments are required and identified by position (not a flag):

\`\`\`python
parser = argparse.ArgumentParser()

# Simple positional argument
parser.add_argument("filename", help="Input file to process")

# With type conversion — argparse validates and converts
parser.add_argument("count", type=int, help="Number of iterations")

args = parser.parse_args()
print(args.filename)   # A string
print(args.count)      # An integer (validated by argparse)
\`\`\`

## Optional Arguments (Flags)

Optional arguments use \`--\` (long) or \`-\` (short) prefixes:

\`\`\`python
parser = argparse.ArgumentParser()

# Boolean flag (store True when present)
parser.add_argument("-v", "--verbose", action="store_true",
                    help="Enable verbose output")

# Flag with value
parser.add_argument("-o", "--output", default="result.txt",
                    help="Output filename (default: result.txt)")

# Required optional argument (useful when you need a flag-style arg)
parser.add_argument("--api-key", required=True,
                    help="API key for authentication")

# Typed optional argument
parser.add_argument("--port", type=int, default=8080,
                    help="Port number (default: 8080)")

args = parser.parse_args()
if args.verbose:
    print("Verbose mode on")
print(f"Output: {args.output}")
print(f"Port: {args.port}")   # Always an int
\`\`\`

## type= Parameter

The \`type=\` parameter validates and converts arguments:

\`\`\`python
import argparse
import pathlib

parser = argparse.ArgumentParser()

# Built-in types
parser.add_argument("--count", type=int)
parser.add_argument("--ratio", type=float)
parser.add_argument("--path", type=pathlib.Path)    # Returns Path object

# Custom type: a function that validates and converts
def positive_int(value):
    ivalue = int(value)
    if ivalue <= 0:
        raise argparse.ArgumentTypeError(f"{value} must be a positive integer")
    return ivalue

parser.add_argument("--workers", type=positive_int, default=4)
\`\`\`

## choices= Parameter

Restrict values to a specific set:

\`\`\`python
parser = argparse.ArgumentParser()

parser.add_argument("--format", choices=["json", "csv", "xml"],
                    default="json", help="Output format")

parser.add_argument("--log-level",
                    choices=["DEBUG", "INFO", "WARNING", "ERROR"],
                    default="INFO")

args = parser.parse_args()
# argparse rejects any value not in choices with a clear error
\`\`\`

## nargs= — Multiple Values

\`\`\`python
parser = argparse.ArgumentParser()

# Exactly N values
parser.add_argument("--point", nargs=2, type=float,
                    metavar=("X", "Y"), help="Coordinates")

# One or more values
parser.add_argument("files", nargs="+", help="Files to process")

# Zero or more values
parser.add_argument("--tags", nargs="*", help="Optional tags")

# Optional single value (uses default if flag absent, const if flag with no value)
parser.add_argument("--debug", nargs="?", const="verbose", default=None)

args = parser.parse_args(["--point", "1.5", "2.5", "a.txt", "b.txt"])
print(args.point)   # [1.5, 2.5]
print(args.files)   # ['a.txt', 'b.txt']
\`\`\`

## Subcommands (Subparsers)

Subcommands let you build tools like \`git commit\`, \`git push\`, \`docker run\`:

\`\`\`python
import argparse

parser = argparse.ArgumentParser(prog="devtool")
subparsers = parser.add_subparsers(dest="command", required=True)

# "devtool build" subcommand
build_parser = subparsers.add_parser("build", help="Build the project")
build_parser.add_argument("--target", default="debug",
                          choices=["debug", "release"])
build_parser.add_argument("--jobs", type=int, default=4)

# "devtool deploy" subcommand
deploy_parser = subparsers.add_parser("deploy", help="Deploy to environment")
deploy_parser.add_argument("environment", choices=["staging", "production"])
deploy_parser.add_argument("--dry-run", action="store_true")

args = parser.parse_args()

if args.command == "build":
    print(f"Building {args.target} with {args.jobs} jobs")
elif args.command == "deploy":
    if args.dry_run:
        print(f"Would deploy to {args.environment}")
    else:
        print(f"Deploying to {args.environment}")
\`\`\`

Usage:
\`\`\`bash
devtool build --target release --jobs 8
devtool deploy production --dry-run
devtool --help          # Shows all subcommands
devtool build --help    # Shows build-specific help
\`\`\`

## Argument Groups

Organize arguments into logical groups for cleaner help output:

\`\`\`python
parser = argparse.ArgumentParser()

input_group = parser.add_argument_group("Input options")
input_group.add_argument("filename")
input_group.add_argument("--encoding", default="utf-8")

output_group = parser.add_argument_group("Output options")
output_group.add_argument("--output", "-o")
output_group.add_argument("--format", choices=["json", "csv"])
\`\`\`

## parse_known_args()

When you want to ignore unknown arguments (useful in testing or extensible tools):

\`\`\`python
args, remaining = parser.parse_known_args()
# args: known arguments as Namespace
# remaining: list of unknown argument strings
\`\`\`

## Auto-Generated Help

argparse automatically creates \`-h\`/\`--help\`:

\`\`\`bash
$ python mytool.py --help
usage: mytool [-h] [--verbose] [--output OUTPUT] filename count

A useful command-line tool

positional arguments:
  filename              Input file to process
  count                 Number of iterations

optional arguments:
  -h, --help            show this help message and exit
  --verbose, -v         Enable verbose output
  --output OUTPUT, -o OUTPUT
                        Output filename (default: result.txt)
\`\`\`

## Putting It Together

\`\`\`python
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(
        description="Process data files",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,  # Shows defaults
    )
    parser.add_argument("input", type=argparse.FileType("r"),
                        help="Input file (use - for stdin)")
    parser.add_argument("-o", "--output", type=argparse.FileType("w"),
                        default=sys.stdout, help="Output file")
    parser.add_argument("-n", "--lines", type=int, default=10,
                        help="Number of lines to process")
    parser.add_argument("-v", "--verbose", action="store_true")

    args = parser.parse_args()

    for i, line in enumerate(args.input):
        if i >= args.lines:
            break
        if args.verbose:
            print(f"[{i+1}] ", end="", file=sys.stderr)
        args.output.write(line)

if __name__ == "__main__":
    main()
\`\`\`
`,
  quiz: [
    {
      question: "What is the difference between positional and optional arguments in argparse?",
      options: [
        "Positional arguments use type=, optional arguments use default=",
        "Positional arguments are identified by position and are usually required; optional arguments use -- or - prefixes",
        "Positional arguments are strings only; optional arguments can have types",
        "There is no difference — both are optional by default",
      ],
      correctIndex: 1,
    },
    {
      question: "What does `action='store_true'` do for an argument?",
      options: [
        "Stores the string 'True' when the flag is present",
        "Makes the argument required",
        "Stores True (boolean) when the flag is present, False when absent",
        "Converts the argument value to a boolean using bool()",
      ],
      correctIndex: 2,
    },
    {
      question: "How do you add subcommands (like `git commit`, `git push`) using argparse?",
      options: [
        "Create separate ArgumentParser instances and merge them",
        "Use parser.add_subparsers() to get a subparsers object, then call add_parser() for each subcommand",
        "Use parser.add_argument('command', choices=['commit', 'push'])",
        "Import argparse.subcommands and use its API",
      ],
      correctIndex: 1,
    },
  ],
};
