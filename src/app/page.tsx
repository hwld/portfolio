import { Profile } from "@/components/profile/profile";
import { ProjectList } from "@/components/project-list";

export default function Home() {
  return (
    <main className="max-w-[1000px] relative pt-14 pb-20 m-auto grid grid-rows-[min-content_1fr] gap-10 px-6 md:px-12">
      <Profile />
      <ProjectList />
    </main>
  );
}
