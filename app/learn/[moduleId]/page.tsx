import { notFound } from "next/navigation";
import { getModuleBySlug } from "@/lib/curriculum";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModuleBySlug(moduleId);
  if (!mod) return {};
  return { title: `${mod.title} — Learn Python` };
}

// Content is rendered in learn/layout.tsx so navigation is instant (no server
// round-trip between modules). This page only validates the slug for 404s.
export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModuleBySlug(moduleId);
  if (!mod) notFound();
  return null;
}
