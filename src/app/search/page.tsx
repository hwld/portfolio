import { SummaryLayout } from "@/components/layout/summary-layout";
import { SearchPageContent } from "@/components/search/search-page-content";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "search - hwld",
};

const SearchPage: React.FC = () => {
  return (
    <SummaryLayout pageTitle="ページ検索" pageSubTitle="search">
      <Suspense>
        <SearchPageContent />
      </Suspense>
    </SummaryLayout>
  );
};

export default SearchPage;
