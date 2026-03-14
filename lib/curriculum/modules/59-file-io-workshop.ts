import type { WorkshopModule } from "../types";

export const fileIOWorkshop: WorkshopModule = {
  type: "workshop",
  id: "59",
  slug: "file-io-workshop",
  title: "Reading, Writing & Appending Files",
  icon: "✍️",
  estimatedMinutes: 20,
  description: "Master file I/O patterns using pathlib and open()",
  steps: [
    {
      instruction:
        "Write a script that creates a file called `notes.txt`, writes 5 lines to it (each ending with `\\n`), then reads it back and prints the line count and each line numbered. Use `with open(...)` for both writing and reading.",
      hint: "Use `open('notes.txt', 'w', encoding='utf-8')` to write. A list of strings passed to `f.writelines()` works well. Then `open('notes.txt', 'r', encoding='utf-8')` and `f.readlines()` to read back.",
      starterCode: `# Step 1: Write lines to a file
lines = [
    "Python is a versatile programming language.\\n",
    "It emphasizes code readability and simplicity.\\n",
    "Python is used in web, data science, and automation.\\n",
    "The standard library covers most common tasks.\\n",
    "Learning Python opens many career opportunities.\\n",
]

# TODO: open "notes.txt" in write mode and write all lines using writelines()
pass

print("File written.")

# Step 2: Read back and display numbered lines
# TODO: open "notes.txt" in read mode, call readlines(), then print numbered lines
pass
`,
      validate: (code) =>
        code.includes('open("notes.txt"') || code.includes("open('notes.txt'"),
      successMessage:
        "Great start! Writing and reading text files is the foundation of almost all data persistence. The with statement ensures the file handle is always closed properly.",
    },
    {
      instruction:
        "Practice the append mode. Create a `journal.txt` file by writing an initial entry. Then simulate adding entries over 'multiple days' by appending to the file in a loop. Read back the whole file at the end and print it.",
      hint: "Use mode `'w'` for the first write, then `'a'` for subsequent appends. The `'a'` mode does NOT truncate the file — it seeks to the end before each write.",
      starterCode: `from datetime import date, timedelta

# Create initial file with header
# TODO: open "journal.txt" in write mode and write "=== My Learning Journal ===\\n\\n"
pass

# Simulate adding entries over several days
start = date(2024, 1, 1)
entries = [
    "Started learning Python basics.",
    "Covered variables, strings, and lists.",
    "Learned about functions and scope.",
    "Explored classes and dataclasses.",
    "Practiced file I/O today!",
]

for i, entry in enumerate(entries):
    entry_date = start + timedelta(days=i)
    # TODO: open "journal.txt" in append mode and write the dated entry line
    pass

# Read and display the final file
print("=== Final Journal Contents ===")
# TODO: open "journal.txt" in read mode and print its full contents with f.read()
pass
`,
      validate: (code) =>
        (code.includes('"a"') || code.includes("'a'")) &&
        (code.includes('"w"') || code.includes("'w'")),
      successMessage:
        "Excellent! Append mode is essential for log files and audit trails where you need to add records without overwriting existing data.",
    },
    {
      instruction:
        "Use `pathlib.Path` to explore the filesystem. Create a directory structure using `mkdir(parents=True, exist_ok=True)`, write files to it using `Path.write_text()`, then use `glob()` to find all `.txt` files and read each one back using `Path.read_text()`.",
      hint: "Create the path with `Path('project/data')` and call `.mkdir(parents=True, exist_ok=True)`. Use `path / 'filename.txt'` to build sub-paths. `path.glob('*.txt')` returns an iterator of matching Path objects.",
      starterCode: `from pathlib import Path

# Create a directory structure
base = Path("project")
data_dir = base / "data"
# TODO: create the nested directory (hint: use parents=True and exist_ok=True)
pass

# Write several files using pathlib
files_content = {
    "readme.txt": "This project analyzes sales data.\\n",
    "config.txt": "debug=true\\nmax_rows=1000\\nformat=csv\\n",
    "notes.txt": "TODO: Add error handling\\nTODO: Write tests\\n",
}

for filename, content in files_content.items():
    file_path = data_dir / filename
    # TODO: save content to file_path using Path's text-writing method
    pass
    print(f"Created: {file_path}")

print()

# Find all .txt files recursively
print("All .txt files found:")
# TODO: iterate over all .txt files under base using a recursive glob pattern
pass

print()

# Read each file
# TODO: iterate sorted .txt files, read each one with Path's text-reading method
pass
`,
      validate: (code) =>
        code.includes("Path") &&
        code.includes("mkdir") &&
        code.includes("write_text") &&
        code.includes("read_text") &&
        (code.includes("glob") || code.includes("rglob")),
      successMessage:
        "Pathlib makes filesystem operations expressive and cross-platform. The / operator for path joining and read_text/write_text shortcuts are much cleaner than os.path + open().",
    },
    {
      instruction:
        "Write a CSV-like file manually (without the csv module), then read it back and parse it into a list of dictionaries. Handle the header row, split each line by comma, and build dicts using `zip(headers, values)`. Print a summary.",
      hint: "Write lines with commas as separators. Read back with `readlines()`, strip whitespace from each line, use `.split(',')` to parse. `zip(headers, values)` pairs them up for `dict()`.",
      starterCode: `from pathlib import Path

# Write a manual CSV file
csv_content = """name,age,city,score
Alice,30,New York,95.5
Bob,25,London,88.0
Carol,35,Tokyo,97.2
David,28,Paris,82.5
Eve,32,Sydney,91.0
"""

Path("students.csv").write_text(csv_content, encoding="utf-8")

# Parse it back into a list of dicts
students = []
with open("students.csv", "r", encoding="utf-8") as f:
    lines = f.readlines()

# TODO: parse headers from lines[0] by stripping whitespace and splitting on ","
headers = []
print(f"Columns: {headers}")

for line in lines[1:]:
    if line.strip():  # skip empty lines
        # TODO: split line on "," and build a dict using zip(headers, values)
        # convert "age" to int and "score" to float, then append to students
        pass

print(f"\\nLoaded {len(students)} students:")
for s in students:
    print(f"  {s['name']} (age {s['age']}, {s['city']}): {s['score']}")

# Simple analytics
avg_score = sum(s["score"] for s in students) / len(students)
top = max(students, key=lambda s: s["score"])
print(f"\\nAverage score: {avg_score:.1f}")
print(f"Top student: {top['name']} with {top['score']}")
`,
      validate: (code) =>
        code.includes('split(",")') || code.includes("split(',')") || code.includes('split(","'),
      successMessage:
        "Parsing files manually builds intuition before using higher-level libraries like csv or pandas. Understanding what those libraries do for you makes you a better programmer.",
    },
    {
      instruction:
        "Write a utility that safely reads a configuration file in `KEY=VALUE` format, with error handling for missing files and malformed lines. Use `pathlib` to check if the file exists before opening it, and return a dictionary of settings with type conversion.",
      hint: "Use `Path('config.cfg').exists()` to check before reading. Split lines on `'='` with `line.split('=', 1)` — the `1` limits splits so values can contain `=`. Use try/except around the whole read.",
      starterCode: `from pathlib import Path

def write_config(path: str, settings: dict) -> None:
    """Write settings dict to a KEY=VALUE config file."""
    # TODO: build a list of "key=value\\n" strings from settings.items() and write to path
    pass

def read_config(path: str, defaults: dict | None = None) -> dict:
    """Read a KEY=VALUE config file. Returns defaults if file missing."""
    config = dict(defaults or {})
    p = Path(path)

    # TODO: if p does not exist, print a message and return config early
    pass

    try:
        with open(p, "r", encoding="utf-8") as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line or line.startswith("#"):
                    continue  # skip blank lines and comments
                # TODO: skip malformed lines (no "="), then split on "=" (max 1 split)
                # and store key.strip() -> value.strip() in config
                pass
    except OSError as e:
        print(f"Error reading config: {e}")

    return config

# Write a sample config
write_config("app.cfg", {
    "host": "localhost",
    "port": "8080",
    "debug": "true",
    "max_connections": "100",
    "log_level": "INFO",
})

# Read it back
settings = read_config("app.cfg", defaults={"timeout": "30"})
print("Settings loaded:")
for key, value in settings.items():
    print(f"  {key} = {value!r}")

# Test missing file
missing = read_config("nonexistent.cfg", defaults={"mode": "default"})
print(f"\\nMissing file result: {missing}")
`,
      validate: (code) =>
        code.includes("Path") &&
        code.includes(".exists()") &&
        code.includes("split") &&
        (code.includes("try") || code.includes("except")),
      successMessage:
        "Well done! Combining pathlib.exists() with graceful error handling produces robust file I/O code. Real applications always need to handle missing files, permissions errors, and malformed data.",
    },
  ],
};
