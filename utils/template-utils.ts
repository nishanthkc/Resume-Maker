import type { ResumeFileType, ResumeTemplate } from '@/types/resume-form';

/**
 * Returns the available templates based on the uploaded file type
 * @param fileType - The type of resume file (pdf, docx, tex) or null
 * @returns Array of available template types
 */
export function getAvailableTemplates(fileType: ResumeFileType | null): ResumeTemplate[] {
  if (!fileType) {
    return [];
  }

  // For LaTeX files, show all 4 templates including "Your Format"
  if (fileType === 'tex') {
    return ['modern', 'classic', 'old-school', 'your-format'];
  }

  // For PDF and DOCX files, show only 3 templates (exclude "Your Format")
  if (fileType === 'pdf' || fileType === 'docx') {
    return ['modern', 'classic', 'old-school'];
  }

  // Fallback: return empty array for unknown file types
  return [];
}

