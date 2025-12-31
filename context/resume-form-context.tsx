'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ResumeFormData, ResumeFileData, ResumeTemplate, ResumeFormContextValue } from '@/types/resume-form';
import { validateStep1, validateStep2, validateStep3 } from '@/utils/validation';

// Create context
const ResumeFormContext = createContext<ResumeFormContextValue | undefined>(undefined);

// Initial form state
const initialFormData: ResumeFormData = {
  currentStep: 1,
  resumeFile: null,
  jobDescription: '',
  jobRole: '',
  template: null,
  personalizationPrompt: '',
};

interface ResumeFormProviderProps {
  children: React.ReactNode;
  isAuthenticated?: boolean; // For Step 3 validation, can be passed from parent
}

export function ResumeFormProvider({ children, isAuthenticated = false }: ResumeFormProviderProps) {
  const [formData, setFormData] = useState<ResumeFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Update functions
  const updateResumeFile = useCallback((file: ResumeFileData) => {
    setFormData((prev) => ({ ...prev, resumeFile: file }));
  }, []);

  const updateJobDescription = useCallback((text: string) => {
    setFormData((prev) => ({ ...prev, jobDescription: text }));
  }, []);

  const updateJobRole = useCallback((role: string) => {
    setFormData((prev) => ({ ...prev, jobRole: role }));
  }, []);

  const updateTemplate = useCallback((template: ResumeTemplate) => {
    setFormData((prev) => ({ ...prev, template }));
  }, []);

  const updatePersonalizationPrompt = useCallback((prompt: string) => {
    setFormData((prev) => ({ ...prev, personalizationPrompt: prompt }));
  }, []);

  // Navigation functions
  const nextStep = useCallback(() => {
    // Validate current step before advancing
    let validationResult;
    
    switch (formData.currentStep) {
      case 1:
        validationResult = validateStep1(formData);
        break;
      case 2:
        validationResult = validateStep2(formData);
        break;
      case 3:
        validationResult = validateStep3(formData, isAuthenticated);
        break;
      default:
        validationResult = { isValid: true, errors: {} };
    }

    if (validationResult.isValid) {
      // Clear errors and advance to next step
      setValidationErrors({});
      if (formData.currentStep < 3) {
        setFormData((prev) => ({ ...prev, currentStep: (prev.currentStep + 1) as 1 | 2 | 3 }));
      }
    } else {
      // Set validation errors and prevent step change
      setValidationErrors(validationResult.errors);
    }
  }, [formData, isAuthenticated]);

  const prevStep = useCallback(() => {
    // No validation needed, just go back and clear errors
    setValidationErrors({});
    if (formData.currentStep > 1) {
      setFormData((prev) => ({ ...prev, currentStep: (prev.currentStep - 1) as 1 | 2 | 3 }));
    }
  }, [formData.currentStep]);

  const contextValue: ResumeFormContextValue = {
    formData,
    updateResumeFile,
    updateJobDescription,
    updateJobRole,
    updateTemplate,
    updatePersonalizationPrompt,
    nextStep,
    prevStep,
    validationErrors,
  };

  return (
    <ResumeFormContext.Provider value={contextValue}>
      {children}
    </ResumeFormContext.Provider>
  );
}

// Custom hook to use the context
export function useResumeForm(): ResumeFormContextValue {
  const context = useContext(ResumeFormContext);
  
  if (context === undefined) {
    throw new Error('useResumeForm must be used within a ResumeFormProvider');
  }
  
  return context;
}

