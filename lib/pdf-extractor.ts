import * as pdfjsLib from "pdfjs-dist";

export type ExtractedDocument = {
  fileName: string;
  fullText: string;
  pageCount: number;
  pages: { pageNum: number; text: string }[];
  error?: string;
};

// Set worker src dynamically for browser PDF parsing
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export async function extractTextFromDocument(file: File): Promise<ExtractedDocument> {
  const fileName = file.name;
  
  if (file.size === 0) {
    return {
      fileName,
      fullText: "",
      pageCount: 0,
      pages: [],
      error: "Document text could not be extracted. File is empty."
    };
  }

  // Plain Text file (.txt)
  if (fileName.toLowerCase().endsWith(".txt")) {
    try {
      const text = await file.text();
      if (!text.trim()) {
        return { fileName, fullText: "", pageCount: 0, pages: [], error: "Document text could not be extracted. File contains no readable text." };
      }
      return {
        fileName,
        fullText: text,
        pageCount: 1,
        pages: [{ pageNum: 1, text }]
      };
    } catch (e) {
      return { fileName, fullText: "", pageCount: 0, pages: [], error: "Document text could not be extracted. Failed to read TXT file." };
    }
  }

  // DOCX XML Text Extraction
  if (fileName.toLowerCase().endsWith(".docx")) {
    try {
      const rawText = await file.text();
      const cleanText = rawText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (cleanText.length < 15) {
        return { fileName, fullText: "", pageCount: 0, pages: [], error: "Document text could not be extracted. Please upload a text-readable PDF/DOCX or try again." };
      }
      return {
        fileName,
        fullText: cleanText,
        pageCount: 1,
        pages: [{ pageNum: 1, text: cleanText }]
      };
    } catch (e) {
      return { fileName, fullText: "", pageCount: 0, pages: [], error: "Document text could not be extracted. Please upload a text-readable PDF/DOCX or try again." };
    }
  }

  // PDF Text Extraction using pdfjs-dist
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: true
    });

    const pdfDoc = await loadingTask.promise;
    const pageCount = pdfDoc.numPages;
    const pages: { pageNum: number; text: string }[] = [];
    let fullText = "";

    for (let i = 1; i <= pageCount; i++) {
      try {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageItems = textContent.items.map((item: Record<string, unknown>) => (typeof item.str === "string" ? item.str : ""));
        const pageText = pageItems.join(" ").replace(/\s+/g, " ").trim();

        // Filter out binary metadata tags like /Adobe /Registry /ModDate
        const cleanPageText = pageText
          .replace(/\/Registry\([^)]*\)/gi, "")
          .replace(/\/ModDate\([^)]*\)/gi, "")
          .replace(/\/CreationDate\([^)]*\)/gi, "")
          .replace(/\/Identity\b/gi, "")
          .trim();

        if (cleanPageText.length > 5 && !cleanPageText.startsWith("/Identity")) {
          pages.push({ pageNum: i, text: cleanPageText });
          fullText += ` [Page ${i}] ` + cleanPageText;
        }
      } catch (err) {
        console.warn(`Error extracting text on page ${i}:`, err);
      }
    }

    // Filter font/metadata header strings from fullText
    fullText = fullText.replace(/\/Identity\b|\/Registry\([^)]*\)|\/ModDate\([^)]*\)/gi, "").trim();

    if (!fullText || fullText.length < 20) {
      return {
        fileName,
        fullText: "",
        pageCount,
        pages: [],
        error: "Document text could not be extracted. Please upload a text-readable PDF/DOCX or try again."
      };
    }

    return {
      fileName,
      fullText,
      pageCount,
      pages
    };

  } catch (e) {
    console.error("PDF.js Extraction error:", e);
    return {
      fileName,
      fullText: "",
      pageCount: 0,
      pages: [],
      error: "Document text could not be extracted. Please upload a text-readable PDF/DOCX or try again."
    };
  }
}
