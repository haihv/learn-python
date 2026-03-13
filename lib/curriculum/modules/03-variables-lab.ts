import type { LabModule } from "../types";

export const variablesLab: LabModule = {
  type: "lab",
  id: "03",
  slug: "variables-lab",
  title: "Variables Practice",
  icon: "🧪",
  estimatedMinutes: 15,
  description: "Practice declaring and using variables in Python",
  instructions: `## Variables Practice Lab

In this lab, you will practice declaring variables of different types and printing them in formatted output.

### Your Tasks

1. **Declare a string variable** called \`name\` and assign it your name (e.g., \`"Alice"\`)

2. **Declare an integer variable** called \`age\` and assign it an age (e.g., \`25\`)

3. **Declare a float variable** called \`height\` and assign it a height in meters (e.g., \`1.75\`)

4. **Declare a boolean variable** called \`is_student\` and assign it \`True\` or \`False\`

5. **Print each variable** using an f-string on its own line in this format:
   - \`Name: Alice\`
   - \`Age: 25\`
   - \`Height: 1.75\`
   - \`Student: True\`

### Hints

- Use f-strings: \`f"Name: {name}"\`
- Make sure your variable names match exactly: \`name\`, \`age\`, \`height\`, \`is_student\`
- Height should be a \`float\` (use a decimal point: \`1.75\`)
- \`is_student\` should be a \`bool\` (\`True\` or \`False\`, capitalized)
`,
  starterCode: `# Variables Practice Lab
# Fill in the TODO sections below

# TODO: Declare a string variable called 'name'
name = ""

# TODO: Declare an integer variable called 'age'
age = 0

# TODO: Declare a float variable called 'height' (in meters)
height = 0.0

# TODO: Declare a boolean variable called 'is_student'
is_student = False

# TODO: Print each variable using f-strings
# Expected output format:
# Name: Alice
# Age: 25
# Height: 1.75
# Student: True
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Student: {is_student}")
`,
  solutionCode: `# Variables Practice Lab — Solution

# String variable
name = "Alice"

# Integer variable
age = 25

# Float variable
height = 1.75

# Boolean variable
is_student = True

# Print each variable using f-strings
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Student: {is_student}")
`,
  tests: [
    {
      name: "name variable declared",
      description: "Assign a non-empty string to 'name' (e.g. name = \"Alice\")",
      // Regex skips comment lines; requires a quoted non-empty string value.
      validate: (code, _stdout) => /(?:^|\n)\s*name\s*=\s*["'][^"']+["']/.test(code),
    },
    {
      name: "age variable declared",
      description: "Assign a positive integer to 'age' (e.g. age = 25)",
      validate: (code, _stdout) => /(?:^|\n)\s*age\s*=\s*[1-9]\d*/.test(code),
    },
    {
      name: "height variable declared",
      description: "Assign a positive decimal to 'height' (e.g. height = 1.75)",
      validate: (code, _stdout) => /(?:^|\n)\s*height\s*=\s*[1-9]\d*\.?\d*/.test(code),
    },
    {
      name: "is_student variable declared",
      description: "Assign True or False to 'is_student'",
      validate: (code, _stdout) => /(?:^|\n)\s*is_student\s*=\s*(True|False)/.test(code),
    },
    {
      name: "Output contains Name, Age, Height, and Student",
      description: "Print all four variables with non-default values",
      // Check labels are present and values are not the starter-code defaults.
      validate: (_code, stdout) =>
        stdout.includes("Name:") &&
        stdout.includes("Age:") &&
        stdout.includes("Height:") &&
        stdout.includes("Student:") &&
        !stdout.includes("Name: \n") &&
        !stdout.includes("Age: 0\n") &&
        !stdout.includes("Height: 0.0\n"),
    },
  ],
};
