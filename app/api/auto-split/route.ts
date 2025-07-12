import { NextResponse } from "next/server";

function splitChapters(text: string) {
  // Support splitting chapters by Chapter/Appendix
  const chapterRegex =
    /((?:Chapter|CHAPTER|Appendix|APPENDIX)\s+(?:\d+|[A-Z][a-z]+|[IVXLCDM]+))(?:\s*[:\-]\s*([^\n]+))?/g;
  const matches = Array.from(text.matchAll(chapterRegex));
  if (matches.length === 0) {
    return [{ title: "Main Text", subtitle: "", content: text }];
  }
  const chapters = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i < matches.length - 1 ? matches[i + 1].index : text.length;
    const title = matches[i][1].trim();
    const subtitle = matches[i][2]?.trim() || "";
    const contentStart = start + matches[i][0].length;
    const content = text.slice(contentStart, end).trim();
    chapters.push({ title, subtitle, content });
  }
  return chapters;
}

export async function POST(request: Request) {
  const { content } = await request.json();
  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }
  const chapters = splitChapters(content);
  return NextResponse.json({ chapters });
}
