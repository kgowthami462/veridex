import { DocumentAnalysis, LegalProvision, ComparisonItem } from "./types";

export const demoDocumentAnalysis: DocumentAnalysis = {
  document: {
    id: "doc_demo_01",
    title: "Executive Employment Agreement",
    type: "Employment",
    parties: ["Acme Corp Pvt Ltd (Company)", "Rahul Sharma (Executive)"],
    approxLength: "14 pages",
    importantDates: ["Effective Date: October 1, 2026"],
    monetaryAmounts: ["Base Salary: ₹45,00,000 per annum", "Bonus target: 20% of base"],
    term: "3 years, auto-renewing",
    terminationSummary: "90 days notice without cause, immediate for cause.",
    majorObligations: ["Full-time dedication", "Non-compete for 12 months post-employment", "Assignment of IP"],
  },
  clauses: [
    {
      id: "c1",
      title: "Compensation & Bonus",
      category: "Compensation",
      excerpt: "The Executive shall be paid a Base Salary of ₹45,00,000 per annum, subject to applicable tax deductions. A performance bonus up to 20% of the Base Salary may be awarded at the sole discretion of the Board.",
      explanation: "You will earn a fixed salary of ₹45,00,000 per year. You might also get a bonus of up to 20%, but the company gets to decide entirely if they want to pay it.",
      attentionLevel: "review",
      whyItMatters: "The bonus is completely discretionary. The company is not legally obligated to pay it even if you hit performance targets.",
      questions: ["Is the bonus tied to specific metrics, or entirely at the Board's discretion?", "Can we establish clear performance metrics for the bonus?"],
      page: 2
    },
    {
      id: "c2",
      title: "Termination Without Cause",
      category: "Termination",
      excerpt: "Either party may terminate this Agreement at any time without cause by providing 90 days' written notice to the other party. The Company reserves the right to provide salary in lieu of notice.",
      explanation: "Either you or the company can end the employment for any reason by giving 90 days' notice. The company can also choose to pay you for 90 days and ask you to leave immediately.",
      attentionLevel: "informational",
      whyItMatters: "90 days is a standard notice period for executives, but it means you must plan a 3-month transition if you decide to leave.",
      questions: ["What happens to my unvested stock options during the notice period?"],
      page: 6
    },
    {
      id: "c3",
      title: "Post-Employment Non-Compete",
      category: "Non-compete",
      excerpt: "For a period of 12 months following termination, the Executive shall not directly or indirectly engage in, consult for, or be employed by any business competing with the Company within the territory of India.",
      explanation: "You cannot work for any competitor in India for 1 year after leaving the company.",
      attentionLevel: "high",
      whyItMatters: "Under Section 27 of the Indian Contract Act, post-employment non-compete clauses are generally considered void and unenforceable, though non-solicitation might be enforceable.",
      questions: ["Is this broad non-compete clause actually enforceable under Indian law?", "Can we narrow this to specific named competitors?"],
      page: 8
    },
    {
      id: "c4",
      title: "Intellectual Property Assignment",
      category: "Intellectual Property",
      excerpt: "All Intellectual Property created, developed, or conceived by the Executive during the term of employment, whether during working hours or otherwise, shall be the sole and exclusive property of the Company.",
      explanation: "The company owns everything you invent or create while you are employed there, even if you do it on your own time or weekends.",
      attentionLevel: "medium",
      whyItMatters: "This is very broad. It might claim ownership of personal side-projects you work on entirely in your own time using your own equipment.",
      questions: ["Can we add an exception for inventions created entirely on my own time without company resources?", "How do I declare my prior inventions?"],
      page: 5
    }
  ]
};

export const demoLegalProvisions: LegalProvision[] = [
  {
    id: "lp_1",
    name: "Section 27",
    number: "Section 27",
    act: "Indian Contract Act, 1872",
    status: "Current",
    sourceText: "Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void. Exception 1: Saving of agreement not to carry on business of which good-will is sold.",
    simpleExplanation: "You cannot legally force someone to stop working in their profession or running a business. Non-compete clauses post-employment are generally invalid under Indian law.",
    essentialElements: [
      "Restraint of a lawful profession, trade, or business",
      "Agreement is void to the extent of that restraint",
      "Does not apply to goodwill sale under specific limits"
    ],
    conditions: ["Applies during post-employment period in employment contracts"],
    consequences: ["The non-compete clause cannot be enforced in a court of law"],
    relatedProvisions: ["Section 28 (Agreements in restraint of legal proceedings)"]
  },
  {
    id: "lp_2",
    name: "Section 138",
    number: "Section 138",
    act: "Negotiable Instruments Act, 1881",
    status: "Current",
    sourceText: "Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money to another person from out of that account for the discharge, in whole or in part, of any debt or other liability, is returned by the bank unpaid...",
    simpleExplanation: "If you issue a cheque to pay off a valid debt and it bounces due to insufficient funds, it constitutes a criminal offense subject to legal notice and court action.",
    essentialElements: [
      "Cheque drawn for legally enforceable debt or liability",
      "Returned unpaid by bank due to insufficient funds or funds exceeding limits",
      "Statutory demand notice sent within 30 days of receiving bank bounce memo",
      "Drawer fails to pay within 15 days of receiving notice"
    ],
    consequences: ["Imprisonment up to 2 years", "Fine extending up to twice the cheque amount", "Or both"],
    relatedProvisions: ["Section 139 (Presumption in favor of holder)", "Section 141 (Offenses by companies)"]
  },
  {
    id: "lp_3",
    name: "Article 21",
    number: "Article 21",
    act: "Constitution of India, 1950",
    status: "Current",
    sourceText: "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
    simpleExplanation: "Guarantees the fundamental right to life, personal liberty, dignity, clean environment, and privacy (as upheld in K.S. Puttaswamy v. Union of India).",
    essentialElements: [
      "Protection applies to both citizens and non-citizens",
      "Encompasses right to privacy, right to clean environment, right to fair trial",
      "Any restriction must be just, fair, reasonable, and enacted by valid law"
    ],
    consequences: ["Violations can be challenged directly in the High Court (Art 226) or Supreme Court (Art 32)"],
    relatedProvisions: ["Article 19 (Freedom of speech and expression)", "Article 32 (Constitutional Remedies)"]
  },
  {
    id: "lp_4",
    name: "BNS Section 103",
    number: "Section 103",
    act: "Bharatiya Nyaya Sanhita, 2023 (formerly IPC Sec 302)",
    status: "Current",
    sourceText: "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Where a group of five or more persons acting in concert commits murder on the ground of race, caste, community, sex, place of birth, language, personal belief...",
    simpleExplanation: "Defines the punishment for murder under the new criminal codification (BNS), replacing IPC Section 302 with enhanced definitions including mob lynching provisions.",
    essentialElements: [
      "Intentional causation of death or bodily injury sufficient in normal course to cause death",
      "Culpable homicide amounting to murder under Section 101 BNS",
      "Specific statutory penalties for group hate crimes"
    ],
    consequences: ["Death penalty or Life Imprisonment", "Mandatory fine"],
    relatedProvisions: ["BNS Section 101 (Culpable Homicide)", "BNS Section 105 (Culpable Homicide Not Amounting to Murder)"]
  },
  {
    id: "lp_5",
    name: "Section 35",
    number: "Section 35",
    act: "Consumer Protection Act, 2019",
    status: "Current",
    sourceText: "A complaint in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided may be filed with a District Commission by a consumer...",
    simpleExplanation: "Empowers aggrieved consumers to file complaints against defective products, unfair trade practices, or deficient services before District Consumer Commissions.",
    essentialElements: [
      "Complainant must meet definition of a Consumer",
      "Alleges unfair trade practice, defective goods, or deficiency of service",
      "Pecuniary jurisdiction based on consideration paid"
    ],
    consequences: ["Replacement of goods", "Refund of price", "Compensation for damages and legal costs"],
    relatedProvisions: ["Section 2(7) (Definition of Consumer)", "Section 2(11) (Deficiency in service)"]
  },
  {
    id: "lp_6",
    name: "Section 25F",
    number: "Section 25F",
    act: "Industrial Disputes Act, 1947",
    status: "Current",
    sourceText: "No workman employed in any industry who has been in continuous service for not less than one year under an employer shall be retrenched by that employer until the workman has been given one month's notice in writing...",
    simpleExplanation: "Protects industrial workmen from arbitrary retrenchment, requiring 1 month notice or pay in lieu, plus 15 days compensation for every completed year of service.",
    essentialElements: [
      "Workman must have continuous service of 1+ year",
      "1 month notice or salary in lieu required",
      "Retrenchment compensation calculated at 15 days average pay per year"
    ],
    consequences: ["Retrenchment without compliance is illegal and void", "Entitles workman to reinstatement with back wages"],
    relatedProvisions: ["Section 25G (Procedure for retrenchment - last come, first go)", "Section 25H (Re-employment of retrenched workmen)"]
  }
];

export const demoLegalProfessionals = [
  {
    id: "prof_1",
    name: "Adv. Ananya Iyer (Delhi)",
    practiceArea: "Criminal & Civil Litigation",
    jurisdiction: "New Delhi",
    court: "Supreme Court of India & Delhi High Court",
    description: "Appears before the Supreme Court of India and Delhi High Court, focusing on high-stakes criminal defense, civil litigation, and sensitive matrimonial/custody disputes. 15+ years experience. Associated with CM Legal and Sidharth Associate setups.",
    sourceDirectory: "Bar Council of Delhi (BCD) & SCBA",
    profileUrl: "https://cmlegal.in/team/"
  },
  {
    id: "prof_2",
    name: "Adv. Ananya Iyer (Mumbai)",
    practiceArea: "Corporate & Commercial Law",
    jurisdiction: "Mumbai",
    court: "Bombay High Court & NCLT",
    description: "Specialized in corporate consultation, focusing on Mergers & Acquisitions (M&A), Intellectual Property (IP) licensing, and commercial agreements. 12+ years experience.",
    sourceDirectory: "CaseDekho Nationwide Directory",
    profileUrl: "https://www.casedekho.in/"
  },
  {
    id: "prof_3",
    name: "Dr. Rama Iyer",
    practiceArea: "Constitutional Law",
    jurisdiction: "Bengaluru & New Delhi",
    court: "Supreme Court of India & High Court of Karnataka",
    description: "Managing Partner at Ayana Legal with over 33+ years of extensive litigation experience handling high-profile public interest, commercial, and constitutional matters.",
    sourceDirectory: "Karnataka Bar Council & Ayana Legal",
    profileUrl: "https://ayanalegal.com/members/"
  },
  {
    id: "prof_4",
    name: "Adv. Harish Salve (Senior Advocate)",
    practiceArea: "Arbitration & Dispute Resolution",
    jurisdiction: "New Delhi & International",
    court: "Supreme Court of India & Arbitral Tribunals",
    description: "Former Solicitor General of India specializing in international commercial arbitration, constitutional disputes, and high-stakes corporate litigation.",
    sourceDirectory: "Supreme Court Bar Association (SCBA)",
    profileUrl: "https://www.scba.org.in/"
  },
  {
    id: "prof_5",
    name: "Adv. Pinky Anand (Senior Advocate)",
    practiceArea: "Employment & Civil Litigation",
    jurisdiction: "New Delhi",
    court: "Supreme Court of India & Delhi High Court",
    description: "Senior Advocate and former Additional Solicitor General of India, leading landmark constitutional litigation, environmental law, and civil rights cases.",
    sourceDirectory: "Supreme Court Bar Association (SCBA)",
    profileUrl: "https://www.scba.org.in/"
  },
  {
    id: "prof_6",
    name: "Adv. Flavia Agnes",
    practiceArea: "Family & Human Rights Law",
    jurisdiction: "Mumbai",
    court: "Bombay High Court & Family Courts",
    description: "Renowned legal advocate, scholar, and co-founder of Majlis Legal Centre, specializing in family law, matrimonial property, and gender rights.",
    sourceDirectory: "Bar Council of Maharashtra & Goa",
    profileUrl: "https://majlislaw.com/"
  }
];

export const demoComparison: ComparisonItem[] = [
  {
    topic: "Notice Period",
    documentA: "60 days",
    documentB: "90 days",
    status: "Changed",
    whyItMatters: "You are now locked in for an extra month before you can transition to a new role. The company also has to pay you for an extra month if they let you go without cause.",
    questions: ["Am I comfortable with a 3-month transition period if I resign?"]
  },
  {
    topic: "Severance Pay",
    documentA: "None specified",
    documentB: "3 months base salary",
    status: "Added",
    whyItMatters: "This provides a financial safety net if the company terminates you without cause. This is a favorable addition.",
    questions: ["Under what specific conditions of termination is the severance pay forfeited?"]
  },
  {
    topic: "Governing Law",
    documentA: "Courts of Mumbai",
    documentB: "Courts of Mumbai",
    status: "Unchanged",
  }
];

export const demoQAResponses: Record<string, string> = {
  "notice period": "According to **Clause 6.1 (Termination Without Cause)** on Page 6, either party can terminate the agreement by providing **90 days' written notice**.",
  "resign before one year": "I couldn't find specific penalties for resigning before one year in the provided document, other than the standard requirement to serve the 90 days' notice period.",
  "who owns the work": "According to **Clause 5.1 (Intellectual Property Assignment)** on Page 5, all intellectual property created by you during the term of employment is the sole and exclusive property of the Company.",
  "default": "I couldn't find this information in the provided document."
};

