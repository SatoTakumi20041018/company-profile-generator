import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const { text } = await extractText(buffer, { mergePages: true });

    return NextResponse.json({ text: text || "" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return NextResponse.json({ error: `PDF解析に失敗: ${message}` }, { status: 500 });
  }
}
