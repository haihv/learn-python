import type { LabModule } from "../types";

export const testingLab: LabModule = {
  type: "lab",
  id: "81",
  slug: "testing-lab",
  title: "Testing Lab: TDD Challenge",
  icon: "🔬",
  estimatedMinutes: 25,
  description: "Write tests for a calculator module using TDD",
  instructions: `# Testing Lab: TDD Calculator Challenge

In Test-Driven Development (TDD), you write tests **before** you write the implementation. This lab walks you through building a \`Calculator\` class using TDD.

## Your Task

Implement the \`Calculator\` class **and** its test suite in the same file.

### The Calculator class must have:
- \`add(a, b)\` — returns a + b
- \`subtract(a, b)\` — returns a - b
- \`multiply(a, b)\` — returns a * b
- \`divide(a, b)\` — returns a / b, raises \`ZeroDivisionError\` if b == 0
- \`power(base, exp)\` — returns base ** exp
- \`history\` — a list of strings recording each operation, e.g. \`"3 + 4 = 7"\`
- \`clear_history()\` — empties the history list

### The TestCalculator class must have at least these test methods:
- \`test_add\` — tests addition
- \`test_subtract\` — tests subtraction
- \`test_multiply\` — tests multiplication
- \`test_divide\` — tests normal division
- \`test_divide_by_zero\` — tests that divide raises ZeroDivisionError
- \`test_power\` — tests exponentiation
- \`test_history_records_operations\` — tests that operations are logged in history
- \`test_clear_history\` — tests that clear_history() empties history

### Running tests

At the bottom of the file, add:
\`\`\`python
import io as _io
_buf = _io.StringIO()
_runner = unittest.TextTestRunner(stream=_buf, verbosity=2)
_suite = unittest.TestLoader().loadTestsFromTestCase(TestCalculator)
_runner.run(_suite)
print(_buf.getvalue())
\`\`\`

This routes the test output to stdout so it appears in the output panel.

### Example output
\`\`\`
test_add ... ok
test_divide ... ok
test_divide_by_zero ... ok
test_history_records_operations ... ok
...
Ran 8 tests in 0.001s
OK
\`\`\`
`,
  starterCode: `import unittest

class Calculator:
    def __init__(self):
        self.history = []

    def add(self, a, b):
        # TODO: compute result, append "a + b = result" to history, return result
        pass

    def subtract(self, a, b):
        # TODO
        pass

    def multiply(self, a, b):
        # TODO
        pass

    def divide(self, a, b):
        # TODO: raise ZeroDivisionError if b == 0
        pass

    def power(self, base, exp):
        # TODO
        pass

    def clear_history(self):
        # TODO
        pass


class TestCalculator(unittest.TestCase):

    def setUp(self):
        self.calc = Calculator()

    def test_add(self):
        pass  # assertEqual(self.calc.add(3, 4), 7)

    def test_subtract(self):
        pass

    def test_multiply(self):
        pass

    def test_divide(self):
        pass

    def test_divide_by_zero(self):
        pass  # assertRaises(ZeroDivisionError)

    def test_power(self):
        pass

    def test_history_records_operations(self):
        pass  # after add(2,3), check self.calc.history has an entry

    def test_clear_history(self):
        pass  # after operations, clear_history(), check history is empty


import io as _io
_buf = _io.StringIO()
_runner = unittest.TextTestRunner(stream=_buf, verbosity=2)
_suite = unittest.TestLoader().loadTestsFromTestCase(TestCalculator)
_runner.run(_suite)
print(_buf.getvalue())
`,
  solutionCode: `import unittest

class Calculator:
    def __init__(self):
        self.history = []

    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

    def subtract(self, a, b):
        result = a - b
        self.history.append(f"{a} - {b} = {result}")
        return result

    def multiply(self, a, b):
        result = a * b
        self.history.append(f"{a} * {b} = {result}")
        return result

    def divide(self, a, b):
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        result = a / b
        self.history.append(f"{a} / {b} = {result}")
        return result

    def power(self, base, exp):
        result = base ** exp
        self.history.append(f"{base} ** {exp} = {result}")
        return result

    def clear_history(self):
        self.history = []


class TestCalculator(unittest.TestCase):

    def setUp(self):
        self.calc = Calculator()

    def test_add(self):
        self.assertEqual(self.calc.add(3, 4), 7)
        self.assertEqual(self.calc.add(-1, 1), 0)
        self.assertEqual(self.calc.add(0, 0), 0)

    def test_subtract(self):
        self.assertEqual(self.calc.subtract(10, 3), 7)
        self.assertEqual(self.calc.subtract(0, 5), -5)

    def test_multiply(self):
        self.assertEqual(self.calc.multiply(3, 4), 12)
        self.assertEqual(self.calc.multiply(-2, 5), -10)
        self.assertEqual(self.calc.multiply(7, 0), 0)

    def test_divide(self):
        self.assertAlmostEqual(self.calc.divide(10, 4), 2.5)
        self.assertEqual(self.calc.divide(9, 3), 3.0)

    def test_divide_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            self.calc.divide(10, 0)

    def test_power(self):
        self.assertEqual(self.calc.power(2, 10), 1024)
        self.assertEqual(self.calc.power(5, 0), 1)
        self.assertEqual(self.calc.power(3, 3), 27)

    def test_history_records_operations(self):
        self.calc.add(2, 3)
        self.calc.multiply(4, 5)
        self.assertEqual(len(self.calc.history), 2)
        self.assertIn("2 + 3 = 5", self.calc.history)
        self.assertIn("4 * 5 = 20", self.calc.history)

    def test_clear_history(self):
        self.calc.add(1, 2)
        self.calc.subtract(3, 1)
        self.calc.clear_history()
        self.assertEqual(self.calc.history, [])


import io as _io
_buf = _io.StringIO()
_runner = unittest.TextTestRunner(stream=_buf, verbosity=2)
_suite = unittest.TestLoader().loadTestsFromTestCase(TestCalculator)
_runner.run(_suite)
print(_buf.getvalue())
`,
  tests: [
    {
      name: "Defines Calculator class",
      description: "Code must define a Calculator class with the required methods",
      validate: (code: string, _stdout: string) =>
        code.includes("class Calculator") &&
        code.includes("def add") &&
        code.includes("def divide"),
    },
    {
      name: "Defines TestCalculator with test methods",
      description: "Code must define TestCalculator(unittest.TestCase) with test_ methods",
      validate: (code: string, _stdout: string) =>
        code.includes("class TestCalculator") &&
        code.includes("unittest.TestCase") &&
        code.includes("def test_"),
    },
    {
      name: "Tests division by zero",
      description: "TestCalculator must test that divide raises ZeroDivisionError",
      validate: (code: string, _stdout: string) =>
        code.includes("ZeroDivisionError") &&
        // assertRaises appears only in a comment in the starter; require actual usage
        /^[ \t]*with\s+self\.assertRaises/m.test(code),
    },
    {
      name: "Tests history recording",
      description: "TestCalculator must test the history attribute",
      validate: (code: string, _stdout: string) =>
        code.includes("history"),
    },
    {
      name: "All tests pass",
      description: "Running the test suite must produce output containing 'OK' — route output to stdout with TextTestRunner(stream=buf) and print(buf.getvalue())",
      validate: (code: string, stdout: string) =>
        stdout.includes("OK") &&
        !stdout.includes("FAILED") &&
        // Require actual assertions — with all-pass test bodies, trivially "OK" without assertions
        /^[ \t]*self\.assert\w+\(/m.test(code),
    },
  ],
};
