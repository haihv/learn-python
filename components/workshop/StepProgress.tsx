type Props = {
  steps: number;
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
};

export default function StepProgress({ steps, currentStep, completedSteps, onStepClick }: Props) {
  // The next unlocked step is the one the user should be working on.
  // It must also be clickable so the user can navigate back to it after
  // reviewing a previously completed step.
  const maxUnlocked = completedSteps.length;

  return (
    <div className="flex gap-3 items-center">
      {Array.from({ length: steps }, (_, i) => {
        const isCompleted = completedSteps.includes(i);
        const isActive = i === currentStep;
        const isClickable = isCompleted || i === maxUnlocked;

        const circleClass = isCompleted
          ? "w-8 h-8 rounded-full bg-python-green text-white flex items-center justify-center text-sm font-bold"
          : isActive
          ? "w-8 h-8 rounded-full border-2 border-python-blue text-python-blue flex items-center justify-center text-sm font-bold"
          : "w-8 h-8 rounded-full bg-navy-700 text-navy-500 flex items-center justify-center text-sm";

        return (
          <div key={i} className="flex gap-3 items-center flex-1 last:flex-none">
            {isClickable ? (
              <button
                className={`${circleClass} hover:opacity-75 transition-opacity`}
                onClick={() => onStepClick?.(i)}
                title={isCompleted ? `Review step ${i + 1}` : `Go to step ${i + 1}`}
              >
                {isCompleted ? "✓" : i + 1}
              </button>
            ) : (
              <div className={circleClass}>{i + 1}</div>
            )}
            {i < steps - 1 && <div className="flex-1 h-0.5 bg-navy-600" />}
          </div>
        );
      })}
    </div>
  );
}
