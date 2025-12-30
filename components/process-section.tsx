interface ProcessStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProcessSectionProps {
  className?: string;
}

export default function ProcessSection({ className = '' }: ProcessSectionProps) {
  const steps: ProcessStep[] = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      title: 'Upload',
      description: 'Upload your current resume in PDF, DOCX, or LaTeX format along with the job description.',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: 'Tailor',
      description: 'Our AI analyzes your resume and the job description to create a perfectly tailored version.',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Export',
      description: 'Download your tailored resume as LaTeX and open it in Overleaf for further customization.',
    },
  ];

  return (
    <section className={`py-20 px-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-sm font-medium text-foreground-muted uppercase tracking-wider mb-4">
            Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground mb-4">
            Your resume, <span className="serif-highlight">effortlessly</span>
          </h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Begin your career journey in three effortless steps.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="text-foreground-muted">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-foreground-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

