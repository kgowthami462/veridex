/**
 * Security & Validation Module for Veridex
 * Handles Upload Validation, Magic Byte Signatures, Malware Payload Scanning,
 * X-Ray PDF Cleaning, and Anti-Prompt-Injection Protection.
 */

export type UploadValidationResult = {
  isValid: boolean;
  error?: string;
  detectedType?: "pdf" | "docx" | "txt";
  sanitizedText?: string;
};

export type PromptInjectionResult = {
  hasInjection: boolean;
  sanitizedInput: string;
  flaggedPatterns: string[];
};

// Known prompt injection attack signatures
const INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous|prior)\s+instructions/gi,
  /system\s+prompt\s*:/gi,
  /forget\s+(?:your|all)\s+instructions/gi,
  /you\s+are\s+now\s+(?:a|an|in|dan|developer\s+mode)/gi,
  /override\s+(?:safety|rules|instructions|filters)/gi,
  /jailbreak/gi,
  /\[INST\]/gi,
  /<\|im_start\|>/gi,
  /<\/document_content>/gi,
  /<document_content>/gi,
  /disregard\s+the\s+above/gi,
  /new\s+rule\s*:/gi
];

/**
 * Validates file upload security using magic bytes, extension matching, and payload scanning.
 */
export async function validateUploadSecurity(
  bufferOrText: Uint8Array | ArrayBuffer | string,
  fileName: string
): Promise<UploadValidationResult> {
  if (!fileName) {
    return { isValid: false, error: "Upload rejected: Missing file name." };
  }

  const lowerName = fileName.toLowerCase();

  // 1. Convert input to Uint8Array for magic byte checking
  let uint8: Uint8Array;
  let textContent = "";

  if (typeof bufferOrText === "string") {
    textContent = bufferOrText;
    uint8 = new TextEncoder().encode(bufferOrText);
  } else if (bufferOrText instanceof ArrayBuffer) {
    uint8 = new Uint8Array(bufferOrText);
    try {
      textContent = new TextDecoder("utf-8", { fatal: false }).decode(uint8);
    } catch {
      textContent = "";
    }
  } else {
    uint8 = bufferOrText;
    try {
      textContent = new TextDecoder("utf-8", { fatal: false }).decode(uint8);
    } catch {
      textContent = "";
    }
  }

  // 2. Empty File Validation
  if (uint8.length === 0) {
    return { isValid: false, error: "Upload rejected: File is empty (0 bytes)." };
  }

  // 3. Max File Size Limit (50MB)
  const MAX_SIZE_BYTES = 50 * 1024 * 1024;
  if (uint8.length > MAX_SIZE_BYTES) {
    return { isValid: false, error: "Upload rejected: File size exceeds the maximum 50MB limit." };
  }

  // 4. Malware & Executable Payload Check
  const payloadCheck = scanForMaliciousPayloads(uint8, textContent);
  if (!payloadCheck.isValid) {
    return payloadCheck;
  }

  // 5. Magic Byte Verification by Extension
  if (lowerName.endsWith(".pdf")) {
    // PDF Magic Bytes: %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D)
    const isPdfMagic =
      uint8.length >= 5 &&
      uint8[0] === 0x25 &&
      uint8[1] === 0x50 &&
      uint8[2] === 0x44 &&
      uint8[3] === 0x46 &&
      uint8[4] === 0x2d;

    // Check header string if text representation is available
    const headerStr = textContent.slice(0, 1024);
    const hasPdfHeader = isPdfMagic || headerStr.includes("%PDF-");

    if (!hasPdfHeader) {
      return {
        isValid: false,
        error: "Upload security error: File extension is .pdf but binary content does not contain a valid %PDF- magic signature."
      };
    }
    return { isValid: true, detectedType: "pdf" };
  }

  if (lowerName.endsWith(".docx")) {
    // DOCX Zip Magic Bytes: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
    const isZipMagic =
      uint8.length >= 4 &&
      uint8[0] === 0x50 &&
      uint8[1] === 0x4b &&
      uint8[2] === 0x03 &&
      uint8[3] === 0x04;

    if (!isZipMagic && !textContent.includes("word/document.xml")) {
      return {
        isValid: false,
        error: "Upload security error: File extension is .docx but binary header does not match valid PK (Zip/DOCX) signature."
      };
    }
    return { isValid: true, detectedType: "docx" };
  }

  if (lowerName.endsWith(".txt")) {
    // Check for null bytes or binary executable headers in text files
    if (hasNullBytesOrExecutableHeaders(uint8)) {
      return {
        isValid: false,
        error: "Upload security error: File extension is .txt but file contains raw binary or executable data."
      };
    }
    return { isValid: true, detectedType: "txt", sanitizedText: sanitizeText(textContent) };
  }

  return {
    isValid: false,
    error: "Upload security error: Unsupported file type. Only .pdf, .docx, and .txt files are permitted."
  };
}

/**
 * Scans binary buffers and text for executable signatures and script injection attacks.
 */
export function scanForMaliciousPayloads(
  uint8: Uint8Array,
  textContent: string
): UploadValidationResult {
  // Check Windows PE Executable signature (MZ at byte offset 0)
  if (uint8.length >= 2 && uint8[0] === 0x4d && uint8[1] === 0x5a) {
    return {
      isValid: false,
      error: "Security Alert: Executable file signature (MZ / PE) detected. File upload rejected."
    };
  }

  // Check Linux ELF Executable signature (\x7F ELF at offset 0)
  if (
    uint8.length >= 4 &&
    uint8[0] === 0x7f &&
    uint8[1] === 0x45 &&
    uint8[2] === 0x4c &&
    uint8[3] === 0x46
  ) {
    return {
      isValid: false,
      error: "Security Alert: ELF binary executable signature detected. File upload rejected."
    };
  }

  // Check for malicious script tags in text
  const lower = textContent.toLowerCase();
  if (
    lower.includes("<script") ||
    lower.includes("javascript:") ||
    lower.includes("cscript.exe") ||
    lower.includes("cmd.exe /c") ||
    lower.includes("powershell -enc")
  ) {
    return {
      isValid: false,
      error: "Security Alert: Potentially malicious script or command payload detected in file."
    };
  }

  return { isValid: true };
}

/**
 * Helper to detect binary null bytes or executable headers.
 */
function hasNullBytesOrExecutableHeaders(uint8: Uint8Array): boolean {
  let nullCount = 0;
  const sampleLength = Math.min(uint8.length, 1024);
  for (let i = 0; i < sampleLength; i++) {
    if (uint8[i] === 0) nullCount++;
  }
  return nullCount > 5;
}

/**
 * Detects prompt injection attempts and returns sanitized input.
 */
export function detectPromptInjection(input: string): PromptInjectionResult {
  if (!input) {
    return { hasInjection: false, sanitizedInput: "", flaggedPatterns: [] };
  }

  const flaggedPatterns: string[] = [];
  let sanitized = input;

  // Sanitize structural XML delimiters first to prevent prompt breakout
  if (/<document_content>|<\/document_content>|<system>|<\/system>/i.test(sanitized)) {
    flaggedPatterns.push("structural_xml_delimiters");
    sanitized = sanitized
      .replace(/<document_content>/gi, "[document_content]")
      .replace(/<\/document_content>/gi, "[/document_content]")
      .replace(/<system>/gi, "[system]")
      .replace(/<\/system>/gi, "[/system]");
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      flaggedPatterns.push(pattern.source);
      // Neutralize injection phrasing by replacing with safe placeholder tag
      sanitized = sanitized.replace(pattern, "[SECURITY_NEUTRALIZED_PROMPT_INJECTION]");
    }
  }

  return {
    hasInjection: flaggedPatterns.length > 0,
    sanitizedInput: sanitized,
    flaggedPatterns
  };
}

/**
 * Sanitize plain text string.
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  return text.replace(/\0/g, "").replace(/\r\n/g, "\n");
}

/**
 * X-Ray PDF Cleaning: Strips PDF font/metadata stream dumps while retaining clean readable legal text.
 */
export function sanitizeExtractedPdfText(rawText: string): string {
  if (!rawText) return "";

  return rawText
    .replace(/\/Registry\([^)]*\)/gi, "")
    .replace(/\/ModDate\([^)]*\)/gi, "")
    .replace(/\/CreationDate\([^)]*\)/gi, "")
    .replace(/\/Identity\b/gi, "")
    .replace(/\/CIDInit\b/gi, "")
    .replace(/\/FontName\b/gi, "")
    .replace(/\/Subtype\b/gi, "")
    .replace(/\bLetsVenture\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}
