import { generate83PageEmploymentAgreement } from "../fixtures/83-page-employment-agreement";
import { extractTextFromDocument } from "../../lib/pdf-extractor";
import { analyzeDocument } from "../../lib/services";

export async function run83PageContractIntegrationTest(): Promise<{ passed: number; failed: number }> {
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

  console.log("\n  \x1b[33m▶ Running Integration Test: 83-Page Contract Analysis\x1b[0m");

  const agreementDoc = generate83PageEmploymentAgreement();
  assert(agreementDoc.pageCount === 83, "Fixture generates 83 distinct agreement pages");

  // Step 1: Text extraction
  const extracted = await extractTextFromDocument(agreementDoc.fullText, agreementDoc.fileName);
  assert(extracted.pageCount === 83 && extracted.pages.length === 83, "Extracts all 83 pages accurately");

  // Step 2: Grounded legal analysis
  const docFile = new File([agreementDoc.fullText], agreementDoc.fileName, { type: "text/plain" });
  const analysis = await analyzeDocument(docFile);

  assert(!analysis.error, "Completed analysis without extraction errors");
  assert(analysis.document.parties.join(" ").includes("VERIDEX"), "Extracted Company party correctly");
  assert(analysis.document.parties.join(" ").includes("RAJESH"), "Extracted Executive party correctly");
  assert(analysis.document.monetaryAmounts.join(" ").includes("1,20,00,000"), "Extracted ₹1,20,00,000 remuneration");
  assert(analysis.document.terminationSummary.includes("90 days"), "Extracted 90 days termination notice");

  const nonCompeteClause = analysis.clauses.find(c => c.category === "Non-compete" || c.title.includes("Non-Compete"));
  assert(Boolean(nonCompeteClause && nonCompeteClause.page === 5), "Non-compete clause cited accurately on Page 5");

  const jurisdictionClause = analysis.clauses.find(c => c.category === "Jurisdiction" || c.title.includes("Governing Law"));
  assert(Boolean(jurisdictionClause && jurisdictionClause.page === 7), "Governing Law clause cited accurately on Page 7");

  return { passed, failed };
}
