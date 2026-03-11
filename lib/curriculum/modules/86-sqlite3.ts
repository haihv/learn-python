import type { LessonModule } from "../types";

export const sqlite3Module: LessonModule = {
  type: "lesson",
  id: "86",
  slug: "sqlite3",
  title: "sqlite3: connect, execute, fetchall, context manager",
  icon: "🗄️",
  estimatedMinutes: 15,
  content: `# SQLite3 in Python

Python's \`sqlite3\` module provides a zero-dependency, serverless relational database. SQLite stores data in a single file (or entirely in memory), making it perfect for desktop apps, prototyping, testing, and small-to-medium scale data storage.

## Connecting and Creating Tables

\`\`\`python
import sqlite3

# In-memory database — fast, no disk I/O, disappears when connection closes
conn = sqlite3.connect(":memory:")

# File-based database — persists to disk
# conn = sqlite3.connect("myapp.db")

# Create a table
conn.execute("""
    CREATE TABLE users (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        name   TEXT    NOT NULL,
        email  TEXT    UNIQUE NOT NULL,
        age    INTEGER
    )
""")

conn.commit()   # Persist changes
conn.close()
\`\`\`

## Cursor — Executing SQL

The \`cursor\` is the object through which you execute SQL and fetch results:

\`\`\`python
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE products (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        name  TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0
    )
""")

# Single row insert
cursor.execute("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
               ("Widget", 9.99, 100))

# executemany — batch inserts
products = [
    ("Gadget", 24.99, 50),
    ("Doohickey", 4.99, 200),
    ("Thingamajig", 14.99, 75),
]
cursor.executemany(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    products
)

conn.commit()
\`\`\`

## Parameterized Queries — Never Use String Formatting

**Always** use \`?\` placeholders, never string formatting. String formatting leads to SQL injection:

\`\`\`python
# DANGEROUS — SQL injection vulnerability
user_input = "'; DROP TABLE users; --"
cursor.execute(f"SELECT * FROM users WHERE name = '{user_input}'")  # DON'T

# SAFE — parameterized query
cursor.execute("SELECT * FROM users WHERE name = ?", (user_input,))
# SQLite treats the entire string as a literal value, not SQL code
\`\`\`

## Fetching Results

\`\`\`python
cursor = conn.cursor()

# Fetch all rows at once — good for small result sets
cursor.execute("SELECT * FROM products WHERE price < ?", (20.0,))
rows = cursor.fetchall()
for row in rows:
    print(row)   # Each row is a tuple: (id, name, price, stock)

# Fetch one row
cursor.execute("SELECT * FROM products WHERE id = ?", (1,))
row = cursor.fetchone()    # Returns a tuple or None

# Fetch N rows at a time
cursor.execute("SELECT * FROM products")
while True:
    batch = cursor.fetchmany(10)
    if not batch:
        break
    for row in batch:
        print(row)

# Iterate cursor directly — memory-efficient for large results
cursor.execute("SELECT * FROM products")
for row in cursor:
    print(row)
\`\`\`

## Connection as Context Manager

Using \`with conn:\` automatically commits on success and rolls back on exception:

\`\`\`python
import sqlite3

conn = sqlite3.connect("myapp.db")

# Context manager: auto-commit or auto-rollback
with conn:
    conn.execute("INSERT INTO users (name, email) VALUES (?, ?)",
                 ("Alice", "alice@example.com"))
    conn.execute("INSERT INTO users (name, email) VALUES (?, ?)",
                 ("Bob", "bob@example.com"))
    # If any execute() raises an exception, the entire block rolls back
    # If all succeed, conn commits automatically

# You still need to close the connection yourself
conn.close()

# For full RAII, use contextlib.closing or handle close() in finally
\`\`\`

## Row Factory — Named Column Access

By default, rows are tuples. Set \`row_factory = sqlite3.Row\` to access columns by name:

\`\`\`python
conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row    # Enable named column access

conn.execute("CREATE TABLE users (id INTEGER, name TEXT, age INTEGER)")
conn.execute("INSERT INTO users VALUES (1, 'Alice', 30)")

cursor = conn.cursor()
cursor.execute("SELECT * FROM users WHERE id = 1")
row = cursor.fetchone()

# Access by name instead of index
print(row["name"])   # Alice
print(row["age"])    # 30
print(row[0])        # 1 (index still works too)
print(dict(row))     # {'id': 1, 'name': 'Alice', 'age': 30}
\`\`\`

## UPDATE and DELETE

\`\`\`python
# Update with parameterized query
conn.execute(
    "UPDATE products SET price = ? WHERE id = ?",
    (12.99, 1)
)

# Update multiple rows
conn.execute(
    "UPDATE products SET stock = stock - 1 WHERE stock > 0"
)

# Delete
conn.execute("DELETE FROM products WHERE stock = 0")

# Get number of affected rows
cursor.execute("DELETE FROM products WHERE price > ?", (100.0,))
print(f"Deleted {cursor.rowcount} rows")

conn.commit()
\`\`\`

## Getting the Last Inserted ID

\`\`\`python
cursor = conn.cursor()
cursor.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    ("Charlie", "charlie@example.com")
)
user_id = cursor.lastrowid
print(f"Created user with id={user_id}")
conn.commit()
\`\`\`

## executemany — Bulk Operations

\`\`\`python
import sqlite3
import csv

conn = sqlite3.connect("data.db")
conn.execute("CREATE TABLE employees (name TEXT, dept TEXT, salary REAL)")

# Efficiently insert thousands of rows
employees = [
    ("Alice", "Engineering", 95000),
    ("Bob", "Marketing", 72000),
    ("Carol", "Engineering", 105000),
    # ... thousands more
]
conn.executemany(
    "INSERT INTO employees VALUES (?, ?, ?)",
    employees
)
conn.commit()
print(f"Inserted {len(employees)} rows")
\`\`\`

## Transactions

SQLite is transactional. In Python's sqlite3 module, INSERT/UPDATE/DELETE are automatically wrapped in a transaction unless you use \`isolation_level=None\` (autocommit mode):

\`\`\`python
# Manual transaction control
conn = sqlite3.connect("myapp.db")
try:
    conn.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    conn.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
    conn.commit()    # Both succeed — commit
except Exception as e:
    conn.rollback()  # Either fails — roll back both
    raise
finally:
    conn.close()
\`\`\`

## Quick Reference

\`\`\`python
import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row

with conn:
    conn.execute("CREATE TABLE t (id INTEGER PRIMARY KEY, val TEXT)")
    conn.execute("INSERT INTO t (val) VALUES (?)", ("hello",))

cursor = conn.execute("SELECT * FROM t")
for row in cursor:
    print(dict(row))   # {'id': 1, 'val': 'hello'}

conn.close()
\`\`\`
`,
  quiz: [
    {
      question: "Why should you always use `?` placeholders in SQLite queries instead of Python string formatting?",
      options: [
        "String formatting is slower than parameterized queries",
        "Parameterized queries prevent SQL injection by treating user input as literal data, not SQL code",
        "The ? placeholder automatically escapes special characters for better performance",
        "Python's sqlite3 module raises an error if you use f-strings in SQL",
      ],
      correctIndex: 1,
    },
    {
      question: "What does `conn.row_factory = sqlite3.Row` do?",
      options: [
        "Makes all queries return pandas DataFrames",
        "Enables automatic serialization to JSON",
        "Allows accessing row columns by name (like row['column']) instead of only by index",
        "Makes INSERT operations automatically generate primary keys",
      ],
      correctIndex: 2,
    },
    {
      question: "What happens when you use a connection as a context manager with `with conn:`?",
      options: [
        "The connection is automatically closed when the block exits",
        "Changes are automatically committed on success, or rolled back if an exception occurs",
        "The database is locked for exclusive access until the block exits",
        "All queries inside the block run in read-only mode",
      ],
      correctIndex: 1,
    },
  ],
};
