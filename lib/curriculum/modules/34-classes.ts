import type { LessonModule } from "../types";

export const classes: LessonModule = {
  type: "lesson",
  id: "34",
  slug: "classes",
  title: "Classes: __init__, self, Instance Methods",
  icon: "🏗️",
  estimatedMinutes: 15,
  content: `# Python Classes: Defining Your Own Types

A **class** is a blueprint for creating objects. Objects bundle together related data (attributes) and behavior (methods). Python's class system is clean, flexible, and central to how many major libraries are designed.

## Defining a Class

\`\`\`python
class Dog:
    pass  # A valid but empty class

my_dog = Dog()        # Create an instance
print(type(my_dog))   # <class '__main__.Dog'>
\`\`\`

Class names use **PascalCase** by convention. Each call to the class creates a new, independent instance.

## __init__: The Initializer

\`__init__\` is called automatically when you create an instance. It sets up the initial state of the object. **Note:** \`__init__\` doesn't create the object — Python creates it first, then calls \`__init__\` to initialize it.

\`\`\`python
class Dog:
    def __init__(self, name, breed, age):
        self.name = name      # Instance attribute
        self.breed = breed
        self.age = age

rex = Dog("Rex", "German Shepherd", 3)
buddy = Dog("Buddy", "Labrador", 5)

print(rex.name)    # Rex
print(buddy.breed) # Labrador
\`\`\`

## self: The Instance Reference

\`self\` is a reference to the **current instance** of the class. When you call \`rex.bark()\`, Python automatically passes \`rex\` as the first argument to the method (which receives it as \`self\`). The name \`self\` is a convention, not a keyword — you could use any name, but always use \`self\`.

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        print(f"{self.name} says: Woof!")

    def get_human_years(self):
        return self.age * 7

rex = Dog("Rex", 3)
rex.bark()                          # Rex says: Woof!
print(rex.get_human_years())        # 21

# What Python actually does:
Dog.bark(rex)                       # Equivalent to rex.bark()
\`\`\`

## Instance Methods

Instance methods are functions defined inside a class. They always receive \`self\` as their first parameter. They can read and modify the instance's attributes.

\`\`\`python
class BankAccount:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance
        self.transactions = []

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount
        self.transactions.append(("deposit", amount))
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        self.transactions.append(("withdrawal", amount))
        return self.balance

    def get_statement(self):
        lines = [f"Account: {self.owner}"]
        for txn_type, amount in self.transactions:
            lines.append(f"  {txn_type:12s}: \${amount:.2f}")
        lines.append(f"  Balance     : \${self.balance:.2f}")
        return "\\n".join(lines)

account = BankAccount("Alice", 1000.0)
account.deposit(500.0)
account.withdraw(200.0)
print(account.get_statement())
# Account: Alice
#   deposit     : $500.00
#   withdrawal  : $200.00
#   Balance     : $1300.00
\`\`\`

## Instance Variables vs Class Variables

**Instance variables** belong to each object independently. **Class variables** are shared across all instances.

\`\`\`python
class Dog:
    species = "Canis lupus familiaris"  # Class variable (shared)
    population = 0

    def __init__(self, name):
        self.name = name          # Instance variable (unique per dog)
        Dog.population += 1       # Modify class variable via class name

rex = Dog("Rex")
buddy = Dog("Buddy")

print(rex.species)         # Canis lupus familiaris (accessed via instance)
print(Dog.species)         # Canis lupus familiaris (accessed via class)
print(Dog.population)      # 2

# DANGER: Assigning to instance.class_var creates an instance variable!
rex.species = "Wolf"       # Creates rex.species instance variable
print(rex.species)         # Wolf (rex's own copy)
print(buddy.species)       # Canis lupus familiaris (class variable unchanged)
print(Dog.species)         # Canis lupus familiaris (class variable unchanged)
\`\`\`

Use class variables for data that should be the same across all instances: constants, configuration, counters.

## __str__: Human-Readable Representation

\`__str__\` is called by \`print()\` and \`str()\`. Without it, you get something like \`<__main__.Dog object at 0x10a3b2e80>\`.

\`\`\`python
class Dog:
    def __init__(self, name, breed, age):
        self.name = name
        self.breed = breed
        self.age = age

    def __str__(self):
        return f"Dog({self.name!r}, {self.breed!r}, age={self.age})"

    def __repr__(self):
        # repr() should produce a string that could recreate the object
        return f"Dog(name={self.name!r}, breed={self.breed!r}, age={self.age!r})"

rex = Dog("Rex", "German Shepherd", 3)
print(rex)          # Dog('Rex', 'German Shepherd', age=3)
print(repr(rex))    # Dog(name='Rex', breed='German Shepherd', age=3)
\`\`\`

If you only define one, define \`__repr__\`. It's used as a fallback for \`str()\` too, and it's shown in the REPL.

## Object Creation: What Actually Happens

When you call \`Dog("Rex", "German Shepherd", 3)\`:

1. Python calls \`Dog.__new__(Dog)\` — creates the object in memory
2. Python calls \`Dog.__init__(instance, "Rex", "German Shepherd", 3)\` — initializes it
3. The initialized instance is returned to the caller

You rarely override \`__new__\`, but it's good to know the full picture.

## type() and isinstance()

\`type(obj)\` returns the exact class of an object. \`isinstance(obj, Class)\` checks if an object is an instance of a class or any of its subclasses.

\`\`\`python
class Animal:
    pass

class Dog(Animal):
    pass

rex = Dog()

print(type(rex))              # <class '__main__.Dog'>
print(type(rex) == Dog)       # True
print(type(rex) == Animal)    # False (exact type check)

print(isinstance(rex, Dog))    # True
print(isinstance(rex, Animal)) # True  ← accounts for inheritance
print(isinstance(rex, str))    # False

# Check against multiple types
print(isinstance(42, (int, float)))   # True
print(isinstance("hi", (int, float))) # False
\`\`\`

Prefer \`isinstance()\` over \`type() ==\` because it handles inheritance correctly.

## Default Argument Values in __init__

\`\`\`python
class Config:
    def __init__(self, host="localhost", port=8080, debug=False):
        self.host = host
        self.port = port
        self.debug = debug

    def __str__(self):
        return f"Config({self.host}:{self.port}, debug={self.debug})"

# All defaults
c1 = Config()
print(c1)  # Config(localhost:8080, debug=False)

# Some overrides
c2 = Config(host="example.com", port=443, debug=True)
print(c2)  # Config(example.com:443, debug=True)
\`\`\`

## A Complete Example

\`\`\`python
class Student:
    school = "Python Academy"  # Shared by all students

    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.grades = {}

    def add_grade(self, subject, score):
        """Record a grade for a subject."""
        self.grades[subject] = score

    def gpa(self):
        """Compute the grade point average."""
        if not self.grades:
            return 0.0
        return sum(self.grades.values()) / len(self.grades)

    def is_passing(self, threshold=60.0):
        return self.gpa() >= threshold

    def __str__(self):
        return f"Student({self.name!r}, GPA={self.gpa():.1f})"

    def __repr__(self):
        return f"Student(name={self.name!r}, id={self.student_id!r})"

alice = Student("Alice", "STU-001")
alice.add_grade("Math", 92)
alice.add_grade("English", 88)
alice.add_grade("Science", 95)

print(alice)              # Student('Alice', GPA=91.7)
print(alice.gpa())        # 91.66666...
print(alice.is_passing()) # True
print(Student.school)     # Python Academy
\`\`\`
`,
  quiz: [
    {
      question: "What is the purpose of `self` in a Python class method?",
      options: [
        "It's a keyword that marks the method as belonging to the class",
        "It's a reference to the current instance, passed automatically when the method is called",
        "It prevents the method from being called on subclass instances",
        "It's required only in `__init__`, not in other methods",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the difference between a class variable and an instance variable?",
      options: [
        "Class variables are faster to access than instance variables",
        "Class variables are defined in __init__, instance variables are defined in the class body",
        "Class variables are shared across all instances; instance variables are unique per instance",
        "There is no difference — Python uses them interchangeably",
      ],
      correctIndex: 2,
    },
    {
      question: "Why is `isinstance(obj, MyClass)` preferred over `type(obj) == MyClass`?",
      options: [
        "isinstance() is faster for large objects",
        "isinstance() correctly returns True for instances of subclasses, while type() == only checks the exact class",
        "type() raises an error when used on class instances",
        "isinstance() works with both old-style and new-style classes",
      ],
      correctIndex: 1,
    },
  ],
};
