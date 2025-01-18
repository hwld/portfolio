import { CertificationList } from "@/components/certification-list";
import { FeaturedProjectList } from "@/components/featured-project-list";
import { LatestArticleList } from "@/components/latest-article-list";
import { BaseLayout } from "@/components/layout/base-layout";
import { Profile } from "@/components/profile";
import { SkillList } from "@/components/skill-list";

export default function Home() {
  return (
    <BaseLayout>
      <Profile />
      <LatestArticleList />
      <FeaturedProjectList />
      <SkillList />
      <CertificationList />
    </BaseLayout>
  );
}
