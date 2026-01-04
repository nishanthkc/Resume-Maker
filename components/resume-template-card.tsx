'use client';

import type { ResumeTemplate } from '@/types/resume-form';

interface ResumeTemplateCardProps {
  template: ResumeTemplate;
  selected: boolean;
  onSelect: (template: ResumeTemplate | null) => void;
  hasError?: boolean;
}

/**
 * Maps template type to display title
 */
const getTemplateTitle = (template: ResumeTemplate): string => {
  const titles: Record<ResumeTemplate, string> = {
    'modern': 'Modern Resume Template',
    'classic': 'Classic Resume Template',
    'old-school': 'Old-School Template',
    'your-format': 'Your Format Resume',
  };
  return titles[template];
};

/**
 * Gets the preview image source for a template
 * For now, using placeholder images. Can be replaced with actual template images later.
 */
const getTemplateImageSrc = (template: ResumeTemplate): string => {
  // Placeholder images - can be replaced with actual template preview images
  // For now, using a generic placeholder pattern
  const images: Record<ResumeTemplate, string> = {
    'modern': '/api/placeholder/400/300', // Replace with actual image path
    'classic': '/api/placeholder/400/300', // Replace with actual image path
    'old-school': '/api/placeholder/400/300', // Replace with actual image path
    'your-format': '/api/placeholder/400/300', // Replace with actual image path
  };
  return images[template];
};

export default function ResumeTemplateCard({
  template,
  selected,
  onSelect,
  hasError = false,
}: ResumeTemplateCardProps) {
  const title = getTemplateTitle(template);
  const imageSrc = getTemplateImageSrc(template);

  const handleClick = () => {
    if (selected) {
      onSelect(null); // Deselect
    } else {
      onSelect(template); // Select
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={`
          w-full border-2 rounded-lg overflow-hidden
          bg-background-secondary
          transition-colors cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background
          ${selected
            ? 'border-accent bg-background-secondary'
            : hasError
            ? 'border-error'
            : 'border-border hover:border-border-light'
          }
        `}
        aria-pressed={selected}
        aria-label={`Select ${title}`}
      >
        {/* Preview Image Area */}
        <div className="w-full pb-[133.33%] relative bg-background overflow-hidden">
          {/* Placeholder for template preview image */}
          <div className="absolute inset-0 bg-background-tertiary flex items-center justify-center text-foreground-muted">
            <span className="text-sm">{title}</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="p-4 text-center">
          <h3 className="text-base font-semibold text-foreground">
            {title}
          </h3>
        </div>
      </button>

      {/* Selected Indicator */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
          <svg
            className="w-4 h-4 text-background"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

