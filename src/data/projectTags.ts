export const tagLinkMap = new Map([
  ["TypeScript", "https://www.typescriptlang.org/"],
  ["Next.js", "https://nextjs.org/"],
  ["React", "https://ja.react.dev/"],
  ["Prisma", "https://www.prisma.io/"],
  ["NextAuth", "https://next-auth.js.org/"],
  ["Mantine", "https://mantine.dev/"],
  ["hono", "https://hono.dev/"],
  ["lucia", "https://lucia-auth.com/"],
  ["shadcn-ui", "https://ui.shadcn.com/"],
  ["tailwindcss", "https://tailwindcss.com/"],
] as const);

export type ProjectTagLabel = ReturnType<
  (typeof tagLinkMap)["keys"]
> extends IterableIterator<infer T>
  ? T
  : never;
