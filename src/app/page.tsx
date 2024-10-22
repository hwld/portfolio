import { CertificationList } from "@/components/certification-list";
import { FeaturedProjectList } from "@/components/featured-project-list";
import { BaseLayout } from "@/components/layout/base-layout";
import { Profile } from "@/components/profile";
import { SkillList } from "@/components/skill-list";

export default function Home() {
  return (
    <BaseLayout>
      <Profile />
      <FeaturedProjectList />
      <SkillList />
      <CertificationList />
    </BaseLayout>
  );
}
