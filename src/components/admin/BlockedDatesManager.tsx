"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";

type Row = { id: string; date: Date; reason: string | null; source: string };
type ImportRef = { id: string; label: string };

export function BlockedDatesManager({
  listingId,
  blocked,
  imports,
}: {
  listingId: string;
  blocked: Row[];
  imports: ImportRef[];
}) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const sorted = [...blocked].sort((a, b) => a.date.getTime() - b.date.getTime());
  const manual = sorted.filter((b) => b.source === "manual");
  const labelFor = (source: string) =>
    imports.find((i) => i.id === source)?.label ?? "Connected calendar";
  const bySource = new Map<string, Row[]>();
  for (const b of sorted) {
    if (b.source === "manual") continue;
    const list = bySource.get(b.source) ?? [];
    list.push(b);
    bySource.set(b.source, list);
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/listings/${listingId}/blocked-dates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, reason: reason || undefined }),
      });
      setDate("");
      setReason("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function removeBlock(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/listings/${listingId}/blocked-dates?blockedId=${id}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={addBlock} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-sm">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Reason (optional)
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Maintenance"
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Block date
        </button>
      </form>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Manually blocked</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {manual.map((b) => (
              <li key={b.id} className="flex items-center justify-between">
                <span>
                  {formatDate(b.date)} {b.reason && <span className="text-black/50">({b.reason})</span>}
                </span>
                <button
                  onClick={() => removeBlock(b.id)}
                  disabled={busy}
                  className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
            {manual.length === 0 && <li className="text-black/50 dark:text-white/50">None</li>}
          </ul>
        </div>

        {[...bySource.entries()].map(([source, rows]) => (
          <div key={source}>
            <h3 className="text-sm font-semibold">Blocked via {labelFor(source)}</h3>
            <ul className="mt-2 space-y-1 text-sm text-black/70 dark:text-white/70">
              {rows.slice(0, 30).map((b) => (
                <li key={b.id}>{formatDate(b.date)}</li>
              ))}
              {rows.length > 30 && <li className="text-black/40">+{rows.length - 30} more</li>}
            </ul>
          </div>
        ))}

        {bySource.size === 0 && (
          <div>
            <h3 className="text-sm font-semibold">From connected calendars</h3>
            <p className="mt-2 text-sm text-black/50 dark:text-white/50">None yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
