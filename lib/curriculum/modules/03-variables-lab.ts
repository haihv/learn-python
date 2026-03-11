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
name =

# TODO: Declare an integer variable called 'age'
age =

# TODO: Declare a float variable called 'height' (in meters)
height =

# TODO: Declare a boolean variable called 'is_student'
is_student =

# TODO: Print each variable using f-strings
# Expected output format:
# Name: Alice
# Age: 25
# Height: 1.75
# Student: True
print(f"Name: {name}")
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
      description: "Code should declare a variable called 'name'",
      validate: (code, _stdout) => code.includes("name") && code.includes("="),
    },
    {
      name: "age variable declared",
      description: "Code should declare a variable called 'age'",
      validate: (code, _stdout) => code.includes("age") && code.includes("="),
    },
    {
      name: "height variable declared",
      description: "Code should declare a variable called 'height'",
      validate: (code, _stdout) => code.includes("height") && code.includes("="),
    },
    {
      name: "is_student variable declared",
      description: "Code should declare a variable called 'is_student'",
      validate: (code, _stdout) => code.includes("is_student") && code.includes("="),
    },
    {
      name: "Output contains Name, Age, Height, and Student",
      description: "Printed output should include all four labels",
      validate: (_code, stdout) =>
        stdout.includes("Name:") &&
        stdout.includes("Age:") &&
        stdout.includes("Height:") &&
        stdout.includes("Student:"),
    },
  ],
};
