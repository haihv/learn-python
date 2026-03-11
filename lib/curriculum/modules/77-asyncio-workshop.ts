import type { WorkshopModule } from "../types";

export const asyncioWorkshop: WorkshopModule = {
  type: "workshop",
  id: "77",
  slug: "asyncio-workshop",
  title: "asyncio.gather, create_task, timeouts",
  icon: "⏱️",
  estimatedMinutes: 20,
  description: "Master async patterns for concurrent I/O",
  steps: [
    {
      instruction:
        "Write your first coroutine. Define `async def say_after(delay, message)` that awaits `asyncio.sleep(delay)` then prints `message`. Write `async def main()` that awaits two calls to `say_after` sequentially. Run with `asyncio.run(main())`.",
      hint: "Use `async def` for both functions. Inside `main`, write `await say_after(1, 'Hello')` then `await say_after(2, 'World')`. This runs sequentially — ~3 seconds total.",
      starterCode: `import asyncio

async def say_after(delay, message):
    # await asyncio.sleep, then print message
    pass

async def main():
    # Call say_after twice sequentially
    pass

asyncio.run(main())
`,
      validate: (code: string) =>
        code.includes("async def") &&
        code.includes("await asyncio.sleep") &&
        code.includes("asyncio.run"),
      successMessage:
        "Your first coroutine! Notice it runs sequentially — next step we make it concurrent.",
    },
    {
      instruction:
        "Use `asyncio.gather()` to run the same two `say_after` calls concurrently. Both should start simultaneously and the total time should be ~2 seconds (the longest delay) instead of 3.",
      hint: "Replace the sequential awaits with `await asyncio.gather(say_after(1, 'Hello'), say_after(2, 'World'))`. Use `time.perf_counter()` to measure elapsed time.",
      starterCode: `import asyncio
import time

async def say_after(delay, message):
    await asyncio.sleep(delay)
    print(f"{message} (after {delay}s)")
    return message

async def main():
    start = time.perf_counter()

    # Use asyncio.gather() to run both concurrently
    # Then print the elapsed time and results

    elapsed = time.perf_counter() - start
    print(f"Total time: {elapsed:.2f}s")

asyncio.run(main())
`,
      validate: (code: string) =>
        code.includes("asyncio.gather") &&
        code.includes("say_after"),
      successMessage:
        "gather() runs all coroutines concurrently — total time equals the longest, not the sum!",
    },
    {
      instruction:
        "Use `asyncio.create_task()` to schedule background tasks. Create tasks for three operations, do some 'other work' (print a message and sleep 0.5s), then collect results by awaiting each task.",
      hint: "Use `task1 = asyncio.create_task(say_after(2, 'slow'))` before doing other work. The tasks run in the background while you do other things. Await them afterward with `result = await task1`.",
      starterCode: `import asyncio
import time

async def fetch_data(name, delay):
    await asyncio.sleep(delay)
    return f"data from {name}"

async def main():
    start = time.perf_counter()

    # Create three tasks using asyncio.create_task()
    # task1: fetch_data("api1", 2)
    # task2: fetch_data("api2", 1)
    # task3: fetch_data("api3", 1.5)

    # Simulate doing other work while tasks run
    print("Doing other work while tasks run...")
    await asyncio.sleep(0.5)
    print("Other work done, now collecting results...")

    # Await each task and print results

    elapsed = time.perf_counter() - start
    print(f"Total time: {elapsed:.2f}s")  # Should be ~2s

asyncio.run(main())
`,
      validate: (code: string) =>
        code.includes("create_task") &&
        code.includes("await task"),
      successMessage:
        "create_task() lets you fire off work and do other things — the tasks run concurrently in the background!",
    },
    {
      instruction:
        "Use `asyncio.wait_for()` to add a timeout to a slow operation. Wrap a coroutine that takes 5 seconds in `wait_for()` with a 2-second timeout, and handle the `asyncio.TimeoutError`.",
      hint: "Use `try/except asyncio.TimeoutError:` around `await asyncio.wait_for(slow_coroutine(), timeout=2.0)`.",
      starterCode: `import asyncio

async def slow_download(url):
    print(f"Starting download: {url}")
    await asyncio.sleep(5)  # Simulates a very slow server
    return f"content of {url}"

async def main():
    urls = [
        "https://fast.example.com",
        "https://slow.example.com",
        "https://medium.example.com",
    ]

    for url in urls:
        try:
            # Wrap slow_download with asyncio.wait_for, timeout=2.0
            # Print the result if successful
            pass
        except asyncio.TimeoutError:
            print(f"Timeout! {url} took too long")

asyncio.run(main())
`,
      validate: (code: string) =>
        code.includes("wait_for") &&
        code.includes("TimeoutError") &&
        code.includes("timeout"),
      successMessage:
        "wait_for() is essential for resilient async code — never let a slow server hang your program forever!",
    },
    {
      instruction:
        "Build a producer/consumer pattern using `asyncio.Queue`. Write a `producer` that puts 5 items into a queue with delays, and a `consumer` that processes items as they arrive. Use `asyncio.gather()` to run both concurrently.",
      hint: "Create `queue = asyncio.Queue()`. Producer: `await queue.put(item)`. Consumer: loop with `item = await queue.get()`. Use a sentinel value like `None` to signal the consumer to stop.",
      starterCode: `import asyncio
import time

async def producer(queue):
    items = ["task1", "task2", "task3", "task4", "task5"]
    for item in items:
        await asyncio.sleep(0.3)   # Simulate work to produce each item
        await queue.put(item)
        print(f"Produced: {item}")
    # Signal consumer that we're done
    await queue.put(None)

async def consumer(queue):
    while True:
        item = await queue.get()
        # Stop when we receive the sentinel None
        # Otherwise: simulate processing (sleep 0.1s) and print "Consumed: {item}"
        pass

async def main():
    queue = asyncio.Queue(maxsize=2)  # Buffer at most 2 items
    start = time.perf_counter()

    # Use asyncio.gather to run producer and consumer concurrently

    elapsed = time.perf_counter() - start
    print(f"Done in {elapsed:.2f}s")

asyncio.run(main())
`,
      validate: (code: string) =>
        code.includes("asyncio.Queue") &&
        code.includes("queue.put") &&
        code.includes("queue.get") &&
        code.includes("asyncio.gather"),
      successMessage:
        "The producer/consumer pattern with asyncio.Queue is the backbone of async pipelines and stream processing!",
    },
  ],
};
