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
      aria-label="コードをコピーする"
      onClick={handleCopyCode}
      className="absolute top-2 right-2 grid size-8 place-items-center rounded-sm border border-zinc-500 bg-zinc-700 pb-px opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-zinc-600"
    >
      <Icon size="75%" />
    </button>
  );
};
