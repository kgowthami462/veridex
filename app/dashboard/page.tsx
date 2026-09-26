"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, BookOpen, GitCompare, MessageSquare, Compass, FileText, ArrowRight, FileUp, AlertTriangle, UserCheck, HelpCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0B132B] mb-1">Dashboard</h1>
          <p className="text-slate-500">Welcome to Veridex. Start a new analysis or explore your recent documents.</p>
        </div>
        <Link href="/#how-it-works">
          <Button variant="outline" className="gap-2 text-sm border-slate-300 text-slate-700 hover:bg-slate-100">
            <HelpCircle className="h-4 w-4 text-[#C5A059]" /> How Veridex Works
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold text-[#1C2541] mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <ActionCard 
                href="/analyze" 
                icon={<FileUp className="h-5 w-5 text-indigo-600" />} 
                title="Start New Analysis" 
                description="Upload a document for Veridex X-Ray." 
              />
              <ActionCard 
                href="/analyze?demo=true" 
                icon={<FileSearch className="h-5 w-5 text-[#C5A059]" />} 
                title="Try Demo Document" 
                description="Explore with a sample employment agreement." 
                highlight
              />
              <ActionCard 
                href="/law-explorer" 
                icon={<BookOpen className="h-5 w-5 text-emerald-600" />} 
                title="Explore Indian Law" 
                description="Search and understand legal provisions." 
              />
              <ActionCard 
                href="/compare" 
                icon={<GitCompare className="h-5 w-5 text-blue-600" />} 
                title="Compare Documents" 
                description="See differences between two versions." 
              />
              <ActionCard 
                href="/situation" 
                icon={<Compass className="h-5 w-5 text-amber-600" />} 
                title="Situation Guide" 
                description="Organize a real-world legal situation." 
              />
              <ActionCard 
                href="/legal-professionals" 
                icon={<UserCheck className="h-5 w-5 text-teal-600" />} 
                title="Legal Professionals" 
                description="Discover public advocates & legal expertise." 
              />
              <ActionCard 
                href="/lawyer-prep" 
                icon={<FileText className="h-5 w-5 text-purple-600" />} 
                title="Prepare for Lawyer" 
                description="Generate your consultation brief." 
              />
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg border bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <FileText className="h-8 w-8 text-slate-400 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[#0B132B] truncate group-hover:text-[#C5A059] transition-colors">Executive Employment Agreement</p>
                  <p className="text-xs text-slate-500 mb-2">Analyzed just now • Demo Document</p>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">12 clauses identified</span>
                    <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">5 items deserve review</span>
                  </div>
                </div>
              </div>
              <Link href="/analyze?demo=true" className="w-full">
                <Button variant="outline" className="w-full text-sm">View Analysis</Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

function ActionCard({ href, icon, title, description, highlight = false }: { href: string, icon: React.ReactNode, title: string, description: string, highlight?: boolean }) {
  return (
    <Link href={href} className="block">
      <div className={`p-4 rounded-xl border transition-all hover:shadow-md h-full flex flex-col ${highlight ? 'bg-[#F8F9FA] border-[#C5A059]/30 hover:border-[#C5A059]' : 'bg-white hover:border-[#0B132B]/20'}`}>
        <div className="flex items-start gap-3 mb-2">
          <div className="p-2 bg-white rounded-lg border shadow-sm shrink-0">
            {icon}
          </div>
          <div className="flex-1 mt-1">
            <h3 className="font-semibold text-[#0B132B] text-sm group-hover:text-black flex items-center justify-between">
              {title}
              <ArrowRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mt-auto ml-11">{description}</p>
      </div>
    </Link>
  )
}
