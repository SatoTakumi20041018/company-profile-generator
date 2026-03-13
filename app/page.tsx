"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CompanyDataContext } from "./lib/store";
import type { CompanyData } from "./lib/types";
import { defaultCompanyData } from "./lib/types";
import FormEditor from "./components/FormEditor";
import ProfileRenderer from "./components/ProfileRenderer";

const STORAGE_KEY = "company-profile-data";
const STARTED_KEY = "company-profile-started";
const ZOOM_STEPS = [0.35, 0.5, 0.65, 0.8, 1.0];
const DEFAULT_ZOOM_INDEX = 1;

function loadSavedData(): CompanyData | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultCompanyData, ...JSON.parse(saved) };
  } catch {}
  return null;
}

function UploadScreen({ onComplete }: { onComplete: (data: CompanyData) => void }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");

  async function parseText(content: string, format: "text" | "html" = "text") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parse-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, format }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); return; }
      onComplete(json.data);
    } catch {
      setError("解析に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (!content) return;
      const isHtml = file.name.endsWith(".html") || file.name.endsWith(".htm");
      setText(content);
      parseText(content, isHtml ? "html" : "text");
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleUrl() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); setLoading(false); return; }
      // Use extracted info as base text and parse
      const fakeText = [
        json.name ? `会社名：${json.name}` : "",
        json.description ? `事業内容：${json.description}` : "",
        json.price ? `料金：${json.price}` : "",
      ].filter(Boolean).join("\n");
      if (fakeText) {
        await parseText(fakeText);
      } else {
        setError("URLから情報を抽出できませんでした");
        setLoading(false);
      }
    } catch {
      setError("URL取得に失敗しました");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">会社紹介資料ジェネレーター</h1>
          <p className="text-sm text-slate-500">ファイルやテキストから、プロフェッショナルな会社紹介資料を自動生成</p>
        </div>

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-6 ${
            dragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-3xl mb-3 text-slate-300">+</div>
          <div className="text-sm font-semibold text-slate-600 mb-1">
            ファイルをドラッグ＆ドロップ、またはクリックして選択
          </div>
          <div className="text-xs text-slate-400">
            .txt .md .html .csv 対応 — 会社概要、商品情報、事業説明など
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.text,.md,.html,.htm,.csv"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* URL Input */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="text-xs font-semibold text-slate-500 mb-2">URLから取得</div>
          <div className="flex gap-2">
            <input
              ref={urlRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleUrl(); }}
              placeholder="https://example.com/company"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              onClick={handleUrl}
              disabled={!url.trim() || loading}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition disabled:opacity-30"
            >
              取得
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="text-xs font-semibold text-slate-500 mb-2">テキストを直接入力</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
            placeholder={"会社名：株式会社○○\n代表者：山田太郎\n設立：2020年4月\n資本金：1,000万円\n従業員数：50名\n所在地：東京都渋谷区...\n事業内容：Webアプリ開発、AIソリューション\n商品：AI自動化ツール 月額10万円\n電話：03-1234-5678\nメール：info@example.com"}
          />
          <button
            onClick={() => parseText(text)}
            disabled={!text.trim() || loading}
            className="mt-2 w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-30"
          >
            {loading ? "解析中..." : "この内容で資料を生成"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Skip / Use sample data */}
        <div className="text-center">
          <button
            onClick={() => onComplete(defaultCompanyData)}
            className="text-xs text-slate-400 hover:text-slate-600 underline transition"
          >
            サンプルデータで始める
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<CompanyData>(defaultCompanyData);
  const [showForm, setShowForm] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(DEFAULT_ZOOM_INDEX);
  const previewRef = useRef<HTMLDivElement>(null);

  const zoom = ZOOM_STEPS[zoomIdx];

  useEffect(() => {
    const saved = loadSavedData();
    const wasStarted = localStorage.getItem(STARTED_KEY);
    if (saved && wasStarted) {
      setData(saved);
      setStarted(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && started) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, hydrated, started]);

  const handleComplete = useCallback((newData: CompanyData) => {
    setData(newData);
    setStarted(true);
    localStorage.setItem(STARTED_KEY, "1");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const handlePrint = useCallback(() => { window.print(); }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("データをリセットして最初からやり直しますか？")) {
      setData(defaultCompanyData);
      setStarted(false);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STARTED_KEY);
    }
  }, []);

  if (!hydrated) return null;

  if (!started) {
    return <UploadScreen onComplete={handleComplete} />;
  }

  return (
    <CompanyDataContext.Provider value={{ data, setData }}>
      <div className="min-h-screen bg-slate-100">
        <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto px-4 h-11 flex items-center justify-between">
            <h1 className="text-xs font-bold text-slate-700 tracking-wide">会社紹介資料ジェネレーター</h1>
            <div className="flex items-center gap-1.5">
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
                最初から
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

        <div className="flex">
          {showForm && (
            <aside className="no-print w-[360px] flex-shrink-0 bg-white border-r border-slate-200 h-[calc(100vh-44px)] sticky top-11 overflow-hidden">
              <FormEditor />
            </aside>
          )}
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
