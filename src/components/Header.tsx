export const Header: React.VFC<{ className?: string }> = () => {
  return (
    <header className="w-full bg-neutral-600 h-14">
      <div className="w-[900px] m-auto flex items-center justify-end h-full">
        <a className="ml-2" href="#works">
          作ったもの
        </a>
      </div>
    </header>
  );
};
