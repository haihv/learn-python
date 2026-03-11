import type { WorkshopModule } from "../types";

export const sqlite3Workshop: WorkshopModule = {
  type: "workshop",
  id: "87",
  slug: "sqlite3-workshop",
  title: "CRUD Operations & Parameterized Queries",
  icon: "💾",
  estimatedMinutes: 20,
  description: "Build a complete CRUD application with SQLite3",
  steps: [
    {
      instruction:
        "Create an in-memory SQLite database and define a `books` table. The table should have: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `title` (TEXT NOT NULL), `author` (TEXT NOT NULL), `year` (INTEGER), `rating` (REAL DEFAULT 0). Use `:memory:` as the database path.",
      hint: "Use `sqlite3.connect(':memory:')` and `conn.execute('CREATE TABLE ...')`. Remember to call `conn.commit()` after DDL statements.",
      starterCode: `import sqlite3

# Connect to in-memory database
conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row

# Create the books table with:
# id (INTEGER PRIMARY KEY AUTOINCREMENT)
# title (TEXT NOT NULL)
# author (TEXT NOT NULL)
# year (INTEGER)
# rating (REAL DEFAULT 0)

conn.commit()
print("Table created successfully")
`,
      validate: (code: string) =>
        code.includes("sqlite3.connect") &&
        code.includes("CREATE TABLE") &&
        code.includes("PRIMARY KEY") &&
        code.includes(":memory:"),
      successMessage:
        "Your database schema is ready! :memory: means no file is written — perfect for testing and short-lived applications.",
    },
    {
      instruction:
        "Insert records into the books table using both `execute()` for a single row and `executemany()` for a batch. Insert at least one book with execute() and then use executemany() to insert 3 more books. Print the total count after inserting.",
      hint: "Use `conn.execute('INSERT INTO books (title, author, year, rating) VALUES (?, ?, ?, ?)', (...))`  for single inserts. For executemany, pass a list of tuples. Use `cursor.lastrowid` after execute() to get the new ID.",
      starterCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
conn.execute("""
    CREATE TABLE books (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        title  TEXT NOT NULL,
        author TEXT NOT NULL,
        year   INTEGER,
        rating REAL DEFAULT 0
    )
""")

# Insert one book using execute()
# Title: "The Pragmatic Programmer", Author: "David Thomas", Year: 1999, Rating: 4.8

# Insert 3 more books using executemany()
more_books = [
    ("Clean Code", "Robert Martin", 2008, 4.5),
    ("Design Patterns", "Gang of Four", 1994, 4.3),
    ("Python Cookbook", "David Beazley", 2013, 4.7),
]

conn.commit()

# Print total count: "Total books: 4"
cursor = conn.execute("SELECT COUNT(*) as count FROM books")
row = cursor.fetchone()
print(f"Total books: {row['count']}")
`,
      validate: (code: string) =>
        code.includes("executemany") &&
        code.includes("execute(") &&
        code.includes("INSERT INTO"),
      successMessage:
        "executemany() is much faster than looping with execute() — it batches the work efficiently!",
    },
    {
      instruction:
        "Query the books table using SELECT with filters. Write queries to: (1) fetch all books ordered by rating descending, (2) fetch books published after 2000, (3) fetch the single highest-rated book. Use the Row factory to access columns by name.",
      hint: "Use `ORDER BY rating DESC`, `WHERE year > 2000`, and `LIMIT 1` in your SELECT queries. Access results with `row['title']` etc. Use `fetchall()` for multiple rows and `fetchone()` for a single row.",
      starterCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
conn.execute("""
    CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, author TEXT NOT NULL,
        year INTEGER, rating REAL DEFAULT 0
    )
""")
conn.executemany("INSERT INTO books (title, author, year, rating) VALUES (?, ?, ?, ?)", [
    ("The Pragmatic Programmer", "David Thomas", 1999, 4.8),
    ("Clean Code", "Robert Martin", 2008, 4.5),
    ("Design Patterns", "Gang of Four", 1994, 4.3),
    ("Python Cookbook", "David Beazley", 2013, 4.7),
    ("Fluent Python", "Luciano Ramalho", 2015, 4.9),
])
conn.commit()

# 1. Fetch all books ordered by rating DESC, print title and rating
print("All books by rating:")
# ...

# 2. Fetch books published after 2000 using parameterized query
print("\\nBooks after 2000:")
# ...

# 3. Fetch the single highest-rated book
print("\\nTop-rated book:")
# ...
`,
      validate: (code: string) =>
        code.includes("ORDER BY") &&
        code.includes("WHERE") &&
        code.includes("fetchall") &&
        code.includes("fetchone"),
      successMessage:
        "Parameterized SELECT queries with row_factory make data access clean and safe!",
    },
    {
      instruction:
        "Update records using parameterized UPDATE queries. Write a function `update_rating(conn, book_id, new_rating)` that updates a book's rating. Also write `update_year_by_author(conn, author, year)` that updates the year for all books by a given author. Print `cursor.rowcount` to see how many rows were affected.",
      hint: "Use `cursor = conn.execute('UPDATE books SET rating = ? WHERE id = ?', (new_rating, book_id))` and check `cursor.rowcount`. For the second function, it should update multiple rows at once.",
      starterCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
conn.execute("""
    CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, author TEXT NOT NULL,
        year INTEGER, rating REAL DEFAULT 0
    )
""")
conn.executemany("INSERT INTO books (title, author, year, rating) VALUES (?, ?, ?, ?)", [
    ("The Pragmatic Programmer", "David Thomas", 1999, 4.8),
    ("Clean Code", "Robert Martin", 2008, 4.5),
    ("The Clean Coder", "Robert Martin", 2011, 4.2),
])
conn.commit()

def update_rating(conn, book_id, new_rating):
    # UPDATE books SET rating = ? WHERE id = ?
    # Print: "Updated 1 book" (use cursor.rowcount)
    pass

def update_year_by_author(conn, author, year):
    # UPDATE all books by this author to the new year
    # Print: "Updated {rowcount} books by {author}"
    pass

update_rating(conn, 1, 4.9)
update_year_by_author(conn, "Robert Martin", 2012)

# Verify changes
for row in conn.execute("SELECT title, author, year, rating FROM books"):
    print(f"{row['title']} by {row['author']} ({row['year']}) — {row['rating']}")
`,
      validate: (code: string) =>
        code.includes("UPDATE") &&
        code.includes("rowcount") &&
        code.includes("SET"),
      successMessage:
        "rowcount tells you exactly how many rows your UPDATE touched — always verify your updates!",
    },
    {
      instruction:
        "Complete CRUD with DELETE operations. Write `delete_book(conn, book_id)` that deletes by ID (returns True if deleted, False if not found), and `delete_low_rated(conn, min_rating)` that deletes all books below a rating threshold. Test both functions and print remaining books.",
      hint: "Use `cursor.rowcount` after DELETE to check if anything was deleted. `cursor.rowcount == 0` means no matching rows were found. Use `conn.commit()` after deletes.",
      starterCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
conn.execute("""
    CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, author TEXT NOT NULL,
        rating REAL DEFAULT 0
    )
""")
conn.executemany("INSERT INTO books (title, author, rating) VALUES (?, ?, ?)", [
    ("Great Book", "Author A", 4.8),
    ("Good Book", "Author B", 4.2),
    ("OK Book", "Author C", 3.5),
    ("Mediocre Book", "Author D", 2.9),
    ("Bad Book", "Author E", 2.1),
])
conn.commit()

def delete_book(conn, book_id):
    # DELETE WHERE id = ?, return True if deleted, False if not found
    pass

def delete_low_rated(conn, min_rating):
    # DELETE WHERE rating < min_rating
    # Print: "Deleted {n} books with rating below {min_rating}"
    pass

delete_book(conn, 999)      # Non-existent — should print nothing or False
delete_book(conn, 1)        # Should delete "Great Book"
delete_low_rated(conn, 3.0) # Should delete "Mediocre Book" and "Bad Book"

print("Remaining books:")
for row in conn.execute("SELECT title, rating FROM books ORDER BY rating DESC"):
    print(f"  {row['title']}: {row['rating']}")
`,
      validate: (code: string) =>
        code.includes("DELETE") &&
        code.includes("rowcount") &&
        code.includes("WHERE"),
      successMessage:
        "Full CRUD in SQLite! The combination of parameterized queries and rowcount makes your database code both safe and informative.",
    },
  ],
};
