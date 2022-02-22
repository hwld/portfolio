import { EggOrigin } from "../contexts/EggStateContext";
import { NavItem } from "./NavItem";

export const Header: React.VFC<{ className?: string }> = () => {
  return (
    <header className="w-full bg-stone-800 h-[150px]">
      <div className="flex items-start justify-end h-full mr-[150px]">
        <div className="relative bg-stone-700 py-5 px-[30px] rounded-bl-3xl flex justify-end overflow-hidden z-0">
          <NavItem className="mx-10" href="#works">
            ホーム
          </NavItem>
          <NavItem className="mr-10" href="#works">
            プロフィール
          </NavItem>
          <NavItem className="mr-10" href="#works">
            作ったもの
          </NavItem>
        </div>
      </div>
      {/* 欠けてる部分 */}
      <div
        className={`absolute w-[150px] h-[150px] bg-yellow-500 rounded-bl-[40%] flex justify-center items-center top-0 right-0`}
      >
        <EggOrigin className="text-8xl pb-3" />
        <div
          className={`absolute h-[50px] w-[50px] bottom-[-50px] right-0 shadow-[25px_0px] shadow-yellow-500 rounded-tr-[50%]`}
        ></div>
        <div
          className={`absolute h-[50px] w-[50px] top-0 left-[-50px] shadow-[25px_0px] shadow-yellow-500 rounded-tr-[50%]`}
        ></div>
      </div>
    </header>
  );
};
