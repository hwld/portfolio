import { ReactNode } from "react";
import { Egg } from "../contexts/EggStateContext";

const Profile: React.VFC<{ className?: string; children?: ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <div className={`flex ${className}`}>
      <div className="relative top-[-40px] h-[170px] w-[170px] flex justify-center shrink-0 items-center bg-stone-800 rounded-[30%] z-10">
        <div className="flex justify-center items-center h-[150px] w-[150px] bg-stone-700 border-2 border-yellow-500 rounded-[30%] pb-5">
          <p className="text-8xl">🐔</p>
        </div>
      </div>
      <div className="relative left-[-85px]  min-h-[180px] bg-stone-700 rounded-xl flex">
        <div className="w-[85px] shrink-0"></div>
        <div className="relative flex flex-col w-full py-5 px-10">
          <p className="text-2xl font-bold shrink-0">hwld</p>
          <p className="text-md mt-2 ml-3 text-stone-300">
            Webフロントエンドに興味のある専門学生です。
            <br />
            React/Typescriptが好きです
          </p>
          <div className="absolute w-[20px] h-[20px] left-0 top-0 rounded-tl-[50%] shadow-[-10px_0px] shadow-stone-800"></div>
        </div>
      </div>
      {children}
    </div>
  );
};

export const Hero: React.VFC<{ className?: string }> = () => {
  return (
    <div className="w-full bg-stone-800">
      <div className="ml-[190px]">
        <div className="mt-5 w-[80%] rounded-3xl h-[250px] bg-yellow-500 justify-center items-center flex whitespace-nowrap overflow-hidden">
          {[...new Array(5)].map(() => {
            return <Egg className="text-9xl" />;
          })}
        </div>
        <Profile className="relative left-[-100px] mx-auto -mt-10" />
      </div>
    </div>
  );
};
