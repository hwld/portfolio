import { z } from "zod";

const ContentInfoSchema = z.object({
  title: z.string(),
  createdAt: z.date(),
});

export const ArticleInfoSchema = ContentInfoSchema;
export type ArticleInfo = z.infer<typeof ArticleInfoSchema> & { slug: string };

const ProjectTag = z.union([
  z.literal("TypeScript"),
  z.literal("Next.js"),
  z.literal("React"),
  z.literal("Prisma"),
  z.literal("NextAuth"),
  z.literal("Mantine"),
  z.literal("hono"),
  z.literal("lucia"),
  z.literal("shadcn-ui"),
  z.literal("tailwindcss"),
]);
export type ProjectTag = z.infer<typeof ProjectTag>;

export const projectTagLinkMap: Map<ProjectTag, string> = new Map([
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
]);

const ProjectInfoBaseSchema = ContentInfoSchema.merge(
  z.object({
    tags: z.array(ProjectTag),
    imageSrc: z.string().optional(),
    summary: z.string(),
    projectUrl: z.string().optional(),
    githubUrl: z.string().optional(),
  })
);

const NormalProjectInfoSchema = ProjectInfoBaseSchema.merge(
  z.object({ type: z.literal("normal").optional() })
);

const FeaturedProjectInfoSchema = ProjectInfoBaseSchema.merge(
  z.object({
    type: z.literal("featured"),
    featuredDesc: z.string(),
    featuredOrder: z.number(),
  })
);
export type FeaturedProjectInfo = z.infer<typeof FeaturedProjectInfoSchema> & {
  slug: string;
};

export const ProjectInfoSchema = NormalProjectInfoSchema.or(
  FeaturedProjectInfoSchema
);

export type ProjectInfo = z.infer<typeof ProjectInfoSchema> & { slug: string };
