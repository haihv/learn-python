import type { LessonModule } from "../types";

export const inheritance: LessonModule = {
  type: "lesson",
  id: "36",
  slug: "inheritance",
  title: "Inheritance, super(), MRO",
  icon: "🧬",
  estimatedMinutes: 15,
  content: `# Inheritance, super(), and Method Resolution Order

Inheritance lets a class **inherit** attributes and methods from another class. This enables code reuse and expresses "is-a" relationships: a \`Dog\` is an \`Animal\`, a \`SavingsAccount\` is a \`BankAccount\`.

## Single Inheritance

\`\`\`python
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}!"

    def __str__(self):
        return f"{type(self).__name__}({self.name!r})"

class Dog(Animal):          # Dog inherits from Animal
    def fetch(self, item):
        return f"{self.name} fetched the {item}!"

class Cat(Animal):
    def purr(self):
        return f"{self.name} purrs..."

dog = Dog("Rex", "Woof")
cat = Cat("Whiskers", "Meow")

print(dog.speak())          # Rex says Woof!  (inherited from Animal)
print(dog.fetch("ball"))    # Rex fetched the ball!  (Dog-specific)
print(cat.speak())          # Whiskers says Meow!
print(cat.purr())           # Whiskers purrs...
\`\`\`

The subclass (\`Dog\`) gets all of the parent's (\`Animal\`) methods for free. It can also define its own additional methods.

## super().__init__() — Delegating to the Parent

When a subclass has its own \`__init__\`, it should call the parent's \`__init__\` using \`super()\` to ensure the parent's setup is done correctly.

\`\`\`python
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)  # Call Animal.__init__ first
        self.breed = breed           # Then add Dog-specific attributes

    def __str__(self):
        return f"Dog({self.name!r}, {self.breed!r}, age={self.age})"

rex = Dog("Rex", 3, "German Shepherd")
print(rex)         # Dog('Rex', 'German Shepherd', age=3)
print(rex.name)    # Rex  (set by Animal.__init__)
print(rex.breed)   # German Shepherd  (set by Dog.__init__)
\`\`\`

If you forget \`super().__init__()\`, the parent's attributes won't be set and you'll get \`AttributeError\` when you try to access them.

## Method Overriding

A subclass can override any method from its parent by defining a method with the same name:

\`\`\`python
class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):               # Overrides Animal.speak
        return f"{self.name} barks: Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} meows: Meow!"

class Duck(Animal):
    def speak(self):
        return f"{self.name} quacks: Quack!"

# Polymorphism: same interface, different behavior
animals = [Dog("Rex", 3, "Lab"), Cat("Whiskers", 2)]
for animal in animals:
    print(animal.speak())   # Each uses its own speak()
\`\`\`

### Extending vs Replacing

You can call the parent's method and extend its behavior:

\`\`\`python
class Animal:
    def describe(self):
        return f"I am {self.name}"

class Dog(Animal):
    def describe(self):
        base = super().describe()    # Get parent's description
        return f"{base}, a {self.breed}"

rex = Dog("Rex", 3, "Lab")
print(rex.describe())   # I am Rex, a Lab
\`\`\`

## isinstance() and issubclass()

\`\`\`python
class Animal: pass
class Dog(Animal): pass
class Cat(Animal): pass

rex = Dog()

isinstance(rex, Dog)     # True  — rex is a Dog
isinstance(rex, Animal)  # True  — Dog is a subclass of Animal
isinstance(rex, Cat)     # False

issubclass(Dog, Animal)  # True  — Dog inherits from Animal
issubclass(Cat, Dog)     # False
issubclass(Animal, Animal)  # True  — a class is a subclass of itself
\`\`\`

## Multiple Inheritance

Python supports inheriting from multiple parent classes:

\`\`\`python
class Flyable:
    def fly(self):
        return f"{self.name} is flying!"

class Swimmable:
    def swim(self):
        return f"{self.name} is swimming!"

class Duck(Animal, Flyable, Swimmable):
    def __init__(self, name):
        super().__init__(name, "Quack")

donald = Duck("Donald")
print(donald.speak())  # Donald says Quack!
print(donald.fly())    # Donald is flying!
print(donald.swim())   # Donald is swimming!
\`\`\`

## MRO: Method Resolution Order

When Python looks up a method, it follows the **Method Resolution Order (MRO)** — a deterministic ordering of classes to search. Use \`__mro__\` or \`mro()\` to inspect it:

\`\`\`python
class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return "B"

class C(A):
    def method(self):
        return "C"

class D(B, C):
    pass

print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

d = D()
print(d.method())  # "B" — follows MRO left to right
\`\`\`

The MRO is computed using the **C3 linearization algorithm**, which ensures:
1. Subclasses come before parent classes
2. The left-to-right order of base classes is preserved
3. No class appears before any of its subclasses

### super() in Multiple Inheritance

\`super()\` follows the MRO, not just the direct parent. This is why \`super().__init__()\` is the correct way to call parent constructors in all cases:

\`\`\`python
class A:
    def __init__(self):
        print("A.__init__")
        super().__init__()

class B(A):
    def __init__(self):
        print("B.__init__")
        super().__init__()

class C(A):
    def __init__(self):
        print("C.__init__")
        super().__init__()

class D(B, C):
    def __init__(self):
        print("D.__init__")
        super().__init__()

D()
# D.__init__
# B.__init__
# C.__init__
# A.__init__
\`\`\`

Each \`super().__init__()\` call follows the MRO, ensuring \`A.__init__\` is called exactly once. This pattern is called **cooperative multiple inheritance**.

## Mixins

A **mixin** is a class that provides methods to other classes through inheritance, but is not meant to stand alone. Mixins are a clean way to add behavior without deep inheritance hierarchies:

\`\`\`python
class JsonMixin:
    """Adds JSON serialization to any class that has a __dict__."""
    def to_json(self):
        import json
        return json.dumps(self.__dict__, indent=2)

    @classmethod
    def from_json(cls, json_str):
        import json
        data = json.loads(json_str)
        obj = cls.__new__(cls)
        obj.__dict__.update(data)
        return obj

class LogMixin:
    """Adds logging to any class."""
    def log(self, message):
        print(f"[{type(self).__name__}] {message}")

class User(JsonMixin, LogMixin):
    def __init__(self, name, email):
        self.name = name
        self.email = email

user = User("Alice", "alice@example.com")
user.log("User created")           # [User] User created
print(user.to_json())
# {
#   "name": "Alice",
#   "email": "alice@example.com"
# }
\`\`\`

Mixins keep related behavior grouped in one place, and you can mix and match them across unrelated class hierarchies.
`,
  quiz: [
    {
      question: "What does `super().__init__()` do in a subclass `__init__` method?",
      options: [
        "It creates a new instance of the parent class",
        "It calls the parent class's `__init__` method to initialize the inherited attributes",
        "It replaces the parent's __init__ entirely",
        "It's only needed when using multiple inheritance",
      ],
      correctIndex: 1,
    },
    {
      question: "Given `class D(B, C)` where both B and C inherit from A, in what order does Python's MRO place these classes?",
      options: [
        "D → A → B → C → object",
        "D → B → C → A → object",
        "D → C → B → A → object",
        "A → B → C → D → object",
      ],
      correctIndex: 1,
    },
    {
      question: "What is a mixin in Python?",
      options: [
        "A class that can only be instantiated as part of another class",
        "A class that provides reusable methods through multiple inheritance but isn't meant to stand alone",
        "A decorator that mixes two functions together",
        "A special Python keyword for combining classes",
      ],
      correctIndex: 1,
    },
  ],
};
