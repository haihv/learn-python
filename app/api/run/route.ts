import { NextRequest, NextResponse } from "next/server";
import type { RunResult } from "@/lib/python-runner";

// Sliding window rate limiter: max 10 requests per IP per 60 seconds.
// In-memory only — resets on server restart, not suitable for multi-instance deploys.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const ipTimestamps = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipTimestamps.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );
  if (timestamps.length >= MAX_REQUESTS) return true;
  timestamps.push(now);
  ipTimestamps.set(ip, timestamps);
  return false;
}

type PistonResponse = {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
  };
};

const MAX_CODE_BYTES = 65_536; // 64 KB
// IPv4 / IPv6 sanity check — rejects obviously spoofed/blank values
const IP_RE = /^[\d.a-fA-F:]+$/;

export async function POST(req: NextRequest): Promise<NextResponse<RunResult>> {
  // Prefer the rightmost entry added by a trusted proxy; fall back to x-real-ip
  const forwarded = req.headers.get("x-forwarded-for");
  const rawIp =
    (forwarded ? forwarded.split(",").at(-1)!.trim() : null) ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ip = IP_RE.test(rawIp) ? rawIp : "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { stdout: "", stderr: "", error: "Rate limit exceeded — wait a minute and try again.", timedOut: false },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { stdout: "", stderr: "", error: "Invalid request body.", timedOut: false },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).code !== "string"
  ) {
    return NextResponse.json(
      { stdout: "", stderr: "", error: "Missing or invalid `code` field.", timedOut: false },
      { status: 400 }
    );
  }

  const { code } = body as { code: string };

  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    return NextResponse.json(
      { stdout: "", stderr: "", error: "Code exceeds the 64 KB size limit.", timedOut: false },
      { status: 413 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [{ content: code }],
      }),
      signal: controller.signal,
    });

    const text = await res.text();
    let data: PistonResponse;
    try {
      data = JSON.parse(text) as PistonResponse;
    } catch {
      return NextResponse.json({
        stdout: "",
        stderr: "",
        error: "Piston API is unavailable — please try again in a moment.",
        timedOut: false,
      });
    }

    const stdout = data.run?.stdout ?? "";
    // Combine compile stderr (if any) with runtime stderr
    const stderr = [data.compile?.stderr, data.run?.stderr].filter(Boolean).join("\n");

    return NextResponse.json({ stdout, stderr, error: null, timedOut: false });
  } catch (err) {
    const timedOut = (err as Error).name === "AbortError";
    return NextResponse.json(
      {
        stdout: "",
        stderr: "",
        error: timedOut ? "Execution timed out (10 s)" : (err instanceof Error ? err.message : String(err)),
        timedOut,
      },
      { status: timedOut ? 504 : 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
