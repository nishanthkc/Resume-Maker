'use client';

import { useCallback, useState } from 'react';
import { ResumeFormProvider, useResumeForm, saveResumeFormState } from '@/context/resume-form-context';
import { useAuth } from '@/context/auth-context';
import FileUpload from '@/components/file-upload';
import StepIndicator from '@/components/step-indicator';
import StepNavigation from '@/components/step-navigation';
import ResumeTemplateCard from '@/components/resume-template-card';
import Button from '@/components/button';
import type { ResumeFileData } from '@/types/resume-form';
import { getFileTypeFromFilename } from '@/utils/file-utils';
import { getAvailableTemplates } from '@/utils/template-utils';
import { extractDocxText, extractPdfText, readLatexFile } from '@/utils/text-extraction';
import { validateStep3 } from '@/utils/validation';

function ResumeBuilderContent() {
  const {
    formData,
    updateResumeFile,
    updateJobDescription,
    updateJobRole,
    updateTemplate,
    updatePersonalizationPrompt,
    nextStep,
    prevStep,
    validationErrors,
  } = useResumeForm();
  const { user, signIn } = useAuth();
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    const fileType = getFileTypeFromFilename(file.name);
    if (!fileType) {
      return; // Should not happen due to component validation, but handle gracefully
    }

    setExtractionError(null);

    let extractedText = '';
    
    // Extract text based on file type
    if (fileType === 'docx') {
      try {
        extractedText = await extractDocxText(file);
        console.log('Extracted DOCX text:', extractedText);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to extract text from DOCX file';
        setExtractionError(errorMessage);
        // Still update context with file metadata, but without extracted text
        // User can see the error and try again
      }
    } else if (fileType === 'pdf') {
      try {
        extractedText = await extractPdfText(file);
        console.log('Extracted PDF text:', extractedText);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to extract text from PDF file';
        setExtractionError(errorMessage);
        // Still update context with file metadata, but without extracted text
        // User can see the error and try again
      }
    } else if (fileType === 'tex') {
      try {
        extractedText = await readLatexFile(file);
        console.log('Read LaTeX file:', extractedText);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to read LaTeX file';
        setExtractionError(errorMessage);
        // Still update context with file metadata, but without extracted text
        // User can see the error and try again
      }
    }

    const fileData: ResumeFileData = {
      type: fileType,
      name: file.name,
      size: file.size,
      extractedText,
    };

    updateResumeFile(fileData);
  }, [updateResumeFile]);

  const handleFileRemove = useCallback(() => {
    setExtractionError(null);
    updateResumeFile(null);
  }, [updateResumeFile]);

  const handleJobDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateJobDescription(e.target.value);
  }, [updateJobDescription]);

  const handleJobRoleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateJobRole(e.target.value);
  }, [updateJobRole]);

  const handlePersonalizationChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePersonalizationPrompt(e.target.value);
  }, [updatePersonalizationPrompt]);

  const handleSignIn = useCallback(async () => {
    try {
      // Save current form state before OAuth redirect
      saveResumeFormState(formData);
      await signIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  }, [formData, signIn]);

  const handleNextStep = useCallback(() => {
    // If on step 3, this is completion
    if (formData.currentStep === 3) {
      // Validate step 3 (optional step, always passes)
      const validationResult = validateStep3(formData, !!user);
      
      if (validationResult.isValid) {
        // Log all resume data
        console.log('Resume Data:', {
          resumeFile: {
            type: formData.resumeFile?.type,
            name: formData.resumeFile?.name,
            size: formData.resumeFile?.size,
            extractedText: formData.resumeFile?.extractedText,
          },
          jobDescription: formData.jobDescription,
          jobRole: formData.jobRole,
          template: formData.template,
          personalizationPrompt: formData.personalizationPrompt,
          user: user ? { id: user.id, email: user.email } : null,
        });
        
        setIsCompleted(true);
      }
    } else {
      nextStep();
    }
  }, [formData, user, nextStep]);

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
          error={validationErrors.resumeFile || extractionError || undefined}
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
        onNext={handleNextStep}
        isFirstStep={formData.currentStep === 1}
      />
    </div>
  );

  const renderStep2 = () => {
    const availableTemplates = getAvailableTemplates(formData.resumeFile?.type || null);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Step 2: Job Role & Template
          </h2>
          <p className="text-foreground-muted mb-6">
            Enter the job role/title and select a template.
          </p>
        </div>

        <div>
          <label
            htmlFor="job-role"
            className="block text-sm font-medium text-foreground-secondary mb-2"
          >
            Job Role / Title
          </label>
          <input
            id="job-role"
            type="text"
            value={formData.jobRole}
            onChange={handleJobRoleChange}
            placeholder="e.g., Software Engineer, Product Manager, etc."
            className={`w-full px-4 py-3 border rounded-lg bg-background-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
              validationErrors.jobRole ? 'border-error' : 'border-border'
            }`}
          />
          {validationErrors.jobRole && (
            <p className="mt-2 text-error text-sm">
              {validationErrors.jobRole}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Choose a Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTemplates.map((template) => (
              <ResumeTemplateCard
                key={template}
                template={template}
                selected={formData.template === template}
                onSelect={updateTemplate}
                hasError={!!validationErrors.template}
              />
            ))}
          </div>
          {validationErrors.template && (
            <p className="mt-2 text-error text-sm">
              {validationErrors.template}
            </p>
          )}
        </div>

        <StepNavigation
          onPrevious={prevStep}
          onNext={handleNextStep}
          isFirstStep={false}
        />
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Step 3: Personalization (Optional)
        </h2>
        <p className="text-foreground-muted mb-6">
          Sign in to add additional instructions on how you'd like your resume tailored.
        </p>
      </div>

      <div>
        <label
          htmlFor="personalization-prompt"
          className="block text-sm font-medium text-foreground-secondary mb-2"
        >
          Personalization Prompt <span className="text-foreground-muted font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <textarea
            id="personalization-prompt"
            value={formData.personalizationPrompt}
            onChange={handlePersonalizationChange}
            disabled={!user}
            placeholder={user 
              ? "e.g., Add a project I did with React, Next.js, and AWS. Emphasize my leadership experience in team projects. Highlight my experience with cloud infrastructure..."
              : ""
            }
            rows={8}
            className={`w-full px-4 py-3 border rounded-lg bg-background-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y border-border ${
              !user 
                ? "opacity-60 cursor-not-allowed" 
                : ""
            }`}
          />
          {!user && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-background-secondary/80 rounded-lg cursor-pointer"
              onClick={handleSignIn}
            >
              <div className="text-center" onClick={(e) => e.stopPropagation()}>
                <p className="text-foreground-muted mb-2">Sign in to unlock</p>
                <Button 
                  onClick={() => handleSignIn()} 
                  variant="primary"
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
        {user && (
          <p className="mt-2 text-foreground-muted text-sm">
            Use this field to provide specific instructions on how you want your resume tailored. For example, you can mention specific projects, skills, or experiences you'd like emphasized or added.
          </p>
        )}
      </div>

      <StepNavigation
        onPrevious={prevStep}
        onNext={handleNextStep}
        isFirstStep={false}
        isLastStep={true}
      />
    </div>
  );

  const renderCompleted = () => (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          COMPLETED Resume
        </h2>
        <p className="text-foreground-muted">
          Your resume data has been logged to the console.
        </p>
      </div>
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
            <StepIndicator currentStep={isCompleted ? 3 : formData.currentStep} totalSteps={3} />
          </div>

          {isCompleted ? renderCompleted() : (
            <>
              {formData.currentStep === 1 && renderStep1()}
              {formData.currentStep === 2 && renderStep2()}
              {formData.currentStep === 3 && renderStep3()}
            </>
          )}
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
