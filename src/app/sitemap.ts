import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { appUrl, Routes } from "@/routes";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: appUrl },
    ...createSitemapEntries(projects, Routes.project),
    ...createSitemapEntries(posts, Routes.blogDetail),
  ];
}

const createSitemapEntries = (
  items: { slug: string }[],
  routeFunc: (slug: string) => string
): MetadataRoute.Sitemap => {
  return items.map((i) => ({ url: `${appUrl}${routeFunc(i.slug)}` }));
};
