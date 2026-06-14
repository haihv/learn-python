import type { CourseModule } from "./curriculum/types";

// Single source of truth for site-wide SEO values.
export const siteConfig = {
  name: "Learn Python Interactively",
  shortName: "Learn Python",
  url: "https://learn-python.haihv.dev",
  description:
    "A free, open-source interactive Python course: read concise lessons, complete guided workshops, and solve coding labs that run in your browser — no setup required. Plus a T-shaped Atlas of Bloom-laddered deep stems.",
  locale: "en_US",
  keywords: [
    "learn python",
    "python tutorial",
    "interactive python course",
    "python for beginners",
    "python workshops",
    "python coding labs",
    "free python course",
    "python online",
    "learn to code",
    "python exercises",
  ],
} as const;

// Absolute URL for a path, resolved against the canonical site origin.
export function absoluteUrl(path = ""): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

// A concise, plain-text meta description for a curriculum module. Workshops and
// labs carry their own description; lessons derive one from their content.
export function moduleDescription(m: CourseModule): string {
  if (m.type === "lesson") {
    const plain = m.content
      .replace(/```[\s\S]*?```/g, " ") // drop fenced code
      .replace(/[#>*`_~|]/g, " ") // drop markdown punctuation
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → label
      .replace(/\s+/g, " ")
      .trim();
    return truncate(plain, 155);
  }
  return truncate(m.description, 155);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
