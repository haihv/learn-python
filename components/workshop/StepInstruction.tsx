import type { WorkshopStep } from "@/lib/curriculum/types";

type Props = {
  step: WorkshopStep;
  stepNumber: number;
};

export default function StepInstruction({ step, stepNumber }: Props) {
  return (
    <div>
      <p className="text-python-cyan text-xs uppercase tracking-widest mb-2">Step {stepNumber}</p>
      <div className="border-l-4 border-python-cyan bg-navy-800 p-4 rounded-r-lg">
        <p className="text-stone-700">{step.instruction}</p>
      </div>
    </div>
  );
}
