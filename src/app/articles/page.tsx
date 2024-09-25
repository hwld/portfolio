import { AvatarIcon } from "@/components/avatar-icon";
import { TbHash } from "@react-icons/all-files/tb/TbHash";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <Link href="/">
        <AvatarIcon />
      </Link>
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="space-y-1">
            <div className="text-zinc-400 text-xs">articles</div>
            <div className="flex items-center gap-1 text-xl font-bold">
              <TbHash className="text-lg mt-[1px]" />
              ブログ
            </div>
          </h1>
          <div className="max-w-[700px] md:text-base">準備中です...</div>
        </div>
        <div className="h-screen" />
      </div>
    </div>
  );
}
