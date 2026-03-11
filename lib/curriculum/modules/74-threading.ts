import type { LessonModule } from "../types";

export const threading: LessonModule = {
  type: "lesson",
  id: "74",
  slug: "threading",
  title: "Thread, Lock, RLock, race conditions, GIL",
  icon: "🧵",
  estimatedMinutes: 15,
  content: `# Threading in Python

Python's \`threading\` module lets you run multiple tasks concurrently within a single process. Understanding threads — and the Global Interpreter Lock that governs them — is essential for writing responsive I/O-bound programs.

## Creating and Starting Threads

A thread is created by instantiating \`threading.Thread\` with a \`target\` function. Call \`.start()\` to launch it and \`.join()\` to wait for it to finish:

\`\`\`python
import threading
import time

def worker(name, delay):
    print(f"Thread {name} starting")
    time.sleep(delay)
    print(f"Thread {name} done after {delay}s")

# Create two threads
t1 = threading.Thread(target=worker, args=("A", 2))
t2 = threading.Thread(target=worker, args=("B", 1))

t1.start()
t2.start()

# Wait for both to complete
t1.join()
t2.join()
print("All threads finished")
# Output order: A starting, B starting, B done after 1s, A done after 2s
\`\`\`

The key insight: both threads run simultaneously. While thread A sleeps for 2 seconds, thread B completes its 1-second sleep and finishes first.

### Passing Arguments

Use \`args=\` for positional arguments and \`kwargs=\` for keyword arguments:

\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

t = threading.Thread(target=greet, args=("Alice",), kwargs={"greeting": "Hi"})
t.start()
t.join()
\`\`\`

## Daemon Threads

A **daemon thread** runs in the background and is automatically killed when all non-daemon threads (including the main thread) exit. Use them for background tasks like monitoring or cleanup that shouldn't prevent program shutdown:

\`\`\`python
import threading
import time

def heartbeat():
    while True:
        print("♥ still running...")
        time.sleep(1)

# Without daemon=True, this would keep the program running forever
monitor = threading.Thread(target=heartbeat, daemon=True)
monitor.start()

print("Main thread doing work...")
time.sleep(3)
print("Main thread done — daemon thread dies automatically")
\`\`\`

Set \`daemon=True\` before calling \`.start()\`, or use \`thread.daemon = True\`.

## Race Conditions

A **race condition** happens when two threads read and write shared data simultaneously, producing unpredictable results:

\`\`\`python
import threading

counter = 0  # Shared state

def increment():
    global counter
    for _ in range(100_000):
        # This is NOT atomic: it's read, add 1, write — three steps
        counter += 1

t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)
t1.start()
t2.start()
t1.join()
t2.join()

print(counter)  # Expected: 200000
# Actual: something like 143782 — threads clobber each other's writes
\`\`\`

The problem: \`counter += 1\` compiles to three bytecode operations. A thread switch can happen between any two of them, causing one thread to overwrite the other's update.

## threading.Lock — Mutual Exclusion

A \`Lock\` (mutex) ensures only one thread executes a critical section at a time:

\`\`\`python
import threading

counter = 0
lock = threading.Lock()

def safe_increment():
    global counter
    for _ in range(100_000):
        with lock:          # acquire() on entry, release() on exit
            counter += 1    # Only one thread here at a time

t1 = threading.Thread(target=safe_increment)
t2 = threading.Thread(target=safe_increment)
t1.start()
t2.start()
t1.join()
t2.join()

print(counter)  # Always 200000 — correct!
\`\`\`

Always use \`with lock:\` rather than manually calling \`lock.acquire()\` / \`lock.release()\` — the context manager guarantees release even if an exception occurs.

## threading.RLock — Reentrant Locks

A regular \`Lock\` **deadlocks** if the same thread tries to acquire it twice. \`RLock\` (reentrant lock) allows the same thread to acquire it multiple times:

\`\`\`python
import threading

rlock = threading.RLock()

def outer():
    with rlock:
        print("Outer acquired")
        inner()     # Calling inner from outer — both need the lock

def inner():
    with rlock:     # Same thread re-acquires — works with RLock, deadlocks with Lock
        print("Inner acquired")

t = threading.Thread(target=outer)
t.start()
t.join()
# Output: Outer acquired, Inner acquired
\`\`\`

Use \`RLock\` when you have recursive functions or methods that all need the same lock.

## The GIL — Global Interpreter Lock

CPython (the standard Python interpreter) has a **Global Interpreter Lock** — a mutex that allows only one thread to execute Python bytecode at a time, even on multi-core machines.

**What this means in practice:**

- **I/O-bound tasks**: Threads work great. When a thread waits for network/disk I/O, it releases the GIL, letting other threads run. Web scraping, file processing, database queries — threading speeds these up.
- **CPU-bound tasks**: Threads don't help. All threads compete for the single GIL, so you get no parallelism. For CPU-heavy work, use \`multiprocessing\` instead.

\`\`\`python
import threading
import time
import urllib.request

# I/O-bound: threading gives real speedup
urls = ["http://example.com"] * 10

def fetch(url):
    urllib.request.urlopen(url)  # Releases GIL while waiting for network

# Sequential: ~10 seconds
# Threaded: ~1 second (all fetches overlap)
threads = [threading.Thread(target=fetch, args=(url,)) for url in urls]
for t in threads: t.start()
for t in threads: t.join()
\`\`\`

## threading.Event — Signaling Between Threads

\`Event\` is a simple communication primitive: one thread signals an event, others wait for it:

\`\`\`python
import threading
import time

ready = threading.Event()

def producer():
    print("Producer: preparing data...")
    time.sleep(2)
    print("Producer: data ready!")
    ready.set()         # Signal all waiting threads

def consumer(name):
    print(f"Consumer {name}: waiting for data...")
    ready.wait()        # Block until ready.set() is called
    print(f"Consumer {name}: got data, processing!")

prod = threading.Thread(target=producer)
cons1 = threading.Thread(target=consumer, args=("A",))
cons2 = threading.Thread(target=consumer, args=("B",))

cons1.start()
cons2.start()
prod.start()

prod.join()
cons1.join()
cons2.join()
\`\`\`

## threading.Semaphore — Limiting Concurrency

A \`Semaphore\` limits how many threads can access a resource simultaneously. It's like a lock with a counter:

\`\`\`python
import threading
import time

# Allow at most 3 concurrent "database connections"
db_pool = threading.Semaphore(3)

def query_db(thread_id):
    with db_pool:
        print(f"Thread {thread_id}: connected (max 3 at once)")
        time.sleep(1)
        print(f"Thread {thread_id}: done")

threads = [threading.Thread(target=query_db, args=(i,)) for i in range(10)]
for t in threads: t.start()
for t in threads: t.join()
\`\`\`

## Thread-Local Storage

Each thread can have its own copy of a variable using \`threading.local()\`:

\`\`\`python
import threading

local_data = threading.local()

def process(value):
    local_data.result = value * 2      # Each thread has its own .result
    print(f"Thread result: {local_data.result}")

threads = [threading.Thread(target=process, args=(i,)) for i in range(5)]
for t in threads: t.start()
for t in threads: t.join()
\`\`\`

## Quick Reference

| Primitive | Purpose |
|-----------|---------|
| \`Thread(target, args)\` | Create a thread |
| \`.start()\` / \`.join()\` | Launch / wait for thread |
| \`daemon=True\` | Auto-kill on main exit |
| \`Lock\` | Mutual exclusion (one at a time) |
| \`RLock\` | Reentrant mutual exclusion |
| \`Event\` | Signal/wait between threads |
| \`Semaphore(n)\` | Limit n concurrent accesses |
| \`local()\` | Per-thread storage |

The GIL means Python threads are best suited for I/O-bound tasks. For CPU parallelism, reach for \`multiprocessing\` or \`concurrent.futures.ProcessPoolExecutor\`.
`,
  quiz: [
    {
      question: "What is a race condition in multithreaded programming?",
      options: [
        "When one thread runs faster than another",
        "When two threads simultaneously read and write shared data, producing unpredictable results",
        "When a thread acquires a lock it already holds",
        "When the main thread exits before daemon threads finish",
      ],
      correctIndex: 1,
    },
    {
      question: "The Global Interpreter Lock (GIL) means that Python threads are most useful for which type of tasks?",
      options: [
        "CPU-bound tasks like number crunching, because threads run in parallel",
        "I/O-bound tasks like network requests, because threads release the GIL while waiting",
        "All tasks equally, since the GIL has no performance impact",
        "Only single-threaded tasks, because the GIL prevents any concurrency",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the difference between threading.Lock and threading.RLock?",
      options: [
        "Lock is faster; RLock provides better error messages",
        "RLock allows the same thread to acquire it multiple times without deadlocking; Lock does not",
        "Lock works across processes; RLock only works within a single thread",
        "RLock automatically releases after a timeout; Lock blocks forever",
      ],
      correctIndex: 1,
    },
  ],
};
