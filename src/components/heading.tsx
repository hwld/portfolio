import { TbHash } from "@react-icons/all-files/tb/TbHash";

type Props = { subTitle: string; children: string };
export const Heading: React.FC<Props> = ({ subTitle, children }) => {
  return (
    <h2 id={subTitle} className="space-y-1">
      <div className="text-sm text-foreground-muted">{subTitle}</div>
      <a
        className="flex w-fit items-center gap-1 text-lg font-bold"
        href={`#${subTitle}`}
      >
        <TbHash className="mt-px text-lg" />
        {children}
      </a>
    </h2>
  );
};
