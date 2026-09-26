"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { answerDocumentQuestion } from "@/lib/services";
import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send, Bot, User, Plus, Loader2 } from "lucide-react";
import { Citation } from "@/components/legal/citation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
};

export default function AskPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const { apiKey, activeDocumentText, activeDocumentAnalysis } = useAppContext();
  
  const activeDocTitle = activeDocumentAnalysis?.document?.title || "Executive Employment Agreement";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello. I am ready to answer questions about ${activeDocTitle}. Every answer is strictly grounded in the extracted document material.`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleAsk = React.useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newMsg: Message = { id: userMsgId, role: "user", content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await answerDocumentQuestion(text, apiKey, activeDocumentText);
      const assistantMsgId = `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: "assistant",
        content: result.answer,
        source: result.source || activeDocTitle
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  }, [apiKey, activeDocumentText, activeDocTitle]);

  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      const timer = setTimeout(() => {
        handleAsk(initialQuery);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, messages.length, handleAsk]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(input);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-4xl h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#0B132B] mb-2 flex items-center justify-center gap-3">
          <MessageSquare className="h-8 w-8 text-[#C5A059]" /> Veridex Ask
        </h1>
        <p className="text-slate-500 text-sm">Ask questions about your uploaded document. Answers are strictly grounded in document text.</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm text-xs font-medium text-slate-700">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          Active Document: <strong className="text-slate-900">{activeDocTitle}</strong>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-md border-slate-200">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {isTyping && (
            <div className="flex items-start gap-4 mr-12">
              <div className="h-8 w-8 rounded-full bg-[#0B132B] flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center h-[44px]">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-50 border-t">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question (e.g., What is my notice period?)"
              className="w-full min-h-[60px] max-h-[120px] p-3 pr-12 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent resize-none shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={isTyping || !input.trim()}
              className="absolute right-2 bottom-2 h-10 w-10 rounded-lg p-0 bg-[#0B132B] hover:bg-[#1C2541]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-slate-400">Veridex answers are based solely on the provided document and do not constitute legal advice.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const { addSavedItem } = useAppContext();

  const handleSave = () => {
    addSavedItem({
      id: message.id,
      type: "question",
      referenceTitle: "Saved Q&A",
      content: JSON.stringify({ question: message.content, answer: message.content, source: message.source }) // Simplified for demo
    });
  }

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse ml-12' : 'mr-12'}`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-[#C5A059]' : 'bg-[#0B132B]'}`}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      
      <div className="flex flex-col gap-2 max-w-2xl">
        <div className={`rounded-2xl px-5 py-3.5 shadow-sm text-sm md:text-base leading-relaxed ${
          isUser 
            ? 'bg-[#C5A059] text-white rounded-tr-sm' 
            : 'bg-slate-100 text-slate-800 rounded-tl-sm'
        }`}>
          {message.content}
        </div>
        
        {!isUser && message.source && (
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Citation source="Document" details={message.source} />
            <Button onClick={handleSave} variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-[#0B132B]">
              <Plus className="h-3 w-3 mr-1" /> Save to Prep
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
