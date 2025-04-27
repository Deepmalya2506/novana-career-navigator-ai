import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set the worker source path correctly
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).href;

// Function to perform OCR on an image
async function performOCR(imageData: ImageData): Promise<string> {
  const worker = await createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(imageData);
  await worker.terminate();
  return text;
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      
      // Get text content
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      // If text content is sparse, try OCR
      if (pageText.trim().length < 100) {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const ocrText = await performOCR(imageData);
          fullText += ocrText + '\n';
        }
      } else {
        fullText += pageText + '\n';
      }
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return extractTextFromPDFWithoutWorker(file);
  }
};

// Fallback method for PDF processing without worker
const extractTextFromPDFWithoutWorker = async (file: File): Promise<string> => {
  // Simple fallback for text extraction
  // This is a very basic implementation that will at least allow some functionality
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        // Try to extract text in a simplified way
        const result = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(result);
        
        // Look for text patterns in PDF bytes
        // This is a very basic implementation and won't work well for all PDFs
        let text = '';
        let inText = false;
        let textStart = 0;
        
        for (let i = 0; i < uint8Array.length - 2; i++) {
          // Look for text object markers in PDF
          if (uint8Array[i] === 40 && uint8Array[i+1] >= 32) { // '(' character
            inText = true;
            textStart = i + 1;
          } else if (inText && uint8Array[i] === 41) { // ')' character
            inText = false;
            const textBytes = uint8Array.slice(textStart, i);
            // Convert bytes to string
            const decoder = new TextDecoder('utf-8');
            text += decoder.decode(textBytes) + ' ';
          }
        }
        
        // If we couldn't extract any text, provide a message
        if (text.trim().length === 0) {
          text = "The PDF content could not be fully extracted. Please try a text file instead.";
        }
        
        resolve(text);
      } catch (e) {
        resolve("Could not parse PDF content. Please try a text file instead.");
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const readFileContent = async (file: File): Promise<string> => {
  // Handle PDF files with our custom function
  if (file.type === 'application/pdf') {
    return await extractTextFromPDF(file);
  }
  
  // For all other file types, use the standard FileReader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as text"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
};
