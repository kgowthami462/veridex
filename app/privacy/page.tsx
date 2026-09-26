"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Trash2, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/providers/app-provider";

export default function PrivacyPage() {
  const router = useRouter();
  const { clearSavedItems, setActiveDocumentText, setActiveDocumentAnalysis } = useAppContext();

  const handleDeleteDocument = () => {
    if (window.confirm("Are you sure you want to delete the active document and reset session data?")) {
      clearSavedItems();
      setActiveDocumentText("");
      setActiveDocumentAnalysis(null);
      alert("Active document and session data permanently deleted from local memory.");
      router.push("/dashboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-3xl">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-[#0B132B] mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8 text-[#C5A059]" /> Privacy & Security
        </h1>
        <p className="text-slate-500">How Veridex handles your documents and information.</p>
      </div>

      <div className="space-y-6">
        
        <div className="prose prose-slate max-w-none">
          <h3>Document Processing</h3>
          <p>
            When using Veridex, your documents are processed to extract text and identify legal clauses. 
            In <strong>Demo Mode</strong>, no real document data is sent to external servers; the application uses 
            pre-loaded, deterministic information for demonstration purposes.
          </p>
          
          <h3>Data Retention</h3>
          <p>
            Veridex does not permanently store your documents. Once your session ends or you manually 
            delete a document, it is removed from the active context. We assume a zero-retention policy 
            for the MVP.
          </p>

          <div className="bg-slate-100 p-4 rounded-lg my-6 flex items-start gap-3">
            <Info className="h-5 w-5 text-slate-500 shrink-0 mt-1" />
            <p className="text-sm text-slate-700 m-0">
              <strong>MVP Notice:</strong> Please avoid uploading highly sensitive or real confidential information 
              while using the hackathon demonstration environment.
            </p>
          </div>
        </div>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Active Document</h3>
            <p className="text-sm text-red-700/80 mb-4">
              Instantly remove the currently uploaded document from Veridex&apos;s memory and reset your analysis state.
            </p>
            <Button onClick={handleDeleteDocument} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 gap-2">
              <Trash2 className="h-4 w-4" /> Delete Document
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
