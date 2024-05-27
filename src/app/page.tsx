import { CertificationList } from "@/components/certification-list";
import { FeaturedProjectList } from "@/components/featured-project-list";
import { Profile } from "@/components/profile/profile";

export default function Home() {
  return (
    <div className="grid grid-rows-[min-content_1fr] gap-12">
      <Profile />
      <FeaturedProjectList />
      <CertificationList />
    </div>
  );
}
