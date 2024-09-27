import path from "node:path";
import fs from "node:fs";

type MarkdownType = "projects" | "posts";

const markdownDir = (dir: MarkdownType) => path.join(process.cwd(), dir);

export const getMarkdownSlugs = (type: MarkdownType): string[] => {
  const fileNames = fs.readdirSync(markdownDir(type));

  return fileNames
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/.md$/, ""));
};

export const getMarkdown = (type: MarkdownType, slug: string): string => {
  const mdFilePath = path.join(markdownDir(type), `${slug}.md`);
  return fs.readFileSync(mdFilePath).toString();
};
