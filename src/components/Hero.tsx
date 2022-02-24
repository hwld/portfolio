import { ReactNode } from "react";
import Icon from "../../images/icons/icon.webp";
import { Egg } from "../contexts/EggStateContext";

const Profile: React.VFC<{ className?: string; children?: ReactNode }> = ({
  className,
  children,
}) => {
  // 150px
  // md 50px

  return (
    <div className={`flex ${className}`}>
      <div
        className="relative top-[-40px] h-[170px] max-md:h-[120px] w-[170px] max-md:w-[120px] flex justify-center shrink-0 
                        items-center bg-stone-800 rounded-[100%] z-10"
      >
        <div
          className="flex justify-center items-center h-[150px] max-md:h-[100px] w-[150px] max-md:w-[100px] bg-stone-700 border-2 
                          border-yellow-500 rounded-[100%] pb-4 max-md:pb-3"
        >
          <img
            src={Icon}
            className="w-28 max-md:w-20 select-none pointer-events-none"
          />
        </div>
      </div>
      <div className="relative max-md:absolute left-[-85px] max-md:left-[40px] max-md:right-[40px]  min-h-[180px] max-md:min-h-[100px] bg-stone-700 rounded-xl flex shadow-2xl">
        <div className="w-[85px] shrink-0"></div>
        <div className="relative flex flex-col w-full p-5 max-md:p-2 grow shrink">
          <p className="text-2xl max-md:text-lg font-bold shrink-0">hwld</p>
          <p className="text-md max-md:text-sm mt-2 max-md:mt-1 ml-3 max-md:ml-2 max-md:pb-2 text-stone-300 break-all">
            Webフロントエンドに興味のある専門学生です。
            <br />
            React/Typescriptが好きです
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export const Hero: React.VFC<{ className?: string }> = () => {
  return (
    <div className="flex flex-col items-stretch relative">
      <div
        className="h-[300px] max-md:h-[150px] m-10 max-md:m-5 rounded-3xl max-md:rounded-xl bg-yellow-500 justify-center items-center overflow-hidden 
                        flex pb-10 max-md:pb-7"
      >
        {[...new Array(13)].map((_, i) => {
          return <Egg key={i} className="w-52 max-md:w-20" />;
        })}
      </div>
      <Profile className="absolute max-w-[1200px] top-[290px] max-md:top-[140px] left-0 right-0 mx-auto" />
      <div className="h-[90px] max-md:h-[70px]"></div>
    </div>
  );
};
