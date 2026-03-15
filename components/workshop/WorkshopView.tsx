"use client";
import dynamic from "next/dynamic";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useCourseStore } from "@/store/course";
import { runPythonCode } from "@/lib/python-runner";
import type { RunResult } from "@/lib/python-runner";
import StepProgress from "@/components/workshop/StepProgress";
import StepInstruction from "@/components/workshop/StepInstruction";
import OutputPanel from "@/components/editor/OutputPanel";
import CelebrationOverlay from "@/components/ui/Celebration";
import { useShortcutKey } from "@/hooks/useShortcutKey";
import type { WorkshopModule } from "@/lib/curriculum/types";

const PythonEditor = dynamic(() => import("@/components/editor/PythonEditor"), { ssr: false });
const CodeBlock = dynamic(() => import("@/components/lesson/CodeBlock"), { ssr: false });

type Props = {
  module: WorkshopModule;
  onComplete: () => void;
};

type Feedback = {
  ok: boolean;
  message: string;
};

export default function WorkshopView({ module, onComplete }: Props) {
  const setWorkshopStep = useCourseStore((state) => state.setWorkshopStep);
  const saveStepSolution = useCourseStore((state) => state.saveStepSolution);
  const markComplete = useCourseStore((state) => state.markComplete);
  // initialStep starts at 0 (store default) and updates to the persisted value
  // after Zustand's async localStorage hydration.
  const initialStep = useCourseStore((state) => state.workshopSteps[module.slug] ?? 0);
  // ?? {} outside the selector to avoid a new object reference every render.
  const savedSolutions = useCourseStore((state) => state.workshopSolutions[module.slug]) ?? {};

  // steps.length is the "all done" sentinel stored when the last step passes.
  const isAllDone = initialStep >= module.steps.length;
  const resolvedStep = isAllDone
    ? module.steps.length - 1
    : Math.min(initialStep, module.steps.length - 1);

  // Derived from the store — always correct after Zustand hydrates, with no
  // useState that could be stale from the pre-hydration render.
  const completedSteps = useMemo(() => {
    if (isAllDone) return Array.from({ length: module.steps.length }, (_, i) => i);
    return Array.from({ length: initialStep }, (_, i) => i);
  }, [initialStep, isAllDone, module.steps.length]);

  const [currentStep, setCurrentStep] = useState(resolvedStep);
  const [code, setCode] = useState(
    savedSolutions[resolvedStep] ?? module.steps[resolvedStep].starterCode
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [runCount, setRunCount] = useState(0);
  const [readyToAdvance, setReadyToAdvance] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { mod } = useShortcutKey();

  // Sync currentStep and code whenever initialStep changes. This handles
  // both Zustand's async hydration (0 → stored value) and step advances.
  useEffect(() => {
    setCurrentStep(resolvedStep);
    setCode(savedSolutions[resolvedStep] ?? module.steps[resolvedStep].starterCode);
    setFeedback(null);
    setReadyToAdvance(false);
    setRunResult(null);
  // resolvedStep is the only dep we need; other values are read from the
  // current render's closure when the effect fires.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedStep]);

  // Exit fullscreen on Escape
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  const handleCheck = useCallback(async () => {
    if (isChecking) return;
    setIsChecking(true);
    setFeedback(null);
    setReadyToAdvance(false);

    const result = await runPythonCode(code);
    setRunResult(result);
    setRunCount((c) => c + 1);

    if (result.stderr || result.error) {
      setFeedback({ ok: false, message: "Fix the errors above and try again." });
      setIsChecking(false);
      return;
    }

    const step = module.steps[currentStep];
    const passed = step.validate(code);
    setIsChecking(false);

    if (passed) {
      saveStepSolution(module.slug, currentStep, code);
      setFeedback({ ok: true, message: step.successMessage });
      const alreadyDone = completedSteps.includes(currentStep);
      if (!alreadyDone) {
        setReadyToAdvance(true);
        if (currentStep === module.steps.length - 1) {
          // Persist immediately — steps.length sentinel + markComplete so the
          // sidebar ticks even if the user navigates away before "Finish".
          setWorkshopStep(module.slug, module.steps.length);
          markComplete(module.slug);
        }
      }
    } else {
      setFeedback({ ok: false, message: "Not quite — check your code and try again." });
    }
  }, [isChecking, code, currentStep, module, completedSteps, saveStepSolution, setWorkshopStep, markComplete]);

  function handleAdvance() {
    const isLast = currentStep === module.steps.length - 1;
    if (isLast) {
      setShowCelebration(true);
      setTimeout(() => { onComplete(); }, 1000);
    } else {
      const nextStep = currentStep + 1;
      setWorkshopStep(module.slug, nextStep); // triggers completedSteps update via useMemo
      setCurrentStep(nextStep);
      setCode(savedSolutions[nextStep] ?? module.steps[nextStep].starterCode);
      setFeedback(null);
      setHintVisible(false);
      setRunResult(null);
      setReadyToAdvance(false);
    }
  }

  function handleStepClick(step: number) {
    setCurrentStep(step);
    setCode(savedSolutions[step] ?? module.steps[step].starterCode);
    setFeedback(null);
    setHintVisible(false);
    setRunResult(null);
    setReadyToAdvance(false);
  }

  const isLastStep = currentStep === module.steps.length - 1;

  const actionBar = (
    <div className="flex items-center gap-4">
      {readyToAdvance ? (
        <>
          <button
            className="bg-python-blue text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
            onClick={handleAdvance}
          >
            {isLastStep ? "Finish →" : "Next →"}
          </button>
          <span className="text-navy-500 text-xs">{mod}+Enter</span>
        </>
      ) : (
        <>
          <button
            className="bg-python-blue text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
            onClick={handleCheck}
            disabled={isChecking}
          >
            {isChecking ? "Running…" : "▶ Run & Check"}
          </button>
          <span className="text-navy-500 text-xs">{mod}+Enter to run</span>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col">
          <div className="h-12 border-b border-navy-600 flex items-center px-4 justify-between shrink-0">
            <span className="text-slate-400 text-sm font-mono">
              Step {currentStep + 1} / {module.steps.length} — {module.title}
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="text-slate-400 hover:text-slate-200 bg-navy-800 hover:bg-navy-700 rounded px-3 py-1 text-sm cursor-pointer"
            >
              ✕ Exit Fullscreen
            </button>
          </div>
          <div className="flex-1 min-h-0 p-4 flex flex-col gap-4">
            <PythonEditor
              value={code}
              onChange={setCode}
              onCmdEnter={readyToAdvance ? handleAdvance : handleCheck}
              height="calc(100vh - 250px)"
            />
            {actionBar}
            {runResult && (
              <div className="max-h-[28vh] overflow-y-auto">
                <OutputPanel
                  key={runCount}
                  stdout={runResult.stdout}
                  stderr={runResult.stderr}
                  error={runResult.error}
                  defaultTab={runResult.stderr || runResult.error ? "errors" : "output"}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Normal view */}
      <div className="flex flex-col gap-6">
        <StepProgress
          steps={module.steps.length}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        <StepInstruction
          step={module.steps[currentStep]}
          stepNumber={currentStep + 1}
        />

        <PythonEditor
          value={code}
          onChange={setCode}
          onCmdEnter={readyToAdvance ? handleAdvance : handleCheck}
          onFullscreen={() => setIsFullscreen(true)}
        />

        {actionBar}

        {feedback && (
          <div
            className={
              feedback.ok
                ? "bg-python-green/20 border border-python-green text-python-green rounded-lg px-4 py-3"
                : "bg-python-red/20 border border-python-red text-python-red rounded-lg px-4 py-3"
            }
          >
            {feedback.message}
          </div>
        )}

        {runResult && (
          <OutputPanel
            key={runCount}
            stdout={runResult.stdout}
            stderr={runResult.stderr}
            error={runResult.error}
            defaultTab={runResult.stderr || runResult.error ? "errors" : "output"}
          />
        )}

        <div className="border-t border-navy-700 pt-4">
          <button
            className="text-python-yellow text-sm underline cursor-pointer"
            onClick={() => setHintVisible((v) => !v)}
          >
            {hintVisible ? "Hide Hint" : "💡 Show Hint"}
          </button>
          {hintVisible && (
            <div className="mt-3">
              <CodeBlock code={module.steps[currentStep].hint} />
            </div>
          )}
        </div>

        {showCelebration && <CelebrationOverlay />}
      </div>
    </>
  );
}
