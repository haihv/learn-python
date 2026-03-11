import type { WorkshopModule } from "../types";

export const controlFlowWorkshop: WorkshopModule = {
  type: "workshop",
  id: "09",
  slug: "control-flow-workshop",
  title: "Building Decision Trees",
  icon: "🌳",
  estimatedMinutes: 20,
  description: "Practice writing complex conditional logic in Python",
  steps: [
    {
      instruction:
        "**Grade Calculator**: Write a function `letter_grade(score)` that returns a letter grade: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60). Test it with a few values and print the results.",
      hint: `def letter_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

print(letter_grade(95))
print(letter_grade(72))
print(letter_grade(55))`,
      starterCode: `# Grade Calculator
def letter_grade(score):
    # TODO: return "A", "B", "C", "D", or "F" based on score
    pass

# Test your function
print(letter_grade(95))   # A
print(letter_grade(83))   # B
print(letter_grade(72))   # C
print(letter_grade(65))   # D
print(letter_grade(50))   # F
`,
      validate: (code: string) =>
        code.includes("elif") && code.includes("return"),
      successMessage:
        "Well done! elif chains are perfect for mutually exclusive ranges. Notice that the order matters — because we check >= 90 first, anyone scoring 90+ gets an A, and the remaining elif branches only run for lower scores.",
    },
    {
      instruction:
        "**BMI Calculator**: Calculate the Body Mass Index (BMI = weight_kg / height_m²) and classify it: Underweight (< 18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (≥ 30). Print the BMI value and classification.",
      hint: `weight = 70   # kg
height = 1.75  # meters

bmi = weight / (height ** 2)
print(f"BMI: {bmi:.1f}")

if bmi < 18.5:
    category = "Underweight"
elif bmi < 25:
    category = "Normal"
elif bmi < 30:
    category = "Overweight"
else:
    category = "Obese"

print(f"Category: {category}")`,
      starterCode: `weight = 70    # kg
height = 1.75  # meters

# TODO: Calculate BMI (weight / height²)
bmi = 0

# TODO: Print f"BMI: {bmi:.1f}"

# TODO: Classify BMI and print f"Category: {category}"
# Underweight: < 18.5
# Normal: 18.5 to 24.9
# Overweight: 25 to 29.9
# Obese: >= 30
`,
      validate: (code: string) =>
        code.includes("**") && code.includes("elif") && code.includes("bmi"),
      successMessage:
        "Great! Note the elegant threshold checking: since we already know BMI >= 18.5 when we reach the second elif (the first elif would have caught anything below 18.5), we only need to check the upper bound.",
    },
    {
      instruction:
        "**Leap Year Checker**: A year is a leap year if it's divisible by 4, EXCEPT centuries (divisible by 100) are NOT leap years, UNLESS they're also divisible by 400. Write a function `is_leap(year)` that returns True/False, then test with: 2000 (True), 1900 (False), 2024 (True), 2023 (False).",
      hint: `def is_leap(year):
    if year % 400 == 0:
        return True
    elif year % 100 == 0:
        return False
    elif year % 4 == 0:
        return True
    else:
        return False

# Or as a one-liner:
def is_leap(year):
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)`,
      starterCode: `def is_leap(year):
    # TODO: Implement leap year logic
    # Divisible by 400 → leap year
    # Divisible by 100 (but not 400) → NOT leap year
    # Divisible by 4 (but not 100) → leap year
    # Otherwise → NOT leap year
    pass

print(is_leap(2000))  # True  (divisible by 400)
print(is_leap(1900))  # False (divisible by 100, not 400)
print(is_leap(2024))  # True  (divisible by 4, not 100)
print(is_leap(2023))  # False (not divisible by 4)
`,
      validate: (code: string) =>
        code.includes("% 400") && code.includes("% 100") && code.includes("% 4"),
      successMessage:
        "Excellent! The order of checks is crucial here — check divisible-by-400 first (the exception to the exception), then divisible-by-100, then divisible-by-4. Changing the order would give wrong answers.",
    },
    {
      instruction:
        "**Traffic Light**: Given a `light` variable (\"red\", \"yellow\", or \"green\"), print what a driver should do. Use a chained if/elif/else. Then rewrite the same logic using a ternary expression for just red vs. not-red.",
      hint: `light = "yellow"

if light == "red":
    action = "Stop"
elif light == "yellow":
    action = "Slow down"
elif light == "green":
    action = "Go"
else:
    action = "Unknown signal"

print(f"Light is {light}: {action}")

# Ternary for red/not-red
simple = "Stop" if light == "red" else "Proceed with caution"
print(simple)`,
      starterCode: `light = "yellow"

# TODO: Use if/elif/else to set 'action' based on light color
# "red" → "Stop"
# "yellow" → "Slow down"
# "green" → "Go"
# anything else → "Unknown signal"
action = ""
print(f"Light is {light}: {action}")

# TODO: Use a ternary expression: "Stop" if red, else "Proceed with caution"
simple = ""
print(simple)
`,
      validate: (code: string) =>
        code.includes("elif") && (code.includes("if light") || code.includes("if light")),
      successMessage:
        "Perfect! The if/elif chain handles 4 distinct cases cleanly. The ternary is great for binary choices (red vs everything else), but would become unreadable if you tried to encode all 4 outcomes — that's the if/elif/else's job.",
    },
    {
      instruction:
        "**Nested Conditions — Password Validator**: Write a function `validate_password(pwd)` that checks: (1) length >= 8, (2) contains at least one digit, (3) contains at least one uppercase letter. Print a specific error message for each failing condition, or 'Password is valid!' if all pass.",
      hint: `def validate_password(pwd):
    if len(pwd) < 8:
        print("Error: Password must be at least 8 characters")
        return False
    if not any(c.isdigit() for c in pwd):
        print("Error: Password must contain at least one digit")
        return False
    if not any(c.isupper() for c in pwd):
        print("Error: Password must contain at least one uppercase letter")
        return False
    print("Password is valid!")
    return True

validate_password("short")
validate_password("longenough")
validate_password("LongEnough1")`,
      starterCode: `def validate_password(pwd):
    # TODO: Check length >= 8
    # Print "Error: Password must be at least 8 characters" and return False if too short

    # TODO: Check for at least one digit (hint: any(c.isdigit() for c in pwd))
    # Print "Error: Password must contain at least one digit" and return False

    # TODO: Check for at least one uppercase letter (hint: any(c.isupper() for c in pwd))
    # Print "Error: Password must contain at least one uppercase letter" and return False

    print("Password is valid!")
    return True

validate_password("short")        # Too short
validate_password("longenoughpwd")  # No digit
validate_password("longenough1")    # No uppercase
validate_password("LongEnough1")    # Valid
`,
      validate: (code: string) =>
        code.includes("isdigit") && code.includes("isupper") && code.includes("len("),
      successMessage:
        "Excellent use of guard clauses! Each condition is checked independently and returns early on failure. This 'fail fast' pattern is more readable than deeply nested if statements — each guard handles one specific failure mode.",
    },
  ],
};
