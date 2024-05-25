import { TbGhost } from "react-icons/tb";

const NotFoundPage = () => {
  return (
    <div className="grid inset-0 absolute place-items-center place-content-center text-sm gap-2">
      <TbGhost size={100} />
      <p className="text-3xl font-bold">404 not found</p>
      <p>ページが存在しません。</p>
    </div>
  );
};

export default NotFoundPage;
