"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Home, Search, GitCompare, MessageSquare, Compass, FileText, Settings, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/components/providers/app-provider";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDemoMode, apiKey } = useAppContext();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "X-Ray", href: "/analyze", icon: FileText },
    { label: "Law", href: "/law-explorer", icon: Search },
    { label: "Compare", href: "/compare", icon: GitCompare },
    { label: "Ask", href: "/ask", icon: MessageSquare },
    { label: "Guide", href: "/situation", icon: Compass },
    { label: "Professionals", href: "/legal-professionals", icon: Scale },
    { label: "Prep", href: "/lawyer-prep", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 print:hidden">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Scale className="h-6 w-6 text-[#0B132B]" />
            <span className="font-serif text-xl font-bold tracking-tight text-[#0B132B]">VERIDEX</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-[#0B132B]",
                  pathname === item.href ? "text-[#0B132B] font-semibold" : "text-slate-500"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="ml-auto flex items-center gap-4">
            {isDemoMode ? (
              <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 border">
                DEMO MODE
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {apiKey ? "LIVE API MODE" : "LIVE MODE"}
              </span>
            )}
            <Link href="/settings" className="text-slate-500 hover:text-[#0B132B]">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-[#F8F9FA]">
        {children}
      </main>

      {/* Persistent Legal Disclaimer */}
      <footer className="border-t bg-white py-6 print:hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <ShieldAlert className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-500 leading-relaxed">
                <strong className="text-slate-700 font-medium">Veridex provides legal information and document assistance for educational purposes.</strong> It does not provide legal representation or replace advice from a qualified legal professional.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/settings" className="hover:underline">Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
