"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookingActions({ bookingId, status }: { bookingId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (status === "PENDING") {
    return (
      <div className="flex gap-2">
        <button
          disabled={busy}
          onClick={() => setStatus("CONFIRMED")}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-accent-deep disabled:opacity-50"
        >
          Confirm
        </button>
        <button
          disabled={busy}
          onClick={() => setStatus("DECLINED")}
          className="rounded-md border border-card-border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
        >
          Decline
        </button>
      </div>
    );
  }

  if (status === "CONFIRMED") {
    return (
      <button
        disabled={busy}
        onClick={() => setStatus("CANCELLED")}
        className="rounded-md border border-card-border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      >
        Cancel
      </button>
    );
  }

  return null;
}
