"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { curriculum } from "@/lib/curriculum";
import Sidebar from "@/components/layout/Sidebar";
import ModuleView from "@/app/learn/[moduleId]/ModuleView";

export default function LearnLayout({ children: _ }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // pathnameSlug: reflects the URL (updates after the server responds)
  // clientSlug: set immediately on sidebar click so content shows instantly
  const pathnameSlug = pathname.split("/").pop() ?? "";
  const [clientSlug, setClientSlug] = useState<string | null>(null);
  const currentSlug = clientSlug ?? pathnameSlug;

  const handleNavigate = (slug: string) => {
    setClientSlug(slug);           // instant re-render with new module
    router.push(`/learn/${slug}`); // URL update happens in background
  };

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      <Sidebar
        modules={curriculum}
        currentSlug={currentSlug}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentSlug && <ModuleView slug={currentSlug} />}
      </main>
    </div>
  );
}
