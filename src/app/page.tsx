import { Profile } from "@/components/profile/profile";
import { ProjectList } from "@/components/project-list";

export default function Home() {
  return (
    <main className="max-w-[700px] px-6 py-16 m-auto grid grid-rows-[min-content_1fr] gap-10">
      <Profile />
      <ProjectList />
    </main>
  );
}
