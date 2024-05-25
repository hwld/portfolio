import Image from "next/image";
import { ProfileIconLink } from "./profile-icon-link";
import { TbBrandGithub, TbBrandTwitter } from "react-icons/tb";

export const Profile: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <Image src="/avatar.png" height={80} width={80} alt="avatar" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 font-medium">
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
        <div className="text-sm">
          Webフロントエンド・バックエンド・UIデザイン、ソフトウェアアーキテクチャなど、Webアプリケーション開発に関連する様々な分野に興味があります。
          <br />
          TypeScriptが好きで、Webフロントエンド・バックエンドで使用しています。
        </div>
      </div>
    </div>
  );
};
