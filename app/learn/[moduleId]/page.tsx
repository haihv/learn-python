import { notFound } from "next/navigation";
import { getModuleBySlug } from "@/lib/curriculum";
import { absoluteUrl, moduleDescription, siteConfig } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModuleBySlug(moduleId);
  if (!mod) return {};
  const description = moduleDescription(mod);
  const url = absoluteUrl(`/learn/${mod.slug}`);
  return {
    title: mod.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${mod.title} — ${siteConfig.shortName}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${mod.title} — ${siteConfig.shortName}`,
      description,
    },
  };
}

// Content is rendered in learn/layout.tsx so navigation is instant (no server
// round-trip between modules). This page validates the slug for 404s and emits
// structured data for the module.
export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModuleBySlug(moduleId);
  if (!mod) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: mod.title,
    description: moduleDescription(mod),
    url: absoluteUrl(`/learn/${mod.slug}`),
    learningResourceType: mod.type,
    educationalLevel: "beginner",
    timeRequired: `PT${mod.estimatedMinutes}M`,
    inLanguage: "en",
    isPartOf: {
      "@type": "Course",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
