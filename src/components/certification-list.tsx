import { TbCircleFilled } from "@react-icons/all-files/tb/TbCircleFilled";
import { Heading } from "./heading";
import { ReactNode } from "react";

export const CertificationList: React.FC = () => {
  return (
    <div className="space-y-4">
      <Heading subTitle="certifications">資格</Heading>
      <div className="space-y-2">
        <Certification>FE / AP</Certification>
        <Certification>SC / DB / NW / ES</Certification>
      </div>
    </div>
  );
};

const Certification: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="ml-2 flex items-center gap-2">
      <TbCircleFilled size={10} /> <div>{children}</div>
    </div>
  );
};
