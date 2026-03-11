import type { LessonModule } from "../types";

export const closures: LessonModule = {
  type: "lesson",
  id: "25",
  slug: "closures",
  title: "Closures & nonlocal",
  icon: "🔒",
  estimatedMinutes: 15,
  content: `# Closures & nonlocal

A **closure** is a function that remembers the values from its enclosing scope even after that scope has finished executing. Understanding closures is key to mastering decorators, callbacks, and any pattern that requires stateful functions without a class.

## What is a Closure?

When a function is defined inside another function and references variables from the outer function, Python captures those variables. The inner function + the captured environment together form a closure.

\`\`\`python
def make_greeting(greeting):
    def greet(name):
        # 'greeting' is a FREE VARIABLE — it lives in the enclosing scope
        return f"{greeting}, {name}!"
    return greet

hello = make_greeting("Hello")
hi    = make_greeting("Hi")

print(hello("Alice"))   # Hello, Alice!
print(hi("Bob"))        # Hi, Bob!
# Both functions continue to access their captured 'greeting'
# even though make_greeting() has already returned.
\`\`\`

The variable \`greeting\` is called a **free variable** — it's used inside \`greet\` but defined in the enclosing scope.

## Inspecting Closures

Python stores captured variables in **cell objects** accessible via \`__closure__\`:

\`\`\`python
def make_adder(n):
    def add(x):
        return x + n
    return add

add5 = make_adder(5)
print(add5(10))           # 15
print(add5.__closure__)   # (<cell at 0x...>,)

# Peek at the captured value
print(add5.__closure__[0].cell_contents)  # 5
\`\`\`

## The nonlocal Keyword

By default, assignment inside an inner function creates a **new local variable** — it does not modify the outer variable. The \`nonlocal\` keyword explicitly tells Python "this name belongs to the enclosing scope."

\`\`\`python
def make_counter():
    count = 0           # lives in make_counter's scope

    def increment():
        nonlocal count  # bind to the enclosing 'count'
        count += 1
        return count

    def reset():
        nonlocal count
        count = 0

    return increment, reset

inc, rst = make_counter()
print(inc())   # 1
print(inc())   # 2
print(inc())   # 3
rst()
print(inc())   # 1  — back to start
\`\`\`

Without \`nonlocal\`, \`count += 1\` would raise \`UnboundLocalError\` because Python would interpret \`count\` as a local variable that is read before assignment.

## Practical Example: make_adder

Closures are excellent for **factories** — functions that return customised functions:

\`\`\`python
def make_adder(n):
    """Return a function that adds n to its argument."""
    def add(x):
        return x + n
    return add

add10 = make_adder(10)
add20 = make_adder(20)

print(add10(5))    # 15
print(add20(5))    # 25
print(list(map(add10, [1, 2, 3])))  # [11, 12, 13]
\`\`\`

## Simple Memoization with a Closure

You can build a lightweight cache without importing \`functools\`:

\`\`\`python
def memoize(func):
    cache = {}   # captured by the wrapper closure

    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]

    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(35))   # 9227465 — computed in microseconds with cache
\`\`\`

Here \`cache\` is a free variable shared by all calls to \`wrapper\`. It persists between calls because the closure keeps it alive.

## The Classic Late-Binding Gotcha

This is one of the trickiest Python bugs involving closures. When a closure references a **loop variable**, all the generated closures end up sharing the same reference — the final value of the loop variable.

\`\`\`python
# BUG: all functions print 4, not 0, 1, 2, 3, 4
funcs = []
for i in range(5):
    funcs.append(lambda: i)   # 'i' is looked up at CALL time, not definition time

for f in funcs:
    print(f())   # 4  4  4  4  4

# FIX 1: use a default argument to capture the current value
funcs = []
for i in range(5):
    funcs.append(lambda i=i: i)   # default arg evaluated at definition time

for f in funcs:
    print(f())   # 0  1  2  3  4

# FIX 2: wrap in a factory function
def make_func(i):
    return lambda: i     # i is now a local parameter — captured separately

funcs = [make_func(i) for i in range(5)]
for f in funcs:
    print(f())   # 0  1  2  3  4
\`\`\`

The reason is **late binding**: Python closures look up free variable names in the enclosing scope at the time the closure is **called**, not when it is **defined**. By the time any of the lambdas run, the loop has finished and \`i\` is 4.

## Closures vs Classes

A closure is essentially a lightweight object with a single method. When you have only one behaviour, a closure is often more concise:

\`\`\`python
# Counter as a closure
def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

# Counter as a class
class Counter:
    def __init__(self):
        self.count = 0
    def __call__(self):
        self.count += 1
        return self.count

c1 = make_counter()   # Closure — one line to create
c2 = Counter()        # Class — needs __init__, __call__

# Both behave identically:
print(c1(), c1(), c1())  # 1 2 3
print(c2(), c2(), c2())  # 1 2 3
\`\`\`

Use a **closure** when you have one or two closely related inner functions and minimal state. Use a **class** when you need multiple methods, inheritance, or the state grows complex.
`,
  quiz: [
    {
      question:
        "What is a 'free variable' in the context of Python closures?",
      options: [
        "A variable declared with the free keyword",
        "A global variable accessible from any function",
        "A variable used inside an inner function but defined in an enclosing scope",
        "A variable that has been garbage-collected",
      ],
      correctIndex: 2,
    },
    {
      question:
        "Why does this code print '4 4 4 4 4' instead of '0 1 2 3 4'?\nfuncs = [lambda: i for i in range(5)]",
      options: [
        "Lambdas always capture the first value of a variable",
        "Closures use late binding — 'i' is looked up when the lambda is called, by which point the loop has ended and i=4",
        "List comprehensions cannot create closures",
        "The lambda is evaluated immediately, capturing i=4 from the start",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What does the nonlocal keyword do?",
      options: [
        "It declares a new global variable visible across modules",
        "It prevents a variable from being modified anywhere in the program",
        "It tells Python to bind a name to the enclosing (non-global) scope instead of creating a new local variable",
        "It imports a variable from an outer module",
      ],
      correctIndex: 2,
    },
  ],
};
