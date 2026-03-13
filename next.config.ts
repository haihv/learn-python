import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    // unsafe-inline required for Tailwind CSS and CodeMirror inline styles
    // wasm-unsafe-eval required for Pyodide WebAssembly execution
    // cdn.jsdelivr.net required for loading Pyodide runtime + stdlib
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://cdn.jsdelivr.net",
      "worker-src 'self' blob:",
      "img-src 'self' data:",
      "font-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
