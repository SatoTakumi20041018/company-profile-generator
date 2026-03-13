"use client";

import { useCompanyData } from "../lib/store";
import type { CompanyData, Product } from "../lib/types";
import { useRef, useState } from "react";

// Parse unstructured Japanese company text into structured data
function parseCompanyText(text: string): Partial<CompanyData> {
  const result: Partial<CompanyData> = {};
  const overview: { label: string; value: string }[] = [];
  const normalized = text.replace(/\r\n/g, "\n");

  const extract = (patterns: RegExp[]): string | null => {
    for (const p of patterns) {
      const match = normalized.match(p);
      if (match) return match[1].trim();
    }
    return null;
  };

  const companyName = extract([/(?:会社名|社名|商号|法人名)[：:・\s]\s*(.+)/m]);
  if (companyName) {
    result.companyName = companyName;
    result.logoText = companyName.replace(/株式会社|合同会社|有限会社/g, "").trim();
  }

  const overviewDefs: [string, RegExp[]][] = [
    ["会社名", [/(?:会社名|社名|商号)[：:・\s]\s*(.+)/m]],
    ["代表者", [/(?:代表者?|代表取締役|CEO)[：:・\s]\s*(.+)/m]],
    ["設立", [/設立[：:・\s]\s*(.+)/m]],
    ["資本金", [/資本金[：:・\s]\s*(.+)/m]],
    ["従業員数", [/従業員(?:数)?[：:・\s]\s*(.+)/m]],
    ["所在地", [/(?:所在地|住所|本社所在地|本社)[：:・\s]\s*(.+)/m]],
    ["事業内容", [/事業(?:内容)?[：:・\s]\s*(.+)/m]],
    ["売上高", [/売上(?:高)?[：:・\s]\s*(.+)/m]],
  ];

  for (const [label, patterns] of overviewDefs) {
    const value = extract(patterns);
    if (value) overview.push({ label, value });
  }
  if (overview.length > 0) result.overview = overview;

  const mission = extract([/(?:ミッション|Mission)[：:・\s]\s*(.+)/mi]);
  if (mission) result.mission = mission;
  const vision = extract([/(?:ビジョン|Vision)[：:・\s]\s*(.+)/mi]);
  if (vision) result.vision = vision;

  const phone = extract([/(?:電話|TEL|Tel|℡)[：:・\s]*([0-9\-()（）]+)/m]);
  if (phone) result.contactPhone = phone;
  const email = extract([
    /(?:メール|E-?mail|Mail)[：:・\s]*(\S+@\S+)/mi,
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
  ]);
  if (email) result.contactEmail = email;
  const web = extract([
    /(?:URL|Web|HP|ホームページ|ウェブ|サイト)[：:・\s]*(https?:\/\/\S+|\S+\.\S+)/mi,
  ]);
  if (web) result.contactWeb = web;

  return result;
}

function Section({ title, children, onAdd, defaultOpen = false }: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-3">
      <div
        className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] text-slate-400 inline-block transition-transform duration-150"
            style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
          >▶</span>
          <h3 className="text-xs font-bold text-slate-500">{title}</h3>
        </div>
        {onAdd && isOpen && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-0.5 rounded hover:bg-blue-50 transition"
          >
            + 追加
          </button>
        )}
      </div>
      {isOpen && <div className="space-y-2.5 pb-1">{children}</div>}
    </div>
  );
}

function Field({ label, value, onChange, multiline, small }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; small?: boolean;
}) {
  const cls = `w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition ${small ? "text-[11px]" : ""}`;
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 mb-0.5">{label}</label>
      {multiline ? (
        <textarea className={cls} rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0" />
      <div>
        <div className="text-[11px] font-medium text-slate-500">{label}</div>
        <div className="text-[10px] text-slate-400 font-mono">{value}</div>
      </div>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-[10px] text-red-400 hover:text-red-600 px-1 py-0.5 rounded hover:bg-red-50 transition" title="削除">
      ✕
    </button>
  );
}

export default function FormEditor() {
  const { data, setData } = useCompanyData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileRef = useRef<HTMLInputElement>(null);
  const [bulkText, setBulkText] = useState("");
  const [parseResult, setParseResult] = useState<string | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [productUrlLoading, setProductUrlLoading] = useState(false);
  const [productUrlResult, setProductUrlResult] = useState<string | null>(null);
  const productFileRef = useRef<HTMLInputElement>(null);

  function update(partial: Partial<CompanyData>) {
    setData({ ...data, ...partial });
  }

  function updateOverview(index: number, field: "label" | "value", value: string) {
    const overview = [...data.overview];
    overview[index] = { ...overview[index], [field]: value };
    update({ overview });
  }

  function updateService(index: number, field: keyof CompanyData["services"][0], value: string) {
    const services = [...data.services];
    services[index] = { ...services[index], [field]: value };
    update({ services });
  }

  function updateStat(index: number, field: keyof CompanyData["stats"][0], value: string) {
    const stats = [...data.stats];
    stats[index] = { ...stats[index], [field]: value };
    update({ stats });
  }

  function updateTeam(index: number, field: keyof CompanyData["team"][0], value: string) {
    const team = [...data.team];
    team[index] = { ...team[index], [field]: value };
    update({ team });
  }

  function updateTimeline(index: number, field: keyof CompanyData["timeline"][0], value: string | boolean) {
    const timeline = [...data.timeline];
    timeline[index] = { ...timeline[index], [field]: value };
    update({ timeline });
  }

  function updateValue(index: number, field: "name" | "description", value: string) {
    const values = [...data.values];
    values[index] = { ...values[index], [field]: value };
    update({ values });
  }

  function updateProduct(index: number, field: keyof Product, value: string) {
    const products = [...data.products];
    products[index] = { ...products[index], [field]: value };
    update({ products });
  }

  function updateOrgStat(index: number, field: keyof CompanyData["orgStats"][0], value: string) {
    const orgStats = [...data.orgStats];
    orgStats[index] = { ...orgStats[index], [field]: value };
    update({ orgStats });
  }

  async function handleProductUrlExtract() {
    if (!productUrl.trim()) return;
    setProductUrlLoading(true);
    setProductUrlResult(null);
    try {
      const res = await fetch("/api/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setProductUrlResult(json.error || "取得に失敗しました");
        return;
      }
      const newProduct: Product = {
        name: json.name || "",
        description: json.description || "",
        price: json.price || "",
        features: json.features || "",
        targetAudience: "",
        sourceUrl: json.sourceUrl || productUrl.trim(),
      };
      update({ products: [...data.products, newProduct] });
      setProductUrl("");
      setProductUrlResult("商材情報を抽出しました");
      setTimeout(() => setProductUrlResult(null), 3000);
    } catch {
      setProductUrlResult("通信エラーが発生しました");
    } finally {
      setProductUrlLoading(false);
    }
  }

  function handleProductFileLoad(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!text) return;
      // Extract product info from text content
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      const newProduct: Product = {
        name: lines[0]?.slice(0, 100) || file.name.replace(/\.[^.]+$/, ""),
        description: lines.slice(1, 4).join(" ").slice(0, 300),
        price: "",
        features: "",
        targetAudience: "",
        sourceUrl: "",
      };
      // Try to extract price
      for (const line of lines) {
        if (/(?:価格|料金|月額|費用|price)/i.test(line)) {
          newProduct.price = line.slice(0, 100);
          break;
        }
      }
      update({ products: [...data.products, newProduct] });
      setProductUrlResult("ファイルから商材情報を追加しました");
      setTimeout(() => setProductUrlResult(null), 3000);
    };
    reader.readAsText(file);
    if (productFileRef.current) productFileRef.current.value = "";
  }

  function handleParse() {
    if (!bulkText.trim()) return;
    const parsed = parseCompanyText(bulkText);
    const fields = Object.keys(parsed);
    if (fields.length === 0) {
      setParseResult("解析できませんでした。「項目名：値」の形式で入力してください。");
      return;
    }
    setData({ ...data, ...parsed });
    setParseResult(`${fields.length}件の項目を入力しました`);
    setTimeout(() => setParseResult(null), 3000);
  }

  function handleBulkFileLoad(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) setBulkText(text);
    };
    reader.readAsText(file);
    if (bulkFileRef.current) bulkFileRef.current.value = "";
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.companyName || "company-profile"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        setData(imported);
      } catch {
        alert("JSONファイルの解析に失敗しました。");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="p-4 overflow-y-auto h-full text-sm">
      {/* Auto-parse section */}
      <Section title="テキストから自動入力" defaultOpen={true}>
        <textarea
          className="w-full px-2.5 py-2 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition leading-relaxed"
          rows={5}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={"会社名：株式会社○○\n代表者：山田太郎\n設立：2020年4月\n資本金：1,000万円\n従業員数：50名\n所在地：東京都渋谷区...\n電話：03-1234-5678\nメール：info@example.com"}
        />
        <div className="flex gap-1.5">
          <button
            onClick={() => bulkFileRef.current?.click()}
            className="flex-1 text-[11px] font-semibold text-slate-500 border border-slate-200 rounded px-2 py-1.5 hover:bg-slate-50 transition"
          >
            .txt 読み込み
          </button>
          <button
            onClick={handleParse}
            disabled={!bulkText.trim()}
            className="flex-1 text-[11px] font-semibold text-white bg-slate-700 rounded px-2 py-1.5 hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            解析して入力
          </button>
        </div>
        <input ref={bulkFileRef} type="file" accept=".txt,.text" onChange={handleBulkFileLoad} className="hidden" />
        {parseResult && (
          <div className="text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded">
            {parseResult}
          </div>
        )}
      </Section>

      {/* Import/Export */}
      <div className="mb-4 flex gap-1.5">
        <button onClick={handleExport} className="flex-1 text-[11px] font-semibold text-slate-500 border border-slate-200 rounded px-2 py-1.5 hover:bg-slate-50 transition">
          JSON出力
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="flex-1 text-[11px] font-semibold text-slate-500 border border-slate-200 rounded px-2 py-1.5 hover:bg-slate-50 transition">
          JSON読込
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>

      <Section title="テーマカラー">
        <ColorField label="アクセントカラー" value={data.primaryColor} onChange={(v) => update({ primaryColor: v })} />
      </Section>

      <Section title="表紙">
        <Field label="会社名" value={data.companyName} onChange={(v) => update({ companyName: v })} />
        <Field label="ロゴテキスト" value={data.logoText} onChange={(v) => update({ logoText: v })} />
        <Field label="キャッチコピー" value={data.tagline} onChange={(v) => update({ tagline: v })} multiline />
        <Field label="サブタイトル" value={data.subtitle} onChange={(v) => update({ subtitle: v })} multiline />
      </Section>

      <Section title="ミッション・ビジョン・バリュー" onAdd={() => update({ values: [...data.values, { name: "", description: "" }] })}>
        <Field label="ミッション" value={data.mission} onChange={(v) => update({ mission: v })} multiline />
        <Field label="ビジョン" value={data.vision} onChange={(v) => update({ vision: v })} />
        {data.values.map((val, i) => (
          <div key={i} className="relative">
            <div className="grid grid-cols-2 gap-1.5">
              <Field label={`Value ${i + 1}`} value={val.name} onChange={(v) => updateValue(i, "name", v)} small />
              <Field label="説明" value={val.description} onChange={(v) => updateValue(i, "description", v)} small />
            </div>
            {data.values.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <RemoveButton onClick={() => update({ values: data.values.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="会社概要" onAdd={() => update({ overview: [...data.overview, { label: "", value: "" }] })}>
        {data.overview.map((item, i) => (
          <div key={i} className="relative grid grid-cols-[90px_1fr] gap-1.5">
            <Field label="項目名" value={item.label} onChange={(v) => updateOverview(i, "label", v)} small />
            <Field label="内容" value={item.value} onChange={(v) => updateOverview(i, "value", v)} small />
            {data.overview.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <RemoveButton onClick={() => update({ overview: data.overview.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="商材情報を入力" onAdd={() => update({ products: [...data.products, { name: "", description: "", price: "", features: "", targetAudience: "", sourceUrl: "" }] })} defaultOpen={true}>
        <div className="text-[10px] text-slate-400 mb-2">URLやファイルから商材情報をAI自動抽出</div>
        <div className="flex gap-1.5">
          <input
            className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="商品ページ、LP、料金表、導入事例ページ等のURLを入力..."
            onKeyDown={(e) => { if (e.key === "Enter") handleProductUrlExtract(); }}
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleProductUrlExtract}
            disabled={!productUrl.trim() || productUrlLoading}
            className="flex-1 text-[11px] font-semibold text-white bg-slate-700 rounded px-2 py-1.5 hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {productUrlLoading ? "抽出中..." : "URLから抽出"}
          </button>
          <button
            onClick={() => productFileRef.current?.click()}
            className="flex-1 text-[11px] font-semibold text-slate-500 border border-slate-200 rounded px-2 py-1.5 hover:bg-slate-50 transition"
          >
            ファイル追加
          </button>
        </div>
        <input ref={productFileRef} type="file" accept=".txt,.text,.html,.htm,.csv,.md" onChange={handleProductFileLoad} className="hidden" />
        {productUrlResult && (
          <div className={`text-[11px] px-2.5 py-1.5 rounded ${productUrlResult.includes("失敗") || productUrlResult.includes("エラー") ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50"}`}>
            {productUrlResult}
          </div>
        )}
        {data.products.map((product, i) => (
          <div key={i} className="p-2.5 bg-slate-50 rounded space-y-1.5 relative">
            <Field label={`商品${i + 1}`} value={product.name} onChange={(v) => updateProduct(i, "name", v)} small />
            <Field label="説明" value={product.description} onChange={(v) => updateProduct(i, "description", v)} small />
            <div className="grid grid-cols-2 gap-1.5">
              <Field label="料金" value={product.price} onChange={(v) => updateProduct(i, "price", v)} small />
              <Field label="ターゲット" value={product.targetAudience} onChange={(v) => updateProduct(i, "targetAudience", v)} small />
            </div>
            <Field label="特徴（スラッシュ区切り）" value={product.features} onChange={(v) => updateProduct(i, "features", v)} small />
            {product.sourceUrl && (
              <div className="text-[10px] text-slate-400 truncate">出典: {product.sourceUrl}</div>
            )}
            {data.products.length > 1 && (
              <div className="absolute top-1 right-1">
                <RemoveButton onClick={() => update({ products: data.products.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="事業内容" onAdd={() => update({ services: [...data.services, { title: "", description: "", highlight: "" }] })}>
        {data.services.map((svc, i) => (
          <div key={i} className="p-2.5 bg-slate-50 rounded space-y-1.5 relative">
            <Field label={`事業${i + 1}`} value={svc.title} onChange={(v) => updateService(i, "title", v)} small />
            <Field label="説明" value={svc.description} onChange={(v) => updateService(i, "description", v)} small />
            <Field label="実績" value={svc.highlight} onChange={(v) => updateService(i, "highlight", v)} small />
            {data.services.length > 1 && (
              <div className="absolute top-1 right-1">
                <RemoveButton onClick={() => update({ services: data.services.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="実績数字" onAdd={() => update({ stats: [...data.stats, { value: "", unit: "", label: "" }] })}>
        {data.stats.map((stat, i) => (
          <div key={i} className="relative">
            <div className="grid grid-cols-3 gap-1.5">
              <Field label="数値" value={stat.value} onChange={(v) => updateStat(i, "value", v)} small />
              <Field label="単位" value={stat.unit} onChange={(v) => updateStat(i, "unit", v)} small />
              <Field label="ラベル" value={stat.label} onChange={(v) => updateStat(i, "label", v)} small />
            </div>
            {data.stats.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <RemoveButton onClick={() => update({ stats: data.stats.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
        <Field label="取引先（カンマ区切り）" value={data.clientLogos.join(", ")} onChange={(v) => update({ clientLogos: v.split(",").map(s => s.trim()).filter(Boolean) })} small />
      </Section>

      <Section title="チーム" onAdd={() => update({ team: [...data.team, { name: "", role: "", bio: "" }] })}>
        <Field label="チーム紹介文" value={data.teamIntro} onChange={(v) => update({ teamIntro: v })} small />
        {data.team.map((member, i) => (
          <div key={i} className="p-2.5 bg-slate-50 rounded space-y-1.5 relative">
            <div className="grid grid-cols-2 gap-1.5">
              <Field label="名前" value={member.name} onChange={(v) => updateTeam(i, "name", v)} small />
              <Field label="役職" value={member.role} onChange={(v) => updateTeam(i, "role", v)} small />
            </div>
            <Field label="経歴" value={member.bio} onChange={(v) => updateTeam(i, "bio", v)} small />
            {data.team.length > 1 && (
              <div className="absolute top-1 right-1">
                <RemoveButton onClick={() => update({ team: data.team.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="組織データ" onAdd={() => update({ orgStats: [...data.orgStats, { value: "", unit: "", label: "" }] })}>
        {data.orgStats.map((stat, i) => (
          <div key={i} className="relative">
            <div className="grid grid-cols-3 gap-1.5">
              <Field label="数値" value={stat.value} onChange={(v) => updateOrgStat(i, "value", v)} small />
              <Field label="単位" value={stat.unit} onChange={(v) => updateOrgStat(i, "unit", v)} small />
              <Field label="ラベル" value={stat.label} onChange={(v) => updateOrgStat(i, "label", v)} small />
            </div>
            {data.orgStats.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <RemoveButton onClick={() => update({ orgStats: data.orgStats.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="沿革" onAdd={() => update({ timeline: [...data.timeline, { year: "", title: "", description: "", isHighlight: false }] })}>
        <Field label="紹介文" value={data.timelineIntro} onChange={(v) => update({ timelineIntro: v })} small />
        {data.timeline.map((event, i) => (
          <div key={i} className="p-2.5 bg-slate-50 rounded space-y-1.5 relative">
            <div className="grid grid-cols-2 gap-1.5">
              <Field label="年月" value={event.year} onChange={(v) => updateTimeline(i, "year", v)} small />
              <Field label="タイトル" value={event.title} onChange={(v) => updateTimeline(i, "title", v)} small />
            </div>
            <Field label="説明" value={event.description} onChange={(v) => updateTimeline(i, "description", v)} small />
            <label className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <input type="checkbox" checked={event.isHighlight} onChange={(e) => updateTimeline(i, "isHighlight", e.target.checked)} />
              ハイライト
            </label>
            {data.timeline.length > 1 && (
              <div className="absolute top-1 right-1">
                <RemoveButton onClick={() => update({ timeline: data.timeline.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="お問い合わせ">
        <Field label="見出し" value={data.ctaHeading} onChange={(v) => update({ ctaHeading: v })} multiline />
        <Field label="サブテキスト" value={data.ctaSubtext} onChange={(v) => update({ ctaSubtext: v })} multiline />
        <Field label="ボタン" value={data.ctaButtonText} onChange={(v) => update({ ctaButtonText: v })} small />
        <Field label="メール" value={data.contactEmail} onChange={(v) => update({ contactEmail: v })} small />
        <Field label="電話番号" value={data.contactPhone} onChange={(v) => update({ contactPhone: v })} small />
        <Field label="Web" value={data.contactWeb} onChange={(v) => update({ contactWeb: v })} small />
      </Section>
    </div>
  );
}
