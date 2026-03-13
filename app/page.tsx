"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CompanyDataContext } from "./lib/store";
import type { CompanyData } from "./lib/types";
import { defaultCompanyData } from "./lib/types";
import FormEditor from "./components/FormEditor";
import ProfileRenderer from "./components/ProfileRenderer";

const STORAGE_KEY = "company-profile-data";

function loadSavedData(): CompanyData {
  if (typeof window === "undefined") return defaultCompanyData;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultCompanyData, ...JSON.parse(saved) };
  } catch {}
  return defaultCompanyData;
}

export default function Home() {
  const [data, setData] = useState<CompanyData>(defaultCompanyData);
  const [showForm, setShowForm] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setData(loadSavedData());
    setHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, hydrated]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("データをリセットしますか？この操作は取り消せません。")) {
      setData(defaultCompanyData);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <CompanyDataContext.Provider value={{ data, setData }}>
      <div className="min-h-screen bg-slate-100">
        {/* Header */}
        <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              </div>
              <h1 className="text-sm font-bold text-slate-800">会社紹介資料ジェネレーター</h1>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">認知科学ベース</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
              >
                リセット
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                {showForm ? "フォームを隠す" : "フォームを表示"}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                PDF ダウンロード
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex">
          {/* Left: Form Editor */}
          {showForm && (
            <aside className="no-print w-[380px] flex-shrink-0 bg-white border-r border-slate-200 h-[calc(100vh-56px)] sticky top-14 overflow-hidden">
              <FormEditor />
            </aside>
          )}

          {/* Right: Preview */}
          <main className="flex-1 py-8" ref={previewRef}>
            <div className="print:p-0">
              <ProfileRenderer data={data} />
            </div>
          </main>
        </div>

        {/* Footer info */}
        <div className="no-print text-center py-8 text-xs text-slate-400">
          認知負荷理論・ゲシュタルト原則・初頭効果/新近効果・フォン・レストルフ効果に基づくデザインサイエンスを適用
        </div>
      </div>
    </CompanyDataContext.Provider>
  );
}
