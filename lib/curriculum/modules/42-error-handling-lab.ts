import type { LabModule } from "../types";

export const errorHandlingLab: LabModule = {
  type: "lab",
  id: "42",
  slug: "error-handling-lab",
  title: "Robust Error Handling Lab",
  icon: "🧪",
  estimatedMinutes: 25,
  description: "Build a robust data parser with proper error handling",
  instructions: `# Robust Error Handling Lab

You are given a mixed list of values that are supposed to represent integers, but many are corrupted: some are already integers, some are numeric strings, some are non-numeric strings, and some are \`None\`. Your job is to parse each value safely and report the results clearly.

## Task

Write a function \`parse_mixed(values)\` that:

1. Iterates over each item in \`values\`
2. Tries to convert each item to \`int\` using \`int(item)\`
3. On success, appends the integer to a \`successes\` list
4. On \`ValueError\` or \`TypeError\`, records the failure in a \`failures\` list as a tuple of \`(original_value, error_message)\`
5. Returns \`(successes, failures)\`

Then write a \`report(successes, failures)\` function that prints:
- Each success: \`"OK: <value>"\`
- Each failure: \`"FAIL: <original> -> <error>"\`
- A summary line: \`"Total: X ok, Y failed"\`

## Example

\`\`\`python
values = [1, "42", None, "3.14", "hello", 0, "", True, "  7  "]

successes, failures = parse_mixed(values)
report(successes, failures)
\`\`\`

Expected output:

\`\`\`
OK: 1
OK: 42
FAIL: None -> int() argument must be a string...
FAIL: 3.14 -> invalid literal for int()...
FAIL: hello -> invalid literal for int()...
OK: 0
FAIL:  -> invalid literal for int()...
OK: 1
OK: 7
Total: 5 ok, 4 failed
\`\`\`

## Notes

- \`None\` raises \`TypeError\` when passed to \`int()\`
- \`"3.14"\` raises \`ValueError\` (int() doesn't parse floats directly)
- \`True\` converts to \`1\` (booleans are integers in Python — this is OK)
- \`"  7  "\` with whitespace: \`int()\` does accept whitespace-padded strings
- Be precise with your except clauses — catch \`(ValueError, TypeError)\` together
`,
  starterCode: `def parse_mixed(values):
    """Parse each value to int, collecting successes and failures."""
    successes = []
    failures = []

    for item in values:
        try:
            # TODO: try int(item) and append to successes
            pass
        except (ValueError, TypeError) as e:
            # TODO: append (item, str(e)) to failures
            pass

    return successes, failures


def report(successes, failures):
    """Print a formatted report of results."""
    # TODO: print each success as "OK: <value>"
    # TODO: print each failure as "FAIL: <original> -> <error>"
    # TODO: print summary "Total: X ok, Y failed"
    pass


# Mixed list of values to parse
values = [1, "42", None, "3.14", "hello", 0, "", True, "  7  ", "-5", "99abc"]

successes, failures = parse_mixed(values)
report(successes, failures)
`,
  tests: [
    {
      name: "Successful conversions are printed",
      description: "Values like 1, '42', 0, True, '  7  ', '-5' should print as OK",
      validate: (_code: string, stdout: string) => {
        return (
          stdout.includes("OK: 1") &&
          stdout.includes("OK: 42") &&
          stdout.includes("OK: 0") &&
          stdout.includes("OK: -5")
        );
      },
    },
    {
      name: "None causes a failure",
      description: "None passed to int() raises TypeError — should appear as FAIL",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("FAIL:") && stdout.includes("None");
      },
    },
    {
      name: "Non-numeric strings cause failures",
      description: "'hello' and '99abc' should appear as FAIL lines",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("hello") && stdout.includes("99abc");
      },
    },
    {
      name: "Summary line shows correct counts",
      description: "The final line must contain 'Total:' with ok and failed counts",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("Total:") && stdout.includes("ok") && stdout.includes("failed");
      },
    },
    {
      name: "Failures include error message",
      description: "FAIL lines should include both the original value and the error text",
      validate: (_code: string, stdout: string) => {
        const failLines = stdout
          .split("\n")
          .filter((line) => line.trim().startsWith("FAIL:"));
        return (
          failLines.length >= 4 &&
          failLines.every((line) => line.includes("->"))
        );
      },
    },
  ],
  solutionCode: `def parse_mixed(values):
    """Parse each value to int, collecting successes and failures."""
    successes = []
    failures = []

    for item in values:
        try:
            successes.append(int(item))
        except (ValueError, TypeError) as e:
            failures.append((item, str(e)))

    return successes, failures


def report(successes, failures):
    """Print a formatted report of results."""
    for value in successes:
        print(f"OK: {value}")

    for original, error in failures:
        print(f"FAIL: {original} -> {error}")

    total_ok = len(successes)
    total_failed = len(failures)
    print(f"Total: {total_ok} ok, {total_failed} failed")


values = [1, "42", None, "3.14", "hello", 0, "", True, "  7  ", "-5", "99abc"]

successes, failures = parse_mixed(values)
report(successes, failures)
`,
};
