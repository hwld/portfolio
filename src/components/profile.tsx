import { TbBalloon } from "@react-icons/all-files/tb/TbBalloon";
import { TbBook } from "@react-icons/all-files/tb/TbBook";
import { TbBrandGithub } from "@react-icons/all-files/tb/TbBrandGithub";
import { TbBrandX } from "@react-icons/all-files/tb/TbBrandX";
import { AvatarIcon } from "./avatar-icon";
import { type IconType } from "@react-icons/all-files/lib";
import { ReactNode } from "react";
import { ExternalLink } from "./external-link";
import { TextLink } from "./link";
import { Routes } from "@/routes";

export const Profile: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <AvatarIcon />
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 text-2xl font-bold">hwld</div>
        <div className="max-w-[700px] md:text-base space-y-3">
          <p>かっこいいUIのWebアプリを作るのが好きなひとです。</p>
          <p>
            言語はTypeScriptが好きで、Webフロントエンド・バックエンドの両方で使用しています。
          </p>
          <p>
            Webフロントエンドの技術に長く触れてきましたが、バックエンドや運用、ソフトウェアアーキテクチャ、セキュリティなどのWebアプリ開発に関連する様々な分野に興味があり、調べたり試したりしています。
          </p>
          <p>
            これまでに調べてきたものは
            <span className="mx-1">
              <TextLink href={Routes.blog()}>こちら</TextLink>
            </span>
            から、作ってきたものは
            <span className="mx-1">
              <TextLink href={Routes.projects()}>こちら</TextLink>
            </span>
            から見られます。
          </p>
        </div>
        <div className="space-y-2">
          <ProfileBasicInfo icon={TbBalloon} title="誕生日">
            2000年7月1日
          </ProfileBasicInfo>
          <ProfileBasicInfo icon={TbBrandX} title="X">
            <ExternalLink href="http://x.com/016User" size="sm">
              x.com/hwld
            </ExternalLink>
          </ProfileBasicInfo>
          <ProfileBasicInfo icon={TbBrandGithub} title="Github">
            <ExternalLink href="https://github.com/hwld" size="sm">
              github.com/hwld
            </ExternalLink>
          </ProfileBasicInfo>
          <ProfileBasicInfo icon={TbBook} title="持ってる本">
            <ExternalLink href="https://booklog.jp/users/hwld" size="sm">
              booklog.jp/users/hwld
            </ExternalLink>
          </ProfileBasicInfo>
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
      <div className="flex gap-1 items-center text-foreground-muted">
        <Icon size={18} />
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
};
