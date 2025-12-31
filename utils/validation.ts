import type { ResumeFormData, ValidationResult } from '@/types/resume-form';

/**
 * Validates Step 1: Resume Upload & Job Description
 * Checks: Resume file uploaded AND job description provided (non-empty)
 * Returns errors for missing fields
 */
export function validateStep1(data: Partial<ResumeFormData>): ValidationResult {
  // TODO: Implement validation logic
  // - Check if resumeFile is provided
  // - Check if resumeFile size is less than 10MB
  // - Check if resumeFile is of type pdf or tex or docx
  // - Check if jobDescription is non-empty
  // - Return appropriate error messages
  
  return {
    isValid: true,
    errors: {},
  };
}

/**
 * Validates Step 2: Job Role & Template Selection
 * Checks: Job role provided AND template selected
 * Special validation: "your-format" template only allowed if resume file type is 'tex'
 * Returns errors for missing fields or invalid template selection
 */
export function validateStep2(data: Partial<ResumeFormData>): ValidationResult {
  // TODO: Implement validation logic
  // - Check if jobRole is provided and non-empty
  // - Check if template is selected
  // - Show template "your-format" only when resumeFile.type is 'tex'
  // - Return appropriate error messages
  
  return {
    isValid: true,
    errors: {},
  };
}

/**
 * Validates Step 3: Personalization Prompt (Optional)
 * Optional step: Always valid (can be skipped)
 * Only validates if: isAuthenticated AND prompt provided (then check minimum length)
 * Returns empty errors if skipped
 */
export function validateStep3(
  data: Partial<ResumeFormData>,
  isAuthenticated: boolean
): ValidationResult {
  // TODO: Implement validation logic
  // - Step 3 is always valid (can be skipped)
  // - Only validate if: isAuthenticated AND personalizationPrompt provided
  // - If validating, check minimum length
  // - Return empty errors if skipped
  
  return {
    isValid: true,
    errors: {},
  };
}

