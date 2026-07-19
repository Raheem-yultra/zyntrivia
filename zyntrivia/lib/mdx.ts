import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const WORK_DIR = path.join(process.cwd(), "content", "work");

export async function getWorkBody(slug: string): Promise<string | null> {
  // Slugs come from lib/work.ts, but never trust a path segment.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const raw = await fs.readFile(path.join(WORK_DIR, `${slug}.mdx`), "utf8");
    return matter(raw).content;
  } catch {
    return null;
  }
}
