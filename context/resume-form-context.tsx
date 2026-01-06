'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
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

const STORAGE_KEY = 'resume-form-state';

export function ResumeFormProvider({ children, isAuthenticated = false }: ResumeFormProviderProps) {
  const [formData, setFormData] = useState<ResumeFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Restore form state from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restored = JSON.parse(saved) as ResumeFormData;
        setFormData(restored);
        sessionStorage.removeItem(STORAGE_KEY); // Clear after restore
      }
    } catch (error) {
      console.error('Failed to restore form state from sessionStorage:', error);
      // If restoration fails, continue with initial state
    }
  }, []); // Only run on mount

  // Helper function to clear a specific validation error
  const clearValidationError = useCallback((key: string) => {
    setValidationErrors((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Update functions
  const updateResumeFile = useCallback((file: ResumeFileData | null) => {
    setFormData((prev) => ({ ...prev, resumeFile: file }));
    // Clear error if file is provided
    if (file !== null) {
      clearValidationError('resumeFile');
    }
  }, [clearValidationError]);

  const updateJobDescription = useCallback((text: string) => {
    setFormData((prev) => ({ ...prev, jobDescription: text }));
    // Clear error if text is non-empty (after trim)
    if (text.trim() !== '') {
      clearValidationError('jobDescription');
    }
  }, [clearValidationError]);

  const updateJobRole = useCallback((role: string) => {
    setFormData((prev) => ({ ...prev, jobRole: role }));
    // Clear error if text is non-empty (after trim)
    if (role.trim() !== '') {
      clearValidationError('jobRole');
    }
  }, [clearValidationError]);

  const updateTemplate = useCallback((template: ResumeTemplate | null) => {
    setFormData((prev) => ({ ...prev, template }));
    // Clear error when template is set (user is interacting)
    clearValidationError('template');
  }, [clearValidationError]);

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

  // Function to save form state to sessionStorage (exported via context if needed)
  const saveFormStateToStorage = useCallback((data: ResumeFormData) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save form state to sessionStorage:', error);
    }
  }, []);

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

// Export function to save form state (for use before OAuth redirect)
export function saveResumeFormState(formData: ResumeFormData): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  } catch (error) {
    console.error('Failed to save form state to sessionStorage:', error);
  }
}

// Custom hook to use the context
export function useResumeForm(): ResumeFormContextValue {
  const context = useContext(ResumeFormContext);
  
  if (context === undefined) {
    throw new Error('useResumeForm must be used within a ResumeFormProvider');
  }
  
  return context;
}

