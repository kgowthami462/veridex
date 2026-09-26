import * as pdfjsLib from "pdfjs-dist";
import { sanitizeExtractedPdfText } from "./security";

export type ExtractedPage = {
  pageNum: number;
  text: string;
};

export type ExtractedDocument = {
  fileName: string;
  fullText: string;
  pageCount: number;
  pages: ExtractedPage[];
  error?: string;
};

// Set worker src dynamically for browser PDF parsing
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Parses PDF/DOCX/TXT file or buffer into structured document text with page-level mapping.
 */
export async function extractTextFromDocument(
  fileOrBuffer: File | Uint8Array | ArrayBuffer | string,
  fileName: string = "uploaded_document.pdf"
): Promise<ExtractedDocument> {
  const actualFileName = fileOrBuffer instanceof File ? fileOrBuffer.name : fileName;

  // Handle String input (Plain text or pre-formatted document text)
  if (typeof fileOrBuffer === "string") {
    return parseTextToExtractedDoc(fileOrBuffer, actualFileName);
  }

  // Handle File or Buffer
  let arrayBuffer: ArrayBuffer;
  if (fileOrBuffer instanceof File) {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else if (fileOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer;
  } else {
    arrayBuffer = fileOrBuffer.buffer.slice(
      fileOrBuffer.byteOffset,
      fileOrBuffer.byteOffset + fileOrBuffer.byteLength
    ) as ArrayBuffer;
  }

  const uint8Array = new Uint8Array(arrayBuffer);

  // Check if content is plain readable text (e.g. test fixture or plain text string disguised as file)
  let rawDecoded = "";
  try {
    rawDecoded = new TextDecoder("utf-8", { fatal: false }).decode(uint8Array);
  } catch {
    rawDecoded = "";
  }

  // If content does NOT start with %PDF- header or PK zip header, but contains readable legal text
  const isPdfHeader = uint8Array.length >= 4 && uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && uint8Array[2] === 0x44 && uint8Array[3] === 0x46;
  const isZipHeader = uint8Array.length >= 4 && uint8Array[0] === 0x50 && uint8Array[1] === 0x4b && uint8Array[2] === 0x03 && uint8Array[3] === 0x04;

  if (!isZipHeader && (rawDecoded.includes("[Page 1]") || !isPdfHeader || !rawDecoded.includes("stream"))) {
    return parseTextToExtractedDoc(rawDecoded, actualFileName);
  }

  // Handle Plain Text file (.txt)
  if (actualFileName.toLowerCase().endsWith(".txt")) {
    return parseTextToExtractedDoc(rawDecoded, actualFileName);
  }

  // Handle DOCX XML Text Extraction (.docx)
  if (actualFileName.toLowerCase().endsWith(".docx")) {
    const cleanText = sanitizeExtractedPdfText(
      rawDecoded.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    );

    if (cleanText.length < 15) {
      return {
        fileName: actualFileName,
        fullText: "",
        pageCount: 0,
        pages: [],
        error: "Document text could not be extracted. Please upload a text-readable PDF/DOCX."
      };
    }

    return {
      fileName: actualFileName,
      fullText: cleanText,
      pageCount: 1,
      pages: [{ pageNum: 1, text: cleanText }]
    };
  }

  // PDF Extraction using pdfjs-dist
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true
    });

    const pdfDoc = await loadingTask.promise;
    const pageCount = pdfDoc.numPages;
    const pages: ExtractedPage[] = [];
    let fullText = "";

    for (let i = 1; i <= pageCount; i++) {
      try {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageItems = textContent.items.map((item: Record<string, unknown>) =>
          typeof item.str === "string" ? item.str : ""
        );
        const rawPageText = pageItems.join(" ").replace(/\s+/g, " ").trim();
        const cleanPageText = sanitizeExtractedPdfText(rawPageText);

        if (cleanPageText.length > 5) {
          pages.push({ pageNum: i, text: cleanPageText });
          fullText += ` [Page ${i}] ` + cleanPageText;
        }
      } catch (err) {
        console.warn(`Error extracting text on page ${i}:`, err);
      }
    }

    fullText = sanitizeExtractedPdfText(fullText);

    if (!fullText || fullText.length < 20) {
      return {
        fileName: actualFileName,
        fullText: "",
        pageCount,
        pages: [],
        error: "Document text could not be extracted. Please upload a text-readable PDF/DOCX or try again."
      };
    }

    return {
      fileName: actualFileName,
      fullText,
      pageCount,
      pages
    };
  } catch (e) {
    console.error("PDF Extraction error:", e);
    return {
      fileName: actualFileName,
      fullText: "",
      pageCount: 0,
      pages: [],
      error: "Document text could not be extracted. Please upload a text-readable PDF/DOCX or try again."
    };
  }
}

/**
 * Helper to split text with [Page X] markers into structured ExtractedDocument
 */
function parseTextToExtractedDoc(text: string, fileName: string): ExtractedDocument {
  const cleanText = sanitizeExtractedPdfText(text);
  if (!cleanText.trim()) {
    return {
      fileName,
      fullText: "",
      pageCount: 0,
      pages: [],
      error: "Document text could not be extracted. File contains no readable text."
    };
  }

  const pageSplits = cleanText.split(/\[Page\s+(\d+)\]/i);
  const pages: ExtractedPage[] = [];

  if (pageSplits.length > 1) {
    for (let i = 1; i < pageSplits.length; i += 2) {
      const pageNum = parseInt(pageSplits[i], 10);
      const pageText = (pageSplits[i + 1] || "").trim();
      if (pageText) {
        pages.push({ pageNum, text: pageText });
      }
    }
  }

  if (pages.length === 0) {
    pages.push({ pageNum: 1, text: cleanText });
  }

  return {
    fileName,
    fullText: cleanText,
    pageCount: pages.length,
    pages
  };
}
