import type { LabModule } from "../types";

export const asyncioLab: LabModule = {
  type: "lab",
  id: "78",
  slug: "asyncio-lab",
  title: "Async Lab: Concurrent Fetcher",
  icon: "🧪",
  estimatedMinutes: 25,
  description: "Build a concurrent URL fetcher using asyncio",
  instructions: `# Async Lab: Concurrent URL Fetcher

In this lab you will build a simulated concurrent URL fetcher using asyncio. Since we can't make real HTTP requests in this environment, you'll use \`asyncio.sleep()\` to simulate network latency.

## Your Task

Implement the following in the code editor:

### 1. \`fetch(url, delay)\` coroutine
- Takes a URL string and a delay (simulated latency in seconds)
- Awaits \`asyncio.sleep(delay)\` to simulate network I/O
- Returns a string in the format: \`"OK: {url} ({delay}s)"\`

### 2. \`fetch_all(urls)\` coroutine
- Takes a list of \`(url, delay)\` tuples
- Uses \`asyncio.gather()\` to fetch all URLs **concurrently**
- Returns the list of results from gather

### 3. \`main()\` coroutine
- Defines a list of at least 4 URLs with different delays (between 0.1 and 1.0 seconds)
- Calls \`fetch_all()\` and stores results
- Prints each result on its own line
- Prints a summary line: \`"Fetched {n} URLs concurrently"\`

### 4. Entry point
- Call \`asyncio.run(main())\` at the bottom

## Requirements
- All functions must use \`async def\`
- Concurrency must be achieved with \`asyncio.gather()\`
- Do NOT use \`threading\` or \`time.sleep()\`
- The total runtime should be close to the maximum individual delay, not the sum

## Example Output
\`\`\`
OK: https://api.example.com/users (0.3s)
OK: https://api.example.com/posts (0.7s)
OK: https://api.example.com/comments (0.2s)
OK: https://api.example.com/todos (0.5s)
Fetched 4 URLs concurrently
\`\`\`
`,
  starterCode: `import asyncio

async def fetch(url, delay):
    """Simulate fetching a URL with the given latency in seconds."""
    # TODO: await asyncio.sleep(delay)
    # TODO: return "OK: {url} ({delay}s)"
    pass

async def fetch_all(urls):
    """Fetch all (url, delay) pairs concurrently using asyncio.gather."""
    # TODO: use asyncio.gather() with a list comprehension or unpacking
    pass

async def main():
    urls = [
        ("https://api.example.com/users",    0.3),
        ("https://api.example.com/posts",    0.7),
        ("https://api.example.com/comments", 0.2),
        ("https://api.example.com/todos",    0.5),
    ]

    # TODO: call fetch_all, print each result, print summary line
    pass

asyncio.run(main())
`,
  solutionCode: `import asyncio

async def fetch(url, delay):
    """Simulate fetching a URL with the given latency in seconds."""
    await asyncio.sleep(delay)
    return f"OK: {url} ({delay}s)"

async def fetch_all(urls):
    """Fetch all (url, delay) pairs concurrently using asyncio.gather."""
    return await asyncio.gather(*(fetch(url, delay) for url, delay in urls))

async def main():
    urls = [
        ("https://api.example.com/users",    0.3),
        ("https://api.example.com/posts",    0.7),
        ("https://api.example.com/comments", 0.2),
        ("https://api.example.com/todos",    0.5),
    ]

    results = await fetch_all(urls)
    for result in results:
        print(result)
    print(f"Fetched {len(results)} URLs concurrently")

asyncio.run(main())
`,
  tests: [
    {
      name: "Uses async def for coroutines",
      description: "fetch and fetch_all must be defined with async def",
      validate: (code: string, _stdout: string) =>
        code.includes("async def fetch(") &&
        code.includes("async def fetch_all("),
    },
    {
      name: "Uses asyncio.sleep for simulated latency",
      description: "fetch() must await asyncio.sleep — not time.sleep",
      validate: (code: string, _stdout: string) =>
        code.includes("asyncio.sleep") && !code.includes("time.sleep"),
    },
    {
      name: "Uses asyncio.gather for concurrency",
      description: "fetch_all() must use asyncio.gather to run fetches concurrently",
      validate: (code: string, _stdout: string) =>
        code.includes("asyncio.gather"),
    },
    {
      name: "Prints results for each URL",
      description: "Output must contain 'OK:' lines for each fetched URL",
      validate: (_code: string, stdout: string) =>
        stdout.includes("OK:") &&
        stdout.split("OK:").length - 1 >= 4,
    },
    {
      name: "Prints summary line",
      description: "Output must contain 'Fetched' and 'concurrently'",
      validate: (_code: string, stdout: string) =>
        stdout.includes("Fetched") && stdout.includes("concurrently"),
    },
  ],
};
