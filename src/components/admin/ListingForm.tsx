"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  basePrice: number;
  cleaningFee: number;
  minNights: number;
  amenities: string[];
  published: boolean;
};

const empty: Initial = {
  name: "",
  tagline: "",
  description: "",
  address: "",
  maxGuests: 2,
  bedrooms: 1,
  beds: 1,
  baths: 1,
  basePrice: 100,
  cleaningFee: 0,
  minNights: 1,
  amenities: [],
  published: true,
};

export function ListingForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial ?? empty);
  const [amenitiesText, setAmenitiesText] = useState((initial?.amenities ?? []).join(", "));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      amenities: amenitiesText
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        form.id ? `/api/admin/listings/${form.id}` : "/api/admin/listings",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ? JSON.stringify(data.error) : "Save failed");

      if (!form.id) {
        router.push(`/admin/listings/${data.listing.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="rounded-md border border-card-border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Tagline
        <input
          value={form.tagline}
          onChange={(e) => update("tagline", e.target.value)}
          className="rounded-md border border-card-border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          rows={5}
          className="rounded-md border border-card-border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Address
        <input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="rounded-md border border-card-border px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          Max guests
          <input
            type="number"
            min={1}
            value={form.maxGuests}
            onChange={(e) => update("maxGuests", Number(e.target.value))}
            className="rounded-md border border-card-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Bedrooms
          <input
            type="number"
            min={0}
            value={form.bedrooms}
            onChange={(e) => update("bedrooms", Number(e.target.value))}
            className="rounded-md border border-card-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Beds
          <input
            type="number"
            min={0}
            value={form.beds}
            onChange={(e) => update("beds", Number(e.target.value))}
            className="rounded-md border border-card-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Baths
          <input
            type="number"
            min={0}
            step={0.5}
            value={form.baths}
            onChange={(e) => update("baths", Number(e.target.value))}
            className="rounded-md border border-card-border px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Base price / night
          <input
            type="number"
            min={0}
            value={form.basePrice}
            onChange={(e) => update("basePrice", Number(e.target.value))}
            className="rounded-md border border-card-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Cleaning fee
          <input
            type="number"
            min={0}
            value={form.cleaningFee}
            onChange={(e) => update("cleaningFee", Number(e.target.value))}
            className="rounded-md border border-card-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Min nights
          <input
            type="number"
            min={1}
            value={form.minNights}
            onChange={(e) => update("minNights", Number(e.target.value))}
            className="rounded-md border border-card-border px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Amenities (comma separated)
        <input
          value={amenitiesText}
          onChange={(e) => setAmenitiesText(e.target.value)}
          placeholder="Wifi, Kitchen, Free parking, Pool"
          className="rounded-md border border-card-border px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
        />
        Published (visible on the public site)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-fit rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-deep disabled:opacity-50"
      >
        {submitting ? "Saving..." : form.id ? "Save changes" : "Create listing"}
      </button>
    </form>
  );
}
