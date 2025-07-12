import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  const dirPath = path.join(process.cwd(), "input-txt");
  try {
    const files = await readdir(dirPath);
    const txtFiles = files.filter((file) => file.endsWith(".txt"));
    return NextResponse.json(txtFiles);
  } catch (error) {
    return NextResponse.json(
      { error: "读取文件列表失败", detail: String(error) },
      { status: 500 }
    );
  }
}
