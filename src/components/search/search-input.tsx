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
      <div className="relative h-9 text-foreground-muted focus-within:text-foreground">
        <div className="absolute top-0 left-0 grid aspect-square h-full place-items-center">
          <TbSearch className="size-5" />
        </div>
        <input
          ref={ref}
          autoFocus
          {...props}
          className="inset-y-0 h-full w-full rounded-sm border border-border bg-input-background pr-2 pl-8 text-sm placeholder:text-foreground-muted focus-visible:border-border-strong focus-visible:outline-hidden"
          // NotoSansだと全角アルファベットでbaselineがずれるので
          // style={{ fontFamily: "sans-serif" }}
          placeholder="検索ワードを入力してください..."
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  }
);
