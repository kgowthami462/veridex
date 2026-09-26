"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SavedItem, DocumentAnalysis } from "@/lib/types";

interface AppContextType {
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  savedItems: SavedItem[];
  addSavedItem: (item: SavedItem) => void;
  removeSavedItem: (id: string) => void;
  clearSavedItems: () => void;
  activeDocumentText: string;
  setActiveDocumentText: (text: string) => void;
  activeDocumentAnalysis: DocumentAnalysis | null;
  setActiveDocumentAnalysis: (analysis: DocumentAnalysis | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for safe storage access (handles SecurityError when localStorage is blocked by browser policies/iframes)
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Access denied or disabled
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Access denied or disabled
    }
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setDemoMode] = useState<boolean>(() => {
    const storedDemo = safeStorage.getItem("veridex_demo_mode");
    return storedDemo !== null ? storedDemo === "true" : true;
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return safeStorage.getItem("veridex_api_key") || "";
  });
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    const stored = safeStorage.getItem("veridex_saved_items");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
    return [];
  });
  const [activeDocumentText, setActiveDocumentText] = useState<string>("");
  const [activeDocumentAnalysis, setActiveDocumentAnalysis] = useState<DocumentAnalysis | null>(null);

  // Save to local storage when state changes
  useEffect(() => {
    safeStorage.setItem("veridex_saved_items", JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    safeStorage.setItem("veridex_demo_mode", String(isDemoMode));
  }, [isDemoMode]);

  useEffect(() => {
    safeStorage.setItem("veridex_api_key", apiKey);
  }, [apiKey]);

  const addSavedItem = (item: SavedItem) => {
    setSavedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeSavedItem = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearSavedItems = () => {
    setSavedItems([]);
  };

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        setDemoMode,
        apiKey,
        setApiKey,
        savedItems,
        addSavedItem,
        removeSavedItem,
        clearSavedItems,
        activeDocumentText,
        setActiveDocumentText,
        activeDocumentAnalysis,
        setActiveDocumentAnalysis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

