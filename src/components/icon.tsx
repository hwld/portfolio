import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { size: "default" | "sm" };
export const Icon: React.FC<Props> = ({ size = "default", ...props }) => {
  const sizeMap = {
    default: { wrapper: 80, content: 50, border: 4 },
    sm: { wrapper: 40, content: 25, border: 2 },
  };

  return (
    <div
      className="rounded-full border-[length:var(--border)] border-zinc-200 grid place-items-center"
      style={{
        width: sizeMap[size].wrapper,
        height: sizeMap[size].wrapper,
        ...{ "--border": `${sizeMap[size].border}px` },
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={sizeMap[size].content}
        height={sizeMap[size].content}
        fill="none"
        viewBox="0 0 40 40"
        {...props}
      >
        <g fill="#E4E4E7">
          <path d="M30.533 30.533c-1.818 9.088-15.467 11.734-22.6 5.334 9.933-.734 15.696-4.681 20.8-13.067 2.8-4.6 10.467-1.667 8.8 3.8-.733-1.267-2.867-2.467-4.333-1.467-1.807 1.232-2.134 2.734-2.667 5.4ZM12.466 4.8c-4.777-2.171-8.6-.533-8.266 6.4.422-.622 2.267-2.4 5.467-2.4 4.54 0 2.733 1.4 5.466 1.6 2.934.215 6.2-6 .667-9.867.733 2.334-1.133 5.267-3.334 4.267ZM5.659 23.265c2.113-1.18 2.483-5.302-.392-5.663-.626-.079-1.644 2.092-1.957 3.225-.391 1.415.235 3.617 2.349 2.438Z" />
          <path
            fillRule="evenodd"
            d="M.667 16.4c.733-1.467 3.2-3.133 4.533-3.6 3-4.133 9.4-1.333 9.4 1.533l.4 5.934c0 2.866 5.2 6.6 8.333 2.466C22.6 8.4 40.6 8.867 39.2 21.933c-1.467-3.466-8.73-5.491-11.467-1.133-3.6 5.733-9.4 13.4-21.133 12.933-2.347-2.346-2.8-7.8-2.067-8.266 5.964-3.796 3.667-8.6 1.933-8.6l-5.8-.467Zm8.266-.933a1.467 1.467 0 1 0 0-2.934 1.467 1.467 0 0 0 0 2.934Z"
            clipRule="evenodd"
          />
        </g>
      </svg>
    </div>
  );
};
