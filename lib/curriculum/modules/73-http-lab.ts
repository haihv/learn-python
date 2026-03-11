import type { LabModule } from "../types";

export const httpLab: LabModule = {
  type: "lab",
  id: "73",
  slug: "http-lab",
  title: "HTTP Lab: Public API Client",
  icon: "🧪",
  estimatedMinutes: 25,
  description: "Build a simple HTTP client using urllib",
  instructions: `# HTTP Lab: Public API Client

In this lab you will build a small command-line client that fetches data from a real public API and processes the results.

## The API

You will use **JSONPlaceholder** — a free, public REST API for testing and prototyping.

**Endpoint:** \`https://jsonplaceholder.typicode.com/todos?userId=1\`

This returns a JSON array of todo items for user 1. Each item has this shape:

\`\`\`json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
\`\`\`

## Your Tasks

1. **Fetch** the todos for userId=1 using \`urllib.request.urlopen\`
2. **Parse** the JSON response body using the \`json\` module
3. **Filter** the list to only completed todos (where \`"completed": true\`)
4. **Print** each completed todo's title, one per line
5. **Print** a summary showing the count of completed todos vs total todos

## Expected Output Format

Your output must include lines like:

\`\`\`
Completed todos:
- delectus aut autem
- quis ut nam facilis et officia qui
...
Completed: 11 / 20
\`\`\`

## Requirements

- Use \`urllib.request\` (do **not** use the \`requests\` library)
- Use the \`json\` module to parse the response
- Handle potential errors with try/except

## Hints

- \`urllib.request.urlopen(url).read()\` returns **bytes** — decode with \`.decode('utf-8')\`
- \`json.loads(text)\` parses the JSON string into a Python list of dicts
- Filter with a list comprehension: \`[t for t in todos if t['completed']]\`
- Use \`len()\` to count items
`,
  starterCode: `import urllib.request
import urllib.error
import json

API_URL = "https://jsonplaceholder.typicode.com/todos"


def fetch_todos(user_id: int) -> list[dict]:
    """Fetch all todos for the given userId from the API."""
    # TODO: Build the URL with the userId query parameter
    url = f"{API_URL}?userId={user_id}"

    # TODO: Use urllib.request.urlopen to fetch the URL
    # TODO: Read and decode the response body
    # TODO: Parse the JSON and return the list
    pass


def filter_completed(todos: list[dict]) -> list[dict]:
    """Return only the todos where completed is True."""
    # TODO: Use a list comprehension to filter by completed == True
    pass


def print_report(todos: list[dict], completed: list[dict]) -> None:
    """Print each completed title and a count summary."""
    # TODO: Print "Completed todos:" header
    # TODO: Print each completed todo's title prefixed with "- "
    # TODO: Print "Completed: X / Y" where X is completed count and Y is total
    pass


if __name__ == "__main__":
    todos = fetch_todos(user_id=1)
    completed = filter_completed(todos)
    print_report(todos, completed)
`,
  solutionCode: `import urllib.request
import urllib.error
import json

API_URL = "https://jsonplaceholder.typicode.com/todos"


def fetch_todos(user_id: int) -> list[dict]:
    """Fetch all todos for the given userId from the API."""
    url = f"{API_URL}?userId={user_id}"
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.reason}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error: {e.reason}") from e


def filter_completed(todos: list[dict]) -> list[dict]:
    """Return only the todos where completed is True."""
    return [todo for todo in todos if todo["completed"]]


def print_report(todos: list[dict], completed: list[dict]) -> None:
    """Print each completed title and a count summary."""
    print("Completed todos:")
    for todo in completed:
        print(f"- {todo['title']}")
    print(f"Completed: {len(completed)} / {len(todos)}")


if __name__ == "__main__":
    todos = fetch_todos(user_id=1)
    completed = filter_completed(todos)
    print_report(todos, completed)
`,
  tests: [
    {
      name: "Uses urllib",
      description: "Code must import and use urllib.request, not requests",
      validate: (code, _stdout) =>
        code.includes("urllib.request") && !code.includes("import requests"),
    },
    {
      name: "Uses json module",
      description: "Code must use json.loads or json.load to parse the response",
      validate: (code, _stdout) =>
        code.includes("import json") &&
        (code.includes("json.loads") || code.includes("json.load")),
    },
    {
      name: "Prints completed todos header",
      description: "Output must contain the 'Completed todos:' header line",
      validate: (_code, stdout) => stdout.includes("Completed todos:"),
    },
    {
      name: "Prints todo titles with dash prefix",
      description: "Each completed todo title must be printed with a '- ' prefix",
      validate: (_code, stdout) => stdout.includes("- "),
    },
    {
      name: "Prints completed count summary",
      description: "Output must contain 'Completed: X / Y' summary line",
      validate: (_code, stdout) =>
        stdout.includes("Completed:") && stdout.includes("/"),
    },
  ],
};
