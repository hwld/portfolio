import { TbHash } from "react-icons/tb";

type Props = { subTitle: string; children: string };
export const Heading: React.FC<Props> = ({ subTitle, children }) => {
  return (
    <h2 id={subTitle}>
      <div className="text-zinc-400 text-xs">{subTitle}</div>
      <a
        className="flex items-center gap-1 text-lg w-fit"
        href={`#${subTitle}`}
      >
        <TbHash className="text-lg mt-[1px]" />
        {children}
      </a>
    </h2>
  );
};
