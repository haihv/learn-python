import { atlas } from "./atlas";
import { objectModelStem } from "./object-model";
import type { Stem } from "./types";

export { atlas } from "./atlas";
export type { Stem, Atlas, AtlasDomain, StemLevel, BloomLevel } from "./types";
export { BLOOM_META } from "./types";

// The deep-stem registry. Author a new stem by adding its data file and
// listing it here, then point the matching Atlas domain at its slug.
export const stems: Stem[] = [objectModelStem];

export function getStemBySlug(slug: string): Stem | undefined {
  return stems.find((s) => s.slug === slug);
}

export function getStemIndex(slug: string): number {
  return stems.findIndex((s) => s.slug === slug);
}

export function getDomainTitle(domainId: string): string | undefined {
  return atlas.domains.find((d) => d.id === domainId)?.title;
}
