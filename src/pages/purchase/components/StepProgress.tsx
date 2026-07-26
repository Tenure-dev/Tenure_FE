import { cn } from '@/shared/lib/cn';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const StepProgress = ({ currentStep, totalSteps = 4 }: StepProgressProps) => (
  <div className="flex gap-1.5 px-4 py-3">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={cn(
          'h-[3px] flex-1 rounded-full',
          i + 1 === currentStep ? 'bg-text-primary' : 'bg-bg-secondary',
        )}
      />
    ))}
  </div>
);

export default StepProgress;
