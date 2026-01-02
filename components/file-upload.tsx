'use client';

import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import type { ResumeFileData } from '@/types/resume-form';
import {
  getFileExtension,
  getFileTypeFromExtension,
  formatFileSize,
  getFileTypeIcon,
  MAX_FILE_SIZE,
} from '@/utils/file-utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: ResumeFileData | null;
  error?: string;
}

export default function FileUpload({ onFileSelect, onFileRemove, selectedFile, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Check file extension
    const extension = getFileExtension(file.name);
    const fileType = getFileTypeFromExtension(extension);
    
    if (!fileType) {
      return {
        isValid: false,
        error: 'Please upload a PDF, DOCX, or LaTeX file',
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size must be less than 10MB',
      };
    }

    return { isValid: true };
  }, []);

  const handleFile = useCallback((file: File) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      setLocalError(validation.error || 'Invalid file');
      return;
    }

    // Clear any previous errors
    setLocalError(null);
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setLocalError(null);
    onFileRemove();
  }, [onFileRemove]);

  const displayError = localError || error;

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging 
              ? 'border-accent bg-background-secondary' 
              : displayError
              ? 'border-error bg-background-secondary'
              : 'border-border bg-background-secondary'
            }
            hover:border-accent cursor-pointer
          `}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.docx,.tex"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload resume file"
          />
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-12 h-12 text-foreground-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-foreground font-medium mb-1">
                Drag and drop your resume file here
              </p>
              <p className="text-foreground-muted text-sm">
                or click to browse
              </p>
            </div>
            <p className="text-foreground-muted text-xs">
              Supported formats: PDF, DOCX, LaTeX (.tex) • Max size: 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className={`border rounded-lg p-4 bg-background-secondary ${displayError ? 'border-error' : 'border-border'}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-2xl flex-shrink-0">
                {getFileTypeIcon(selectedFile.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-foreground-muted text-sm">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex-shrink-0 p-2 rounded-full hover:bg-background-tertiary transition-colors"
              aria-label="Remove file"
            >
              <svg
                className="w-5 h-5 text-foreground-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {displayError && (
        <div className="mt-1 p-1">
          <p className="text-error text-sm font-medium">
            {displayError}
          </p>
        </div>
      )}
    </div>
  );
}
