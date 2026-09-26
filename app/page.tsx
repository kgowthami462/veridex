import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileSearch, GitCompare, MessageSquare, Compass, FileText, FileUp, Zap, CheckCircle2, Sparkles, ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative px-4 py-24 md:py-32 lg:py-36 bg-[#0B132B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-center items-center">
          {/* Abstract Scales of Justice Geometric Pattern */}
          <svg width="600" height="600" viewBox="0 0 100 100" className="w-[800px] h-[800px]">
            <path d="M50 10 L50 90 M20 40 L80 40 M20 40 L35 70 L5 70 Z M80 40 L95 70 L65 70 Z" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 border border-white/15 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#C5A059]" /> Powered by Veridex Gen AI Legal Engine
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            See the law clearly.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Understand the law. Understand your document. <br className="hidden md:block"/> Know what to ask next.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-none">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#C5A059] text-[#121212] hover:bg-[#d6b87d] border-none font-semibold text-lg px-8 py-6">
                  Try Demo Document
                </Button>
              </Link>
              <Link href="/law-explorer" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
                  Explore Indian Law
                </Button>
              </Link>
            </div>

            {/* Requested How It Works button directly below action buttons */}
            <a href="#how-it-works" className="mt-2">
              <Button size="md" variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 gap-2 font-medium text-sm rounded-full px-6 border border-white/15">
                How It Works <ArrowDown className="h-4 w-4 text-[#C5A059]" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0B132B] mb-4">Empowering Legal Understanding</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">VERIDEX structures complex legal information into plain language, helping you prepare before you consult a professional.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileSearch className="h-6 w-6 text-[#C5A059]" />}
              title="Veridex X-Ray"
              description="Understand your document. Analyze clauses, obligations, dates, payments, termination provisions, and areas deserving closer review."
            />
            <FeatureCard 
              icon={<Scale className="h-6 w-6 text-[#C5A059]" />}
              title="Veridex Law"
              description="Explore Indian legal information. Search provisions and understand them in simpler language with source references."
            />
            <FeatureCard 
              icon={<GitCompare className="h-6 w-6 text-[#C5A059]" />}
              title="Veridex Compare"
              description="See what changed. Compare agreements and identify meaningful differences without getting lost in legal jargon."
            />
            <FeatureCard 
              icon={<MessageSquare className="h-6 w-6 text-[#C5A059]" />}
              title="Veridex Ask"
              description="Ask your document. Ask questions and receive answers grounded in the provided document material."
            />
            <FeatureCard 
              icon={<Compass className="h-6 w-6 text-[#C5A059]" />}
              title="Veridex Guide"
              description="Organize your situation. Turn a real-world legal situation into structured information and documents to gather."
            />
            <FeatureCard 
              icon={<FileText className="h-6 w-6 text-[#C5A059]" />}
              title="Veridex Prep"
              description="Prepare for the conversation. Generate a structured consultation brief for a legal professional."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-[#F8F9FA] border-t border-slate-200 scroll-mt-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" /> End-to-End Workflow
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0B132B] mb-4">How Veridex Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">A simple four-step process to gain legal clarity and prepare for counsel.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard number="01" icon={<FileUp className="h-8 w-8 text-[#1C2541]" />} title="Upload / Search" description="Provide a document or search legal information." />
            <StepCard number="02" icon={<Zap className="h-8 w-8 text-[#1C2541]" />} title="Gen AI Analysis" description="VERIDEX Gen AI structures clauses and provisions into plain language." />
            <StepCard number="03" icon={<FileSearch className="h-8 w-8 text-[#1C2541]" />} title="Review & Identify" description="Inspect clauses, explanations, differences, and attention items." />
            <StepCard number="04" icon={<CheckCircle2 className="h-8 w-8 text-[#1C2541]" />} title="Prepare Brief" description="Generate questions and a consultation brief for a lawyer." />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-[#F8F9FA]">
      <CardHeader>
        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4 border">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-[#C5A059]/30 transition-colors">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 text-8xl font-serif font-bold text-slate-50 opacity-50 group-hover:text-[#C5A059]/5 transition-colors">
        {number}
      </div>
      <div className="h-16 w-16 rounded-full bg-[#F8F9FA] flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-[#0B132B] mb-3 relative z-10">{number} &mdash; {title}</h3>
      <p className="text-slate-500 relative z-10 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
