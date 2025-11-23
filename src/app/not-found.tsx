import { TbGhost } from "@react-icons/all-files/tb/TbGhost";

const NotFoundPage = () => {
  return (
    <div className="absolute inset-0 grid place-content-center place-items-center gap-2 text-sm">
      <TbGhost size={100} />
      <p className="text-3xl font-bold">404 not found</p>
      <p>ページが存在しません。</p>
    </div>
  );
};

export default NotFoundPage;
