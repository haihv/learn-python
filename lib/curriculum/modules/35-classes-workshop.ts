import type { WorkshopModule } from "../types";

export const classesWorkshop: WorkshopModule = {
  type: "workshop",
  id: "35",
  slug: "classes-workshop",
  title: "Building a Data Model with Classes",
  icon: "🏛️",
  estimatedMinutes: 25,
  description: "Build a complete data model using Python classes",
  steps: [
    {
      instruction:
        "Define a `BankAccount` class with `__init__(self, owner, balance=0.0)`. Store `owner` and `balance` as instance attributes, and initialize an empty list `self.transactions`. Add a `__str__` method that returns `'BankAccount(owner, balance=X.XX)'`. Create an account and print it.",
      hint: "class BankAccount: then def __init__(self, owner, balance=0.0): set self.owner, self.balance, self.transactions = []. Then def __str__(self): return an f-string with the owner and balance.",
      starterCode: `class BankAccount:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance
        self.transactions = []

    def __str__(self):
        return f"BankAccount({self.owner!r}, balance={self.balance:.2f})"

# Create and print an account
account = BankAccount("Alice", 500.0)
print(account)      # BankAccount('Alice', balance=500.00)
print(account.owner)    # Alice
print(account.balance)  # 500.0
`,
      validate: (code: string) => {
        return (
          code.includes("class BankAccount") &&
          code.includes("__init__") &&
          code.includes("self.owner") &&
          code.includes("self.balance") &&
          code.includes("__str__")
        );
      },
      successMessage:
        "BankAccount class created! The __str__ method makes instances human-readable when printed.",
    },
    {
      instruction:
        "Add `deposit(self, amount)` and `withdraw(self, amount)` methods to `BankAccount`. `deposit` should raise `ValueError` if amount <= 0, then add to balance and append `('deposit', amount)` to transactions. `withdraw` should raise `ValueError` if amount > balance, then subtract from balance and append `('withdrawal', amount)`. Return the new balance from both.",
      hint: "def deposit(self, amount): if amount <= 0: raise ValueError(...). self.balance += amount. self.transactions.append(('deposit', amount)). return self.balance. Similar pattern for withdraw but check amount > self.balance.",
      starterCode: `class BankAccount:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance
        self.transactions = []

    def __str__(self):
        return f"BankAccount({self.owner!r}, balance={self.balance:.2f})"

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount
        self.transactions.append(("deposit", amount))
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError(f"Insufficient funds: balance is {self.balance:.2f}")
        self.balance -= amount
        self.transactions.append(("withdrawal", amount))
        return self.balance

account = BankAccount("Alice", 500.0)
print(account.deposit(200.0))   # 700.0
print(account.withdraw(150.0))  # 550.0
print(account)                  # BankAccount('Alice', balance=550.00)

try:
    account.withdraw(1000.0)
except ValueError as e:
    print(f"Error: {e}")
`,
      validate: (code: string) => {
        return (
          code.includes("deposit") &&
          code.includes("withdraw") &&
          code.includes("transactions") &&
          code.includes("ValueError")
        );
      },
      successMessage:
        "Transaction methods added with proper validation! Notice how we raise ValueError for invalid operations — this is the Pythonic way to signal usage errors.",
    },
    {
      instruction:
        "Add a `get_statement(self)` method that returns a formatted string showing all transactions and the final balance. Also add a `transfer(self, amount, target_account)` method that withdraws from self and deposits to target. Test transferring $100 between two accounts.",
      hint: "In get_statement, build a list of lines and join with newline. For each (txn_type, amount) in self.transactions, format a line. For transfer: self.withdraw(amount) then target_account.deposit(amount).",
      starterCode: `class BankAccount:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance
        self.transactions = []

    def __str__(self):
        return f"BankAccount({self.owner!r}, balance={self.balance:.2f})"

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount
        self.transactions.append(("deposit", amount))
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError(f"Insufficient funds: balance is {self.balance:.2f}")
        self.balance -= amount
        self.transactions.append(("withdrawal", amount))
        return self.balance

    def get_statement(self):
        lines = [f"=== Statement for {self.owner} ==="]
        for txn_type, amount in self.transactions:
            prefix = "+" if txn_type == "deposit" else "-"
            lines.append(f"  {prefix}\${amount:.2f}  ({txn_type})")
        lines.append(f"  Balance: \${self.balance:.2f}")
        return "\\n".join(lines)

    def transfer(self, amount, target_account):
        self.withdraw(amount)
        target_account.deposit(amount)
        print(f"Transferred \${amount:.2f} from {self.owner} to {target_account.owner}")

alice = BankAccount("Alice", 500.0)
bob = BankAccount("Bob", 200.0)

alice.deposit(300.0)
alice.transfer(100.0, bob)

print(alice.get_statement())
print()
print(bob.get_statement())
`,
      validate: (code: string) => {
        return (
          code.includes("get_statement") &&
          code.includes("transfer") &&
          code.includes("target_account")
        );
      },
      successMessage:
        "Transfer method shows how objects can interact with each other. The statement gives a full history — this is why storing transactions as a list pays off!",
    },
    {
      instruction:
        "Add a class variable `interest_rate = 0.05` to `BankAccount` and an instance method `apply_interest(self)` that adds `self.balance * interest_rate` to the balance and records it as a transaction type `'interest'`. Also add a class method `set_interest_rate(cls, rate)` decorated with `@classmethod` to update the class-wide rate.",
      hint: "class interest_rate = 0.05 at class level. def apply_interest(self): interest = self.balance * BankAccount.interest_rate. Then self.balance += interest and self.transactions.append(('interest', interest)). @classmethod def set_interest_rate(cls, rate): cls.interest_rate = rate.",
      starterCode: `class BankAccount:
    interest_rate = 0.05  # 5% annual interest (class variable)

    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance
        self.transactions = []

    def __str__(self):
        return f"BankAccount({self.owner!r}, balance={self.balance:.2f})"

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

    def apply_interest(self):
        interest = self.balance * BankAccount.interest_rate
        self.balance += interest
        self.transactions.append(("interest", interest))
        return self.balance

    @classmethod
    def set_interest_rate(cls, rate):
        cls.interest_rate = rate
        print(f"Interest rate updated to {rate:.1%}")

account = BankAccount("Alice", 1000.0)
print(f"Initial: \${account.balance:.2f}")
account.apply_interest()
print(f"After interest: \${account.balance:.2f}")  # $1050.00

BankAccount.set_interest_rate(0.03)
account2 = BankAccount("Bob", 1000.0)
account2.apply_interest()
print(f"Bob after 3% interest: \${account2.balance:.2f}")  # $1030.00
print(f"Current rate: {BankAccount.interest_rate:.1%}")   # 3.0%
`,
      validate: (code: string) => {
        return (
          code.includes("interest_rate") &&
          code.includes("apply_interest") &&
          code.includes("classmethod") &&
          code.includes("set_interest_rate")
        );
      },
      successMessage:
        "Class variables and classmethods work together beautifully. The classmethod pattern is the standard way to provide alternative constructors and class-level operations.",
    },
    {
      instruction:
        "Add a `__repr__` method and a `from_dict` class method constructor. `from_dict` should accept a dict like `{'owner': 'Alice', 'balance': 500.0}` and return a `BankAccount` instance. Demonstrate creating an account from a dict. Also use `isinstance()` to verify the created object is a `BankAccount`.",
      hint: "def __repr__(self): return f'BankAccount(owner={self.owner!r}, balance={self.balance:.2f})'. @classmethod def from_dict(cls, data): return cls(data['owner'], data.get('balance', 0.0)).",
      starterCode: `class BankAccount:
    interest_rate = 0.05

    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance
        self.transactions = []

    def __str__(self):
        return f"BankAccount({self.owner!r}, balance={self.balance:.2f})"

    def __repr__(self):
        return f"BankAccount(owner={self.owner!r}, balance={self.balance:.2f})"

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount
        self.transactions.append(("deposit", amount))
        return self.balance

    @classmethod
    def from_dict(cls, data):
        """Create a BankAccount from a dictionary."""
        return cls(data["owner"], data.get("balance", 0.0))

# Create from dict (e.g., loaded from JSON)
account_data = {"owner": "Charlie", "balance": 750.0}
account = BankAccount.from_dict(account_data)

print(account)          # BankAccount('Charlie', balance=750.00)
print(repr(account))    # BankAccount(owner='Charlie', balance=750.00)

# Verify type
print(isinstance(account, BankAccount))   # True
print(type(account).__name__)              # BankAccount

# List of accounts from list of dicts
records = [
    {"owner": "Alice", "balance": 1000.0},
    {"owner": "Bob",   "balance": 500.0},
]
accounts = [BankAccount.from_dict(r) for r in records]
for acc in accounts:
    print(acc)
`,
      validate: (code: string) => {
        return (
          code.includes("__repr__") &&
          code.includes("from_dict") &&
          code.includes("classmethod") &&
          code.includes("isinstance")
        );
      },
      successMessage:
        "Excellent! Alternative constructors via classmethods are a hallmark of well-designed Python classes. You now have a complete, production-quality BankAccount class!",
    },
  ],
};
