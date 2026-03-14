import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

// Dynamic imports for optional deps
async function loadMammoth() {
  return await import("mammoth");
}
async function loadXlsx() {
  return await import("xlsx-parse-json");
}
async function loadYaml() {
  return await import("js-yaml");
}
async function loadIconvLite() {
  return await import("iconv-lite");
}

interface ParseResult {
  text: string;
  format: string;
  pages?: number;
  metadata?: Record<string, string>;
  error?: string;
}

function detectEncoding(buffer: Buffer): string {
  // BOM detection
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) return "utf-8";
  if (buffer[0] === 0xff && buffer[1] === 0xfe) return "utf-16le";
  if (buffer[0] === 0xfe && buffer[1] === 0xff) return "utf-16be";

  // Validate UTF-8 byte sequences first — if valid, it IS UTF-8
  let isValidUtf8 = true;
  let hasMultibyte = false;
  for (let i = 0; i < buffer.length; i++) {
    const b = buffer[i];
    if (b <= 0x7f) continue;
    hasMultibyte = true;
    if (b >= 0xc2 && b <= 0xdf) {
      if (i + 1 >= buffer.length || (buffer[i + 1] & 0xc0) !== 0x80) { isValidUtf8 = false; break; }
      i++;
    } else if (b >= 0xe0 && b <= 0xef) {
      if (i + 2 >= buffer.length || (buffer[i + 1] & 0xc0) !== 0x80 || (buffer[i + 2] & 0xc0) !== 0x80) { isValidUtf8 = false; break; }
      i += 2;
    } else if (b >= 0xf0 && b <= 0xf4) {
      if (i + 3 >= buffer.length || (buffer[i + 1] & 0xc0) !== 0x80 || (buffer[i + 2] & 0xc0) !== 0x80 || (buffer[i + 3] & 0xc0) !== 0x80) { isValidUtf8 = false; break; }
      i += 3;
    } else {
      isValidUtf8 = false;
      break;
    }
  }

  if (isValidUtf8) return "utf-8";

  // Only check Shift-JIS / EUC-JP if NOT valid UTF-8
  let sjisScore = 0;
  let eucScore = 0;
  for (let i = 0; i < Math.min(buffer.length, 4096); i++) {
    const b = buffer[i];
    if (b >= 0x81 && b <= 0x9f) sjisScore += 2;
    if (b >= 0xe0 && b <= 0xef) sjisScore += 1;
    if (b >= 0xa1 && b <= 0xfe && i + 1 < buffer.length && buffer[i + 1] >= 0xa1 && buffer[i + 1] <= 0xfe) eucScore += 2;
    if (b === 0x8e) eucScore += 1;
  }

  if (eucScore > sjisScore && eucScore > 10) return "euc-jp";
  if (sjisScore > 10) return "shift_jis";
  return "utf-8";
}

async function decodeBuffer(buffer: Buffer): Promise<string> {
  const encoding = detectEncoding(buffer);
  if (encoding === "utf-8") {
    // Strip BOM if present
    const str = buffer.toString("utf-8");
    return str.charCodeAt(0) === 0xfeff ? str.slice(1) : str;
  }
  try {
    const iconv = await loadIconvLite();
    return iconv.default.decode(buffer, encoding);
  } catch {
    return buffer.toString("utf-8");
  }
}

async function parsePdf(buffer: Uint8Array): Promise<ParseResult> {
  try {
    const { text, totalPages } = await extractText(buffer, { mergePages: true });
    return { text: text || "", format: "pdf", pages: totalPages };
  } catch (e) {
    return { text: "", format: "pdf", error: `PDF解析失敗: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function parseDocx(buffer: Buffer): Promise<ParseResult> {
  try {
    const mammoth = await loadMammoth();
    const result = await mammoth.default.extractRawText({ buffer });
    return { text: result.value || "", format: "docx" };
  } catch (e) {
    return { text: "", format: "docx", error: `DOCX解析失敗: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function parseXlsx(buffer: Buffer): Promise<ParseResult> {
  try {
    const xlsx = await loadXlsx();
    // xlsx-parse-json expects a file path or buffer
    const workbook = xlsx.default ? xlsx.default : xlsx;
    // Fallback: use raw parsing
    const rows: string[] = [];
    // Try using the library
    if (typeof workbook.parseXlsx === "function") {
      const sheets = await workbook.parseXlsx(buffer);
      for (const sheet of sheets) {
        for (const row of sheet.data || []) {
          const vals = Object.values(row).map(v => String(v ?? "")).filter(Boolean);
          if (vals.length > 0) rows.push(vals.join("\t"));
        }
      }
    }
    if (rows.length === 0) {
      // Minimal xlsx parsing fallback using raw buffer scan for shared strings
      const text = buffer.toString("utf-8").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return { text: text.slice(0, 50000), format: "xlsx", metadata: { note: "fallback-parsing" } };
    }
    return { text: rows.join("\n"), format: "xlsx" };
  } catch (e) {
    return { text: "", format: "xlsx", error: `XLSX解析失敗: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function parseCsv(buffer: Buffer): Promise<ParseResult> {
  const text = await decodeBuffer(buffer);
  // Parse CSV into readable text
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return { text: "", format: "csv" };

  // Detect delimiter
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const delimiter = tabCount > commaCount ? "\t" : ",";

  const rows = lines.map(l => l.split(delimiter).map(c => c.replace(/^["']|["']$/g, "").trim()));
  const headers = rows[0];

  // Convert to key:value format for better AI parsing
  const output: string[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const pairs = headers.map((h, j) => row[j] ? `${h}：${row[j]}` : "").filter(Boolean);
    if (pairs.length > 0) output.push(pairs.join("\n"));
  }

  return { text: output.join("\n---\n") || rows.map(r => r.join("\t")).join("\n"), format: delimiter === "\t" ? "tsv" : "csv" };
}

function parseJson(text: string): ParseResult {
  try {
    const obj = JSON.parse(text);
    // Flatten JSON to key:value pairs
    const pairs: string[] = [];
    function flatten(o: unknown, prefix = "") {
      if (o === null || o === undefined) return;
      if (typeof o === "object" && !Array.isArray(o)) {
        for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
          flatten(v, prefix ? `${prefix}.${k}` : k);
        }
      } else if (Array.isArray(o)) {
        o.forEach((item, i) => flatten(item, `${prefix}[${i}]`));
      } else {
        pairs.push(`${prefix}：${String(o)}`);
      }
    }
    flatten(obj);
    return { text: pairs.join("\n"), format: "json" };
  } catch (e) {
    return { text, format: "json", error: `JSON解析失敗: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function parseYaml(text: string): Promise<ParseResult> {
  try {
    const yaml = await loadYaml();
    const obj = yaml.default.load(text);
    // Reuse JSON flattener
    return parseJson(JSON.stringify(obj));
  } catch {
    // Fallback: treat as structured text (key: value pairs)
    // This handles Japanese YAML that js-yaml rejects due to "non-printable" chars
    const lines = text.split(/\r?\n/);
    const pairs: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^[\s-]*([^:]+):\s*(.+)$/);
      if (match) {
        pairs.push(`${match[1].trim()}：${match[2].trim()}`);
      }
    }
    return { text: pairs.join("\n") || text, format: "yaml", metadata: { note: "fallback-text-parsing" } };
  }
}

function parseXml(text: string): ParseResult {
  // Strip XML tags but preserve text content with structure
  const cleaned = text
    .replace(/<\?xml[^>]*\?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<([^/\s>]+)[^>]*\/>/g, "") // self-closing tags
    .replace(/<\/([^>]+)>/g, "\n")
    .replace(/<([^>]+)>/g, (_, tag) => {
      const name = tag.split(/\s/)[0];
      return `${name}：`;
    })
    .replace(/：\s*\n/g, "：")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text: cleaned, format: "xml" };
}

function parseHtml(html: string): ParseResult {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|h[1-6]|li|tr|td|th|dt|dd|section|article|header|footer|nav|aside)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ {2,}/g, " ")
    .trim();

  const metadata: Record<string, string> = {};
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1]?.trim();
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([\s\S]*?)["']/i)?.[1]?.trim();
  const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1]?.trim();

  if (title) metadata.title = title;
  if (metaDesc) metadata.description = metaDesc;
  if (ogTitle) metadata.ogTitle = ogTitle;
  if (ogDesc) metadata.ogDescription = ogDesc;

  return { text, format: "html", metadata };
}

function parseRtf(text: string): ParseResult {
  // Strip RTF control words
  const cleaned = text
    .replace(/\{\\fonttbl[\s\S]*?\}/g, "")
    .replace(/\{\\colortbl[\s\S]*?\}/g, "")
    .replace(/\{\\stylesheet[\s\S]*?\}/g, "")
    .replace(/\{\\info[\s\S]*?\}/g, "")
    .replace(/\\par\b/g, "\n")
    .replace(/\\line\b/g, "\n")
    .replace(/\\tab\b/g, "\t")
    .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\u(\d+)\??/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/\\[a-z]+\d*\s?/g, "")
    .replace(/[{}]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text: cleaned, format: "rtf" };
}

function parsePptxXml(text: string): ParseResult {
  // PPTX internals are XML — extract text from slide XML fragments
  const textContent = text
    .replace(/<a:t>([\s\S]*?)<\/a:t>/g, "$1 ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return { text: textContent, format: "pptx" };
}

function getFormatFromFilename(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop() || "";
  const map: Record<string, string> = {
    pdf: "pdf", docx: "docx", doc: "docx",
    xlsx: "xlsx", xls: "xlsx",
    pptx: "pptx", ppt: "pptx",
    csv: "csv", tsv: "tsv",
    json: "json",
    yaml: "yaml", yml: "yaml",
    xml: "xml", svg: "xml",
    html: "html", htm: "html",
    rtf: "rtf",
    txt: "text", text: "text", md: "text", markdown: "text",
    log: "text", ini: "text", cfg: "text", conf: "text",
    js: "text", ts: "text", py: "text", rb: "text", java: "text",
    css: "text", scss: "text", less: "text",
    sh: "text", bash: "text", zsh: "text",
    sql: "text", r: "text", go: "text", rs: "text",
    env: "text", gitignore: "text",
    toml: "text", properties: "text",
  };
  return map[ext] || "text";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
    }

    const filename = file.name || "unknown.txt";
    const format = getFormatFromFilename(filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uint8 = new Uint8Array(arrayBuffer);

    let result: ParseResult;

    switch (format) {
      case "pdf":
        result = await parsePdf(uint8);
        break;
      case "docx":
        result = await parseDocx(buffer);
        break;
      case "xlsx":
        result = await parseXlsx(buffer);
        break;
      case "csv":
      case "tsv":
        result = await parseCsv(buffer);
        break;
      case "json": {
        const text = await decodeBuffer(buffer);
        result = parseJson(text);
        break;
      }
      case "yaml": {
        const text = await decodeBuffer(buffer);
        result = await parseYaml(text);
        break;
      }
      case "xml": {
        const text = await decodeBuffer(buffer);
        result = parseXml(text);
        break;
      }
      case "html": {
        const text = await decodeBuffer(buffer);
        result = parseHtml(text);
        break;
      }
      case "rtf": {
        const text = await decodeBuffer(buffer);
        result = parseRtf(text);
        break;
      }
      case "pptx": {
        // Try mammoth-like extraction or XML fallback
        const text = await decodeBuffer(buffer);
        result = parsePptxXml(text);
        break;
      }
      default: {
        const text = await decodeBuffer(buffer);
        result = { text, format: "text" };
      }
    }

    // Truncate very large texts
    if (result.text.length > 100000) {
      result.text = result.text.slice(0, 100000);
      result.metadata = { ...result.metadata, truncated: "true" };
    }

    return NextResponse.json({
      text: result.text,
      format: result.format,
      pages: result.pages,
      metadata: result.metadata,
      filename,
      size: buffer.length,
      success: !result.error && result.text.length > 0,
      error: result.error,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return NextResponse.json({ error: `ファイル解析に失敗: ${message}`, success: false }, { status: 500 });
  }
}
