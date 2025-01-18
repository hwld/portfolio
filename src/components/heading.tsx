import { TbHash } from "@react-icons/all-files/tb/TbHash";

type Props = { subTitle: string; children: string };
export const Heading: React.FC<Props> = ({ subTitle, children }) => {
  return (
    <h2 id={subTitle} className="space-y-1">
      <div className="text-foreground-muted text-sm">{subTitle}</div>
      <a
        className="flex items-center gap-1 text-lg font-bold w-fit"
        href={`#${subTitle}`}
      >
        <TbHash className="text-lg mt-[1px]" />
        {children}
      </a>
    </h2>
  );
};
