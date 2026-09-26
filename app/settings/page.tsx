"use client";

import React, { useState } from "react";
import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, RefreshCw, AlertTriangle, Key, CheckCircle2, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { isDemoMode, setDemoMode, apiKey, setApiKey, clearSavedItems } = useAppContext();
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempKey.trim());
    if (tempKey.trim()) {
      setDemoMode(false); // Automatically activate Live API mode when key is configured
    }
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleClearSession = () => {
    if (window.confirm("Are you sure you want to clear your current session? This will remove all saved items from Lawyer Prep.")) {
      clearSavedItems();
      alert("Session cleared.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-3xl">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-[#0B132B] mb-2 flex items-center gap-3">
          <Settings className="h-8 w-8 text-[#C5A059]" /> Settings & AI Configuration
        </h1>
        <p className="text-slate-500">Configure application mode, API credentials, and manage session data.</p>
      </div>

      <div className="space-y-6">
        
        {/* Application Mode Selection */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg">Application Execution Mode</CardTitle>
            <CardDescription>Choose how Veridex processes legal information and queries.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#0B132B]">Demo Mode (Offline / Hackathon)</p>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border">DETERMINISTIC</span>
                </div>
                <p className="text-xs text-slate-500">Uses curated, verified statutory offline datasets without making external API calls.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isDemoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0B132B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B132B]"></div>
              </label>
            </div>

            {!isDemoMode && (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-lg text-xs flex items-start gap-3 border border-emerald-200">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <strong className="font-semibold">Live Gen AI Mode Active:</strong> Queries will be processed in real-time. {apiKey ? "Using configured custom API credentials." : "Enter your API Key below to enable live responses."}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Credentials Configuration */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5 text-[#C5A059]" /> Gen AI API Key Credentials
                </CardTitle>
                <CardDescription className="mt-1">Add your Google Gemini API Key for live AI generation.</CardDescription>
              </div>
              {apiKey && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                  <ShieldCheck className="h-3.5 w-3.5" /> Key Configured
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Google Gemini API Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showKey ? "text" : "password"}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-4 pr-24 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B132B] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Button type="submit" size="sm" className="absolute right-1.5 bg-[#0B132B] hover:bg-[#1C2541]">
                    {savedFeedback ? "Saved!" : "Save Key"}
                  </Button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Your key is stored securely in your local browser session and never sent to external servers other than official AI endpoints.
                </p>
              </div>

              {savedFeedback && (
                <div className="p-3 bg-green-50 text-green-800 rounded-md text-xs flex items-center gap-2 border border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> API Key saved successfully. Live AI mode is enabled.
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Data Controls */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg">Data Controls & Privacy</CardTitle>
            <CardDescription>Manage session data and saved brief items.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between p-4 border rounded-lg border-red-100 bg-red-50/50">
              <div>
                <p className="font-semibold text-red-900 text-sm">Clear Session Data</p>
                <p className="text-xs text-red-700/80 mt-0.5">Removes all saved clauses, questions, legal provisions, and resets your brief.</p>
              </div>
              <Button onClick={handleClearSession} variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 gap-1.5 shrink-0">
                <RefreshCw className="h-3.5 w-3.5" /> Clear Session
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
