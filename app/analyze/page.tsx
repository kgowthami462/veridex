"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { analyzeDocument } from "@/lib/services";
import { extractTextFromDocument } from "@/lib/pdf-extractor";
import { DocumentAnalysis, Clause } from "@/lib/types";
import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUp, Loader2, AlertCircle, ChevronDown, ChevronUp, Plus, MessageSquare, BookOpen, CheckCircle2, ShieldAlert, FileText, Check } from "lucide-react";
import { Citation } from "@/components/legal/citation";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const { apiKey, setActiveDocumentText, setActiveDocumentAnalysis } = useAppContext();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [processStep, setProcessStep] = useState(1);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);

  const handleAnalyze = React.useCallback(async (file: File | null) => {
    setIsAnalyzing(true);
    setProcessStep(1);

    // Step Progress simulation
    const stepInterval = setInterval(() => {
      setProcessStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 350);

    try {
      if (file) {
        const extracted = await extractTextFromDocument(file);
        if (extracted.fullText) {
          setActiveDocumentText(extracted.fullText);
        }
      } else {
        setActiveDocumentText("");
      }

      const result = await analyzeDocument(file, apiKey);
      clearInterval(stepInterval);
      setProcessStep(5);
      
      setAnalysis(result);
      setActiveDocumentAnalysis(result);
    } catch (e) {
      console.error(e);
      clearInterval(stepInterval);
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, setActiveDocumentAnalysis, setActiveDocumentText]);

  useEffect(() => {
    if (isDemo) {
      const timer = setTimeout(() => {
        handleAnalyze(null);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isDemo, handleAnalyze]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleAnalyze(selectedFile);
    }
  };

  if (isAnalyzing) {
    const steps = [
      "Uploading document...",
      "Extracting text & page structures...",
      "Identifying clauses & obligations...",
      "Calculating attention items & citations...",
      "Building X-Ray Analysis..."
    ];

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F8F9FA] px-4">
        <Card className="max-w-md w-full p-8 shadow-md border-slate-200 text-center space-y-6">
          <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Loader2 className="h-8 w-8 text-[#C5A059] animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#0B132B] mb-1">Veridex X-Ray</h2>
            <p className="text-slate-500 text-xs">Document-Grounded Gen AI Analysis</p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3 text-left border-t pt-4">
            {steps.map((stepLabel, idx) => {
              const stepNum = idx + 1;
              const isDone = processStep > stepNum;
              const isCurrent = processStep === stepNum;
              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 transition-colors ${
                    isDone ? "bg-green-600 text-white" : isCurrent ? "bg-[#0B132B] text-white animate-pulse" : "bg-slate-200 text-slate-500"
                  }`}>
                    {isDone ? <Check className="h-3 w-3" /> : stepNum}
                  </div>
                  <span className={`font-medium ${isCurrent ? "text-[#0B132B] font-bold" : isDone ? "text-slate-700" : "text-slate-400"}`}>
                    {stepLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0B132B] mb-2 flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-[#C5A059]" /> Veridex X-Ray
          </h1>
          <p className="text-slate-500">Upload any legal agreement (PDF/DOCX/TXT) to extract clauses, metadata, obligations, and attention items.</p>
        </div>
        
        <Card className="border-dashed border-2 border-slate-300 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <FileUp className="h-12 w-12 text-[#C5A059] mb-4" />
            <h3 className="font-semibold text-lg text-slate-800 mb-2">Upload your legal agreement</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md leading-relaxed">
              Supports text-readable PDF, DOCX, or TXT contracts up to 50MB. Text will be extracted directly from your file.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <input
                type="file"
                id="xray-file-input"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="xray-file-input" className="cursor-pointer">
                <Button type="button" onClick={() => document.getElementById("xray-file-input")?.click()} className="bg-[#0B132B] hover:bg-[#1C2541] text-white px-6">
                  Browse Files & Analyze
                </Button>
              </label>
              <Button onClick={() => handleAnalyze(null)} variant="outline" className="border-slate-300 bg-white hover:bg-slate-100">
                Try Demo Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle Extraction Error State
  if (analysis.error) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-3xl">
        <Card className="border-red-200 bg-red-50/50 shadow-md">
          <CardHeader className="border-b border-red-100 bg-red-100/50">
            <CardTitle className="text-red-900 flex items-center gap-2 text-xl font-serif">
              <ShieldAlert className="h-6 w-6 text-red-600" /> Document Text Extraction Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-red-800 leading-relaxed font-medium">
              {analysis.error}
            </p>
            <div className="p-4 bg-white rounded-lg border border-red-200 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-800">Why did this happen?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The PDF may contain scanned image pages without selectable OCR text.</li>
                <li>The file format might be password protected or corrupted.</li>
                <li>Veridex strictly enforces accuracy and will not fabricate demo content for real files.</li>
              </ul>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setAnalysis(null)} variant="outline" className="border-slate-300">
                Upload Different File
              </Button>
              <Button onClick={() => handleAnalyze(null)} className="bg-[#C5A059] text-black">
                Try Demo Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate dynamic radar from actual clauses
  const attentionCounts = {
    high: analysis.clauses.filter(c => c.attentionLevel === "high").length,
    medium: analysis.clauses.filter(c => c.attentionLevel === "medium").length,
    review: analysis.clauses.filter(c => c.attentionLevel === "review").length,
    info: analysis.clauses.filter(c => c.attentionLevel === "informational").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-1">Document X-Ray Analysis</span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#0B132B] mb-2">{analysis.document.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Badge variant="outline" className="bg-slate-100 text-slate-800 font-semibold">{analysis.document.type}</Badge>
            <span>{analysis.document.approxLength}</span>
            <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-medium">✓ Document Grounded</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setAnalysis(null)} className="shrink-0 border-slate-300">
          Upload New Document
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col - Dynamic Radar & Grounded Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/70 border-b pb-4">
              <CardTitle className="text-base font-bold text-[#0B132B]">Dynamic Attention Radar</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <RadarItem level="High Attention" count={attentionCounts.high} colorClass="bg-red-500" />
                <RadarItem level="Medium Attention" count={attentionCounts.medium} colorClass="bg-orange-500" />
                <RadarItem level="Review" count={attentionCounts.review} colorClass="bg-yellow-500" />
                <RadarItem level="Informational" count={attentionCounts.info} colorClass="bg-green-500" />
              </div>
              <div className="mt-6 p-3 bg-blue-50/80 text-blue-900 text-xs rounded-md flex items-start gap-2 border border-blue-100">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
                <p>Attention levels are calculated dynamically from extracted clause severity. They are not legal risk scores.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/70 border-b pb-4">
              <CardTitle className="text-base font-bold text-[#0B132B]">Extracted Document Metadata</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-xs md:text-sm">
              <OverviewRow label="Parties" values={analysis.document.parties} />
              <OverviewRow label="Important Dates" values={analysis.document.importantDates} />
              <OverviewRow label="Duration / Term" values={[analysis.document.term]} />
              <OverviewRow label="Monetary Amounts" values={analysis.document.monetaryAmounts} />
              <OverviewRow label="Termination Terms" values={[analysis.document.terminationSummary]} />
              <OverviewRow label="Major Obligations" values={analysis.document.majorObligations} />
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Grounded Clauses with Source Citations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Extracted Clauses ({analysis.clauses.length})</h2>
            <span className="text-xs text-slate-400 font-mono">Page & Excerpt Citations</span>
          </div>

          {analysis.clauses.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border text-center text-slate-500 text-sm">
              No specific clause headings were identified in the document text.
            </div>
          ) : (
            analysis.clauses.map((clause) => (
              <ClauseItem key={clause.id} clause={clause} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RadarItem({ level, count, colorClass }: { level: string, count: number, colorClass: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${colorClass}`} />
        <span className="text-xs font-semibold text-slate-700">{level}</span>
      </div>
      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border">{count}</span>
    </div>
  );
}

function OverviewRow({ label, values }: { label: string, values: string[] }) {
  if (!values.length) return null;
  return (
    <div className="border-b pb-3 last:border-none last:pb-0">
      <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">{label}</h4>
      <ul className="space-y-1">
        {values.map((v, i) => (
          <li key={i} className={`font-medium text-xs leading-relaxed ${v.includes("Not found") ? "text-slate-400 italic" : "text-slate-800"}`}>{v}</li>
        ))}
      </ul>
    </div>
  );
}

function ClauseItem({ clause }: { clause: Clause }) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addSavedItem } = useAppContext();
  const router = useRouter();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    addSavedItem({
      id: clause.id,
      type: "clause",
      referenceTitle: clause.title,
      content: JSON.stringify(clause)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAsk = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/ask?q=What does the ${clause.title.toLowerCase()} clause require?`);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md border-l-4 shadow-sm" style={{
      borderLeftColor: 
        clause.attentionLevel === 'high' ? '#EF4444' : 
        clause.attentionLevel === 'medium' ? '#F97316' : 
        clause.attentionLevel === 'review' ? '#EAB308' : '#22C55E'
    }}>
      <div 
        className="p-5 cursor-pointer flex items-start justify-between gap-4 bg-white"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant={clause.attentionLevel}>{clause.attentionLevel.toUpperCase()}</Badge>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{clause.category}</span>
            {clause.page && (
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                Page {clause.page}
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg font-bold text-[#0B132B]">{clause.title}</h3>
          {!expanded && (
            <p className="text-slate-600 text-xs md:text-sm line-clamp-2 mt-1.5 leading-relaxed font-serif italic border-l-2 border-slate-200 pl-2">
              &quot;{clause.excerpt}&quot;
            </p>
          )}
        </div>
        <div className="mt-1 bg-slate-50 p-1.5 rounded-md text-slate-400 border shrink-0">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>
      
      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t bg-slate-50/40">
          <div className="mt-5 space-y-6">
            
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-[#C5A059]" /> Plain-Language Explanation
              </h4>
              <p className="text-[#0B132B] font-medium text-sm md:text-base leading-relaxed bg-white p-4 rounded-lg border shadow-sm">
                {clause.explanation}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Legal Significance</h4>
                <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-100">
                  <p className="text-slate-800 text-xs leading-relaxed font-medium">{clause.whyItMatters}</p>
                </div>
              </div>
              
              {clause.questions && clause.questions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Questions for Counsel</h4>
                  <ul className="space-y-1.5">
                    {clause.questions.map((q, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-[#C5A059] font-bold">•</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Extracted Source Text</h4>
              <div className="bg-white p-4 rounded-lg text-xs md:text-sm text-slate-800 font-serif leading-relaxed border shadow-inner">
                &quot;{clause.excerpt}&quot;
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <Citation source={`${clause.title}`} details={`Page ${clause.page || 1}`} verified={true} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
              <Button onClick={handleAsk} variant="outline" size="sm" className="gap-2 text-xs">
                <MessageSquare className="h-3.5 w-3.5" /> Ask about this clause
              </Button>
              <Button onClick={handleSave} variant="secondary" size="sm" className="gap-2 bg-[#1C2541] hover:bg-[#0B132B] text-xs">
                {saved ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Plus className="h-3.5 w-3.5" />}
                {saved ? "Saved to Prep" : "Add to Lawyer Prep"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-[#C5A059]" />
        <p className="text-sm font-medium">Loading Veridex X-Ray...</p>
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  );
}
