# VERIDEX — See the Law Clearly ⚖️✨

> **Understand the law. Understand your document. Know what to ask next.**

VERIDEX is an AI-powered legal intelligence and consultation preparation platform designed to help individuals and business professionals understand complex legal documents, search Indian statutes in plain language, and prepare structured briefs for legal counsel.

---

## 🌟 Key Features

### 📄 1. Veridex X-Ray (Document Extraction & Analysis)
- **Grounded Document Parsing**: Supports uploading real PDF, DOCX, and TXT legal agreements (e.g. Employment Contracts, Leases, NDAs, Service Agreements).
- **Document Metadata**: Extracts actual parties, effective dates, agreement term, monetary terms/compensation, and termination notice requirements.
- **Clause Attention Levels**: Categorizes clauses by risk level (*High*, *Review*, *Medium*, *Informational*) with plain-language explanations and legal significance notes.

### ⚖️ 2. Veridex Law (Indian Statute Explorer)
- **Plain-Language Concept Search**: Search Indian legal concepts using natural language keywords (e.g. *"cheque bounce"*, *"right to privacy"*, *"non-compete restraint"*, *"retrenchment"*).
- **Verified Official Sources**: Links directly to official Indian legislation resources on [India Code](https://www.indiacode.nic.in) and Gazette notifications.

### 🔀 3. Veridex Compare (Document Comparison & Diff Engine)
- **Upload Comparison**: Upload two agreement versions to identify added, modified, or removed clauses.
- **Neutral Impact Analysis**: Classifies changes based on operational or legal impact (*Favorable*, *Neutral*, *Caution*).

### 💬 4. Veridex Ask (Document-Grounded QA)
- **Strict Citation Grounding**: Ask questions directly to your uploaded contract with exact page and clause citations.

### 🧭 5. Veridex Guide (Situation Structuring)
- **Fact Organization**: Describe real-world legal disputes in plain language to generate fact summaries, document checklists, and preliminary questions.

### 👨‍⚖️ 6. Legal Professionals Discovery
- **Verified Advocate Directory**: Browse verified Indian legal practitioners across practice areas (Supreme Court, High Courts, Corporate M&A, Family & Matrimonial Law).

### 📝 7. Veridex Prep (Consultation Brief Generator)
- **One-Click Export**: Aggregate saved clauses, questions, statutory provisions, and timeline events into a clean printable brief.
- **PDF & Clipboard Support**: Instant copy to clipboard and `@media print` clean PDF rendering with hidden UI chrome.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom Deep Navy (`#0B132B`) & Gold (`#C5A059`) legal typography theme
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Extraction**: [`pdfjs-dist`](https://mozilla.github.io/pdf.js/) browser-side client worker
- **AI Models**: Google Gemini 1.5 Flash API (Live Mode) + Deterministic Grounded Fallback Engine (Demo Mode)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed

### 2. Installation
```bash
git clone https://github.com/kgowthami462/veridex.git
cd veridex
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Live Gen AI Mode vs. Demo Mode

- **Demo Mode (Default)**: Out-of-the-box local document parsing and grounded demo data. No API key required.
- **Live Mode**: Enter your **Google Gemini API Key** under `/settings` to enable real-time generative AI document extraction and question answering.

---

## 🛡️ Disclaimer & Privacy

Veridex provides legal information and document assistance for educational purposes only. It does not provide legal representation or replace advice from a qualified legal professional.
