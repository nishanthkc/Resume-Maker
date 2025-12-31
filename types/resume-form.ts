// Core types for resume form
export type ResumeFileType = 'pdf' | 'docx' | 'tex';

export type ResumeTemplate = 'modern' | 'classic' | 'old-school' | 'your-format';

// Resume file data structure
export interface ResumeFileData {
  type: ResumeFileType;
  name: string;
  size: number; // bytes
  extractedText: string; // content after processing
}

// Complete form state
export interface ResumeFormData {
  currentStep: 1 | 2 | 3;
  resumeFile: ResumeFileData | null;
  jobDescription: string;
  jobRole: string;
  template: ResumeTemplate | null;
  personalizationPrompt: string; // optional, for authenticated users
}

// Validation result structure
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Context value interface
export interface ResumeFormContextValue {
  formData: ResumeFormData;
  updateResumeFile: (file: ResumeFileData) => void;
  updateJobDescription: (text: string) => void;
  updateJobRole: (role: string) => void;
  updateTemplate: (template: ResumeTemplate) => void;
  updatePersonalizationPrompt: (prompt: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  validationErrors: Record<string, string>;
}

