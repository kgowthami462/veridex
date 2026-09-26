export type AttentionLevel = "high" | "medium" | "review" | "informational";

export type Clause = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  explanation: string;
  attentionLevel: AttentionLevel;
  whyItMatters: string;
  questions: string[];
  page?: number;
};

export type DocumentMetadata = {
  id: string;
  title: string;
  type: string;
  parties: string[];
  approxLength: string;
  importantDates: string[];
  monetaryAmounts: string[];
  term: string;
  terminationSummary: string;
  majorObligations: string[];
};

export type DocumentAnalysis = {
  document: DocumentMetadata;
  clauses: Clause[];
  error?: string;
};

export type LegalProvision = {
  id: string;
  name: string;
  number: string;
  act: string;
  status: "Current" | "Repealed" | "Amended";
  sourceText: string;
  simpleExplanation: string;
  essentialElements: string[];
  conditions?: string[];
  consequences?: string[];
  relatedProvisions?: string[];
};

export type SavedItem = {
  id: string;
  type: "clause" | "question" | "provision" | "difference" | "situation";
  content: string; // JSON stringified data or plain text
  referenceTitle: string;
  sourceUrl?: string;
};

export type ComparisonItem = {
  topic: string;
  documentA: string;
  documentB: string;
  status: "Added" | "Removed" | "Changed" | "Unchanged";
  whyItMatters?: string;
  questions?: string[];
};

export type SituationSummary = {
  summary: string;
  relevantConcepts: string[];
  documentsToGather: string[];
  questionsToAsk: string[];
  possibleNextSteps: string[];
};

export type LegalProfessional = {
  id: string;
  name: string;
  practiceArea: string;
  jurisdiction: string;
  court: string;
  description: string;
  sourceDirectory: string;
  profileUrl: string;
};

