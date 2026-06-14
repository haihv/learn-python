"use client";
import type { TestResult } from "@/lib/test-runner";

type Props = { results: TestResult[] };

export default function TestResults({ results }: Props) {
  if (results.length === 0) return null;

  const allPassed = results.every((r) => r.passed);

  if (allPassed) {
    return (
      <div className="mt-4 p-4 bg-python-green/20 border border-python-green rounded-lg text-python-green font-bold text-center">
        ✅ All tests passed!
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-2">
      {results.map((result, index) =>
        result.passed ? (
          <li
            key={index}
            className="flex items-start gap-2 p-3 bg-python-green/10 border border-python-green/30 rounded-lg"
          >
            <span className="text-python-green mt-0.5">✅</span>
            <span className="text-stone-700">{result.name}</span>
          </li>
        ) : (
          <li
            key={index}
            className="flex items-start gap-2 p-3 bg-python-red/10 border border-python-red/30 rounded-lg"
          >
            <span className="text-python-red mt-0.5">❌</span>
            <div>
              <p className="text-stone-700">{result.name}</p>
              {result.message && (
                <p className="text-python-red text-sm mt-1">{result.message}</p>
              )}
            </div>
          </li>
        )
      )}
    </ul>
  );
}
