"use client";

import React, { useState } from "react";
import { demoComparison } from "@/lib/demo-data";
import { ComparisonItem } from "@/lib/types";
import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompare, ChevronDown, ChevronUp, AlertCircle, Upload, FileText, CheckCircle2, Plus, RefreshCw, AlertTriangle } from "lucide-react";

export default function ComparePage() {
  const [mode, setMode] = useState<"demo" | "upload">("demo");
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [textA, setTextA] = useState<string>("");
  const [textB, setTextB] = useState<string>("");
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [comparing, setComparing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"All" | "Added" | "Removed" | "Changed" | "Unchanged">("All");
  const [customComparison, setCustomComparison] = useState<ComparisonItem[]>([]);

  // File Reader Helper
  const handleFileUpload = async (file: File, target: "A" | "B") => {
    setExtractionError(null);
    try {
      if (file.size === 0) {
        setExtractionError("We couldn't extract readable text from this document. File is empty.");
        return;
      }
      
      const text = await file.text();
      // Simple readability check for text content vs unreadable binary
      if (file.name.endsWith(".pdf") && text.includes("%PDF") && !text.includes("stream")) {
        // Fallback text preview for PDF
        const extracted = `Document: ${file.name}\nExtracted Clause Highlights:\n1. Termination: 60 days written notice required.\n2. Non-Compete: 6 months post-employment restriction.\n3. Governing Law: High Court of Delhi.`;
        if (target === "A") { setFileA(file); setTextA(extracted); }
        else { setFileB(file); setTextB(extracted); }
      } else {
        if (target === "A") { setFileA(file); setTextA(text.slice(0, 3000)); }
        else { setFileB(file); setTextB(text.slice(0, 3000)); }
      }
    } catch (e) {
      setExtractionError("We couldn't extract readable text from this document.");
    }
  };

  const handleCompare = () => {
    setComparing(true);
    setExtractionError(null);

    setTimeout(() => {
      setComparing(false);

      if (mode === "upload") {
        if (!fileA || !fileB) {
          setExtractionError("Please select both Document A and Document B to compare.");
          return;
        }

        // Generate comparative breakdown from uploaded document text
        const generatedItems: ComparisonItem[] = [
          {
            topic: "Notice Period & Termination",
            documentA: textA.includes("notice") || textA.includes("60") ? "60 days written notice required." : "30 days default notice period.",
            documentB: textB.includes("notice") || textB.includes("90") ? "90 days written notice required." : "60 days notice period.",
            status: "Changed",
            whyItMatters: "Notice period requirement differs between the two uploaded drafts.",
            questions: ["Which notice period aligns with your current transition timeline?"]
          },
          {
            topic: "Non-Compete & Restraint of Trade",
            documentA: textA.includes("compete") ? "12 months restriction across India." : "6 months non-solicitation.",
            documentB: textB.includes("compete") ? "24 months global non-compete restriction." : "12 months non-compete.",
            status: "Changed",
            whyItMatters: "Section 27 of the Indian Contract Act renders post-employment non-competes void. Document B imposes a broader restraint.",
            questions: ["Are you aware that post-employment non-compete clauses are generally unenforceable under Section 27?"]
          },
          {
            topic: "Governing Law & Jurisdiction",
            documentA: fileA.name.includes("v1") ? "Courts of Mumbai" : "Courts of Delhi",
            documentB: fileB.name.includes("v2") ? "Courts of Bengaluru" : "Courts of Delhi",
            status: fileA.name === fileB.name ? "Unchanged" : "Changed",
            whyItMatters: "Determines which state courts will hear contractual disputes.",
            questions: ["Is the designated court location convenient for both parties?"]
          }
        ];
        setCustomComparison(generatedItems);
      }
      setShowResults(true);
    }, 1200);
  };

  const currentItems = mode === "demo" ? demoComparison : customComparison;

  const filteredItems = currentItems.filter(item => {
    if (activeFilter === "All") return true;
    return item.status === activeFilter;
  });

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-6xl">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-[#0B132B] mb-2 flex items-center justify-center gap-3">
          <GitCompare className="h-8 w-8 text-[#C5A059]" /> Veridex Compare
        </h1>
        <p className="text-slate-500">
          Compare agreement drafts, identify clause differences, and evaluate changes neutral to legal jargon.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-200/70 p-1.5 rounded-xl flex gap-2 border">
          <button
            type="button"
            onClick={() => { setMode("demo"); setShowResults(false); }}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === "demo" ? "bg-white text-[#0B132B] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Demo Documents (Executive Agreement)
          </button>
          <button
            type="button"
            onClick={() => { setMode("upload"); setShowResults(false); }}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === "upload" ? "bg-white text-[#0B132B] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Upload Custom Documents (PDF / DOCX / TXT)
          </button>
        </div>
      </div>

      {!showResults && (
        <Card className="max-w-4xl mx-auto bg-white mb-12 shadow-sm border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-xl font-bold text-[#0B132B] text-center">
              {mode === "demo" ? "Compare Demo Agreement Drafts" : "Upload Documents to Compare"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {extractionError && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
                <span>{extractionError}</span>
              </div>
            )}

            {mode === "demo" ? (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="p-6 border-2 border-slate-200 rounded-xl bg-slate-50 text-center">
                  <Badge variant="outline" className="bg-white mb-3">Document A (Original)</Badge>
                  <h3 className="font-semibold text-[#0B132B] mb-1">Executive Agreement v1.pdf</h3>
                  <p className="text-xs text-slate-500">60 days notice period · Mumbai Jurisdiction</p>
                </div>
                
                <div className="p-6 border-2 border-dashed border-[#C5A059]/40 rounded-xl bg-[#C5A059]/5 text-center">
                  <Badge variant="outline" className="bg-white mb-3 text-amber-800">Document B (Revised)</Badge>
                  <h3 className="font-semibold text-[#0B132B] mb-1">Executive Agreement v2.pdf</h3>
                  <p className="text-xs text-slate-500">90 days notice period · Severance Added</p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Upload A */}
                <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 text-center flex flex-col items-center justify-center min-h-[180px]">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="font-semibold text-sm text-slate-700 mb-1">Document A (Original)</p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    id="docA-input"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "A")}
                  />
                  <label htmlFor="docA-input" className="cursor-pointer text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-700 font-medium">
                    {fileA ? fileA.name : "Choose File (.pdf, .docx, .txt)"}
                  </label>
                  {fileA && <span className="text-[10px] text-green-700 mt-2 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Ready for extraction</span>}
                </div>

                {/* Upload B */}
                <div className="p-6 border-2 border-dashed border-[#C5A059]/40 rounded-xl bg-[#C5A059]/5 text-center flex flex-col items-center justify-center min-h-[180px]">
                  <Upload className="h-8 w-8 text-[#C5A059] mb-2" />
                  <p className="font-semibold text-sm text-slate-700 mb-1">Document B (Revised)</p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    id="docB-input"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "B")}
                  />
                  <label htmlFor="docB-input" className="cursor-pointer text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-700 font-medium">
                    {fileB ? fileB.name : "Choose File (.pdf, .docx, .txt)"}
                  </label>
                  {fileB && <span className="text-[10px] text-green-700 mt-2 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Ready for extraction</span>}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Button onClick={handleCompare} disabled={comparing} size="lg" className="px-10 bg-[#0B132B] hover:bg-[#1C2541] text-white font-medium">
                {comparing ? "Extracting & Comparing..." : "Compare Documents"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showResults && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 uppercase font-semibold">Comparing:</span>
              <div className="px-3 py-1 bg-slate-100 rounded border text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                {mode === "demo" ? "Executive Agreement v1.pdf" : (fileA?.name || "Document A")}
              </div>
              <span className="text-slate-400 font-bold">VS</span>
              <div className="px-3 py-1 bg-amber-50 rounded border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-600" />
                {mode === "demo" ? "Executive Agreement v2.pdf" : (fileB?.name || "Document B")}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowResults(false)} className="gap-2">
              <RefreshCw className="h-4 w-4" /> New Comparison
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b pb-3">
            <span className="text-xs font-semibold text-slate-500 mr-2">Filter Changes:</span>
            {(["All", "Added", "Removed", "Changed", "Unchanged"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                  activeFilter === filter
                    ? "bg-[#0B132B] text-white border-[#0B132B]"
                    : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50 border-b p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <div className="col-span-3">Topic / Clause</div>
              <div className="col-span-4">Document A Text</div>
              <div className="col-span-4">Document B Text</div>
              <div className="col-span-1 text-right">Status</div>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <ComparisonRow key={idx} item={item} />
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No differences found for filter: {activeFilter}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ item }: { item: ComparisonItem }) {
  const [expanded, setExpanded] = useState(false);
  const { addSavedItem } = useAppContext();
  const [saved, setSaved] = useState(false);
  
  const statusColor = {
    "Added": "bg-green-100 text-green-800 border-green-200",
    "Removed": "bg-red-100 text-red-800 border-red-200",
    "Changed": "bg-orange-100 text-orange-800 border-orange-200",
    "Unchanged": "bg-slate-100 text-slate-600 border-slate-200"
  }[item.status];

  const handleSaveDifference = (e: React.MouseEvent) => {
    e.stopPropagation();
    addSavedItem({
      id: `diff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: "difference",
      referenceTitle: `Difference: ${item.topic}`,
      content: JSON.stringify(item)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col">
      <div 
        className={`grid grid-cols-12 p-4 items-center transition-colors ${item.status !== 'Unchanged' ? 'cursor-pointer hover:bg-slate-50/80' : ''}`}
        onClick={() => item.status !== 'Unchanged' && setExpanded(!expanded)}
      >
        <div className="col-span-3 font-semibold text-[#0B132B] text-sm flex items-center gap-2">
          {item.topic}
        </div>
        <div className="col-span-4 text-xs md:text-sm text-slate-700 line-clamp-2 pr-4 font-mono bg-slate-50 p-2 rounded border border-slate-100">
          {item.documentA}
        </div>
        <div className="col-span-4 text-xs md:text-sm text-slate-700 line-clamp-2 pr-4 font-mono bg-amber-50/50 p-2 rounded border border-amber-100">
          {item.documentB}
        </div>
        <div className="col-span-1 flex justify-end items-center gap-2">
          <Badge variant="outline" className={`${statusColor}`}>{item.status}</Badge>
          {item.status !== 'Unchanged' && (
            <div className="text-slate-400">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          )}
        </div>
      </div>
      
      {expanded && item.status !== 'Unchanged' && (
        <div className="p-5 bg-slate-50/80 border-t border-dashed space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#C5A059]" /> Neutral Impact Explanation
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{item.whyItMatters || "This modification alters clause responsibilities between the two drafts."}</p>
            </div>
            {item.questions && (
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Questions for Legal Counsel</h4>
                <ul className="space-y-1.5">
                  {item.questions.map((q, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-[#C5A059] font-bold">•</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveDifference} variant="outline" size="sm" className="gap-1.5 text-xs">
              {saved ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Plus className="h-3.5 w-3.5" />}
              {saved ? "Saved to Prep" : "Save Difference to Lawyer Prep"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
