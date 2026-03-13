"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CompanyDataContext } from "./lib/store";
import type { CompanyData } from "./lib/types";
import { defaultCompanyData } from "./lib/types";
import FormEditor from "./components/FormEditor";
import ProfileRenderer from "./components/ProfileRenderer";

const STORAGE_KEY = "company-profile-data";
const ZOOM_STEPS = [0.35, 0.5, 0.65, 0.8, 1.0];
const DEFAULT_ZOOM_INDEX = 1; // 50%

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
  const [zoomIdx, setZoomIdx] = useState(DEFAULT_ZOOM_INDEX);
  const previewRef = useRef<HTMLDivElement>(null);

  const zoom = ZOOM_STEPS[zoomIdx];

  useEffect(() => {
    setData(loadSavedData());
    setHydrated(true);
  }, []);

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
          <div className="max-w-[1800px] mx-auto px-4 h-11 flex items-center justify-between">
            <h1 className="text-xs font-bold text-slate-700 tracking-wide">会社紹介資料ジェネレーター</h1>
            <div className="flex items-center gap-1.5">
              {/* Zoom controls */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md">
                <button
                  onClick={() => setZoomIdx(Math.max(0, zoomIdx - 1))}
                  disabled={zoomIdx === 0}
                  className="text-xs text-slate-500 hover:text-slate-800 w-6 h-6 flex items-center justify-center disabled:opacity-30"
                  aria-label="縮小"
                >−</button>
                <span className="text-[10px] text-slate-500 font-mono w-8 text-center border-x border-slate-200">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoomIdx(Math.min(ZOOM_STEPS.length - 1, zoomIdx + 1))}
                  disabled={zoomIdx === ZOOM_STEPS.length - 1}
                  className="text-xs text-slate-500 hover:text-slate-800 w-6 h-6 flex items-center justify-center disabled:opacity-30"
                  aria-label="拡大"
                >+</button>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-md hover:bg-slate-100 transition"
              >
                {showForm ? "フォームを隠す" : "フォーム表示"}
              </button>
              <button
                onClick={handleReset}
                className="text-[11px] font-medium text-red-400 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition"
              >
                リセット
              </button>
              <button
                onClick={handlePrint}
                className="bg-slate-800 text-white text-[11px] font-semibold px-3.5 py-1 rounded-md hover:bg-slate-900 transition"
              >
                PDF出力
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex">
          {/* Left: Form Editor */}
          {showForm && (
            <aside className="no-print w-[360px] flex-shrink-0 bg-white border-r border-slate-200 h-[calc(100vh-44px)] sticky top-11 overflow-hidden">
              <FormEditor />
            </aside>
          )}

          {/* Right: Preview */}
          <main className="flex-1 py-4" ref={previewRef}>
            <div className="preview-zoom" style={{ zoom }}>
              <ProfileRenderer data={data} />
            </div>
          </main>
        </div>
      </div>
    </CompanyDataContext.Provider>
  );
}
