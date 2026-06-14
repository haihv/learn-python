import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStemBySlug, stems } from "@/lib/stems";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import StemShell from "@/components/stem/StemShell";

export function generateStaticParams() {
  return stems.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stem = getStemBySlug(slug);
  if (!stem) return {};
  const title = `${stem.title} — Deep Stem`;
  const description = stem.oneLiner;
  const url = absoluteUrl(`/stem/${stem.slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} — ${siteConfig.shortName}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.shortName}`,
      description,
    },
  };
}

export default async function StemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stem = getStemBySlug(slug);
  if (!stem) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: stem.title,
    description: stem.oneLiner,
    url: absoluteUrl(`/stem/${stem.slug}`),
    learningResourceType: "deep stem",
    teaches: stem.levels.map((l) => l.title),
    timeRequired: `PT${stem.estimatedMinutes}M`,
    inLanguage: "en",
    isPartOf: {
      "@type": "Course",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StemShell stem={stem} />
    </>
  );
}
