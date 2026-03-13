import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Thought } from "@/types";

const thoughtsDir = path.join(process.cwd(), "content", "thoughts");

export async function getAllThoughts(): Promise<Thought[]> {
  if (!fs.existsSync(thoughtsDir)) return [];

  const files = fs.readdirSync(thoughtsDir).filter((f) => f.endsWith(".md"));

  const thoughts = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(thoughtsDir, file), "utf-8");
      const { data, content } = matter(raw);

      const processed = await remark().use(html).process(content);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        tags: data.tags || [],
        projectSlug: data.projectSlug || undefined,
        content: processed.toString(),
      } as Thought;
    })
  );

  return thoughts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getThoughtsByProject(
  projectSlug: string
): Promise<Thought[]> {
  const all = await getAllThoughts();
  return all.filter(
    (t) => t.projectSlug === projectSlug || t.tags.includes(projectSlug)
  );
}
