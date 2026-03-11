import type { LessonModule } from "../types";

export const fileIO: LessonModule = {
  type: "lesson",
  id: "58",
  slug: "file-io",
  title: "open(), read/write modes, pathlib.Path",
  icon: "📂",
  estimatedMinutes: 15,
  content: `# File I/O in Python

Working with files is fundamental to most programs. Python provides two complementary approaches: the built-in \`open()\` function for low-level file operations, and the modern \`pathlib.Path\` class for object-oriented path manipulation.

## The \`open()\` Function

\`open(filename, mode, encoding)\` opens a file and returns a file object:

\`\`\`python
# Basic syntax
f = open("data.txt", "r", encoding="utf-8")
content = f.read()
f.close()  # Always close files!
\`\`\`

The \`close()\` call is critical — open file handles consume OS resources. If your code raises an exception before \`close()\`, the file stays open. This is why you should almost always use the \`with\` statement instead.

## File Modes

The mode string controls what operations are allowed:

| Mode | Meaning | Creates file? | Truncates? |
|------|---------|--------------|-----------|
| \`"r"\` | Read text (default) | No | No |
| \`"w"\` | Write text | Yes | Yes |
| \`"a"\` | Append text | Yes | No |
| \`"x"\` | Exclusive create | Fails if exists | — |
| \`"r+"\` | Read and write | No | No |
| \`"rb"\` | Read binary | No | No |
| \`"wb"\` | Write binary | Yes | Yes |
| \`"ab"\` | Append binary | Yes | No |

\`\`\`python
# Write mode — creates or overwrites the file
f = open("log.txt", "w", encoding="utf-8")
f.write("First line\\n")
f.write("Second line\\n")
f.close()

# Append mode — adds to the end without erasing
f = open("log.txt", "a", encoding="utf-8")
f.write("Third line\\n")
f.close()

# Read mode
f = open("log.txt", "r", encoding="utf-8")
text = f.read()
print(text)
f.close()
\`\`\`

## The \`with\` Statement (Context Manager)

The \`with\` statement guarantees the file is closed when the block exits — even if an exception occurs:

\`\`\`python
# File is automatically closed when the with block ends
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()

# content is still available here, but the file is already closed
print(content)
print(f.closed)  # True
\`\`\`

Multiple files in one \`with\` statement:

\`\`\`python
with open("input.txt", "r") as src, open("output.txt", "w") as dst:
    for line in src:
        dst.write(line.upper())
\`\`\`

## Reading Methods

File objects have several reading methods:

\`\`\`python
with open("poem.txt", "r", encoding="utf-8") as f:
    # read() — entire file as one string
    content = f.read()

with open("poem.txt", "r", encoding="utf-8") as f:
    # read(n) — read at most n characters
    first_100 = f.read(100)

with open("data.csv", "r", encoding="utf-8") as f:
    # readline() — one line at a time (includes the newline)
    header = f.readline()
    first_row = f.readline()

with open("data.csv", "r", encoding="utf-8") as f:
    # readlines() — all lines as a list
    lines = f.readlines()
    # Each line includes the trailing '\\n'

with open("data.csv", "r", encoding="utf-8") as f:
    # Iterating the file object — memory-efficient for large files
    for line in f:
        print(line.rstrip("\\n"))
\`\`\`

For large files, iterating the file object directly is most efficient — it reads one line at a time without loading the whole file into memory.

## Writing Methods

\`\`\`python
lines = ["Alice,30\\n", "Bob,25\\n", "Carol,35\\n"]

with open("people.csv", "w", encoding="utf-8") as f:
    f.write("name,age\\n")          # write() — write a string
    f.writelines(lines)             # writelines() — write a list of strings

# writelines() does NOT add newlines — they must be in your strings
\`\`\`

## Encoding

Always specify the encoding explicitly. UTF-8 is the universal choice for modern systems:

\`\`\`python
# Always use encoding="utf-8" to avoid platform-specific defaults
with open("unicode.txt", "w", encoding="utf-8") as f:
    f.write("Hello, 世界! Привет! مرحبا\\n")

# Reading binary — no encoding conversion
with open("image.png", "rb") as f:
    header = f.read(8)
    print(header.hex())  # PNG magic bytes: 89504e47...
\`\`\`

## \`pathlib.Path\`: Modern Path Handling

The \`pathlib\` module (Python 3.4+) provides an object-oriented interface for filesystem paths:

\`\`\`python
from pathlib import Path

# Creating paths
p = Path("/home/user/documents")
q = Path("data") / "reports" / "2024.csv"  # / operator joins paths

# Common path methods
p.name        # "documents" — final component
p.stem        # "documents" — name without suffix
p.suffix      # "" — file extension
q.suffix      # ".csv"
p.parent      # Path("/home/user")
p.parts       # ('/', 'home', 'user', 'documents')

# String representation
str(p)        # "/home/user/documents"
\`\`\`

### Path Interrogation

\`\`\`python
from pathlib import Path

p = Path("myfile.txt")

p.exists()     # Does this path exist on disk?
p.is_file()    # Is it a regular file?
p.is_dir()     # Is it a directory?
p.stat().st_size  # File size in bytes
p.stat().st_mtime # Last modification time (Unix timestamp)
\`\`\`

### Common Path Operations

\`\`\`python
from pathlib import Path

# Navigation
home = Path.home()          # e.g., Path("/home/alice")
cwd = Path.cwd()            # Current working directory

# Reading and writing (no need to open()!)
content = Path("readme.txt").read_text(encoding="utf-8")
Path("output.txt").write_text("Hello!", encoding="utf-8")
data = Path("photo.jpg").read_bytes()

# Directory operations
Path("newdir").mkdir(exist_ok=True)
Path("a/b/c").mkdir(parents=True, exist_ok=True)  # like mkdir -p

# Listing directory contents
for item in Path(".").iterdir():
    print(item.name, "DIR" if item.is_dir() else "FILE")

# Glob patterns
py_files = list(Path(".").glob("*.py"))        # Current dir only
all_py = list(Path(".").rglob("*.py"))         # Recursive

# File manipulation
Path("old.txt").rename("new.txt")
Path("file.txt").unlink()       # Delete file
Path("dir").rmdir()             # Delete empty directory
\`\`\`

### Building Paths Safely

\`\`\`python
from pathlib import Path

# The / operator builds paths cross-platform
base = Path("/var/log")
log_file = base / "myapp" / "2024" / "errors.log"
print(log_file)  # /var/log/myapp/2024/errors.log

# Much better than os.path.join():
import os.path
old_way = os.path.join("/var", "log", "myapp", "errors.log")
\`\`\`

## \`os.path\` vs \`pathlib\`

\`os.path\` is the older, string-based approach. \`pathlib\` is the modern replacement:

\`\`\`python
import os.path
from pathlib import Path

# Joining paths
os.path.join("/home", "user", "file.txt")    # old
Path("/home") / "user" / "file.txt"          # new

# Getting the directory of a file
os.path.dirname("/home/user/file.txt")        # old
Path("/home/user/file.txt").parent            # new

# Checking existence
os.path.exists("data.csv")                   # old
Path("data.csv").exists()                    # new
\`\`\`

For new code, prefer \`pathlib\`. It's more readable, more cross-platform, and has a richer API.

## Practical Example: Log Rotation

\`\`\`python
from pathlib import Path
from datetime import date

def rotate_logs(log_dir: str, max_files: int = 7) -> None:
    """Keep only the most recent max_files log files."""
    log_path = Path(log_dir)
    log_path.mkdir(exist_ok=True)

    # Write today's log
    today = date.today().isoformat()
    log_file = log_path / f"app-{today}.log"
    log_file.write_text(f"Log started on {today}\\n", encoding="utf-8")

    # Get all log files sorted by modification time (oldest first)
    logs = sorted(log_path.glob("app-*.log"), key=lambda p: p.stat().st_mtime)

    # Delete oldest files if over the limit
    while len(logs) > max_files:
        logs.pop(0).unlink()
        print(f"Deleted old log")

rotate_logs("./logs")
\`\`\`
`,
  quiz: [
    {
      question: "Why is the `with open(...) as f:` pattern preferred over manually calling `f.close()`?",
      options: [
        "The with statement is faster because it uses buffered I/O",
        "It automatically closes the file even if an exception occurs inside the block, preventing resource leaks",
        "It allows reading and writing simultaneously without specifying a mode",
        "It's required when using encoding='utf-8'",
      ],
      correctIndex: 1,
    },
    {
      question: "What happens when you open a file with mode `'w'` and the file already exists?",
      options: [
        "A FileExistsError is raised",
        "The new content is appended to the existing content",
        "The existing file is truncated (emptied) and overwritten",
        "The file is opened in read-only mode as a safety measure",
      ],
      correctIndex: 2,
    },
    {
      question: "In pathlib, how do you combine path segments into a single Path object?",
      options: [
        "Path.join('/home', 'user', 'file.txt')",
        "Path('/home') + 'user' + 'file.txt'",
        "Path('/home') / 'user' / 'file.txt'",
        "Path.concat(['/home', 'user', 'file.txt'])",
      ],
      correctIndex: 2,
    },
  ],
};
