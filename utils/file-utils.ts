import type { ResumeFileType } from '@/types/resume-form';

/**
 * Gets the file extension from a filename (including the dot)
 * @param filename - The filename to extract extension from
 * @returns The extension in lowercase (e.g., '.pdf') or empty string if no extension
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) {
    return ''; // No extension or dot at end
  }
  return filename.toLowerCase().substring(lastDot);
}

/**
 * Maps a file extension to a ResumeFileType
 * @param extension - File extension (with or without dot, case-insensitive)
 * @returns ResumeFileType or null if extension is not supported
 */
export function getFileTypeFromExtension(extension: string): ResumeFileType | null {
  const ext = extension.toLowerCase().startsWith('.') 
    ? extension.toLowerCase() 
    : `.${extension.toLowerCase()}`;
  
  if (ext === '.pdf') return 'pdf';
  if (ext === '.docx') return 'docx';
  if (ext === '.tex') return 'tex';
  return null;
}

/**
 * Gets the file type from a filename
 * @param filename - The filename to extract type from
 * @returns ResumeFileType or null if file type is not supported
 */
export function getFileTypeFromFilename(filename: string): ResumeFileType | null {
  const extension = getFileExtension(filename);
  return getFileTypeFromExtension(extension);
}

/**
 * Formats file size in bytes to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB", "512 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Gets an emoji icon for a file type
 * @param type - ResumeFileType
 * @returns Emoji string for the file type
 */
export function getFileTypeIcon(type: ResumeFileType): string {
  switch (type) {
    case 'pdf':
      return '📄';
    case 'docx':
      return '📝';
    case 'tex':
      return '📋';
    default:
      return '📎';
  }
}

/**
 * Accepted file extensions for resume uploads
 */
export const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.tex'] as const;

/**
 * Maximum file size for resume uploads (10MB in bytes)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

