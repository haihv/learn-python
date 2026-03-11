import type { WorkshopModule } from "../types";

export const testingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "80",
  slug: "testing-workshop",
  title: "Writing Test Suites & Using Mock",
  icon: "🧪",
  estimatedMinutes: 20,
  description: "Write comprehensive test suites with unittest and mock",
  steps: [
    {
      instruction:
        "Write a basic `unittest.TestCase` for a `multiply(a, b)` function. The class should be named `TestMultiply` and include at least three `test_` methods: one for positive numbers, one for negative × positive, and one for multiplication by zero.",
      hint: "Import unittest and define class TestMultiply(unittest.TestCase). Each method must start with test_ and use self.assertEqual(). Add if __name__ == '__main__': unittest.main() at the bottom.",
      starterCode: `import unittest

def multiply(a, b):
    return a * b

class TestMultiply(unittest.TestCase):
    # Write test_positive, test_negative, test_zero here

    def test_positive(self):
        pass  # assertEqual(multiply(3, 4), 12)

    def test_negative(self):
        pass  # assertEqual(multiply(-2, 5), -10)

    def test_zero(self):
        pass  # assertEqual(multiply(99, 0), 0)

if __name__ == "__main__":
    unittest.main()
`,
      validate: (code: string) =>
        code.includes("unittest.TestCase") &&
        code.includes("def test_") &&
        code.includes("assertEqual"),
      successMessage:
        "Your first test suite! Three tests, each focused on one scenario.",
    },
    {
      instruction:
        "Test that a function raises exceptions correctly using `assertRaises`. Write a `safe_divide(a, b)` function that raises `ZeroDivisionError` when `b == 0` and `TypeError` when inputs aren't numbers. Write tests for both exceptions using `with self.assertRaises()`.",
      hint: "Use `with self.assertRaises(ZeroDivisionError):` as a context manager around the code that should raise. Test both error cases plus a normal case.",
      starterCode: `import unittest

def safe_divide(a, b):
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("Inputs must be numbers")
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b

class TestSafeDivide(unittest.TestCase):

    def test_normal_division(self):
        pass  # assertAlmostEqual(safe_divide(10, 4), 2.5)

    def test_zero_denominator(self):
        pass  # assertRaises ZeroDivisionError

    def test_non_numeric_input(self):
        pass  # assertRaises TypeError for safe_divide("ten", 2)

if __name__ == "__main__":
    unittest.main()
`,
      validate: (code: string) =>
        code.includes("assertRaises") &&
        code.includes("ZeroDivisionError") &&
        code.includes("with self.assertRaises"),
      successMessage:
        "assertRaises is the clean way to verify your error handling works!",
    },
    {
      instruction:
        "Use `setUp` and `tearDown` to manage shared state. Write a `ShoppingCart` class with `add_item(name, price)`, `total()`, and `clear()` methods. Use `setUp` to create a fresh cart before each test, and `tearDown` to verify the cart can be cleared.",
      hint: "In setUp: `self.cart = ShoppingCart()`. Add items in individual tests. tearDown can call `self.cart.clear()` and assert total is 0.",
      starterCode: `import unittest

class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, name, price):
        self.items.append({"name": name, "price": price})

    def total(self):
        return sum(item["price"] for item in self.items)

    def clear(self):
        self.items = []

    def count(self):
        return len(self.items)

class TestShoppingCart(unittest.TestCase):

    def setUp(self):
        # Create a fresh cart for each test
        pass

    def tearDown(self):
        # Clear cart and verify it's empty
        pass

    def test_empty_cart_total(self):
        pass  # assertEqual(self.cart.total(), 0)

    def test_add_single_item(self):
        pass  # add "apple" at 1.50, assertEqual total to 1.50

    def test_add_multiple_items(self):
        pass  # add 3 items, assertEqual total

if __name__ == "__main__":
    unittest.main()
`,
      validate: (code: string) =>
        code.includes("def setUp") &&
        code.includes("def tearDown") &&
        code.includes("self.cart"),
      successMessage:
        "setUp/tearDown ensures test isolation — each test starts fresh regardless of what others did!",
    },
    {
      instruction:
        "Use `unittest.mock.patch` to mock an external dependency. Write a function `get_weather(city)` that calls `requests.get()`. Mock out `requests.get` in tests so they don't make real HTTP requests.",
      hint: "Use `@unittest.mock.patch('requests.get')` as a decorator on the test method. The mock object is passed as the last parameter. Set `mock_get.return_value.json.return_value = {...}` to control what the mock returns.",
      starterCode: `import unittest
from unittest import mock
import json

# Imagine this calls a real API
def get_weather(city):
    import requests
    response = requests.get(f"https://api.weather.com/v1/{city}")
    data = response.json()
    return data["temperature"]

class TestGetWeather(unittest.TestCase):

    @mock.patch("requests.get")
    def test_returns_temperature(self, mock_get):
        # Configure the mock: mock_get.return_value.json.return_value = ...
        # Then call get_weather("London") and assert the result
        pass

    @mock.patch("requests.get")
    def test_different_city(self, mock_get):
        # Test with "Tokyo", return temp 25
        pass

if __name__ == "__main__":
    unittest.main()
`,
      validate: (code: string) =>
        code.includes("mock.patch") &&
        code.includes("mock_get") &&
        code.includes("return_value"),
      successMessage:
        "Mocking lets you test code in isolation without real network calls — fast and reliable tests!",
    },
    {
      instruction:
        "Use `unittest.mock.MagicMock` to create a mock object with configurable behavior. Test a `send_notification(user, message)` function that depends on an `EmailService`. Use a MagicMock to verify it's called with the right arguments.",
      hint: "Create `mock_service = mock.MagicMock()`. Pass it to the function under test. Then use `mock_service.send.assert_called_once_with(expected_args)` to verify it was called correctly.",
      starterCode: `import unittest
from unittest import mock

class EmailService:
    def send(self, to_email, subject, body):
        # Real implementation would send an email
        pass

def send_notification(user_email, message, email_service):
    subject = "Notification"
    email_service.send(user_email, subject, message)

class TestSendNotification(unittest.TestCase):

    def test_sends_to_correct_email(self):
        # Create a MagicMock for email_service
        # Call send_notification with it
        # Assert email_service.send was called with correct args
        pass

    def test_uses_notification_subject(self):
        # Verify the subject line is "Notification"
        pass

    def test_call_count(self):
        # Call send_notification twice and verify .send was called twice
        pass

if __name__ == "__main__":
    unittest.main()
`,
      validate: (code: string) =>
        code.includes("MagicMock") &&
        code.includes("assert_called") &&
        code.includes("mock"),
      successMessage:
        "MagicMock lets you assert how your code interacts with its dependencies — not just what it returns!",
    },
  ],
};
