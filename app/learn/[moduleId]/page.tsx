import { notFound } from "next/navigation";
import { curriculum, getModuleBySlug } from "@/lib/curriculum";
import { absoluteUrl, moduleDescription, siteConfig } from "@/lib/seo";
import type { Metadata } from "next";

// Prerender every module at build time. The modules are fully known up front,
// so these pages are static HTML (like the stems) rather than a per-request
// serverless function — faster, cacheable, and no runtime function to fail.
export function generateStaticParams() {
  return curriculum.map((m) => ({ moduleId: m.slug }));
}

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

// Content is rendered in learn/layout.tsx (which owns the sidebar + instant
// client navigation) and the per-module JSON-LD is emitted from ModuleView.
// This page only validates the slug for 404s.
export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  if (!getModuleBySlug(moduleId)) notFound();
  return null;
}
