"use client";

import { useState } from "react";

export function CopyableUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable; user can select the text manually
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        className="flex-1 truncate rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
      />
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
