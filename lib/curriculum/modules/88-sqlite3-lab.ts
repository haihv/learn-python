import type { LabModule } from "../types";

export const sqlite3Lab: LabModule = {
  type: "lab",
  id: "88",
  slug: "sqlite3-lab",
  title: "SQLite3 Lab: Todo Database",
  icon: "🧪",
  estimatedMinutes: 25,
  description: "Build a todo database with SQLite3 using an in-memory database",
  instructions: `## SQLite3 Lab: Todo Database

In this lab you will build a complete todo management system using Python's built-in \`sqlite3\` module. All data will live in an **in-memory** database — no file is written to disk.

---

### Step 1 — Connect and create the schema

Use \`sqlite3.connect(":memory:")\` to create an ephemeral database. Then create a \`todos\` table:

| Column | Type | Constraint |
|--------|------|-----------|
| \`id\` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| \`title\` | TEXT | NOT NULL |
| \`done\` | INTEGER | DEFAULT 0 |

\`done = 0\` means pending; \`done = 1\` means completed. SQLite has no native boolean type — integers are the convention.

\`\`\`python
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE todos (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT    NOT NULL,
        done  INTEGER DEFAULT 0
    )
""")
conn.commit()
\`\`\`

---

### Step 2 — Insert at least 5 todos

Use \`executemany()\` to insert a batch of todos. Include a mix of done and pending items so later queries have data to filter.

\`\`\`python
todos = [
    ("Buy groceries",      0),
    ("Write unit tests",   1),
    ("Read Python docs",   0),
    ("Deploy to staging",  1),
    ("Fix bug #42",        0),
    ("Review pull request",0),
    ("Update README",      1),
]

conn.executemany(
    "INSERT INTO todos (title, done) VALUES (?, ?)",
    todos
)
conn.commit()
\`\`\`

Always use **parameterized queries** (\`?\` placeholders). Never use f-strings or string concatenation with SQL — that opens the door to SQL injection.

---

### Step 3 — Print all todos

Fetch every row and print it in a readable format. Use \`conn.row_factory = sqlite3.Row\` so columns are accessible by name instead of position index.

\`\`\`python
conn.row_factory = sqlite3.Row

for row in conn.execute("SELECT id, title, done FROM todos ORDER BY id"):
    status = "done" if row["done"] else "pending"
    print(f"{row['id']}. [{status}] {row['title']}")
\`\`\`

> **Tip:** Set \`row_factory\` immediately after \`connect()\`, before any queries, so every cursor you open from that connection inherits it.

---

### Step 4 — Print only pending todos

Filter with \`WHERE done = 0\`:

\`\`\`python
print("\\nPending todos:")
for row in conn.execute("SELECT id, title FROM todos WHERE done = 0 ORDER BY id"):
    print(f"  - [{row['id']}] {row['title']}")
\`\`\`

---

### Step 5 — Mark a todo as done

Write a function that updates the \`done\` flag for a given id and reports whether the row actually existed:

\`\`\`python
def mark_done(conn, todo_id):
    cursor = conn.execute(
        "UPDATE todos SET done = 1 WHERE id = ?",
        (todo_id,)
    )
    conn.commit()
    if cursor.rowcount:
        print(f"Todo #{todo_id} marked as done.")
    else:
        print(f"Todo #{todo_id} not found.")

mark_done(conn, 1)
mark_done(conn, 999)  # Does not exist
\`\`\`

---

### Step 6 — Print the done / pending count

Use a single aggregation query with \`GROUP BY\`:

\`\`\`python
print("\\nSummary:")
for row in conn.execute(
    "SELECT done, COUNT(*) as count FROM todos GROUP BY done"
):
    label = "done" if row["done"] else "pending"
    print(f"  {label}: {row['count']}")
\`\`\`

---

### Putting it all together

Your final script should produce output similar to:

\`\`\`
All todos:
1. [done] Buy groceries
2. [done] Write unit tests
...

Pending todos:
  - [3] Read Python docs
  - [5] Fix bug #42
  - [6] Review pull request

Todo #1 marked as done.
Todo #999 not found.

Summary:
  done: 4
  pending: 3
\`\`\`
`,
  starterCode: `import sqlite3

# Connect to an in-memory database (no file written to disk)
conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row

# TODO: Create the todos table
# Columns: id (INTEGER PRIMARY KEY AUTOINCREMENT), title (TEXT NOT NULL), done (INTEGER DEFAULT 0)


# TODO: Insert at least 5 todos — mix of done=0 and done=1
todos_data = [
    # ("title", done_flag),
]


# TODO: Print all todos with their status


# TODO: Print only pending (done=0) todos


# TODO: Implement mark_done(conn, todo_id) and call it on an existing id and a non-existent id
def mark_done(conn, todo_id):
    pass


# TODO: Print the count of done vs pending todos using GROUP BY
`,
  solutionCode: `import sqlite3

# Connect to an in-memory database — data lives only for the duration of this script
conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row

# Create schema
conn.execute("""
    CREATE TABLE todos (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT    NOT NULL,
        done  INTEGER DEFAULT 0
    )
""")
conn.commit()

# Insert a representative mix of done and pending todos
todos_data = [
    ("Buy groceries",       0),
    ("Write unit tests",    1),
    ("Read Python docs",    0),
    ("Deploy to staging",   1),
    ("Fix bug #42",         0),
    ("Review pull request", 0),
    ("Update README",       1),
]
conn.executemany(
    "INSERT INTO todos (title, done) VALUES (?, ?)",
    todos_data
)
conn.commit()

# Print all todos
print("All todos:")
for row in conn.execute("SELECT id, title, done FROM todos ORDER BY id"):
    status = "done" if row["done"] else "pending"
    print(f"  {row['id']}. [{status}] {row['title']}")

# Print only pending todos
print("\\nPending todos:")
for row in conn.execute(
    "SELECT id, title FROM todos WHERE done = 0 ORDER BY id"
):
    print(f"  - [{row['id']}] {row['title']}")

# Mark a todo as done
def mark_done(conn, todo_id):
    cursor = conn.execute(
        "UPDATE todos SET done = 1 WHERE id = ?",
        (todo_id,)
    )
    conn.commit()
    if cursor.rowcount:
        print(f"Todo #{todo_id} marked as done.")
    else:
        print(f"Todo #{todo_id} not found.")

print()
mark_done(conn, 1)
mark_done(conn, 999)

# Count done vs pending
print("\\nSummary:")
for row in conn.execute(
    "SELECT done, COUNT(*) as count FROM todos GROUP BY done ORDER BY done"
):
    label = "done" if row["done"] else "pending"
    print(f"  {label}: {row['count']}")
`,
  tests: [
    {
      name: "Creates todos table",
      description: "Code must contain a CREATE TABLE statement for a 'todos' table",
      validate: (code: string, _stdout: string) =>
        code.includes("CREATE TABLE") && code.toLowerCase().includes("todos"),
    },
    {
      name: "Uses in-memory database",
      description: "Code must connect using :memory: so no file is written to disk",
      validate: (code: string, _stdout: string) =>
        code.includes(":memory:"),
    },
    {
      name: "Inserts multiple todos with executemany or multiple execute calls",
      description: "Code must insert at least 5 todos — executemany is preferred",
      validate: (code: string, _stdout: string) =>
        code.includes("INSERT INTO") &&
        (code.includes("executemany") || (code.match(/INSERT INTO/g) || []).length >= 3),
    },
    {
      name: "Prints pending todos",
      description: "stdout must contain the word 'pending' (case-insensitive)",
      validate: (_code: string, stdout: string) =>
        stdout.toLowerCase().includes("pending"),
    },
    {
      name: "Prints done/pending summary count",
      description: "stdout must contain both 'done' and a numeric count on the same or adjacent lines",
      validate: (_code: string, stdout: string) =>
        stdout.toLowerCase().includes("done") && /\d+/.test(stdout),
    },
  ],
};
