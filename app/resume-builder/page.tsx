'use client';

import { useCallback } from 'react';
import { ResumeFormProvider, useResumeForm } from '@/context/resume-form-context';
import FileUpload from '@/components/file-upload';
import StepIndicator from '@/components/step-indicator';
import StepNavigation from '@/components/step-navigation';
import type { ResumeFileData } from '@/types/resume-form';
import { getFileTypeFromFilename } from '@/utils/file-utils';

function ResumeBuilderContent() {
  const {
    formData,
    updateResumeFile,
    updateJobDescription,
    nextStep,
    prevStep,
    validationErrors,
  } = useResumeForm();

  const handleFileSelect = useCallback((file: File) => {
    const fileType = getFileTypeFromFilename(file.name);
    if (!fileType) {
      return; // Should not happen due to component validation, but handle gracefully
    }

    const fileData: ResumeFileData = {
      type: fileType,
      name: file.name,
      size: file.size,
      extractedText: '', // Will be populated in Tasks 3.2-3.4
    };

    updateResumeFile(fileData);
  }, [updateResumeFile]);

  const handleFileRemove = useCallback(() => {
    updateResumeFile(null);
  }, [updateResumeFile]);

  const handleJobDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateJobDescription(e.target.value);
  }, [updateJobDescription]);

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Step 1: Upload Your Resume
        </h2>
        <p className="text-foreground-muted mb-6">
          Upload your resume file and provide the job description.
        </p>
      </div>

      <div>
        <label
          htmlFor="resume-upload"
          className="block text-sm font-medium text-foreground-secondary mb-2"
        >
          Resume File
        </label>
        <FileUpload
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          selectedFile={formData.resumeFile}
          error={validationErrors.resumeFile}
        />
      </div>

      <div>
        <label
          htmlFor="job-description"
          className="block text-sm font-medium text-foreground-secondary mb-2"
        >
          Job Description
        </label>
        <textarea
          id="job-description"
          value={formData.jobDescription}
          onChange={handleJobDescriptionChange}
          placeholder="Paste the job description here..."
          rows={8}
          className={`w-full px-4 py-3 border rounded-lg bg-background-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y ${
            validationErrors.jobDescription ? 'border-error' : 'border-border'
          }`}
        />
        {validationErrors.jobDescription && (
          <p className="mt-2 text-error text-sm">
            {validationErrors.jobDescription}
          </p>
        )}
      </div>

      <StepNavigation
        onPrevious={prevStep}
        onNext={nextStep}
        isFirstStep={formData.currentStep === 1}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Step 2: Job Role & Template
      </h2>
      <p className="text-foreground-muted mb-6">
        Step 2 content will be implemented in future tasks.
      </p>
      <StepNavigation
        onPrevious={prevStep}
        onNext={nextStep}
        isFirstStep={false}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Step 3: Personalization (Optional)
      </h2>
      <p className="text-foreground-muted mb-6">
        Step 3 content will be implemented in future tasks.
      </p>
      <StepNavigation
        onPrevious={prevStep}
        onNext={nextStep}
        isFirstStep={false}
        isLastStep={true}
      />
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-start py-16 px-8 bg-background">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground mb-2">
            Resume Maker
          </h1>
          <p className="text-lg leading-8 text-foreground-muted mb-8">
            Build your personalized resume in a few simple steps.
          </p>

          <div className="mb-8">
            <StepIndicator currentStep={formData.currentStep} totalSteps={3} />
          </div>

          {formData.currentStep === 1 && renderStep1()}
          {formData.currentStep === 2 && renderStep2()}
          {formData.currentStep === 3 && renderStep3()}
        </div>
      </main>
    </div>
  );
}

export default function ResumeBuilder() {
  return (
    <ResumeFormProvider>
      <ResumeBuilderContent />
    </ResumeFormProvider>
  );
}
