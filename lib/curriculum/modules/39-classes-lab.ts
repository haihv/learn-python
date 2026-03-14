import type { LabModule } from "../types";

export const classesLab: LabModule = {
  type: "lab",
  id: "39",
  slug: "classes-lab",
  title: "OOP Lab: Build a Mini Library",
  icon: "🧪",
  estimatedMinutes: 30,
  description: "Build a mini library system using OOP",
  instructions: `# OOP Lab: Mini Library System

Build a mini library management system using Python classes. The system must support books, members, and borrowing/returning operations.

## Classes to Implement

### 1. \`Book\`

\`\`\`python
class Book:
    def __init__(self, title: str, author: str, isbn: str)
\`\`\`

- \`title\`, \`author\`, \`isbn\` — stored as instance attributes
- \`is_available: bool\` — \`True\` by default
- \`__str__\` — returns \`"title by author"\`
- \`__repr__\` — returns \`"Book(title, author, isbn)"\`
- \`__eq__\` — two books are equal if their ISBN matches

### 2. \`Member\`

\`\`\`python
class Member:
    def __init__(self, name: str, member_id: str)
\`\`\`

- \`name\`, \`member_id\` — stored as attributes
- \`borrowed_books: list\` — empty list initially
- \`borrow(book)\` — adds the book to \`borrowed_books\` and sets \`book.is_available = False\`; raises \`ValueError\` if book is not available
- \`return_book(book)\` — removes the book from \`borrowed_books\` and sets \`book.is_available = True\`; raises \`ValueError\` if the member doesn't have that book
- \`__str__\` — returns \`"Member(name, N books borrowed)"\`

### 3. \`Library\`

\`\`\`python
class Library:
    def __init__(self, name: str)
\`\`\`

- \`name\`, \`books: list\`, \`members: list\`
- \`add_book(book)\` — adds a Book to the catalog
- \`register_member(member)\` — adds a Member
- \`search_by_title(query)\` — returns list of books where query (case-insensitive) is in the title
- \`available_books()\` — returns list of available books
- \`__len__\` — returns total number of books in the catalog
- \`__contains__\` — returns True if a Book (by ISBN) is in the catalog

## Example Usage

\`\`\`python
lib = Library("City Library")

book1 = Book("Python Crash Course", "Eric Matthes", "978-1593279288")
book2 = Book("Fluent Python", "Luciano Ramalho", "978-1492056355")
book3 = Book("Clean Code", "Robert Martin", "978-0132350884")

lib.add_book(book1)
lib.add_book(book2)
lib.add_book(book3)

alice = Member("Alice", "M001")
lib.register_member(alice)

alice.borrow(book1)
print(len(lib))               # 3
print(len(lib.available_books()))  # 2
print(book1 in lib)           # True
print(alice)                  # Member(Alice, 1 books borrowed)

results = lib.search_by_title("python")
print([str(b) for b in results])
# ['Python Crash Course by Eric Matthes']

alice.return_book(book1)
print(book1.is_available)     # True
\`\`\`
`,
  starterCode: `class Book:
    def __init__(self, title, author, isbn):
        # TODO: store title, author, isbn; set is_available = True
        pass

    def __str__(self):
        # TODO: return "title by author"
        pass

    def __repr__(self):
        # TODO: return repr string e.g. "Book('title', 'author', 'isbn')"
        pass

    def __eq__(self, other):
        # TODO: compare ISBNs (return NotImplemented if other is not a Book)
        pass

    def __hash__(self):
        # TODO: return hash(self.isbn)
        pass


class Member:
    def __init__(self, name, member_id):
        self.name = name
        self.member_id = member_id
        self.borrowed_books = []

    def borrow(self, book):
        # TODO: check availability, update book, append to borrowed_books
        pass

    def return_book(self, book):
        # TODO: check membership, update book, remove from list
        pass

    def __str__(self):
        # TODO: return "Member(name, N books borrowed)"
        pass


class Library:
    def __init__(self, name):
        self.name = name
        self.books = []
        self.members = []

    def add_book(self, book):
        self.books.append(book)

    def register_member(self, member):
        self.members.append(member)

    def search_by_title(self, query):
        # TODO: case-insensitive title search
        pass

    def available_books(self):
        # TODO: return list of available books
        pass

    def __len__(self):
        # TODO: return count of all books
        pass

    def __contains__(self, book):
        # TODO: check if a book (by ISBN) is in the catalog
        pass


# Demo
lib = Library("City Library")

book1 = Book("Python Crash Course", "Eric Matthes", "978-1593279288")
book2 = Book("Fluent Python", "Luciano Ramalho", "978-1492056355")
book3 = Book("Clean Code", "Robert Martin", "978-0132350884")

lib.add_book(book1)
lib.add_book(book2)
lib.add_book(book3)

alice = Member("Alice", "M001")
lib.register_member(alice)

alice.borrow(book1)
print(f"Library size: {len(lib)}")
print(f"Available: {len(lib.available_books())}")
print(f"book1 in lib: {book1 in lib}")
print(alice)

results = lib.search_by_title("python")
print([str(b) for b in results])

alice.return_book(book1)
print(f"book1 available after return: {book1.is_available}")

# Test error handling
try:
    alice.borrow(book1)
    alice.borrow(book1)  # Try borrowing same book twice
except ValueError as e:
    print(f"Error: {e}")
`,
  tests: [
    {
      name: "Library size is correct",
      description: "len(lib) should return 3 after adding 3 books",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("Library size: 3");
      },
    },
    {
      name: "Available books count decreases when borrowed",
      description: "After borrowing one book, available_books() should return 2",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("Available: 2");
      },
    },
    {
      name: "Member string shows borrowed count",
      description: "str(alice) should show '1 books borrowed' after borrowing one book",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("1 books borrowed");
      },
    },
    {
      name: "search_by_title works case-insensitively",
      description: "Searching 'python' should find 'Python Crash Course'",
      validate: (_code: string, stdout: string) => {
        return stdout.includes("Python Crash Course") && stdout.includes("Eric Matthes");
      },
    },
    {
      name: "Book returns correctly and double-borrow raises error",
      description: "After returning, the book should be available; borrowing an unavailable book raises ValueError",
      validate: (_code: string, stdout: string) => {
        return (
          stdout.includes("book1 available after return: True") &&
          (stdout.includes("is not available") || stdout.includes("Error:"))
        );
      },
    },
  ],
  solutionCode: `class Book:
    def __init__(self, title, author, isbn):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.is_available = True

    def __str__(self):
        return f"{self.title} by {self.author}"

    def __repr__(self):
        return f"Book({self.title!r}, {self.author!r}, {self.isbn!r})"

    def __eq__(self, other):
        if not isinstance(other, Book):
            return NotImplemented
        return self.isbn == other.isbn

    def __hash__(self):
        return hash(self.isbn)


class Member:
    def __init__(self, name, member_id):
        self.name = name
        self.member_id = member_id
        self.borrowed_books = []

    def borrow(self, book):
        if not book.is_available:
            raise ValueError(f"{book.title!r} is not available")
        book.is_available = False
        self.borrowed_books.append(book)

    def return_book(self, book):
        if book not in self.borrowed_books:
            raise ValueError(f"{self.name} does not have {book.title!r}")
        self.borrowed_books.remove(book)
        book.is_available = True

    def __str__(self):
        n = len(self.borrowed_books)
        return f"Member({self.name}, {n} books borrowed)"

    def __repr__(self):
        return f"Member(name={self.name!r}, id={self.member_id!r})"


class Library:
    def __init__(self, name):
        self.name = name
        self.books = []
        self.members = []

    def add_book(self, book):
        self.books.append(book)

    def register_member(self, member):
        self.members.append(member)

    def search_by_title(self, query):
        q = query.lower()
        return [b for b in self.books if q in b.title.lower()]

    def available_books(self):
        return [b for b in self.books if b.is_available]

    def __len__(self):
        return len(self.books)

    def __contains__(self, book):
        return any(b.isbn == book.isbn for b in self.books)

    def __repr__(self):
        return f"Library({self.name!r}, {len(self.books)} books)"


lib = Library("City Library")
book1 = Book("Python Crash Course", "Eric Matthes", "978-1593279288")
book2 = Book("Fluent Python", "Luciano Ramalho", "978-1492056355")
book3 = Book("Clean Code", "Robert Martin", "978-0132350884")

lib.add_book(book1)
lib.add_book(book2)
lib.add_book(book3)

alice = Member("Alice", "M001")
lib.register_member(alice)

alice.borrow(book1)
print(f"Library size: {len(lib)}")
print(f"Available: {len(lib.available_books())}")
print(f"book1 in lib: {book1 in lib}")
print(alice)

results = lib.search_by_title("python")
print([str(b) for b in results])

alice.return_book(book1)
print(f"book1 available after return: {book1.is_available}")

try:
    alice.borrow(book1)
    alice.borrow(book1)
except ValueError as e:
    print(f"Error: {e}")
`,
};
