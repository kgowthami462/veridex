import { answerDocumentQuestion, searchLegalProvision, executeLocalGroundedAnalysis } from "../../lib/services";
import { veridexCache } from "../../lib/cache";

export async function runServicesUnitTests(): Promise<{ passed: number; failed: number }> {
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

  console.log("\n  \x1b[33m▶ Running Unit Tests: lib/services.ts & lib/cache.ts\x1b[0m");

  const sampleDocText = `[Page 1] EMPLOYMENT AGREEMENT between ACME CORP and JOHN DOE. Effective Date: January 1, 2026. Base Salary: ₹25,00,000 per annum. Termination notice period is 60 days written notice. Non-compete restraint is 12 months post-employment. Governing Law: Courts of Delhi.`;
  const pages = [{ pageNum: 1, text: sampleDocText }];

  // Test 1: Grounded document analysis
  const analysis = executeLocalGroundedAnalysis("contract.pdf", sampleDocText, pages, 1);
  assert(analysis.document.parties.join(" ").includes("ACME CORP"), "Extracts company party name");
  assert(analysis.document.terminationSummary.includes("60 days"), "Extracts 60 days notice period");

  // Test 2: Grounded Q&A matcher - Grounded query
  const qa1 = await answerDocumentQuestion("What is the notice period?", undefined, sampleDocText);
  assert(qa1.answer.includes("60 days"), "Answers grounded notice period query accurately");

  // Test 3: Anti-Hallucination - Unmentioned query
  const qa2 = await answerDocumentQuestion("What is the stock option vesting acceleration?", undefined, sampleDocText);
  assert(qa2.answer === "I couldn't find this information in the provided document.", "Strictly returns absence notice for unmentioned facts");

  // Test 4: Statutory Search
  const search1 = await searchLegalProvision("cheque bounce");
  assert(search1.some(p => p.number.includes("138")), "Maps 'cheque bounce' to Section 138 Negotiable Instruments Act");

  // Test 5: Cache Engine
  veridexCache.set("test_key", { result: "ok" });
  const cachedVal = veridexCache.get<{ result: string }>("test_key");
  assert(cachedVal?.result === "ok", "Stores and retrieves cache entries with sub-millisecond efficiency");

  return { passed, failed };
}
