import { extractTextFromDocument } from "../../lib/pdf-extractor";

export async function runPdfExtractorUnitTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`    \x1b[32m✔ PASS:\x1b[0m ${testName}`);
      passed++;
    } else {
      console.error(`    \x1b[31m✖ FAIL:\x1b[0m ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  console.log("\n  \x1b[33m▶ Running Unit Tests: lib/pdf-extractor.ts\x1b[0m");

  // Test 1: Extract plain text string with page markers
  const textInput = "[Page 1] This is Section 1 of Agreement. [Page 2] This is Section 2 of Agreement.";
  const res1 = await extractTextFromDocument(textInput, "agreement.txt");
  assert(res1.pageCount === 2, "Extracts exactly 2 pages from string with page markers");
  assert(res1.pages[0].pageNum === 1 && res1.pages[1].pageNum === 2, "Maps page numbers accurately");

  // Test 2: Handle empty file input cleanly
  const res2 = await extractTextFromDocument("", "empty.txt");
  assert(res2.pageCount === 0 && Boolean(res2.error), "Returns clean error for empty document text");

  // Test 3: Handle DOCX text extraction cleaning
  const docxInput = "<html><body><w:p>Employment Contract Clause</w:p></body></html>";
  const res3 = await extractTextFromDocument(docxInput, "contract.docx");
  assert(res3.fullText.includes("Employment Contract Clause"), "Strips XML tags from DOCX stream");

  return { passed, failed };
}
