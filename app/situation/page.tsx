"use client";

import React, { useState } from "react";
import { analyzeSituation } from "@/lib/services";
import { SituationSummary } from "@/lib/types";
import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, FileText, CheckCircle2, FileQuestion, Loader2, AlertCircle, Plus } from "lucide-react";

export default function SituationPage() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SituationSummary | null>(null);
  const [saved, setSaved] = useState(false);
  const { addSavedItem } = useAppContext();

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeSituation(text);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadExample = () => {
    setText("I rented a house and vacated it last month. I left the house in good condition, but my landlord is refusing to return my security deposit of Rs 50,000, claiming vague cleaning charges.");
  };

  const handleSaveToPrep = () => {
    if (!result) return;
    addSavedItem({
      id: `sit-${Date.now()}`,
      type: "situation",
      referenceTitle: `Situation Summary: ${result.relevantConcepts[0] || 'Real-World Legal Guidance'}`,
      content: JSON.stringify(result)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-5xl">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#0B132B] mb-2 flex items-center justify-center gap-3">
          <Compass className="h-8 w-8 text-[#C5A059]" /> Veridex Guide
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Describe a real-world legal situation in your own words, and we&apos;ll help organize it into actionable steps.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-[#C5A059] shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Describe your situation</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="E.g., I rented a house and my landlord is refusing to return my deposit..."
                className="w-full h-48 p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent resize-none mb-4 text-sm"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !text.trim()} 
                  className="w-full bg-[#0B132B] hover:bg-[#1C2541]"
                >
                  {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Organizing...</> : "Organize Situation"}
                </Button>
                <Button onClick={loadExample} variant="outline" className="w-full sm:w-auto shrink-0">Load Example</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-none shadow-none">
            <CardContent className="p-6">
              <h3 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" /> Note on guidance
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Veridex Guide helps you organize facts and prepare for a consultation. It does not provide definitive legal advice or instruct you to pursue specific legal actions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {!result ? (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-50/50">
              <Compass className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-sm">Your structured guide will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-end">
                <Button onClick={handleSaveToPrep} variant="default" size="sm" className="bg-[#0B132B] hover:bg-[#1C2541] gap-1.5 text-xs">
                  {saved ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Plus className="h-3.5 w-3.5" />}
                  {saved ? "Saved to Lawyer Prep" : "Save Guide to Lawyer Prep"}
                </Button>
              </div>

              <Card className="shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b pb-3">
                  <CardTitle className="text-base text-[#0B132B]">1. What you told us</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-xs text-slate-600 italic">&quot;{result.summary}&quot;</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b pb-3">
                  <CardTitle className="text-base text-[#0B132B]">2. Documents to gather</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {result.documentsToGather.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b pb-3">
                  <CardTitle className="text-base text-[#0B132B]">3. Questions for a professional</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {result.questionsToAsk.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <FileQuestion className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-[#0B132B] shadow-sm">
                <CardHeader className="bg-[#0B132B] text-white pb-3">
                  <CardTitle className="text-base">4. Possible Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {result.possibleNextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-slate-700">
                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          {i + 1}
                        </div>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
