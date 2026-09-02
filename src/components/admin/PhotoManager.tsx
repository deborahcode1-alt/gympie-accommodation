"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Photo = { id: string; url: string; alt: string };

export function PhotoManager({ listingId, photos }: { listingId: string; photos: Photo[] }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addPhoto(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt: alt || undefined }),
      });
      if (!res.ok) throw new Error("Could not add photo — check the URL");
      setUrl("");
      setAlt("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add photo");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(photoId: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/listings/${listingId}/photos?photoId=${photoId}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((p) => (
          <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg">
            <Image src={p.url} alt={p.alt || "Listing photo"} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(p.id)}
              disabled={busy}
              className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={addPhoto} className="mt-4 flex flex-wrap gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://... photo URL"
          required
          className="min-w-[220px] flex-1 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
        />
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Description (optional)"
          className="w-48 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Add photo
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-black/50 dark:text-white/50">
        Paste a URL to an image you host elsewhere (e.g. Imgur, your own storage). The first photo
        becomes the cover photo.
      </p>
    </div>
  );
}
