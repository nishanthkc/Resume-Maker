interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                ${isActive
                  ? 'bg-accent text-background'
                  : isCompleted
                  ? 'bg-success text-background'
                  : 'bg-background-secondary text-foreground-muted border border-border'
                }
              `}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`
                  h-0.5 w-12 mx-2 transition-colors
                  ${isCompleted ? 'bg-success' : 'bg-border'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

