import path from "path";
import fs from "fs";

const projectMarkdownDir = path.join(process.cwd(), "projects");

export const getProjectMarkdownSlugs = (): string[] => {
  const fileNames = fs.readdirSync(projectMarkdownDir);

  return fileNames
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/.md$/, ""));
};

export const getProjectMarkdown = (projectName: string): string => {
  const mdFilePath = path.join(projectMarkdownDir, `${projectName}.md`);
  return fs.readFileSync(mdFilePath).toString();
};
