interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextLabel?: string;
}

export default function StepNavigation({
  onPrevious,
  onNext,
  isFirstStep = false,
  isLastStep = false,
  nextLabel,
}: StepNavigationProps) {
  const defaultNextLabel = isLastStep ? 'Complete' : 'Next';

  return (
    <div className="flex justify-between gap-4 pt-4">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="px-6 py-2.5 rounded-full font-semibold text-sm bg-accent text-background hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        className="px-6 py-2.5 rounded-full font-semibold text-sm bg-accent text-background hover:bg-accent-hover transition-colors"
      >
        {nextLabel || defaultNextLabel}
      </button>
    </div>
  );
}

