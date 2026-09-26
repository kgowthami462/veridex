"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Home, Search, GitCompare, MessageSquare, Compass, FileText, Settings, ShieldAlert, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/components/providers/app-provider";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDemoMode, apiKey } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "X-Ray", href: "/analyze", icon: FileText },
    { label: "Law Explorer", href: "/law-explorer", icon: Search },
    { label: "Compare", href: "/compare", icon: GitCompare },
    { label: "Ask QA", href: "/ask", icon: MessageSquare },
    { label: "Guide", href: "/situation", icon: Compass },
    { label: "Advocates", href: "/legal-professionals", icon: Scale },
    { label: "Prep Brief", href: "/lawyer-prep", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <header role="banner" className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 print:hidden">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6 justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B132B] rounded-md px-1 py-0.5">
              <Scale className="h-6 w-6 text-[#0B132B]" aria-hidden="true" />
              <span className="font-serif text-xl font-bold tracking-tight text-[#0B132B]">VERIDEX</span>
            </Link>
            
            <nav role="navigation" aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-[#0B132B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B132B] rounded-md px-2 py-1",
                    pathname === item.href ? "text-[#0B132B] font-bold border-b-2 border-[#0B132B]" : "text-slate-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            {isDemoMode ? (
              <span className="hidden sm:inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200" aria-label="Demo Mode Active">
                DEMO MODE
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200" aria-label="Live AI Mode Active">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
                {apiKey ? "LIVE GEMINI API" : "LIVE MODE"}
              </span>
            )}

            <Link
              href="/settings"
              aria-label="Application Settings"
              className="text-slate-600 hover:text-[#0B132B] p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B132B]"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden text-slate-700 p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B132B]"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav role="navigation" aria-label="Mobile Navigation" className="lg:hidden border-t bg-white px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md transition-colors",
                  pathname === item.href ? "bg-[#0B132B] text-white" : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content" role="main" className="flex-1 bg-[#F8F9FA]">
        {children}
      </main>

      {/* Persistent Legal Disclaimer */}
      <footer role="contentinfo" className="border-t bg-white py-6 print:hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-semibold">Veridex Legal Intelligence Disclaimer:</strong> Veridex provides AI-powered document analysis and statutory information for educational assistance. It does not constitute formal legal representation or advice from a licensed advocate.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <Link href="/privacy" className="hover:underline focus-visible:ring-1 focus-visible:ring-[#0B132B]">Privacy Policy</Link>
              <Link href="/settings" className="hover:underline focus-visible:ring-1 focus-visible:ring-[#0B132B]">Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
