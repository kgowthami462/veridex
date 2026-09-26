"use client";

import React, { useState } from "react";
import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Printer, Download, Copy, Trash2, FileSearch, MessageSquare, BookOpen, CheckCircle2, ShieldAlert, Layers, CheckSquare, Clock } from "lucide-react";
import { Clause, LegalProvision } from "@/lib/types";

export default function LawyerPrepPage() {
  const { savedItems, removeSavedItem } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [coreIssue, setCoreIssue] = useState("Executive Employment Contract Review & Enforceability of Non-Compete / Notice Period Terms");
  const [sessionId] = useState(() => `VRX-${Math.floor(100000 + Math.random() * 900000)}`);
  const [formattedDate] = useState(() => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));

  const clauses = savedItems.filter(i => i.type === "clause");
  const questions = savedItems.filter(i => i.type === "question");
  const provisions = savedItems.filter(i => i.type === "provision");
  const differences = savedItems.filter(i => i.type === "difference");

  // Sample document metadata for consultation context
  const docInfo = {
    title: "Executive Employment Agreement",
    parties: "Acme Corp Pvt Ltd (Company) & Rahul Sharma (Executive)",
    effectiveDate: "October 1, 2026",
    term: "3 years, auto-renewing",
    noticePeriod: "90 days written notice",
    monetaryValue: "₹45,00,000 per annum + 20% discretionary performance bonus"
  };

  const timelineEvents = [
    { date: "Oct 1, 2026", event: "Employment Agreement executed between Acme Corp and Executive." },
    { date: "Sep 15, 2026", event: "Veridex X-Ray analysis identified 12-month post-employment non-compete clause." },
    { date: "Sep 20, 2026", event: "Revised draft received extending notice period from 60 days to 90 days." },
    { date: "Current", event: "Legal consultation brief prepared for legal counsel review." }
  ];

  const documentChecklist = [
    "Original Signed Employment Agreement / Drafts",
    "Company Offer Letter and Compensation Addendum",
    "Written Email Communications / Revision History",
    "Bank Deposit Statements for Bonus/Salary Credit",
    "Identity & Registration Records of Employer"
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyBrief = () => {
    let text = `VERIDEX — LEGAL CONSULTATION BRIEF\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n\n`;
    text += `1. CORE ISSUE & CONTEXT:\n${coreIssue}\n\n`;
    text += `2. DOCUMENT INFORMATION:\n`;
    text += `Title: ${docInfo.title}\nParties: ${docInfo.parties}\nEffective Date: ${docInfo.effectiveDate}\nNotice Period: ${docInfo.noticePeriod}\n\n`;
    
    text += `3. KEY CLAUSES FOR REVIEW (${clauses.length}):\n`;
    clauses.forEach((item, idx) => {
      try {
        const c = JSON.parse(item.content);
        text += `${idx + 1}. ${c.title || item.referenceTitle}\n   Excerpt: "${c.excerpt || ''}"\n   Impact: ${c.whyItMatters || ''}\n\n`;
      } catch {
        text += `${idx + 1}. ${item.referenceTitle}\n`;
      }
    });

    text += `4. QUESTIONS FOR COUNSEL (${questions.length}):\n`;
    questions.forEach((item, idx) => {
      try {
        const q = JSON.parse(item.content);
        text += `${idx + 1}. ${q.question || item.content}\n`;
      } catch {
        text += `${idx + 1}. ${item.referenceTitle}\n`;
      }
    });

    text += `\n5. STATUTORY LEGAL PROVISIONS (${provisions.length}):\n`;
    provisions.forEach((item, idx) => {
      try {
        const p = JSON.parse(item.content);
        text += `${idx + 1}. ${p.name} — ${p.act}\n   Explanation: ${p.simpleExplanation}\n`;
      } catch {
        text += `${idx + 1}. ${item.referenceTitle}\n`;
      }
    });

    text += `\nDISCLAIMER:\nThis brief was generated using Veridex for legal information and document preparation purposes. It does not replace advice from a qualified legal professional.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-5xl print:max-w-none print:px-0 print:py-0">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0B132B] mb-1 flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#C5A059]" /> Veridex Consultation Brief
          </h1>
          <p className="text-slate-500 text-sm">Organize your saved clauses, questions, legal provisions, and timeline for your lawyer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleCopyBrief} variant="outline" size="sm" className="gap-1.5">
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-slate-600" />}
            {copied ? "Copied to Clipboard" : "Copy Brief"}
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm" className="gap-1.5">
            <Printer className="h-4 w-4 text-slate-600" /> Print
          </Button>
          <Button onClick={handlePrint} size="sm" className="gap-1.5 bg-[#0B132B] hover:bg-[#1C2541] text-white">
            <Download className="h-4 w-4" /> Save / Download PDF
          </Button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-white border rounded-xl shadow-md overflow-hidden print:border-none print:shadow-none print:rounded-none">
        
        {/* Printable Header */}
        <div className="p-8 border-b bg-slate-900 text-white print:bg-white print:text-[#0B132B] print:border-b-2 print:border-[#0B132B] print:p-0 print:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#C5A059] block mb-1">VERIDEX</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">LEGAL CONSULTATION BRIEF</h2>
              <p className="text-xs text-slate-300 print:text-slate-500 mt-1">Prepared for Legal Professional Review & Consultation</p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-300 print:text-slate-600 space-y-0.5">
              <p><strong>Date:</strong> {formattedDate}</p>
              <p><strong>Session ID:</strong> {sessionId}</p>
              <p><strong>Items Attached:</strong> {savedItems.length} Saved Entries</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10 print:p-0 print:space-y-8">
          
          {/* Section 1: Core Issue / Context */}
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#0B132B] border-b pb-2 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#C5A059] print:hidden" /> 1. Core Issue / Context Summary
            </h3>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 print:bg-white print:border-slate-300">
              <textarea
                value={coreIssue}
                onChange={(e) => setCoreIssue(e.target.value)}
                className="w-full text-sm text-slate-800 bg-transparent border-none focus:outline-none resize-none leading-relaxed print:hidden font-medium"
                rows={2}
              />
              <p className="hidden print:block text-sm text-slate-800 font-medium">{coreIssue}</p>
            </div>
          </section>

          {/* Section 2: Document Information */}
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#0B132B] border-b pb-2 flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-[#C5A059] print:hidden" /> 2. Relevant Document Metadata
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs md:text-sm">
              <div className="p-3 bg-slate-50 rounded-md border print:border-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Document Title</span>
                <span className="font-semibold text-slate-800">{docInfo.title}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border print:border-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Parties Involved</span>
                <span className="font-semibold text-slate-800">{docInfo.parties}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border print:border-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Effective Date</span>
                <span className="font-semibold text-slate-800">{docInfo.effectiveDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border print:border-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Agreement Term</span>
                <span className="font-semibold text-slate-800">{docInfo.term}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border print:border-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Notice Period</span>
                <span className="font-semibold text-slate-800">{docInfo.noticePeriod}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border print:border-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Monetary Terms</span>
                <span className="font-semibold text-slate-800">{docInfo.monetaryValue}</span>
              </div>
            </div>
          </section>

          {/* Section 3: Key Clauses Identified for Review */}
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#0B132B] border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#C5A059] print:hidden" /> 3. Key Clauses Identified for Review ({clauses.length})
              </span>
              <span className="text-xs text-slate-400 font-sans font-normal print:hidden">X-Ray Analysis</span>
            </h3>

            {clauses.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-dashed text-slate-500 text-xs text-center print:hidden">
                No custom clauses saved. Save clauses from X-Ray to include them here.
              </div>
            ) : (
              <div className="space-y-3">
                {clauses.map((item) => {
                  let c: Clause;
                  try {
                    c = JSON.parse(item.content);
                  } catch {
                    c = { id: item.id, title: item.referenceTitle, category: "General", excerpt: item.content, explanation: "", attentionLevel: "review", whyItMatters: item.content, questions: [] };
                  }
                  return (
                    <div key={item.id} className="group relative p-4 rounded-lg border bg-slate-50/50 print:bg-white print:border-slate-300">
                      <Button
                        onClick={() => removeSavedItem(item.id)}
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 print:hidden"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] uppercase bg-white">{c.category || 'Clause'}</Badge>
                        <span className="font-bold text-sm text-[#0B132B]">{c.title || item.referenceTitle}</span>
                      </div>
                      {c.excerpt && <p className="text-xs font-serif italic text-slate-700 my-2 border-l-2 border-[#C5A059] pl-3 py-0.5">&quot;{c.excerpt}&quot;</p>}
                      <p className="text-xs text-slate-700"><strong>Legal Significance:</strong> {c.whyItMatters || c.explanation}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section 4: Questions for Counsel */}
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#0B132B] border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#C5A059] print:hidden" /> 4. Questions for Counsel ({questions.length})
              </span>
            </h3>

            {questions.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-dashed text-slate-500 text-xs text-center print:hidden">
                No saved questions. Save questions from Ask page to populate this section.
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((item, idx) => {
                  let qaText = item.content;
                  try {
                    const qa = JSON.parse(item.content);
                    qaText = qa.question || qa.answer || item.content;
                  } catch {}
                  return (
                    <div key={item.id} className="group relative p-3 bg-slate-50 rounded-md border flex items-start justify-between gap-3 print:bg-white print:border-slate-300">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[#C5A059]">{idx + 1}.</span>
                        <p className="text-xs md:text-sm text-slate-800 font-medium">{qaText}</p>
                      </div>
                      <Button
                        onClick={() => removeSavedItem(item.id)}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 shrink-0 print:hidden"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section 5: Relevant Legal Provisions */}
          {provisions.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0B132B] border-b pb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#C5A059] print:hidden" /> 5. Relevant Statutory Provisions ({provisions.length})
              </h3>
              <div className="space-y-3">
                {provisions.map((item) => {
                  let p: LegalProvision;
                  try {
                    p = JSON.parse(item.content);
                  } catch {
                    p = { id: item.id, name: item.referenceTitle, number: "", act: "Indian Law", status: "Current", sourceText: item.content, simpleExplanation: item.content, essentialElements: [] };
                  }
                  return (
                    <div key={item.id} className="group relative p-4 rounded-lg border bg-slate-50/50 print:bg-white print:border-slate-300">
                      <Button
                        onClick={() => removeSavedItem(item.id)}
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 print:hidden"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <h4 className="font-bold text-sm text-[#0B132B] mb-1">{p.name} ({p.act})</h4>
                      <p className="text-xs text-slate-700">{p.simpleExplanation}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section 6: Documents & Records Checklist */}
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#0B132B] border-b pb-2 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#C5A059] print:hidden" /> 6. Documents & Records Checklist
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {documentChecklist.map((doc, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded border text-xs text-slate-700 print:bg-white print:border-slate-300">
                  <div className="h-4 w-4 rounded border border-slate-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: Timeline of Events */}
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#0B132B] border-b pb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C5A059] print:hidden" /> 7. Timeline of Key Events
            </h3>
            <div className="space-y-2">
              {timelineEvents.map((e, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-50 rounded border text-xs print:bg-white print:border-slate-300">
                  <Badge variant="outline" className="bg-white text-[10px] shrink-0">{e.date}</Badge>
                  <span className="text-slate-700 font-medium">{e.event}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer Disclaimer */}
        <div className="bg-slate-100 p-6 text-center text-xs text-slate-500 border-t print:bg-transparent print:border-t-2 print:border-slate-800 print:mt-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldAlert className="h-4 w-4 text-slate-400" />
            <strong className="text-slate-700 font-medium">STATUTORY LEGAL DISCLAIMER</strong>
          </div>
          This brief was generated using Veridex for legal information and document preparation purposes. It is intended strictly to assist users in organizing information prior to a formal legal consultation. It does not provide legal representation or replace advice from a licensed advocate.
        </div>
      </div>
    </div>
  );
}
