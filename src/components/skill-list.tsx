import Image from "next/image";
import { Heading } from "./heading";
import { TbExternalLink } from "@react-icons/all-files/tb/TbExternalLink";

type Skill = { name: string; imgFile: string; link: string };
const skills = [
  {
    imgFile: "typescript.png",
    name: "TypeScript",
    link: "https://www.typescriptlang.org/",
  },
  { imgFile: "react.png", name: "React", link: "https://ja.react.dev/" },
  { imgFile: "nextjs.png", name: "Next.js", link: "https://nextjs.org/" },
  {
    imgFile: "tailwindcss.png",
    name: "tailwindcss",
    link: "https://tailwindcss.com/",
  },
  { imgFile: "hono.png", name: "hono", link: "https://hono.dev/" },
  { imgFile: "php.png", name: "PHP", link: "https://www.php.net/" },
  { imgFile: "cakephp.png", name: "CakePHP", link: "https://cakephp.org/jp" },
  {
    imgFile: "postgresql.png",
    name: "PostgreSQL",
    link: "https://www.postgresql.org/",
  },
  {
    imgFile: "firebase.png",
    name: "Firebase",
    link: "https://firebase.google.com/?hl=ja",
  },
  {
    imgFile: "gcp.png",
    name: "Google Could",
    link: "https://cloud.google.com/?hl=ja",
  },
] satisfies Skill[];

export const SkillList: React.FC = () => {
  return (
    <div className="space-y-6">
      <Heading subTitle="skills">使ったことのある技術</Heading>
      <div className="flex w-full flex-wrap gap-4">
        {skills.map((t) => {
          return <SkillCard skill={t} key={t.name} />;
        })}
      </div>
    </div>
  );
};

const SkillCard: React.FC<{ skill: Skill }> = ({
  skill: { name, imgFile, link },
}) => {
  return (
    <a
      href={link}
      target="_blank"
      className="group flex size-[150px] flex-col items-center justify-center gap-1 rounded-lg border border-border p-4 shadow-sm transition-colors hover:bg-background-hover"
    >
      <Image
        src={`/techs-logo/${imgFile}`}
        width={80}
        height={80}
        alt={`${name}-logo`}
      />
      <div className="flex items-center gap-1 font-bold transition-colors group-hover:text-foreground-strong">
        {name}
        <TbExternalLink
          size={14}
          className="text-foreground-muted transition-colors group-hover:text-foreground-strong"
        />
      </div>
    </a>
  );
};
