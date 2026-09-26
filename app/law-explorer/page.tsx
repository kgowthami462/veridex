"use client";

import React, { useState, useEffect } from "react";
import { searchLegalProvision } from "@/lib/services";
import { LegalProvision } from "@/lib/types";
import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Citation } from "@/components/legal/citation";
import { Search, Loader2, BookOpen, Scale, Plus, AlertCircle, ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";

export default function LawExplorerPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LegalProvision[] | null>(null);
  const { isDemoMode } = useAppContext();

  useEffect(() => {
    // Initial load of default provisions
    searchLegalProvision("").then(res => setResults(res));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchLegalProvision(query, isDemoMode);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = async (term: string) => {
    setQuery(term);
    setIsSearching(true);
    try {
      const res = await searchLegalProvision(term, isDemoMode);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-5xl">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4 border">
          <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
          {isDemoMode ? "DEMO MODE — Offline Curated Statutory Dataset" : "LIVE LAW SEARCH — Verifiable Indian Legal Source Access"}
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0B132B] mb-3 flex items-center justify-center gap-3">
          <Scale className="h-8 w-8 text-[#C5A059]" /> Veridex Law Explorer
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Search Indian statutory provisions, Acts, and Articles. Understand provisions in plain language with explicit separation between official source text and AI explanations.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
        <div className="relative flex items-center shadow-md rounded-xl">
          <Search className="absolute left-4 h-5 w-5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-12 pr-32 py-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent text-base md:text-lg"
            placeholder="Search e.g. Section 138 NI Act, Article 21, cheque bounce..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" disabled={isSearching} className="absolute right-2 top-2 bottom-2 bg-[#0B132B] hover:bg-[#1C2541]">
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search Law"}
          </Button>
        </div>

        {/* Quick searches */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
          <span className="font-medium text-slate-400">Popular Searches:</span>
          {[
            "Section 138 NI Act",
            "Article 21",
            "BNS 103",
            "cheque bounce",
            "right to privacy",
            "Section 27 Contract",
            "Section 35 Consumer"
          ].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleQuickSearch(term)}
              className="bg-white hover:bg-slate-100 text-slate-700 border rounded-full px-3 py-1 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </form>

      {/* Results Header */}
      {results && (
        <div className="mb-6 flex items-center justify-between text-sm text-slate-500 border-b pb-3">
          <span>Found <strong className="text-slate-800">{results.length}</strong> provision{results.length !== 1 ? 's' : ''} matching your search</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Source-First Verified UI
          </span>
        </div>
      )}

      {/* Empty State */}
      {results && results.length === 0 && (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Source verification required.</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-4">
            We couldn&apos;t verify this exact provision from our active legal source. Veridex adheres to strict accuracy guidelines and will not fabricate legal citations.
          </p>
          <Button onClick={() => handleQuickSearch("Section 138 NI Act")} variant="outline" size="sm">
            Reset to Featured Provisions
          </Button>
        </div>
      )}

      {/* Provision Cards */}
      {results && results.length > 0 && (
        <div className="space-y-8">
          {results.map((provision) => (
            <ProvisionCard key={provision.id} provision={provision} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProvisionCard({ provision }: { provision: LegalProvision }) {
  const { addSavedItem } = useAppContext();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    addSavedItem({
      id: `prov-${provision.id}-${Date.now()}`,
      type: "provision",
      referenceTitle: `${provision.number} — ${provision.act}`,
      content: JSON.stringify(provision)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const getSourceUrl = () => {
    if (provision.act.includes("Negotiable")) return "https://www.indiacode.nic.in/handle/123456789/2189";
    if (provision.act.includes("Contract")) return "https://www.indiacode.nic.in/handle/123456789/2187";
    if (provision.act.includes("Constitution")) return "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcede7b007799/uploads/2024/05/2024050772.pdf";
    if (provision.act.includes("Bharatiya Nyaya")) return "https://www.mha.gov.in/sites/default/files/250883_english_01042024.pdf";
    if (provision.act.includes("Consumer")) return "https://egazette.gov.in/WriteReadData/2019/210422.pdf";
    return "https://www.indiacode.nic.in";
  };

  return (
    <Card className="overflow-hidden border-t-4 border-t-[#0B132B] shadow-md">
      <CardHeader className="bg-slate-50/70 pb-4 border-b flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-white font-medium">{provision.act}</Badge>
            <Badge variant="outline" className={provision.status === 'Current' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600'}>
              Status: {provision.status}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-[#0B132B] mb-1">{provision.name} ({provision.number})</CardTitle>
          <p className="text-xs text-slate-500 font-serif italic">Statutory Provision under Indian Law</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={getSourceUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            View Original Source <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
          <Button onClick={handleSave} variant="default" size="sm" className="bg-[#0B132B] hover:bg-[#1C2541] gap-1.5">
            {saved ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Plus className="h-4 w-4" />}
            {saved ? "Saved to Prep" : "Save Reference"}
          </Button>
        </div>
      </CardHeader>
      
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* SOURCE TEXT Column */}
        <div className="p-6 bg-slate-50/40">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#0B132B]" /> VERIFIED SOURCE TEXT
            </h4>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">STATUTE</span>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-inner font-serif text-slate-800 leading-relaxed text-sm mb-4">
            &quot;{provision.sourceText}&quot;
          </div>

          <div className="pt-2">
            <Citation source={provision.act} details={provision.number} verified={true} />
          </div>
        </div>

        {/* AI PLAIN LANGUAGE Column */}
        <div className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#C5A059]" /> PLAIN-LANGUAGE EXPLANATION
            </h4>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">EXPLANATION</span>
          </div>

          <p className="text-[#0B132B] font-medium text-sm md:text-base leading-relaxed mb-6 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
            {provision.simpleExplanation}
          </p>

          {provision.essentialElements && provision.essentialElements.length > 0 && (
            <div className="mb-5">
              <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Key Legal Elements</h5>
              <ul className="space-y-1.5">
                {provision.essentialElements.map((el, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-[#C5A059] font-bold">•</span>
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {provision.consequences && provision.consequences.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Legal Consequences</h5>
                <ul className="space-y-1">
                  {provision.consequences.map((el, i) => (
                    <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                      <span className="font-bold">•</span> {el}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {provision.relatedProvisions && provision.relatedProvisions.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Related Provisions</h5>
                <ul className="space-y-1">
                  {provision.relatedProvisions.map((el, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="font-bold text-slate-400">•</span> {el}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
