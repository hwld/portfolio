export const Routes = {
  home: () => `/` as const,

  projects: () => `/projects` as const,
  project: (slug: string) => `${Routes.projects()}/${slug}` as const,

  blog: () => `/blog`,
  blogDetail: (slug: string) => `${Routes.blog()}/${slug}` as const,
};
