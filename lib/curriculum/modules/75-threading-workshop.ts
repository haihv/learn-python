import type { WorkshopModule } from "../types";

export const threadingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "75",
  slug: "threading-workshop",
  title: "Thread Pools with concurrent.futures",
  icon: "🔀",
  estimatedMinutes: 20,
  description: "Use concurrent.futures.ThreadPoolExecutor for parallel I/O",
  steps: [
    {
      instruction:
        "Create a basic thread using `threading.Thread`. Define a function `download(url)` that prints `Downloading {url}...`, sleeps for 1 second, then prints `Done: {url}`. Create two threads targeting this function with different URLs and start/join them.",
      hint: "Use `threading.Thread(target=download, args=(url,))`, then call `.start()` on both before calling `.join()` on both.",
      starterCode: `import threading
import time

def download(url):
    # Print "Downloading {url}...", sleep 1 second, print "Done: {url}"
    pass

# Create two Thread objects, start them, then join them
urls = ["https://api.example.com/users", "https://api.example.com/posts"]
`,
      validate: (code: string) =>
        code.includes("threading.Thread") &&
        code.includes(".start()") &&
        code.includes(".join()") &&
        code.includes("time.sleep"),
      successMessage:
        "Both threads run concurrently — total time ~1s instead of 2s!",
    },
    {
      instruction:
        "Use `ThreadPoolExecutor.map()` to run downloads in parallel. Import `concurrent.futures`, define `download(url)` returning a string like `'Downloaded: {url}'`, then use `ThreadPoolExecutor(max_workers=4)` with `.map()` to fetch all 5 URLs and print each result.",
      hint: "Use `with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:` and call `executor.map(download, urls)`. Iterate over the results from `.map()`.",
      starterCode: `import concurrent.futures
import time

urls = [
    "https://api.example.com/users",
    "https://api.example.com/posts",
    "https://api.example.com/comments",
    "https://api.example.com/todos",
    "https://api.example.com/photos",
]

def download(url):
    time.sleep(0.5)  # Simulate network latency
    return f"Downloaded: {url}"

# Use ThreadPoolExecutor with max_workers=4 and .map() to fetch all URLs
# Print each result
`,
      validate: (code: string) =>
        code.includes("ThreadPoolExecutor") &&
        code.includes(".map(") &&
        code.includes("max_workers"),
      successMessage:
        "executor.map() is the simplest way to parallelize a function over an iterable!",
    },
    {
      instruction:
        "Use `executor.submit()` with `Future` objects for more control. Submit each download as a separate future, collect them in a list, then iterate and call `.result()` on each to get the return value.",
      hint: "Call `future = executor.submit(download, url)` for each URL. Store futures in a list. Then `for future in futures: print(future.result())`.",
      starterCode: `import concurrent.futures
import time

def download(url):
    time.sleep(0.5)
    return f"Downloaded: {url}"

urls = [
    "https://api.example.com/users",
    "https://api.example.com/posts",
    "https://api.example.com/comments",
]

futures = []
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    # Submit each URL as a separate future and collect them
    # Then iterate futures and print each .result()
    pass
`,
      validate: (code: string) =>
        code.includes(".submit(") &&
        code.includes(".result()") &&
        code.includes("futures"),
      successMessage:
        "submit() gives you a Future handle — useful for tracking individual task status!",
    },
    {
      instruction:
        "Use `concurrent.futures.as_completed()` to process results as they finish (not in submission order). Some downloads are fast, some slow — print results in completion order.",
      hint: "Pass your list of futures to `concurrent.futures.as_completed(futures)`. Wrap in a for loop: `for future in as_completed(futures): print(future.result())`.",
      starterCode: `import concurrent.futures
import time
import random

def download(url):
    # Random delay: fast URLs finish before slow ones
    delay = random.uniform(0.1, 1.0)
    time.sleep(delay)
    return f"Done ({delay:.2f}s): {url}"

urls = [
    "https://api.example.com/users",
    "https://api.example.com/posts",
    "https://api.example.com/comments",
    "https://api.example.com/todos",
]

futures = []
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    for url in urls:
        futures.append(executor.submit(download, url))

# Use as_completed to print results as they arrive
`,
      validate: (code: string) =>
        code.includes("as_completed") &&
        code.includes(".result()"),
      successMessage:
        "as_completed() lets you react to results immediately instead of waiting for the slowest task!",
    },
    {
      instruction:
        "Compare `ThreadPoolExecutor` vs `ProcessPoolExecutor`. Define a CPU-heavy function `cpu_task(n)` that returns `sum(i*i for i in range(n))`. Run it with both executors and print the results. Note that ProcessPoolExecutor bypasses the GIL for true parallelism.",
      hint: "Use `concurrent.futures.ProcessPoolExecutor(max_workers=4)` the same way as ThreadPoolExecutor. Wrap in `if __name__ == '__main__':` when using ProcessPoolExecutor on Windows/macOS.",
      starterCode: `import concurrent.futures
import time

def cpu_task(n):
    # CPU-bound: sum of squares
    return sum(i * i for i in range(n))

numbers = [500_000, 600_000, 700_000, 800_000]

# Run with ThreadPoolExecutor
start = time.perf_counter()
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    thread_results = list(executor.map(cpu_task, numbers))
thread_time = time.perf_counter() - start
print(f"ThreadPoolExecutor: {thread_time:.3f}s, results: {thread_results}")

# Run with ProcessPoolExecutor
if __name__ == "__main__":
    # Replace ThreadPoolExecutor with ProcessPoolExecutor below
    pass
`,
      validate: (code: string) =>
        code.includes("ProcessPoolExecutor") &&
        code.includes("ThreadPoolExecutor") &&
        code.includes("cpu_task"),
      successMessage:
        "ProcessPoolExecutor creates separate processes — each with its own GIL — enabling true CPU parallelism!",
    },
  ],
};
