import { ProfileIconLink } from "./profile-icon-link";
import {
  TbBalloon,
  TbBook,
  TbBrandGithub,
  TbBrandTwitter,
} from "react-icons/tb";
import { AvatarIcon } from "../avatar-icon";
import { IconType } from "react-icons";
import { ReactNode } from "react";
import { ExternalLink } from "../external-link";

export const Profile: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <AvatarIcon />
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 text-xl font-bold">
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
        <div className="space-y-1">
          <ProfileBasicInfo icon={TbBalloon} title="誕生日">
            2000年7月1日
          </ProfileBasicInfo>
          <ProfileBasicInfo icon={TbBook} title="持ってる本">
            <a target="_blank" href="https://booklog.jp/users/hwld"></a>
            <ExternalLink href="https://booklog.jp/users/hwld" size="sm">
              booklog.jp/users/hwld
            </ExternalLink>
          </ProfileBasicInfo>
        </div>
        <div className="max-w-[700px] md:text-base">
          カッコいいUIのWebアプリケーションを作りたいと思っている人です。
          <br />
          Webフロントエンドの他にも、バックエンドや運用、ソフトウェアアーキテクチャなどのWebアプリ開発に関連する様々な分野に興味があり、調べたり試したりしています。
          <br />
          プログラミング言語はTypeScriptが好きで、Webフロントエンド・バックエンド両方で使用しています。
        </div>
      </div>
    </div>
  );
};

const ProfileBasicInfo: React.FC<{
  icon: IconType;
  title: string;
  children: ReactNode;
}> = ({ icon: Icon, title, children }) => {
  return (
    <div className="grid grid-cols-[110px_1fr] w-full">
      <div className="flex gap-1 items-center text-zinc-400">
        <Icon size={18} />
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
};
