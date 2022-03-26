import { EggOrigin } from "../contexts/EggStateContext";
import { NavItem } from "./NavItem";

export const Header: React.VFC<{ className?: string }> = () => {
  // 768~ 150px
  // ~767 50px
  return (
    <header className="h-[150px] max-md:h-[50px]">
      <div className="flex items-start justify-end h-full mr-[150px] max-md:mr-[50px]">
        <div className="bg-stone-700 py-3 max-md:py-2 px-8 max-md:px-3 rounded-bl-3xl max-md:rounded-md flex justify-end overflow-hidden z-0 shadow-2xl">
          <NavItem className="mx-5 max-md:mx-2 max-md:text-sm" href="#works">
            ホーム
          </NavItem>
          <NavItem className="mr-5 max-md:mr-2 max-md:text-sm" href="#works">
            プロフィール
          </NavItem>
          <NavItem className="mr-5 max-md:mr-2 max-md:text-sm" href="#works">
            作ったもの
          </NavItem>
        </div>
      </div>
      {/* 欠けてる部分 */}
      <div
        className={`absolute w-[150px] max-md:w-[50px] h-[150px] max-md:h-[50px] bg-yellow-500 rounded-bl-[40%] flex justify-center items-center top-0 right-0`}
      >
        <EggOrigin className="w-24 max-md:w-7 pb-3 max-md:pb-0" />
        <div
          className={`absolute h-[50px] max-md:h-[25px] w-[50px] max-md:w-[25px] bottom-[-50px] max-md:bottom-[-25px] right-0 shadow-[25px_0px] 
                      max-md:shadow-[10px_0px] shadow-yellow-500 max-md:shadow-yellow-500 rounded-tr-[50%]`}
        ></div>
        <div
          className={`absolute h-[50px] max-md:h-[25px] w-[50px] max-md:w-[25px] top-0 left-[-50px] max-md:left-[-25px] shadow-[25px_0px] 
                      max-md:shadow-[10px_0px] shadow-yellow-500 max-md:shadow-yellow-500 rounded-tr-[50%]`}
        ></div>
      </div>
    </header>
  );
};
