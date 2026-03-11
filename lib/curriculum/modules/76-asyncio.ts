import type { LessonModule } from "../types";

export const asyncio: LessonModule = {
  type: "lesson",
  id: "76",
  slug: "asyncio",
  title: "async/await, event loop, coroutines, tasks",
  icon: "⚡",
  estimatedMinutes: 15,
  content: `# asyncio: Asynchronous I/O in Python

Python's \`asyncio\` library provides a foundation for writing concurrent code using the \`async\`/\`await\` syntax. Unlike threading, asyncio uses a single thread and a cooperative event loop — making it ideal for I/O-bound workloads with many concurrent operations.

## Why asyncio?

Threads have overhead: each thread consumes memory (~8MB stack), and context switching between them is expensive. With asyncio you can handle thousands of concurrent I/O operations in a single thread. The trade-off: you must explicitly yield control at every \`await\` point.

## async def and await

Define a **coroutine** using \`async def\`. Use \`await\` to pause execution until an awaitable completes, yielding control back to the event loop in the meantime:

\`\`\`python
import asyncio

async def greet(name, delay):
    print(f"Hello, {name}!")
    await asyncio.sleep(delay)    # Pause here, let other coroutines run
    print(f"Goodbye, {name}!")

# Calling greet() returns a coroutine object — it doesn't run yet
coro = greet("Alice", 1)
print(type(coro))  # <class 'coroutine'>

# Run it with asyncio.run()
asyncio.run(greet("Alice", 1))
\`\`\`

\`asyncio.sleep()\` is the async equivalent of \`time.sleep()\`. It suspends the coroutine without blocking the thread, allowing the event loop to run other coroutines.

## asyncio.run() — The Entry Point

\`asyncio.run()\` creates an event loop, runs a coroutine to completion, then closes the loop. Use it as your program's entry point:

\`\`\`python
import asyncio

async def main():
    print("Starting...")
    await asyncio.sleep(1)
    print("Done!")

asyncio.run(main())   # Always use this — don't manually create event loops
\`\`\`

## Coroutines vs Threads

| Aspect | Threads | asyncio Coroutines |
|--------|---------|-------------------|
| Concurrency model | Preemptive (OS switches) | Cooperative (you yield with await) |
| Memory per unit | ~8MB | ~1KB |
| Max concurrent | ~1,000s | ~100,000s |
| Blocking code | OK (other threads run) | Breaks everything (blocks event loop) |
| GIL | Limited CPU parallelism | N/A — single-threaded |
| Best for | I/O with blocking libs | I/O with async libs |

**Critical rule**: Never call blocking functions (like \`time.sleep()\`, \`requests.get()\`, file I/O with normal open()) inside async code. They block the event loop, preventing all other coroutines from running. Use async equivalents: \`asyncio.sleep()\`, \`aiohttp\`, \`aiofiles\`.

## asyncio.gather() — Run Coroutines Concurrently

\`gather()\` runs multiple coroutines concurrently and returns all results when they all complete:

\`\`\`python
import asyncio
import time

async def fetch(url, delay):
    print(f"Fetching {url}...")
    await asyncio.sleep(delay)     # Simulate network latency
    print(f"Got {url}")
    return f"data from {url}"

async def main():
    start = time.perf_counter()

    # Sequential: takes 1+2+3 = 6 seconds
    # result1 = await fetch("url1", 1)
    # result2 = await fetch("url2", 2)
    # result3 = await fetch("url3", 3)

    # Concurrent with gather: takes max(1,2,3) = 3 seconds
    results = await asyncio.gather(
        fetch("url1", 1),
        fetch("url2", 2),
        fetch("url3", 3),
    )

    elapsed = time.perf_counter() - start
    print(f"Results: {results}")
    print(f"Time: {elapsed:.2f}s")   # ~3.0s, not 6.0s

asyncio.run(main())
\`\`\`

## asyncio.create_task() — Background Tasks

\`create_task()\` schedules a coroutine to run concurrently without awaiting it immediately. This lets you fire off work and do other things:

\`\`\`python
import asyncio

async def background_job(name, delay):
    await asyncio.sleep(delay)
    print(f"Job {name} complete")
    return name

async def main():
    # Schedule tasks — they start running immediately
    task1 = asyncio.create_task(background_job("alpha", 2))
    task2 = asyncio.create_task(background_job("beta", 1))

    print("Tasks created, doing other work...")
    await asyncio.sleep(0)    # Yield control so tasks can start

    print("Waiting for tasks...")
    result1 = await task1     # Wait for task1 specifically
    result2 = await task2
    print(f"Got: {result1}, {result2}")

asyncio.run(main())
\`\`\`

The difference from \`gather()\`: tasks created with \`create_task()\` run independently even if you don't immediately await them. \`gather()\` is cleaner when you want all results together.

## The Event Loop

The **event loop** is the heart of asyncio. It manages a queue of coroutines and callbacks, running them one at a time, switching between them at every \`await\`:

\`\`\`python
import asyncio

async def task(name, n):
    for i in range(n):
        print(f"{name}: step {i}")
        await asyncio.sleep(0)    # Yield to event loop between steps

async def main():
    await asyncio.gather(
        task("A", 3),
        task("B", 3),
    )

asyncio.run(main())
# A: step 0
# B: step 0
# A: step 1
# B: step 1
# A: step 2
# B: step 2
\`\`\`

\`await asyncio.sleep(0)\` yields control without actually sleeping — useful to let other coroutines make progress in a tight loop.

## asyncio.Queue — Producer/Consumer Pattern

\`asyncio.Queue\` is a thread-safe (event-loop-safe) queue for passing data between coroutines:

\`\`\`python
import asyncio

async def producer(queue, items):
    for item in items:
        await asyncio.sleep(0.5)       # Simulate work
        await queue.put(item)
        print(f"Produced: {item}")
    await queue.put(None)              # Sentinel to signal completion

async def consumer(queue):
    while True:
        item = await queue.get()       # Wait for item
        if item is None:
            break
        print(f"Consumed: {item}")
        queue.task_done()

async def main():
    queue = asyncio.Queue(maxsize=3)   # Buffer at most 3 items
    await asyncio.gather(
        producer(queue, ["apple", "banana", "cherry", "date"]),
        consumer(queue),
    )

asyncio.run(main())
\`\`\`

## When to Use asyncio

**Use asyncio when:**
- Making many concurrent HTTP requests (with \`aiohttp\`)
- Building network servers/clients
- Interacting with async databases (asyncpg, motor)
- High-concurrency I/O where threads would be too heavy

**Stick with threads when:**
- Using libraries that don't have async equivalents
- Running simple scripts with moderate concurrency

**Use multiprocessing when:**
- CPU-bound parallel computation

## asyncio.wait_for() — Timeouts

\`\`\`python
import asyncio

async def slow_operation():
    await asyncio.sleep(10)
    return "done"

async def main():
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=2.0)
    except asyncio.TimeoutError:
        print("Operation timed out after 2 seconds")

asyncio.run(main())
\`\`\`

\`wait_for()\` cancels the coroutine automatically when the timeout expires.
`,
  quiz: [
    {
      question: "What happens when you call an `async def` function without `await`?",
      options: [
        "The function runs immediately and blocks the event loop",
        "A coroutine object is returned but the function body does not execute",
        "Python raises a SyntaxError",
        "The function runs in a background thread",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the correct way to run multiple coroutines concurrently in asyncio?",
      options: [
        "Call each coroutine with await sequentially — they run in parallel automatically",
        "Use asyncio.gather() or asyncio.create_task() to schedule them concurrently",
        "Use threading.Thread to wrap each coroutine",
        "asyncio does not support concurrency — it only supports sequential execution",
      ],
      correctIndex: 1,
    },
    {
      question: "Why should you never call `time.sleep()` inside an async function?",
      options: [
        "It raises an asyncio.InvalidStateError",
        "It blocks the entire event loop thread, preventing all other coroutines from running",
        "It is deprecated in Python 3.10+",
        "It conflicts with the GIL",
      ],
      correctIndex: 1,
    },
  ],
};
