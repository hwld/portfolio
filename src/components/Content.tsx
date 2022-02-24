import { Works } from "./Works";

export const Content: React.VFC<{ className?: string }> = ({ className }) => {
  return (
    <main
      className={`w-full max-w-[1500px] p-10 max-md:p-6  mx-auto max-md:mx-0 ${className}`}
    >
      <Works />
    </main>
  );
};
