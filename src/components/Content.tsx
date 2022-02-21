import { Works } from "./Works";

export const Content: React.VFC<{ className?: string }> = ({ className }) => {
  return (
    <main className={`bg-stone-800 ${className} flex`}>
      <div className="max-w-[1500px] mx-auto flex-grow flex">
        <div className="p-10 my-5 rounded-md flex-grow mx-2">
          <Works className="" />
        </div>
      </div>
    </main>
  );
};
