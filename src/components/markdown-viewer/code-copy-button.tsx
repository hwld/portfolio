"use client";

import { useState } from "react";
import { TbClipboard } from "@react-icons/all-files/tb/TbClipboard";
import { TbClipboardCheck } from "@react-icons/all-files/tb/TbClipboardCheck";

type Props = { codeId: string };

export const CodeCopyButton: React.FC<Props> = ({ codeId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    const codeElement = window.document.querySelector(`#${codeId}`);
    if (!codeElement || !("clipboard" in navigator)) {
      return;
    }

    const codeText = codeElement.textContent ?? "";

    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  };

  const Icon = copied ? TbClipboardCheck : TbClipboard;
  return (
    <button
      onClick={handleCopyCode}
      className="absolute right-2 top-2 pb-[1px] opacity-0 group-hover:opacity-100 size-8 shadow border border-zinc-600 bg-zinc-700 rounded grid place-items-center hover:bg-zinc-600 transition-all"
    >
      <Icon size="75%" />
    </button>
  );
};
