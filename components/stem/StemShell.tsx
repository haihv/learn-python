"use client";
import { useCallback } from "react";
import Link from "next/link";
import { useCourseStore } from "@/store/course";
import { BLOOM_META, stems, getStemIndex } from "@/lib/stems";
import type { Stem, StemLevel } from "@/lib/stems/types";
import RecallChips from "./levels/RecallChips";
import TapFlow from "./levels/TapFlow";
import ApplyChecklist from "./levels/ApplyChecklist";
import TradeoffAnalyze from "./levels/TradeoffAnalyze";
import SpotTheFlaw from "./levels/SpotTheFlaw";
import SpecBuilder from "./levels/SpecBuilder";

function LevelBody({ level, onEngage }: { level: StemLevel; onEngage: () => void }) {
  switch (level.level) {
    case 1:
      return <RecallChips data={level} onEngage={onEngage} />;
    case 2:
      return <TapFlow data={level} onEngage={onEngage} />;
    case 3:
      return <ApplyChecklist data={level} onEngage={onEngage} />;
    case 4:
      return <TradeoffAnalyze data={level} onEngage={onEngage} />;
    case 5:
      return <SpotTheFlaw data={level} onEngage={onEngage} />;
    case 6:
      return <SpecBuilder data={level} onEngage={onEngage} />;
  }
}

export default function StemShell({ stem }: { stem: Stem }) {
  const reached = useCourseStore((s) => s.stemLevels[stem.slug] ?? 0);
  const reachStemLevel = useCourseStore((s) => s.reachStemLevel);

  const index = getStemIndex(stem.slug);
  const prev = index > 0 ? stems[index - 1] : undefined;
  const next = index < stems.length - 1 ? stems[index + 1] : undefined;

  const engage = useCallback(
    (level: number) => reachStemLevel(stem.slug, level),
    [reachStemLevel, stem.slug]
  );

  return (
    <main className="min-h-screen bg-navy-950">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/atlas" className="text-python-blue text-sm hover:underline">
          ← Atlas
        </Link>

        <header className="mt-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{stem.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">{stem.title}</h1>
              <p className="text-navy-500 text-xs">Deep stem · ~{stem.estimatedMinutes} min</p>
            </div>
          </div>
          <p className="mt-4 text-python-cyan text-sm border-l-2 border-python-cyan pl-3">
            {stem.oneLiner}
          </p>

          {/* Bloom ladder progress */}
          <div className="mt-6 flex items-center gap-1.5">
            {stem.levels.map((l) => {
              const meta = BLOOM_META[l.level];
              const done = reached >= l.level;
              return (
                <div key={l.level} className="flex-1 text-center">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      done ? meta.bar : "bg-navy-700"
                    }`}
                  />
                  <span className="mt-1 block text-[10px] text-navy-500">{meta.name}</span>
                </div>
              );
            })}
          </div>
        </header>

        <div className="flex flex-col gap-10">
          {stem.levels.map((level) => {
            const meta = BLOOM_META[level.level];
            return (
              <section key={level.level}>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`${meta.text} font-mono text-xs font-bold uppercase tracking-wide`}
                  >
                    L{level.level} · {meta.name}
                  </span>
                  <span className="text-navy-500 text-xs">— {meta.verb}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mb-1">{level.title}</h2>
                <p className="text-slate-400 text-sm mb-4">{level.lead}</p>
                <LevelBody level={level} onEngage={() => engage(level.level)} />
              </section>
            );
          })}
        </div>

        {/* Prev/next rails so the course reads as one path */}
        <nav className="mt-12 flex items-center justify-between border-t border-navy-700 pt-6">
          {prev ? (
            <Link
              href={`/stem/${prev.slug}`}
              className="text-slate-300 text-sm hover:text-python-blue"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/stem/${next.slug}`}
              className="text-slate-300 text-sm hover:text-python-blue"
            >
              {next.title} →
            </Link>
          ) : (
            <Link href="/atlas" className="text-python-blue text-sm hover:underline">
              Back to the Atlas →
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
