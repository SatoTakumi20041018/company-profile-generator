import { NextRequest, NextResponse } from "next/server";
import type { CompanyData } from "../../lib/types";
import { defaultCompanyData } from "../../lib/types";

function extractFromText(text: string): Partial<CompanyData> {
  const result: Partial<CompanyData> = {};
  const n = text.replace(/\r\n/g, "\n");

  const ext = (patterns: RegExp[]): string | null => {
    for (const p of patterns) {
      const m = n.match(p);
      if (m) return m[1].trim();
    }
    return null;
  };

  const extAll = (patterns: RegExp[]): string[] => {
    const results: string[] = [];
    for (const p of patterns) {
      const matches = n.matchAll(new RegExp(p.source, p.flags.includes("g") ? p.flags : p.flags + "g"));
      for (const m of matches) if (m[1]) results.push(m[1].trim());
    }
    return results;
  };

  // Company name
  const companyName = ext([
    /(?:会社名|社名|商号|法人名)[：:・\s]\s*(.+)/m,
    /^((?:株式会社|合同会社|有限会社).+)$/m,
  ]);
  if (companyName) {
    result.companyName = companyName;
    result.logoText = companyName.replace(/株式会社|合同会社|有限会社/g, "").trim();
  }

  // Overview items
  const overview: { label: string; value: string }[] = [];
  const overviewDefs: [string, RegExp[]][] = [
    ["会社名", [/(?:会社名|社名|商号)[：:・\s]\s*(.+)/m]],
    ["代表者", [/(?:代表者?|代表取締役|CEO|代表社員)[：:・\s]\s*(.+)/m]],
    ["設立", [/設立[：:・\s]\s*(.+)/m, /(?:創業|創立)[：:・\s]\s*(.+)/m]],
    ["資本金", [/資本金[：:・\s]\s*(.+)/m]],
    ["従業員数", [/従業員(?:数)?[：:・\s]\s*(.+)/m, /社員数[：:・\s]\s*(.+)/m]],
    ["所在地", [/(?:所在地|住所|本社所在地|本社)[：:・\s]\s*(.+)/m]],
    ["事業内容", [/事業(?:内容)?[：:・\s]\s*(.+)/m]],
    ["売上高", [/売上(?:高)?[：:・\s]\s*(.+)/m]],
    ["URL", [/(?:URL|Web|HP|ホームページ)[：:・\s]*(https?:\/\/\S+|\S+\.\S+)/mi]],
  ];
  for (const [label, patterns] of overviewDefs) {
    const value = ext(patterns);
    if (value) overview.push({ label, value });
  }
  if (overview.length > 0) result.overview = overview;

  // Mission / Vision
  const mission = ext([
    /(?:ミッション|Mission)[：:・\s]\s*(.+)/mi,
    /(?:経営理念|企業理念|理念)[：:・\s]\s*(.+)/m,
  ]);
  if (mission) result.mission = mission;

  const vision = ext([
    /(?:ビジョン|Vision)[：:・\s]\s*(.+)/mi,
    /(?:目標|将来像)[：:・\s]\s*(.+)/m,
  ]);
  if (vision) result.vision = vision;

  // Values
  const valueMatches = n.match(/(?:バリュー|Values?|行動指針|行動規範)[：:・\s]*\n((?:[\s\S]*?)(?=\n\n|\n[^\s]|$))/mi);
  if (valueMatches) {
    const lines = valueMatches[1].split("\n").map(l => l.replace(/^[\s・\-\d.]+/, "").trim()).filter(l => l.length > 1);
    if (lines.length > 0) {
      result.values = lines.slice(0, 6).map(l => {
        const parts = l.split(/[：:—\-\s]{2,}/);
        return { name: parts[0] || l, description: parts[1] || "" };
      });
    }
  }

  // Services / Products
  const serviceMatches = extAll([
    /(?:事業|サービス|プロダクト|商品|ソリューション)\d*[：:・\s]\s*(.+)/gmi,
  ]);
  if (serviceMatches.length > 0) {
    result.services = serviceMatches.slice(0, 6).map(s => ({
      title: s, description: "", highlight: "",
    }));
  }

  // Products extraction
  const productBlocks = n.match(/(?:商品|プロダクト|製品|サービス)(?:一覧|情報|紹介)?[：:\s]*\n([\s\S]*?)(?=\n\n[^\s]|$)/mi);
  if (productBlocks) {
    const lines = productBlocks[1].split("\n").map(l => l.replace(/^[\s・\-\d.]+/, "").trim()).filter(l => l.length > 2);
    if (lines.length > 0) {
      result.products = lines.slice(0, 6).map(l => {
        const parts = l.split(/[：:—\-\s]{2,}/);
        return {
          name: parts[0] || l,
          description: parts[1] || "",
          price: "",
          features: "",
          targetAudience: "",
          sourceUrl: "",
        };
      });
    }
  }

  // Prices
  const priceMatches = n.matchAll(/(?:価格|料金|月額|費用|price)[：:\s]*([¥￥]?[\d,]+(?:万)?円?(?:[\s/〜~\-]+[¥￥]?[\d,]+(?:万)?円?)?(?:\/月|\/年)?)/gi);
  const prices: string[] = [];
  for (const m of priceMatches) if (m[1]) prices.push(m[1].trim());

  // Stats / Numbers
  const statPatterns = [
    /(?:導入|取引)(?:企業|社|実績)(?:数)?[：:\s]*([0-9,]+(?:社|件|\+)?)/,
    /(?:顧客)?満足度[：:\s]*([\d.]+%?)/,
    /(?:売上|売上高)[：:\s]*([\d,]+(?:万|億)?円)/,
    /従業員(?:数)?[：:\s]*([\d,]+名?)/,
    /(?:拠点|オフィス)(?:数)?[：:\s]*([\d]+(?:拠点|カ所)?)/,
    /(?:設立|創業)[：:\s]*(\d{4}年)/,
  ];
  const stats: { value: string; unit: string; label: string }[] = [];
  const statLabels = ["累計導入企業数", "顧客満足度", "売上高", "従業員数", "拠点数", "設立"];
  statPatterns.forEach((p, i) => {
    const m = n.match(p);
    if (m) {
      const raw = m[1];
      const numMatch = raw.match(/[\d,.]+/);
      const unitMatch = raw.replace(/[\d,.]+/, "").trim();
      if (numMatch) stats.push({ value: numMatch[0], unit: unitMatch || "", label: statLabels[i] });
    }
  });
  if (stats.length > 0) result.stats = stats;

  // Team members
  const teamPatterns = [
    /(?:代表取締役|CEO|CTO|COO|CFO|取締役|執行役員|部長)\s*[：:\s]?\s*(.+)/gm,
  ];
  const teamRaw = extAll(teamPatterns);
  if (teamRaw.length > 0) {
    result.team = teamRaw.slice(0, 6).map(t => {
      const parts = t.split(/[\s　]+/);
      return { name: parts.slice(-2).join(" ") || t, role: parts.slice(0, -2).join(" ") || "", bio: "" };
    });
  }

  // Timeline / History
  const yearEvents = n.matchAll(/(\d{4}年(?:\s?\d{1,2}月)?)[：:\s]+(.+)/g);
  const timeline: { year: string; title: string; description: string; isHighlight: boolean }[] = [];
  for (const m of yearEvents) {
    timeline.push({ year: m[1], title: m[2].trim(), description: "", isHighlight: false });
  }
  if (timeline.length > 0) {
    // Mark last item as highlight
    timeline[timeline.length - 1].isHighlight = true;
    result.timeline = timeline.slice(0, 10);
  }

  // Contact info
  const phone = ext([/(?:電話|TEL|Tel|℡)[：:・\s]*([0-9\-()（）]+)/m]);
  if (phone) result.contactPhone = phone;
  const email = ext([
    /(?:メール|E-?mail|Mail)[：:・\s]*(\S+@\S+)/mi,
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
  ]);
  if (email) result.contactEmail = email;
  const web = ext([
    /(?:URL|Web|HP|ホームページ|ウェブ|サイト)[：:・\s]*(https?:\/\/\S+|\S+\.\S+)/mi,
  ]);
  if (web) result.contactWeb = web;

  // Tagline
  const tagline = ext([
    /(?:キャッチコピー|タグライン|スローガン|Tagline|Slogan)[：:・\s]\s*(.+)/mi,
  ]);
  if (tagline) result.tagline = tagline;

  return result;
}

function extractFromHtml(html: string): Partial<CompanyData> {
  // Strip HTML tags but preserve structure
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const result = extractFromText(text);

  // Also extract from meta tags
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1]?.trim();

  if (title && !result.companyName) result.companyName = title;
  if (metaDesc && !result.tagline) result.tagline = metaDesc;

  return result;
}

export async function POST(req: NextRequest) {
  try {
    const { text, format } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "テキストが必要です" }, { status: 400 });
    }

    let extracted: Partial<CompanyData>;
    if (format === "html") {
      extracted = extractFromHtml(text);
    } else {
      extracted = extractFromText(text);
    }

    // Merge with defaults for a complete document
    const filled: CompanyData = { ...defaultCompanyData, ...extracted };

    // Count how many fields were extracted
    const fieldCount = Object.keys(extracted).length;

    return NextResponse.json({ data: filled, fieldsExtracted: fieldCount });
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return NextResponse.json({ error: `解析に失敗: ${message}` }, { status: 500 });
  }
}
