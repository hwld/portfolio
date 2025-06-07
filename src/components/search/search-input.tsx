import { TbSearch } from "@react-icons/all-files/tb/TbSearch";
import { forwardRef } from "react";

type Props = { query: string; onChangeQuery: (query: string) => void };

export const SearchInput = forwardRef<HTMLInputElement, Props>(
  function SearchInput(
    { query: value, onChangeQuery: onChange, ...props },
    ref
  ) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="relative h-9">
        <div className="h-full aspect-square grid place-items-center absolute left-0 top-0">
          <TbSearch className="size-5" />
        </div>
        <input
          ref={ref}
          autoFocus
          {...props}
          className="inset-y-0 pl-8 pr-2 text-sm border border-border-strong rounded-sm w-full h-full focus-visible:outline-hidden focus-visible:border-foreground bg-transparent placeholder:text-foreground-muted"
          // NotoSansだと全角アルファベットでbaselineがずれるので
          style={{ fontFamily: "sans-serif" }}
          placeholder="キーワード"
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  }
);
