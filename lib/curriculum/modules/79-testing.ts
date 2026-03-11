import type { LessonModule } from "../types";

export const testing: LessonModule = {
  type: "lesson",
  id: "79",
  slug: "testing",
  title: "unittest: TestCase, assertEqual, setUp, discovery",
  icon: "✅",
  estimatedMinutes: 15,
  content: `# Testing with unittest

Python's \`unittest\` module is part of the standard library and provides a complete framework for writing and running automated tests. Good tests catch bugs before users do and give you confidence to refactor code.

## The Structure of a Test

Every test file imports \`unittest\`, defines a class that inherits from \`unittest.TestCase\`, and writes methods whose names start with \`test_\`:

\`\`\`python
import unittest

def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):

    def test_positive_numbers(self):
        result = add(2, 3)
        self.assertEqual(result, 5)

    def test_negative_numbers(self):
        self.assertEqual(add(-1, -1), -2)

    def test_zero(self):
        self.assertEqual(add(0, 42), 42)

if __name__ == "__main__":
    unittest.main()
\`\`\`

The class name conventionally starts with \`Test\` and describes what you're testing. Each \`test_*\` method tests one specific scenario.

## Running Tests

\`\`\`bash
# Run a specific test file
python -m unittest test_math.py

# Run all tests in the current directory (discovery)
python -m unittest discover

# Verbose output showing each test name
python -m unittest -v test_math.py

# Run a specific test class
python -m unittest test_math.TestAdd

# Run a specific test method
python -m unittest test_math.TestAdd.test_positive_numbers
\`\`\`

Test discovery looks for files matching \`test*.py\` in the current directory and subdirectories.

## Assertion Methods

\`unittest.TestCase\` provides many assertion methods. When an assertion fails, the test immediately stops and reports the failure:

\`\`\`python
class TestAssertions(unittest.TestCase):

    def test_equality(self):
        self.assertEqual(1 + 1, 2)           # a == b
        self.assertNotEqual("a", "b")         # a != b

    def test_truthiness(self):
        self.assertTrue(len([1, 2]) > 0)      # bool(x) is True
        self.assertFalse(0 == 1)              # bool(x) is False

    def test_identity(self):
        x = [1, 2, 3]
        self.assertIs(x, x)                   # x is y
        self.assertIsNone(None)               # x is None
        self.assertIsNotNone(42)              # x is not None

    def test_containment(self):
        self.assertIn("hello", ["hello", "world"])      # a in b
        self.assertNotIn("foo", {"bar": 1})             # a not in b

    def test_types(self):
        self.assertIsInstance(42, int)        # isinstance(a, b)
        self.assertIsInstance("hi", str)

    def test_comparison(self):
        self.assertGreater(5, 3)              # a > b
        self.assertGreaterEqual(5, 5)         # a >= b
        self.assertLess(2, 10)                # a < b
        self.assertLessEqual(10, 10)          # a <= b

    def test_approximate(self):
        self.assertAlmostEqual(0.1 + 0.2, 0.3, places=5)  # float comparison
\`\`\`

## assertRaises — Testing Exceptions

Use \`assertRaises\` to verify that code raises the expected exception:

\`\`\`python
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

class TestDivide(unittest.TestCase):

    def test_divide_normal(self):
        self.assertEqual(divide(10, 2), 5.0)

    def test_divide_by_zero(self):
        # Context manager form — most readable
        with self.assertRaises(ValueError):
            divide(10, 0)

    def test_divide_by_zero_message(self):
        # Check the exception message too
        with self.assertRaises(ValueError) as ctx:
            divide(10, 0)
        self.assertIn("zero", str(ctx.exception))

    def test_type_error(self):
        with self.assertRaises(TypeError):
            divide("ten", 2)
\`\`\`

## setUp and tearDown

\`setUp()\` runs **before each** test method. \`tearDown()\` runs **after each** test method, even if the test fails. Use them to prepare and clean up shared state:

\`\`\`python
import unittest
import tempfile
import os

class TestFileOperations(unittest.TestCase):

    def setUp(self):
        # Runs before every test — create a fresh temp file
        self.temp_file = tempfile.NamedTemporaryFile(
            mode='w', suffix='.txt', delete=False
        )
        self.temp_file.write("initial content")
        self.temp_file.close()
        self.filepath = self.temp_file.name

    def tearDown(self):
        # Runs after every test — clean up resources
        if os.path.exists(self.filepath):
            os.unlink(self.filepath)

    def test_file_exists(self):
        self.assertTrue(os.path.exists(self.filepath))

    def test_file_content(self):
        with open(self.filepath) as f:
            self.assertEqual(f.read(), "initial content")

    def test_file_overwrite(self):
        with open(self.filepath, 'w') as f:
            f.write("new content")
        with open(self.filepath) as f:
            self.assertEqual(f.read(), "new content")
\`\`\`

## setUpClass and tearDownClass

Run once for the entire class, not before each test. Use for expensive setup like database connections:

\`\`\`python
class TestDatabase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Runs once before any tests in this class
        cls.db = create_test_database()

    @classmethod
    def tearDownClass(cls):
        # Runs once after all tests in this class
        cls.db.close()

    def test_insert(self):
        # self.db is available from setUpClass
        cls.db.insert({"name": "test"})
\`\`\`

## Organizing Test Files

Conventional project structure:

\`\`\`
myproject/
├── myproject/
│   ├── __init__.py
│   ├── math_utils.py
│   └── string_utils.py
└── tests/
    ├── __init__.py
    ├── test_math_utils.py
    └── test_string_utils.py
\`\`\`

Each module gets a corresponding test file. Run all tests from the project root:

\`\`\`bash
python -m unittest discover tests/
\`\`\`

## Skipping Tests

\`\`\`python
class TestFeatures(unittest.TestCase):

    @unittest.skip("Not implemented yet")
    def test_future_feature(self):
        pass

    @unittest.skipIf(sys.platform == "win32", "Unix only")
    def test_unix_sockets(self):
        pass

    @unittest.expectedFailure
    def test_known_bug(self):
        self.assertEqual(1, 2)  # This failure is expected
\`\`\`

## A Complete Example

Here's a real-world test for a simple \`BankAccount\` class:

\`\`\`python
import unittest

class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

class TestBankAccount(unittest.TestCase):

    def setUp(self):
        self.account = BankAccount(balance=100)

    def test_initial_balance(self):
        self.assertEqual(self.account.balance, 100)

    def test_deposit(self):
        self.account.deposit(50)
        self.assertEqual(self.account.balance, 150)

    def test_withdraw(self):
        self.account.withdraw(30)
        self.assertEqual(self.account.balance, 70)

    def test_withdraw_insufficient_funds(self):
        with self.assertRaises(ValueError):
            self.account.withdraw(200)

    def test_deposit_negative_raises(self):
        with self.assertRaises(ValueError):
            self.account.deposit(-10)

    def test_multiple_operations(self):
        self.account.deposit(100)
        self.account.withdraw(50)
        self.assertEqual(self.account.balance, 150)

if __name__ == "__main__":
    unittest.main()
\`\`\`
`,
  quiz: [
    {
      question: "What naming convention must test methods follow for unittest to discover them?",
      options: [
        "They must be decorated with @test",
        "They must start with test_",
        "They must end with _test",
        "They must be inside a function named tests()",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the purpose of setUp() in a unittest.TestCase class?",
      options: [
        "It runs once before all tests in the class to set up shared expensive resources",
        "It runs before each individual test method to prepare fresh state",
        "It replaces __init__ for TestCase subclasses",
        "It is called only if the previous test passed",
      ],
      correctIndex: 1,
    },
    {
      question: "How do you verify that a function raises a specific exception in unittest?",
      options: [
        "try: func() except Exception: pass",
        "self.assertException(ValueError, func)",
        "with self.assertRaises(ValueError): func()",
        "self.assertEqual(func(), ValueError)",
      ],
      correctIndex: 2,
    },
  ],
};
