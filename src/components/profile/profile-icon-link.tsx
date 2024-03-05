import { IconType } from "react-icons";

export const ProfileIconLink: React.FC<{ icon: IconType; href: string }> = ({
  icon: Icon,
  href,
}) => {
  return (
    <a
      className="size-[24px] grid place-items-center border border-zinc-500 rounded text-zinc-300 transition-colors hover:bg-white/15"
      href={href}
      target="_blank"
      aria-label="profile-link"
    >
      <Icon size={16} />
    </a>
  );
};
