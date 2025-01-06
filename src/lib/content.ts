import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";
import {
  BlogPostInfo,
  BlogPostInfoSchema,
  ProjectInfo,
  ProjectInfoSchema,
} from "@/components/content/type";

type ContentType = "projects" | "blog";

const contentDir = (dir: ContentType) => path.join(process.cwd(), dir);

export const getContentPaths = (type: ContentType): string[] => {
  const dir = contentDir(type);

  const files = fs.readdirSync(dir);
  return files.filter((file) => {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      return false;
    }

    const ext = path.extname(file);
    if (!(ext === ".md")) {
      return false;
    }

    return true;
  });
};

export const getContentSlug = (contentPath: string): string => {
  return path.basename(contentPath, path.extname(contentPath));
};

export const getContentSlugs = (type: ContentType): string[] => {
  const paths = getContentPaths(type);
  return paths.map(getContentSlug);
};

export const getContent = (type: ContentType, slug: string): string => {
  const mdFilePath = path.join(contentDir(type), `${slug}.md`);
  return fs.readFileSync(mdFilePath).toString();
};

export const getBlogPostInfos = (): BlogPostInfo[] => {
  const paths = getContentPaths("blog");

  const infos = paths.map((postPath): BlogPostInfo => {
    const textData = fs
      .readFileSync(path.join(contentDir("blog"), postPath))
      .toString();

    const { data } = matter(textData);

    const result = BlogPostInfoSchema.omit({ slug: true }).safeParse(data);
    if (result.error) {
      throw new Error(`${postPath}: ${result.error}`);
    }

    return { ...result.data, slug: getContentSlug(postPath) };
  });

  return infos;
};

export const getProjectInfos = (): ProjectInfo[] => {
  const paths = getContentPaths("projects");

  const infos = paths.map((projectPath): ProjectInfo => {
    const textData = fs
      .readFileSync(path.join(contentDir("projects"), projectPath))
      .toString();

    const { data } = matter(textData);

    const result = ProjectInfoSchema.omit({ slug: true }).safeParse(data);
    if (result.error) {
      throw new Error(`${projectPath}: ${result.error}`);
    }

    return { ...result.data, slug: getContentSlug(projectPath) };
  });

  return infos;
};

/**
 * サーバー(ビルド環境)以外では使用できない
 */
export const blogPostInfos = getBlogPostInfos();

/**
 * サーバー(ビルド環境)以外では使用できない
 */
export const projectInfos = getProjectInfos();
