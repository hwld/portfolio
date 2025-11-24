import { TbCircleFilled } from "react-icons/tb";
import { Heading } from "./heading";
import { ReactNode } from "react";

export const CertificationList: React.FC = () => {
  return (
    <div className="space-y-4">
      <Heading subTitle="certifications">資格</Heading>
      <div className="space-y-2">
        <Certification href="https://www.ipa.go.jp/shiken/kubun/list.html">
          基本情報技術者試験
        </Certification>
        <Certification href="https://www.ipa.go.jp/shiken/kubun/list.html">
          応用情報技術者試験
        </Certification>
        <Certification href="https://www.ipa.go.jp/shiken/kubun/list.html">
          情報処理安全確保支援士試験
        </Certification>
        <Certification href="https://www.ipa.go.jp/shiken/kubun/list.html">
          データベーススペシャリスト試験
        </Certification>
        <Certification href="https://www.ipa.go.jp/shiken/kubun/list.html">
          ネットワークスペシャリスト試験
        </Certification>
        <Certification href="https://www.ipa.go.jp/shiken/kubun/list.html">
          エンベデッドシステムスペシャリスト試験
        </Certification>
      </div>
    </div>
  );
};

const Certification: React.FC<{ children: ReactNode; href: string }> = ({
  children,
}) => {
  return (
    <div className="ml-2 flex items-center gap-2">
      <TbCircleFilled size={10} /> <div>{children}</div>
    </div>
  );
};
