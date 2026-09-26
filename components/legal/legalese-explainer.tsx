"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, AlertCircle, Scale, Lightbulb, ChevronRight } from "lucide-react";
import { useDebounce } from "@/lib/hooks";

export interface LegalTerm {
  term: string;
  category: "Contract Law" | "Employment Law" | "Statutory Rights" | "Dispute Resolution" | "IP & Privacy";
  simpleMeaning: string;
  practicalRisk: string;
  statutoryReference?: string;
  exampleScenario: string;
}

export const LEGAL_GLOSSARY: LegalTerm[] = [
  {
    term: "Restraint of Trade / Non-Compete",
    category: "Contract Law",
    simpleMeaning: "A clause requiring an employee or party not to work for a competitor or start a competing business for a specific time.",
    practicalRisk: "Under Section 27 of the Indian Contract Act, 1872, post-employment non-compete clauses are generally void and unenforceable in India.",
    statutoryReference: "Section 27, Indian Contract Act, 1872",
    exampleScenario: "An employer requires a software engineer not to work at any competitor in India for 2 years after resigning. Under Indian law, this post-employment restriction is unenforceable."
  },
  {
    term: "Indemnity / Indemnification",
    category: "Contract Law",
    simpleMeaning: "A promise by one party to pay for financial losses or legal expenses suffered by the other party due to specific events or breaches.",
    practicalRisk: "Unlimited indemnity clauses can create severe personal financial liabilities for claims or lawsuits beyond your control.",
    statutoryReference: "Section 124, Indian Contract Act, 1872",
    exampleScenario: "A contractor agrees to indemnify a client for any third-party copyright claims arising from delivered materials."
  },
  {
    term: "Notice Period in Lieu",
    category: "Employment Law",
    simpleMeaning: "Paying money equivalent to your base salary for the notice period instead of physically working through the notice duration.",
    practicalRisk: "Check if the agreement explicitly grants the employee the right to pay in lieu of notice, or if it is at the employer's sole discretion.",
    statutoryReference: "Section 25F, Industrial Disputes Act, 1947",
    exampleScenario: "An executive with a 90-day notice period requests immediate release by paying 3 months' salary to start a new job."
  },
  {
    term: "Cheque Dishonour / Bounce (Section 138)",
    category: "Statutory Rights",
    simpleMeaning: "When a written cheque is returned unpaid by the bank due to insufficient funds or account closure.",
    practicalRisk: "Section 138 is a criminal offense under Indian law carrying up to 2 years imprisonment or fine up to twice the cheque amount.",
    statutoryReference: "Section 138, Negotiable Instruments Act, 1881",
    exampleScenario: "A tenant gives a security cheque that bounces. The landlord issues a statutory 15-day notice before filing a legal complaint."
  },
  {
    term: "Right to Data Erasure & Privacy",
    category: "IP & Privacy",
    simpleMeaning: "The right of an individual to demand that a company delete their personal data once the business purpose is fulfilled.",
    practicalRisk: "Failure by a Data Fiduciary to protect data can lead to penalties up to ₹250 Crores under India's DPDP Act 2023.",
    statutoryReference: "Section 12, Digital Personal Data Protection (DPDP) Act, 2023",
    exampleScenario: "A user deletes their account on an app and requests complete removal of personal phone numbers and address records."
  },
  {
    term: "Severability Clause",
    category: "Contract Law",
    simpleMeaning: "A rule stating that if one clause in a contract is declared illegal by a court, the rest of the contract remains valid and enforceable.",
    practicalRisk: "Prevents the entire contract from collapsing if one minor clause is struck down.",
    statutoryReference: "Indian Contract Act, 1872",
    exampleScenario: "If a court strikes down an illegal non-compete clause, the rest of the employment agreement remains binding."
  },
  {
    term: "Exclusive Court Jurisdiction",
    category: "Dispute Resolution",
    simpleMeaning: "Specifies which exact city or state court has the legal authority to handle legal disputes between the parties.",
    practicalRisk: "If jurisdiction is set in a distant state (e.g. High Court of Delhi for a resident in Bangalore), litigating can become expensive and inconvenient.",
    statutoryReference: "Code of Civil Procedure, 1908 (Section 20)",
    exampleScenario: "An agreement designates 'Courts of Mumbai' as having exclusive jurisdiction, meaning any lawsuit must be filed in Mumbai."
  },
  {
    term: "Force Majeure",
    category: "Contract Law",
    simpleMeaning: "Unforeseeable external circumstances (natural disasters, wars, government bans) that excuse parties from performing their contractual duties.",
    practicalRisk: "Without an explicit Force Majeure clause, unexpected events may be treated as a breach of contract rather than an excused delay.",
    statutoryReference: "Section 56, Indian Contract Act, 1872",
    exampleScenario: "A factory cannot deliver goods on time due to severe floods, invoking the Force Majeure clause to avoid penalties."
  }
];

export function LegaleseExplainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const debouncedSearch = useDebounce(searchTerm, 200);

  const filteredTerms = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return LEGAL_GLOSSARY.filter((item) => {
      const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
      if (!categoryMatch) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.simpleMeaning.toLowerCase().includes(q) ||
        item.practicalRisk.toLowerCase().includes(q) ||
        (item.statutoryReference && item.statutoryReference.toLowerCase().includes(q))
      );
    });
  }, [debouncedSearch, selectedCategory]);

  return (
    <Card className="shadow-md border-slate-200 bg-white overflow-hidden">
      <CardHeader className="bg-[#0B132B] text-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
              AI Plain-Language Legal Access
            </span>
            <CardTitle className="font-serif text-2xl font-bold flex items-center gap-2 text-white">
              <BookOpen className="h-6 w-6 text-[#C5A059]" /> Legalese-to-Plain-English Explainer
            </CardTitle>
            <p className="text-slate-300 text-xs mt-1">
              Understand complex legal terms, practical risks, and statutory protections in plain language.
            </p>
          </div>
          <Badge className="bg-[#C5A059] text-black font-bold border-none px-3 py-1 shrink-0">
            Citizen Legal Access
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search legal terms (e.g. Non-compete, Indemnity, Section 138, Jurisdiction)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Contract Law", "Employment Law", "Statutory Rights", "Dispute Resolution", "IP & Privacy"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    selectedCategory === cat
                      ? "bg-[#0B132B] text-white border-[#0B132B]"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Term Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item, idx) => (
              <TermCard key={idx} termItem={item} />
            ))
          ) : (
            <div className="md:col-span-2 p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-500 text-sm">
              No legal terms found matching &quot;{debouncedSearch}&quot;. Try searching for terms like <strong>Indemnity</strong>, <strong>Non-compete</strong>, or <strong>Jurisdiction</strong>.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const TermCard = React.memo(function TermCard({ termItem }: { termItem: LegalTerm }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <Badge variant="outline" className="bg-white text-slate-700 text-[10px] uppercase font-bold">
            {termItem.category}
          </Badge>
          {termItem.statutoryReference && (
            <span className="text-[10px] font-mono bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-semibold">
              {termItem.statutoryReference}
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg font-bold text-[#0B132B]">{termItem.term}</h3>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <Lightbulb className="h-3 w-3 text-[#C5A059]" /> Plain Language Meaning
          </h4>
          <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-md border border-slate-100">
            {termItem.simpleMeaning}
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-red-500" /> Practical Risk Note
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed bg-red-50/60 p-3 rounded-md border border-red-100">
            {termItem.practicalRisk}
          </p>
        </div>

        {expanded && (
          <div className="pt-2 border-t border-slate-200 space-y-2 animate-fadeIn">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
              <Scale className="h-3 w-3 text-blue-600" /> Real-World Example
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-blue-50/50 p-3 rounded-md border border-blue-100 font-serif">
              &quot;{termItem.exampleScenario}&quot;
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-xs font-bold text-[#0B132B] hover:text-[#C5A059] flex items-center gap-1 self-start transition-colors focus:outline-none"
      >
        {expanded ? "Show Less" : "See Practical Scenario"} <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>
    </div>
  );
});
