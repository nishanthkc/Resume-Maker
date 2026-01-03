import mammoth from 'mammoth';

/**
 * Extracts text content from a DOCX file
 * @param file - The DOCX file to extract text from
 * @returns Promise that resolves to the extracted text string
 * @throws Error if extraction fails
 */
export async function extractDocxText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Failed to extract text from DOCX file: ${error.message}`
        : 'Failed to extract text from DOCX file. The file may be corrupted or invalid.'
    );
  }
}

/**
 * Extracts text content from a PDF file (handles multi-page documents)
 * @param file - The PDF file to extract text from
 * @returns Promise that resolves to the extracted text string
 * @throws Error if extraction fails
 */
export async function extractPdfText(file: File): Promise<string> {
  try {
    // Dynamically import pdfjs-dist only on client side
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up PDF.js worker using worker from public folder
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const numPages = pdf.numPages;
    const textParts: string[] = [];

    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      textParts.push(pageText);
    }

    return textParts.join('\n\n');
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Failed to extract text from PDF file: ${error.message}`
        : 'Failed to extract text from PDF file. The file may be corrupted or invalid.'
    );
  }
}

/**
 * Reads content from a LaTeX file (plain text file)
 * @param file - The LaTeX file to read
 * @returns Promise that resolves to the file content string
 * @throws Error if reading fails
 */
export async function readLatexFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content === 'string') {
          resolve(content);
        } else {
          reject(new Error('Failed to read LaTeX file: Invalid file content'));
        }
      } catch (error) {
        reject(
          new Error(
            error instanceof Error
              ? `Failed to read LaTeX file: ${error.message}`
              : 'Failed to read LaTeX file. The file may be corrupted or invalid.'
          )
        );
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read LaTeX file: File reading error'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
}