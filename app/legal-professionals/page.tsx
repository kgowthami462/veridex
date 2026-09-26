"use client";

import React, { useState } from "react";
import { demoLegalProfessionals } from "@/lib/demo-data";
import { LegalProfessional } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, ShieldAlert, ExternalLink, MapPin, Building, Filter, Scale, CheckCircle2, X } from "lucide-react";

export default function LegalProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string>("All");
  const [selectedCourt, setSelectedCourt] = useState<string>("All");
  const [activeModalProf, setActiveModalProf] = useState<LegalProfessional | null>(null);

  const practiceAreas = [
    "All",
    "Constitutional Law",
    "Criminal & Civil Litigation",
    "Corporate & Commercial Law",
    "Employment & Civil Litigation",
    "Family & Human Rights Law",
    "Arbitration & Dispute Resolution"
  ];

  const courts = [
    "All",
    "Supreme Court of India",
    "Delhi High Court",
    "Bombay High Court",
    "High Court of Karnataka",
    "Madras High Court"
  ];

  const filteredProfessionals = demoLegalProfessionals.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedPracticeArea === "All" || prof.practiceArea === selectedPracticeArea;
    const matchesCourt = selectedCourt === "All" || prof.court.includes(selectedCourt);

    return matchesSearch && matchesArea && matchesCourt;
  });

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-6xl">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0B132B] mb-3 flex items-center justify-center gap-3">
          <UserCheck className="h-8 w-8 text-[#C5A059]" /> Legal Expertise Discovery
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Discover publicly documented legal advocates, arbitrators, and practitioners by practice domain and court jurisdiction to help prepare for your legal consultations.
        </p>
      </div>

      {/* Mandatory Informational Disclaimer Notice */}
      <div className="mb-8 p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-start gap-3 shadow-sm">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Notice:</strong> VERIDEX does not endorse, rank, or represent the legal professionals listed. Profiles are compiled from public bar council directories for informational discovery purposes only.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by advocate name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
            />
          </div>

          {/* Practice Area Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedPracticeArea}
              onChange={(e) => setSelectedPracticeArea(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
            >
              {practiceAreas.map((area) => (
                <option key={area} value={area}>
                  {area === "All" ? "All Practice Areas" : area}
                </option>
              ))}
            </select>
          </div>

          {/* Court Jurisdiction Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
            >
              {courts.map((court) => (
                <option key={court} value={court}>
                  {court === "All" ? "All Courts / Jurisdictions" : court}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredProfessionals.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((prof) => (
            <Card key={prof.id} className="flex flex-col h-full hover:shadow-md transition-shadow border-slate-200">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge variant="outline" className="bg-white text-xs font-medium text-slate-700">
                    {prof.practiceArea}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-serif text-[#0B132B] font-bold">
                  {prof.name}
                </CardTitle>
                <div className="space-y-1 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>{prof.court}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{prof.jurisdiction}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {prof.description}
                </p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 truncate max-w-[130px]">{prof.sourceDirectory}</span>
                  <button
                    type="button"
                    onClick={() => setActiveModalProf(prof)}
                    className="inline-flex items-center gap-1 text-[#0B132B] hover:text-[#C5A059] font-semibold transition-colors bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border"
                  >
                    Public Profile <ExternalLink className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border p-8">
          <Filter className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 mb-1">No matching professionals found</h3>
          <p className="text-sm text-slate-500 mb-4">Try clearing your filters or changing search keywords.</p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedPracticeArea("All");
              setSelectedCourt("All");
            }}
            variant="outline"
            size="sm"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Public Profile Modal */}
      {activeModalProf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl border shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in duration-200">
            <div className="p-6 bg-[#0B132B] text-white flex justify-between items-start">
              <div>
                <Badge variant="outline" className="border-amber-400/50 text-amber-300 mb-2">
                  {activeModalProf.practiceArea}
                </Badge>
                <h3 className="font-serif text-2xl font-bold">{activeModalProf.name}</h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-[#C5A059]" /> {activeModalProf.court}
                </p>
              </div>
              <button
                onClick={() => setActiveModalProf(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Public Description</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border">
                  {activeModalProf.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border">
                  <span className="text-slate-400 block font-medium">Jurisdiction</span>
                  <strong className="text-slate-800">{activeModalProf.jurisdiction}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded border">
                  <span className="text-slate-400 block font-medium">Directory Source</span>
                  <strong className="text-slate-800">{activeModalProf.sourceDirectory}</strong>
                </div>
              </div>

              <div className="p-3 bg-amber-50 text-amber-900 rounded-lg text-xs border border-amber-200 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Profiles are sourced from public Bar Council records for informational discovery only. VERIDEX does not represent or endorse advocates.</span>
              </div>

              <div className="pt-2 flex justify-between items-center border-t">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(activeModalProf.name + " " + activeModalProf.court + " advocate directory")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0B132B] font-semibold hover:underline"
                >
                  Verify via External Search <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <Button onClick={() => setActiveModalProf(null)} variant="default" size="sm" className="bg-[#0B132B]">
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
