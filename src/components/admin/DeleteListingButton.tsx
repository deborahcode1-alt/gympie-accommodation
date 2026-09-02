"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteListingButton({ listingId, name }: { listingId: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This also deletes its bookings and photos.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/listings/${listingId}`, { method: "DELETE" });
      router.push("/admin/listings");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete listing
    </button>
  );
}
