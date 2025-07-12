import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name || !name.endsWith(".txt")) {
    return NextResponse.json({ error: "缺少或非法的文件名" }, { status: 400 });
  }
  const filePath = path.join(process.cwd(), "input-txt", name);
  try {
    const content = await readFile(filePath, "utf-8");
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: "读取文件失败", detail: String(error) },
      { status: 500 }
    );
  }
}
