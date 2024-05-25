import Image from "next/image";
import { ProfileIconLink } from "./profile-icon-link";
import { TbBrandGithub, TbBrandTwitter } from "react-icons/tb";

export const Profile: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <Image src="/avatar.png" height={80} width={80} alt="avatar" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 text-lg font-bold">
          hwld
          <div className="flex gap-2">
            <ProfileIconLink
              icon={TbBrandTwitter}
              href="https://twitter.com/016User"
            />
            <ProfileIconLink
              icon={TbBrandGithub}
              href="https://github.com/hwld"
            />
          </div>
        </div>
        <div className="max-w-[700px]">
          カッコいいUIのWebアプリケーションを作りたいと思っている人です。
          <br />
          Webフロントエンドの他にも、バックエンドやソフトウェアアーキテクチャなどのWebアプリ開発に関連する様々な分野に興味があります。
          <br />
          プログラミング言語はTypeScriptが好きで、Webフロントエンド・バックエンド両方で使用しています。
        </div>
      </div>
    </div>
  );
};
