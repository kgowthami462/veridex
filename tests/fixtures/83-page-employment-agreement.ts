/**
 * Fixture for 83-Page Executive Employment Agreement
 * Generates an 83-page legal agreement with structured text and page markers.
 */

export function generate83PageEmploymentAgreement(): {
  fileName: string;
  fullText: string;
  pageCount: number;
  pages: { pageNum: number; text: string }[];
} {
  const pages: { pageNum: number; text: string }[] = [];
  let fullText = "%PDF-1.7\n";

  // Page 1: Title, Preamble, and Parties
  const p1 = `EXECUTED EXECUTIVE EMPLOYMENT AGREEMENT

THIS EXECUTIVE EMPLOYMENT AGREEMENT (the "Agreement") is entered into on January 15, 2026 (the "Effective Date"), BY AND BETWEEN:

1. VERIDEX TECHNOLOGIES PRIVATE LIMITED, a corporation organized under the Companies Act, 2013, having its registered office at Cyber City, Sector 24, Gurugram, Haryana 122002 (hereinafter referred to as the "Company" or "Employer");

AND

2. MR. RAJESH KUMAR SHARMA, residing at Villa 42, Palm Meadows, Whitefield, Bengaluru, Karnataka 560066 (hereinafter referred to as the "Executive" or "Employee").

RECITALS:
WHEREAS, the Company desires to employ the Executive as Executive Vice President & Chief Technology Officer, and the Executive desires to accept such employment under the terms and conditions set forth herein.`;

  pages.push({ pageNum: 1, text: p1 });
  fullText += ` [Page 1] ` + p1;

  // Page 2: Position, Term, and Remuneration
  const p2 = `SECTION 1: POSITION, DUTIES, AND TERM OF EMPLOYMENT

1.1 Position: The Executive shall serve as Executive Vice President & Chief Technology Officer of the Company.
1.2 Term: The term of employment shall commence on February 1, 2026, and shall continue for a fixed period of 3 years unless terminated earlier in accordance with Section 6.
1.3 Compensation & Base Salary: The Company shall pay the Executive a base salary of ₹1,20,00,000 (One Crore Twenty Lakh Rupees) per annum, payable in monthly installments in arrears.
1.4 Annual Performance Bonus: The Executive shall be eligible for an annual discretionary performance bonus of up to ₹40,00,000 (Forty Lakh Rupees) subject to board KPI evaluation.`;

  pages.push({ pageNum: 2, text: p2 });
  fullText += ` [Page 2] ` + p2;

  // Page 3: Confidentiality & Proprietary Information
  const p3 = `SECTION 2: CONFIDENTIALITY AND NON-DISCLOSURE

2.1 Confidential Information: The Executive acknowledges that during employment, the Executive will have access to non-public proprietary business trade secrets, customer algorithms, source code, and strategic operational plans.
2.2 Non-Disclosure Obligation: The Executive agrees not to disclose, publish, or utilize any Confidential Information at any time during or after employment without express written approval from the Board of Directors.`;

  pages.push({ pageNum: 3, text: p3 });
  fullText += ` [Page 3] ` + p3;

  // Page 4: Intellectual Property & Inventions Assignment
  const p4 = `SECTION 3: INTELLECTUAL PROPERTY RIGHTS ASSIGNMENT

3.1 Works for Hire: All inventions, computer code, artificial intelligence architectures, patents, software algorithms, and technical documentation created by the Executive during the course of employment shall belong exclusively to Veridex Technologies Private Limited.
3.2 Assignment: The Executive hereby irrevocably assigns to the Company all right, title, and interest in and to all Intellectual Property created or developed during the term of engagement.`;

  pages.push({ pageNum: 4, text: p4 });
  fullText += ` [Page 4] ` + p4;

  // Page 5: Post-Employment Non-Compete & Non-Solicitation Restraint
  const p5 = `SECTION 4: RESTRAINT OF TRADE AND NON-SOLICITATION

4.1 Post-Employment Non-Compete: For a period of 12 months following the termination of employment, the Executive shall not engage in or advise any competitive enterprise operating in India.
Note: Parties recognize Section 27 of the Indian Contract Act, 1872 regarding post-employment restraints.
4.2 Non-Solicitation of Employees & Clients: The Executive agrees not to solicit, entice, or hire any current employees, consultants, or enterprise clients of the Company for a period of 24 months post-termination.`;

  pages.push({ pageNum: 5, text: p5 });
  fullText += ` [Page 5] ` + p5;

  // Page 6: Termination & Notice Period Requirements
  const p6 = `SECTION 5: TERMINATION AND NOTICE PERIOD

5.1 Termination for Convenience: Either party may terminate this Agreement by providing 90 days prior written notice to the other party, or by payment of 90 days base salary in lieu of notice.
5.2 Termination for Cause: The Company may terminate employment immediately without notice or severance in the event of gross misconduct, fraud, material breach, or felony conviction.`;

  pages.push({ pageNum: 6, text: p6 });
  fullText += ` [Page 6] ` + p6;

  // Page 7: Governing Law & Court Jurisdiction
  const p7 = `SECTION 6: GOVERNING LAW AND DISPUTE RESOLUTION

6.1 Governing Law: This Agreement shall be governed by and construed in accordance with the laws of the Republic of India.
6.2 Jurisdiction: Any disputes, controversies, or legal claims arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the Courts of Delhi / High Court of Delhi.`;

  pages.push({ pageNum: 7, text: p7 });
  fullText += ` [Page 7] ` + p7;

  // Pages 8 through 82: Operational Schedules, Technology Specifications, and Governance Protocols
  for (let i = 8; i <= 82; i++) {
    const text = `SCHEDULE ${i - 7}: DETAILED OPERATIONAL & TECHNICAL SPECIFICATIONS (PAGE ${i} OF 83)

Section ${i}.1: Operational Protocol ${i} for Artificial Intelligence Infrastructure & Security Standards.
The Executive shall oversee technological compliance, multi-region cloud deployment protocols, data privacy governance, and API rate limits as set out in Schedule ${i - 7}.
All operations conducted under Section ${i} must comply with ISO 27001 certification guidelines and Indian Digital Personal Data Protection (DPDP) Act, 2023.`;
    pages.push({ pageNum: i, text });
    fullText += ` [Page ${i}] ` + text;
  }

  // Page 83: Execution Signatures & Annexures
  const p83 = `PAGE 83 OF 83: EXECUTION AND SIGNATURE BLOCK

IN WITNESS WHEREOF, the parties hereto have executed this Executive Employment Agreement as of the Effective Date written above.

VERIDEX TECHNOLOGIES PRIVATE LIMITED
By: ____________________________________
Name: Vikramaditya Singh
Title: Managing Director & Chairman

EXECUTIVE
By: ____________________________________
Name: Rajesh Kumar Sharma
Title: Executive Vice President & Chief Technology Officer`;

  pages.push({ pageNum: 83, text: p83 });
  fullText += ` [Page 83] ` + p83;

  return {
    fileName: "Executive_Employment_Agreement_83_Pages.pdf",
    fullText: fullText.trim(),
    pageCount: 83,
    pages
  };
}
