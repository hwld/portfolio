import { articleInfos, projectInfos } from "@/lib/content";
import { appUrl, Routes } from "@/routes";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: appUrl },
    ...createSitemapEntries(projectInfos, Routes.project),
    ...createSitemapEntries(articleInfos, Routes.blogDetail),
  ];
}

const createSitemapEntries = (
  items: { slug: string }[],
  routeFunc: (slug: string) => string
): MetadataRoute.Sitemap => {
  return items.map((i) => ({ url: `${appUrl}${routeFunc(i.slug)}` }));
};
