import { promises as fs } from "fs";
import path from "path";

const MAX_IMAGES = 10;

export async function GET() {
  const imagesDir = path.join(process.cwd(), "public", "images");

  try {
    const files = await fs.readdir(imagesDir);

    const matches = files
      .map((file) => {
        const match = /^auth(\d+)\.[^/.]+$/i.exec(file);
        if (!match) return null;
        const index = Number(match[1]);
        if (!Number.isFinite(index) || index < 1 || index > MAX_IMAGES) {
          return null;
        }
        return { index, file };
      })
      .filter((entry): entry is { index: number; file: string } => !!entry)
      .sort((a, b) => a.index - b.index)
      .map((entry) => `/images/${entry.file}`);

    return Response.json({ images: matches });
  } catch {
    return Response.json({ images: [] }, { status: 200 });
  }
}
