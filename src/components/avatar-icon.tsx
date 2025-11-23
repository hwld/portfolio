import Image from "next/image";
import Link from "next/link";

export const AvatarIcon: React.FC = () => {
  return <Image src="/avatar.png" height={80} width={80} alt="avatar" />;
};

export const AvatarIconLink: React.FC = () => {
  return (
    <Link href="/" className="block w-fit">
      <AvatarIcon />
    </Link>
  );
};
