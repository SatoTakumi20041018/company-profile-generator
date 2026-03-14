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

function ConfirmationScreen({
  data,
  onConfirm,
  onBack,
}: {
  data: CompanyData;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const sections: { label: string; content: string | null }[] = [];

  if (data.companyName && data.companyName !== defaultCompanyData.companyName) {
    sections.push({ label: "会社名", content: data.companyName });
  }
  if (data.tagline && data.tagline !== defaultCompanyData.tagline) {
    sections.push({ label: "キャッチコピー", content: data.tagline.replace(/\n/g, " ") });
  }
  if (data.mission && data.mission !== defaultCompanyData.mission) {
    sections.push({ label: "ミッション", content: data.mission.replace(/\n/g, " ") });
  }
  if (data.vision && data.vision !== defaultCompanyData.vision) {
    sections.push({ label: "ビジョン", content: data.vision });
  }
  if (data.overview && data.overview.length > 0) {
    const overviewText = data.overview.map((o) => `${o.label}：${o.value}`).join("\n");
    sections.push({ label: "会社概要", content: overviewText });
  }
  if (data.services && data.services.length > 0 && data.services[0].title !== defaultCompanyData.services[0]?.title) {
    sections.push({ label: "サービス", content: data.services.map((s) => s.title + (s.description ? `（${s.description}）` : "")).join("\n") });
  }
  if (data.products && data.products.length > 0 && data.products[0].name !== defaultCompanyData.products[0]?.name) {
    sections.push({ label: "商品・プロダクト", content: data.products.map((p) => p.name + (p.price ? ` - ${p.price}` : "") + (p.description ? `：${p.description}` : "")).join("\n") });
  }
  if (data.stats && data.stats.length > 0 && data.stats[0].value !== defaultCompanyData.stats[0]?.value) {
    sections.push({ label: "数値実績", content: data.stats.map((s) => `${s.label}：${s.value}${s.unit}`).join("、") });
  }
  if (data.team && data.team.length > 0 && data.team[0].name !== defaultCompanyData.team[0]?.name) {
    sections.push({ label: "チーム", content: data.team.map((t) => `${t.name}（${t.role}）`).join("、") });
  }
  if (data.timeline && data.timeline.length > 0 && data.timeline[0].year !== defaultCompanyData.timeline[0]?.year) {
    sections.push({ label: "沿革", content: data.timeline.map((t) => `${t.year} ${t.title}`).join("\n") });
  }
  if (data.contactPhone && data.contactPhone !== defaultCompanyData.contactPhone) {
    sections.push({ label: "電話", content: data.contactPhone });
  }
  if (data.contactEmail && data.contactEmail !== defaultCompanyData.contactEmail) {
    sections.push({ label: "メール", content: data.contactEmail });
  }
  if (data.contactWeb && data.contactWeb !== defaultCompanyData.contactWeb) {
    sections.push({ label: "Web", content: data.contactWeb });
  }

  const hasExtracted = sections.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            {hasExtracted ? "以下の会社概要で間違いないですか？" : "情報を抽出できませんでした"}
          </h1>
          <p className="text-sm text-slate-500">
            {hasExtracted
              ? "AIが読み取った内容を確認してください。OKを押すと資料を生成します。"
              : "サンプルデータで資料を生成するか、戻って別のデータを入力してください。"}
          </p>
        </div>

        {hasExtracted && (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 mb-6">
            {sections.map((sec, i) => (
              <div key={i} className="px-5 py-3">
                <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">{sec.label}</div>
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{sec.content}</div>
              </div>
            ))}
          </div>
        )}

        {!hasExtracted && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
            <p className="text-sm text-amber-700">
              入力データから会社情報を自動的に抽出できませんでした。サンプルデータをベースに、エディタで手動編集できます。
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
          >
            戻って修正
          </button>
          <button
            onClick={onConfirm}
            className="flex-[2] px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            {hasExtracted ? "この内容でOK — 資料を生成" : "サンプルデータで資料を生成"}
          </button>
        </div>
      </div>
    </div>
  );
}

function loadSavedData(): CompanyData | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultCompanyData, ...JSON.parse(saved) };
  } catch {}
  return null;
}

function UploadScreen({ onComplete, onSkip }: { onComplete: (data: CompanyData) => void; onSkip: () => void }) {
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
      if (!res.ok) { setError(json.error || "テキスト解析でエラーが発生しました"); return; }
      onComplete(json.data);
    } catch (e) {
      const detail = e instanceof Error ? e.message : "";
      if (detail.includes("Failed to fetch") || detail.includes("NetworkError")) {
        setError("ネットワークエラーが発生しました。接続を確認してください。");
      } else {
        setError("テキストの解析中にエラーが発生しました。内容を確認してください。");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-file", { method: "POST", body: formData });
      if (!res.ok) {
        let msg: string;
        if (res.status === 504 || res.status === 408) {
          msg = `${file.name} の処理がタイムアウトしました。ファイルサイズが大きすぎる可能性があります。`;
        } else if (res.status === 413) {
          msg = `${file.name} のサイズが大きすぎます。4.5MB以下のファイルをお試しください。`;
        } else {
          msg = `${file.name} の処理中に問題が発生しました。別のファイル形式をお試しください。`;
        }
        try { const j = await res.json(); if (j.error) msg = j.error; } catch {}
        setError(msg);
        setLoading(false);
        return;
      }
      const json = await res.json();
      // Even if parse-file returned an error (e.g. invalid PDF), try to use whatever text we got
      const extractedText = json.text || "";
      setText(extractedText);
      if (extractedText.trim()) {
        const isHtml = file.name.endsWith(".html") || file.name.endsWith(".htm");
        await parseText(extractedText, isHtml ? "html" : "text");
      } else if (json.error) {
        // File-specific error (e.g. "PDF解析失敗: Invalid PDF structure")
        setError(`${file.name} の読み取りに失敗しました: ${json.error}`);
        setLoading(false);
      } else {
        // File was parsed but no text content
        setError(`${file.name} からテキストを抽出できませんでした。別のファイルをお試しください。`);
        setLoading(false);
      }
    } catch (e) {
      const detail = e instanceof Error ? e.message : "";
      if (detail.includes("Failed to fetch") || detail.includes("NetworkError")) {
        setError("ネットワークエラーが発生しました。接続を確認してもう一度お試しください。");
      } else if (detail.includes("timeout") || detail.includes("AbortError")) {
        setError("ファイルの処理に時間がかかりすぎました。ファイルサイズを確認してください。");
      } else {
        setError(`${file.name} の処理中にエラーが発生しました。ファイル形式を確認してください。`);
      }
      setLoading(false);
    }
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
      if (!res.ok) {
        setError(json.error || "URLからの情報取得に失敗しました。URLを確認してください。");
        setLoading(false);
        return;
      }
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
    } catch (e) {
      const detail = e instanceof Error ? e.message : "";
      if (detail.includes("Failed to fetch") || detail.includes("NetworkError")) {
        setError("ネットワークエラーが発生しました。接続を確認してください。");
      } else {
        setError("URLからの情報取得中にエラーが発生しました。URLを確認してください。");
      }
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
            .pdf .txt .md .html .csv .json .xml .yaml .docx .rtf 対応
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.text,.md,.html,.htm,.csv,.tsv,.json,.yaml,.yml,.xml,.rtf,.docx,.ini,.conf,.log"
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
            onClick={onSkip}
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
  const [pendingData, setPendingData] = useState<CompanyData | null>(null);
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

  const handleParsed = useCallback((newData: CompanyData) => {
    setPendingData(newData);
  }, []);

  const handleConfirm = useCallback(() => {
    const d = pendingData || defaultCompanyData;
    setData(d);
    setStarted(true);
    setPendingData(null);
    localStorage.setItem(STARTED_KEY, "1");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  }, [pendingData]);

  const handleSkip = useCallback(() => {
    setData(defaultCompanyData);
    setStarted(true);
    localStorage.setItem(STARTED_KEY, "1");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCompanyData));
  }, []);

  const handleBackToUpload = useCallback(() => {
    setPendingData(null);
  }, []);

  const handlePrint = useCallback(() => { window.print(); }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("データをリセットして最初からやり直しますか？")) {
      setData(defaultCompanyData);
      setStarted(false);
      setPendingData(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STARTED_KEY);
    }
  }, []);

  if (!hydrated) return null;

  if (!started && pendingData) {
    return (
      <ConfirmationScreen
        data={pendingData}
        onConfirm={handleConfirm}
        onBack={handleBackToUpload}
      />
    );
  }

  if (!started) {
    return <UploadScreen onComplete={handleParsed} onSkip={handleSkip} />;
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
