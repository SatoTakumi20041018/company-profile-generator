import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "URLが必要です" }, { status: 400 });
    }

    const trimmedUrl = url.trim();

    // Reject obviously invalid URLs
    if (trimmedUrl.length < 4 || /^(ftp|file|javascript|data):/i.test(trimmedUrl)) {
      return NextResponse.json({ error: "無効なURLです" }, { status: 400 });
    }

    // Must contain a dot (domain) or be localhost
    if (!trimmedUrl.includes(".") && !trimmedUrl.includes("localhost")) {
      return NextResponse.json({ error: "無効なURLです" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`);
    } catch {
      return NextResponse.json({ error: "無効なURLです" }, { status: 400 });
    }

    // Reject localhost on port 0/1 and 0.0.0.0
    if (parsedUrl.hostname === "0.0.0.0" || (parsedUrl.port && parseInt(parsedUrl.port) <= 1)) {
      return NextResponse.json({ error: "無効なURLです" }, { status: 400 });
    }

    let res: Response;
    try {
      res = await fetch(parsedUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; CompanyProfileBot/1.0)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(10000),
      });
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : "接続失敗";
      return NextResponse.json({ error: `取得失敗: ${msg}` }, { status: 502 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: `取得失敗: ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    // Extract info from HTML
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
    const metaDesc =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1]?.trim() ||
      html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i)?.[1]?.trim() ||
      "";
    const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([\s\S]*?)["']/i)?.[1]?.trim() || "";
    const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1]?.trim() || "";

    // Extract prices
    const pricePatterns = [
      /(?:価格|料金|月額|年額|費用|price)[：:\s]*([¥￥$]?[\d,]+(?:万)?円?(?:[\s/〜~-]+[¥￥$]?[\d,]+(?:万)?円?)?(?:\/月|\/年)?)/gi,
      /([¥￥][\d,]+(?:万円|円))/g,
      /(月額[\d,]+(?:万)?円)/g,
    ];
    const prices: string[] = [];
    for (const p of pricePatterns) {
      const matches = html.replace(/<[^>]+>/g, " ").matchAll(p);
      for (const m of matches) {
        if (m[1] && !prices.includes(m[1])) prices.push(m[1]);
      }
    }

    // Extract features from lists
    const listItems: string[] = [];
    const liMatches = html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    for (const m of liMatches) {
      const text = m[1].replace(/<[^>]+>/g, "").trim();
      if (text.length > 2 && text.length < 100) listItems.push(text);
    }

    // Extract headings for context
    const headings: string[] = [];
    const hMatches = html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi);
    for (const m of hMatches) {
      const text = m[1].replace(/<[^>]+>/g, "").trim();
      if (text.length > 1 && text.length < 80) headings.push(text);
    }

    // Build product data
    const name = ogTitle || title || headings[0] || "";
    const description = ogDesc || metaDesc || "";
    const price = prices.slice(0, 3).join(" / ") || "";
    const features = listItems.slice(0, 8).join(" / ") || "";

    return NextResponse.json({
      name: name.slice(0, 100),
      description: description.slice(0, 300),
      price: price.slice(0, 100),
      features: features.slice(0, 300),
      sourceUrl: parsedUrl.toString(),
      headings: headings.slice(0, 5),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return NextResponse.json({ error: `抽出に失敗: ${message}` }, { status: 500 });
  }
}
