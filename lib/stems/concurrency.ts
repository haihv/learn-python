import type { Stem } from "./types";

export const concurrencyStem: Stem = {
  id: "S7",
  slug: "stem-concurrency",
  domainId: "concurrency",
  title: "Concurrency",
  icon: "⚡",
  oneLiner: "Match the model to the bottleneck — threads and asyncio for I/O, processes for CPU.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the concurrency vocabulary",
      lead: "The words that stop you reaching for the wrong tool.",
      terms: [
        { term: "GIL", reveal: "The Global Interpreter Lock lets only one thread run Python bytecode at a time, so threads don't speed up CPU work." },
        { term: "concurrency vs parallelism", reveal: "Concurrency is dealing with many tasks (interleaving); parallelism is doing many at once (multiple cores)." },
        { term: "thread", reveal: "A lightweight in-process worker. Great for I/O-bound work (waiting releases the GIL); useless for CPU-bound speedup." },
        { term: "process", reveal: "A separate interpreter with its own memory and GIL. True parallelism for CPU-bound work, at higher overhead." },
        { term: "asyncio", reveal: "Single-threaded cooperative concurrency: one event loop interleaves many awaiting coroutines." },
        { term: "coroutine", reveal: "An `async def` function; awaiting it suspends at I/O so the event loop can run others." },
        { term: "event loop", reveal: "The scheduler that runs coroutines, resuming each when its awaited I/O is ready." },
        { term: "I/O-bound vs CPU-bound", reveal: "I/O-bound waits on network/disk (threads/asyncio help); CPU-bound burns the processor (needs processes)." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "See why asyncio speeds up 100 fetches",
      lead: "Tap each step to see where the time goes — and where it stops going.",
      stages: [
        { label: "sync: requests.get(url) ×100", why: "Each call blocks until its response returns. 100 × 50ms ≈ 5s, almost all of it spent waiting idle." },
        { label: "await session.get(url)", why: "A coroutine hits the network and `await` suspends it, handing control back to the event loop." },
        { label: "await asyncio.gather(*tasks)", why: "The loop launches all 100; while each waits on the network, others make progress. The waiting overlaps." },
        { label: "total ≈ slowest single request", why: "Because the waiting is concurrent, 100 fetches finish in roughly the time of one — not 100×." },
      ],
      takeaway: "asyncio wins when tasks spend their time waiting — it overlaps the waiting, not the computing.",
    },
    {
      level: 3,
      verb: "use",
      title: "Pick the model that fits",
      lead: "A checklist that starts with the only question that matters: what's the bottleneck?",
      checklist: [
        "Classify first: is the bottleneck waiting (I/O) or computing (CPU)? That decides the tool.",
        "I/O-bound with many tasks? asyncio (or a ThreadPoolExecutor) overlaps the waiting.",
        "CPU-bound? multiprocessing / ProcessPoolExecutor for real parallelism — threads won't help (GIL).",
        "Never block the event loop with sync calls (time.sleep, requests) — use async equivalents or run_in_executor.",
        "Protect shared mutable state with a lock; better, avoid sharing — pass messages or use immutable data.",
      ],
      codePeek: `import asyncio, aiohttp

async def fetch(session, url):
    async with session.get(url) as r:
        return await r.text()

async def main(urls):
    async with aiohttp.ClientSession() as s:
        return await asyncio.gather(*(fetch(s, u) for u in urls))`,
    },
    {
      level: 4,
      verb: "compare",
      title: "In-process or multi-process?",
      lead: "Both add concurrency. Slide to see the trade; then settle the toggle.",
      slider: {
        leftLabel: "Threads / asyncio",
        rightLabel: "Processes",
        stops: [
          { at: 0, note: "Threads/asyncio: cheap, share memory, ideal for I/O-bound waiting. But the GIL means no CPU speedup." },
          { at: 50, note: "Both add concurrency. In-process models share memory (easy data, risky races); processes isolate it (safe, but must serialize)." },
          { at: 100, note: "Processes: true multi-core parallelism for CPU-bound work, at the cost of startup time and inter-process data copying." },
        ],
      },
      toggle: {
        question: "You must hash 10,000 files as fast as possible (CPU-bound). Use…",
        optionA: "a thread pool",
        optionB: "a process pool",
        answer: "B",
        why: "Hashing is CPU-bound, and the GIL serializes Python threads on the CPU — threads give almost no speedup. A process pool runs across multiple cores in parallel.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Bust the 'threads = parallel' myth",
      lead: "One claim is the misconception that wastes the most afternoons. Spot it.",
      prompt: "Which statement about Python concurrency is correct?",
      options: [
        {
          text: "Using threads makes CPU-bound Python code run on multiple cores.",
          correct: false,
          reveal: "✗ The classic misconception. The GIL allows only one thread to execute Python bytecode at a time, so CPU-bound code sees little to no speedup. Use processes.",
        },
        {
          text: "asyncio runs coroutines concurrently on one thread by overlapping their waiting.",
          correct: true,
          reveal: "✓ One event loop interleaves coroutines; while one awaits I/O, others run. Great for I/O-bound, not CPU-bound.",
        },
        {
          text: "multiprocessing workers share memory by default.",
          correct: false,
          reveal: "✗ Each process has its own memory; data is pickled/copied across. Sharing needs explicit shared memory or queues.",
        },
        {
          text: "A normal time.sleep(1) inside a coroutine lets other coroutines run.",
          correct: false,
          reveal: "✗ time.sleep blocks the whole event loop. Use `await asyncio.sleep(1)` so others can run.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build concurrency that fits the bottleneck",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "task", label: "Workload", options: ["fetch many URLs", "resize many images", "query many DB rows"] },
        { id: "model", label: "Model", options: ["asyncio", "thread pool", "process pool"] },
        { id: "prove", label: "Proven by", options: ["timing vs sequential", "a CPU utilization check", "a throughput number"] },
      ],
      specTemplate: "A concurrent {task} using {model}, proven by {prove}.",
      buildCard: {
        title: "Concurrency that fits the bottleneck",
        deliverable:
          "A concurrent URL fetcher that uses asyncio (the right model for I/O-bound work) and demonstrates a real speedup over the sequential version with a timing comparison.",
        acceptance: [
          "Correctly classifies the workload as I/O-bound and picks asyncio (or a thread pool).",
          "Uses asyncio.gather (or as_completed) to overlap requests.",
          "No blocking calls (time.sleep / requests) inside coroutines.",
          "Prints a measured speedup versus the sequential baseline.",
        ],
      },
    },
  ],
};
