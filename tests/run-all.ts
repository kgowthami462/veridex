import { runSecurityUnitTests } from "./unit/security.test";
import { runPdfExtractorUnitTests } from "./unit/pdf-extractor.test";
import { runServicesUnitTests } from "./unit/services.test";
import { run83PageContractIntegrationTest } from "./integration/83-page-contract.test";
import { runAIEvaluationSuite } from "./ai-evaluation/ai-eval-suite";

async function main() {
  const startTime = Date.now();

  console.log("\n==========================================================================");
  console.log("  VERIDEX COMPREHENSIVE AUTOMATED TEST SUITE & AI EVALUATION  ");
  console.log("==========================================================================");

  const secResults = await runSecurityUnitTests();
  const pdfResults = await runPdfExtractorUnitTests();
  const srvResults = await runServicesUnitTests();
  const intResults = await run83PageContractIntegrationTest();
  const aiResults = await runAIEvaluationSuite();

  const totalSoftwarePassed = secResults.passed + pdfResults.passed + srvResults.passed + intResults.passed;
  const totalSoftwareFailed = secResults.failed + pdfResults.failed + srvResults.failed + intResults.failed;
  const durationMs = Date.now() - startTime;

  console.log("==========================================================================");
  console.log("  SOFTWARE TEST RESULTS:");
  console.log(`    Total Tests: ${totalSoftwarePassed + totalSoftwareFailed}`);
  console.log(`    Passed:      \x1b[32m${totalSoftwarePassed}\x1b[0m`);
  console.log(`    Failed:      \x1b[31m${totalSoftwareFailed}\x1b[0m`);

  console.log("\n  AI EVALUATION RESULTS:");
  console.log(`    Total AI Test Cases: ${aiResults.totalTests}`);
  console.log(`    Passed:              \x1b[32m${aiResults.passCount}\x1b[0m`);
  console.log(`    Failed:              \x1b[31m${aiResults.failCount}\x1b[0m`);
  console.log(`    Measured AI Accuracy: \x1b[35m${aiResults.overallAccuracyPct}%\x1b[0m`);

  console.log(`\n  Execution Time: ${durationMs} ms`);
  console.log("==========================================================================\n");

  if (totalSoftwareFailed > 0 || aiResults.failCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
