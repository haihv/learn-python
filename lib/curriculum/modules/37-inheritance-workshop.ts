import type { WorkshopModule } from "../types";

export const inheritanceWorkshop: WorkshopModule = {
  type: "workshop",
  id: "37",
  slug: "inheritance-workshop",
  title: "Extending Classes & super()",
  icon: "🔗",
  estimatedMinutes: 20,
  description: "Practice class hierarchies with super()",
  steps: [
    {
      instruction:
        "Create an `Animal` base class with `__init__(self, name, age)` and a `speak(self)` method that returns `'...'`. Add a `__str__` that returns `'Animal(name)'`. Then create `Dog` and `Cat` subclasses, each calling `super().__init__()` and overriding `speak()` to return the appropriate sound.",
      hint: "class Dog(Animal): def __init__(self, name, age, breed): super().__init__(name, age) then self.breed = breed. Override speak() to return f'{self.name} says: Woof!'. Same pattern for Cat with 'Meow!'.",
      starterCode: `class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def speak(self):
        return "..."

    def __str__(self):
        return f"{type(self).__name__}({self.name!r})"

class Dog(Animal):
    def __init__(self, name, age, breed):
        # TODO: call super().__init__, store self.breed
        pass

    def speak(self):
        # TODO: return f"{self.name} says: Woof!"
        pass

class Cat(Animal):
    def __init__(self, name, age, indoor=True):
        # TODO: call super().__init__, store self.indoor
        pass

    def speak(self):
        # TODO: return f"{self.name} says: Meow!"
        pass

# Test the hierarchy
dog = Dog("Rex", 3, "Labrador")
cat = Cat("Whiskers", 5, indoor=True)

print(dog)          # Dog('Rex')
print(cat)          # Cat('Whiskers')
print(dog.speak())  # Rex says: Woof!
print(cat.speak())  # Whiskers says: Meow!
print(dog.age)      # 3  (inherited attribute)

# Polymorphism
animals = [dog, cat]
for animal in animals:
    print(f"  {animal.speak()}")
`,
      validate: (code: string) => {
        return (
          code.includes("class Dog(Animal)") &&
          code.includes("class Cat(Animal)") &&
          code.includes("super().__init__") &&
          code.includes("speak")
        );
      },
      successMessage:
        "Animal hierarchy built! Polymorphism means you can call speak() on any Animal without knowing the specific type — the right method is called automatically.",
    },
    {
      instruction:
        "Add a `ServiceDog` class that inherits from `Dog`. Its `__init__` takes `name, age, breed, service_type`. Override `speak()` to call `super().speak()` and append `f' (trained for {self.service_type})'`. Demonstrate that `isinstance(sd, Dog)` and `isinstance(sd, Animal)` are both `True`.",
      hint: "class ServiceDog(Dog): def __init__(self, name, age, breed, service_type): super().__init__(name, age, breed), then self.service_type = service_type. In speak: base = super().speak(), return base + additional info.",
      starterCode: `class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def speak(self):
        return "..."
    def __str__(self):
        return f"{type(self).__name__}({self.name!r})"

class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)
        self.breed = breed
    def speak(self):
        return f"{self.name} says: Woof!"

class ServiceDog(Dog):
    def __init__(self, name, age, breed, service_type):
        # TODO: call super().__init__, store self.service_type
        pass

    def speak(self):
        # TODO: call super().speak(), append training info, return result
        pass

buddy = ServiceDog("Buddy", 4, "Golden Retriever", "guide")
print(buddy)          # ServiceDog('Buddy')
print(buddy.speak())  # Buddy says: Woof! (trained for guide)
print(buddy.breed)    # Golden Retriever (from Dog)
print(buddy.age)      # 4 (from Animal)

# Type checks
print(isinstance(buddy, ServiceDog))  # True
print(isinstance(buddy, Dog))         # True
print(isinstance(buddy, Animal))      # True

# MRO
print([c.__name__ for c in ServiceDog.__mro__])
`,
      validate: (code: string) => {
        return (
          code.includes("class ServiceDog(Dog)") &&
          code.includes("super().__init__") &&
          code.includes("self.service_type") &&
          code.includes("isinstance")
        );
      },
      successMessage:
        "Multi-level inheritance works seamlessly. Each super() call chains up the hierarchy. The MRO shows exactly which class's method will be called.",
    },
    {
      instruction:
        "Create a `Speakable` mixin with a `introduce(self)` method that returns `f'Hi, I am {self.name}, a {type(self).__name__}.'`. Apply this mixin to a `Parrot` class that also inherits from `Animal`. Verify the mixin method works without the mixin needing to know anything about `Animal`.",
      hint: "class Speakable: def introduce(self): return f-string. class Parrot(Speakable, Animal): def __init__(self, name, age): super().__init__(name, age). def speak(self): return f'{self.name} squawks!'.",
      starterCode: `class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def speak(self):
        return "..."
    def __str__(self):
        return f"{type(self).__name__}({self.name!r})"

class Speakable:
    """Mixin that adds an introduction method."""
    def introduce(self):
        # TODO: return introduction f-string with self.name and type(self).__name__
        pass

class Parrot(Speakable, Animal):
    def __init__(self, name, age, can_talk=True):
        # TODO: call super().__init__, store self.can_talk
        pass

    def speak(self):
        # TODO: return different phrase based on self.can_talk
        pass

polly = Parrot("Polly", 7)
print(polly.speak())       # Polly says: Polly wants a cracker!
print(polly.introduce())   # Hi, I am Polly, a Parrot.
print(polly.name)          # Polly (from Animal via super())

# Check MRO
print([c.__name__ for c in Parrot.__mro__])
# [Parrot, Speakable, Animal, object]
`,
      validate: (code: string) => {
        return (
          code.includes("class Speakable") &&
          code.includes("introduce") &&
          code.includes("class Parrot") &&
          code.includes("Speakable") &&
          code.includes("Animal") &&
          code.includes("super().__init__") &&
          code.includes("self.can_talk")
        );
      },
      successMessage:
        "Mixins are powerful! The Speakable mixin has no idea about Animal — it just assumes self.name exists. This loose coupling is what makes mixins reusable across any class hierarchy.",
    },
    {
      instruction:
        "Use `issubclass()` and `__mro__` to introspect the class hierarchy. Build a function `hierarchy_info(cls)` that prints all classes in the MRO (excluding `object`) and whether each relationship is direct or inherited. Test it on `ServiceDog`.",
      hint: "for cls_in_mro in cls.__mro__[:-1]: (skip object). For each class, check if it's in cls.__bases__ to see if it's a direct parent. issubclass(cls, parent) checks if cls inherits from parent.",
      starterCode: `class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)
        self.breed = breed

class ServiceDog(Dog):
    def __init__(self, name, age, breed, service_type):
        super().__init__(name, age, breed)
        self.service_type = service_type

def hierarchy_info(cls):
    # TODO: print the class hierarchy, direct parents,
    # all ancestors, and subclass relationships
    pass

hierarchy_info(ServiceDog)
`,
      validate: (code: string) => {
        return (
          code.includes("issubclass") &&
          code.includes("__mro__") &&
          code.includes("hierarchy_info")
        );
      },
      successMessage:
        "MRO introspection gives you a window into Python's method resolution mechanism. In complex multiple inheritance, __mro__ is your debugging tool.",
    },
    {
      instruction:
        "Build a `Vehicle` base class and two subclasses `Car` and `ElectricCar`. `ElectricCar` inherits from `Car`. Add a `BatteryMixin` with a `charge_status()` method. Show cooperative `super()` calls by having each `__init__` properly chain to the next in the MRO.",
      hint: "class BatteryMixin: def charge_status(self): return f'Battery: {self.battery_level}%'. class ElectricCar(BatteryMixin, Car): def __init__(self, make, model, year, battery_level): super().__init__(make, model, year) then self.battery_level = battery_level.",
      starterCode: `class Vehicle:
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year

    def describe(self):
        return f"{self.year} {self.make} {self.model}"

class Car(Vehicle):
    def __init__(self, make, model, year, num_doors=4):
        super().__init__(make, model, year)
        self.num_doors = num_doors

    def describe(self):
        base = super().describe()
        return f"{base} ({self.num_doors}-door)"

class BatteryMixin:
    """Mixin for electric vehicle battery status."""
    def charge_status(self):
        # TODO: return f"Battery: {self.battery_level}%"
        pass

    def is_low_battery(self):
        # TODO: return True if battery_level < 20
        pass

class ElectricCar(BatteryMixin, Car):
    def __init__(self, make, model, year, battery_level=100):
        # TODO: call super().__init__, store self.battery_level
        pass

    def describe(self):
        # TODO: call super().describe(), append electric info, return result
        pass

tesla = ElectricCar("Tesla", "Model 3", 2024, battery_level=85)
print(tesla.describe())        # 2024 Tesla Model 3 (4-door) [Electric, 85% charge]
print(tesla.charge_status())   # Battery: 85%
print(tesla.is_low_battery())  # False

print("\\nMRO:", [c.__name__ for c in ElectricCar.__mro__])
print("Is Vehicle?", isinstance(tesla, Vehicle))   # True
print("Is Car?",     isinstance(tesla, Car))       # True
`,
      validate: (code: string) => {
        return (
          code.includes("class BatteryMixin") &&
          code.includes("class ElectricCar") &&
          code.includes("super().__init__") &&
          code.includes("self.battery_level")
        );
      },
      successMessage:
        "Cooperative multiple inheritance with mixins — this is how many real-world Python frameworks like Django are built. Each class does one thing, and they compose cleanly through the MRO.",
    },
  ],
};
