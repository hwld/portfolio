import { SearchPageContent } from "@/components/search/search-page";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "search - hwld",
};

const SearchPage: React.FC = () => {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
