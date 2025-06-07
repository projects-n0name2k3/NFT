import { StepProps } from "@/common/type";
import { ChevronRight } from "lucide-react";

interface StepSectionProps {
  steps: StepProps[];
  currentStepIndex: number;
}

const StepSection = ({ steps, currentStepIndex }: StepSectionProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* On mobile, only show current step */}
      <div className="block md:hidden text-primary font-semibold">
        <span>{steps[currentStepIndex]?.label}</span>
        <span className="text-gray-400 text-sm ml-2">
          {currentStepIndex + 1}/{steps.length}
        </span>
      </div>

      {/* On desktop, show all steps */}
      <div className="hidden md:flex items-center gap-3">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={`flex items-center gap-2 ${
              index === currentStepIndex
                ? "text-primary font-semibold"
                : "text-gray-500"
            }`}
          >
            {index > 0 && <ChevronRight size={18} />}
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSection;
