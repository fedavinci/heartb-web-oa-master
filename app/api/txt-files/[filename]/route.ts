import { readFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } },
) {
  const { filename } = params;

  if (!filename || !filename.endsWith(".txt")) {
    return NextResponse.json(
      { error: "Missing or invalid filename" },
      { status: 400 },
    );
  }
  const filePath = path.join(process.cwd(), "input-txt", filename);

  try {
    const content = await readFile(filePath, "utf-8");

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read file", detail: String(error) },
      { status: 500 },
    );
  }
}
