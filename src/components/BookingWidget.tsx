"use client";

import { useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { formatMoney } from "@/lib/format";

type Props = {
  listingId: string;
  basePrice: number;
  cleaningFee: number;
  minNights: number;
  maxGuests: number;
  unavailableNights: string[];
};

function toISODate(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}

function nightsBetween(from: Date, to: Date) {
  const ms = new Date(toISODate(to)).getTime() - new Date(toISODate(from)).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function BookingWidget({
  listingId,
  basePrice,
  cleaningFee,
  minNights,
  maxGuests,
  unavailableNights,
}: Props) {
  const unavailableSet = useMemo(() => new Set(unavailableNights), [unavailableNights]);
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isDisabled = (date: Date) => {
    if (date < today) return true;
    return unavailableSet.has(toISODate(date));
  };

  const nights = range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const total = nights > 0 ? basePrice * nights + cleaningFee : 0;
  const meetsMinStay = nights === 0 || nights >= minNights;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!range?.from || !range?.to) {
      setError("Please select your check-in and check-out dates.");
      return;
    }
    if (!meetsMinStay) {
      setError(`Minimum stay is ${minNights} night(s).`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          guestName,
          guestEmail,
          guestPhone: guestPhone || undefined,
          checkIn: toISODate(range.from),
          checkOut: toISODate(range.to),
          guests,
          message: message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.formErrors?.[0] ?? data?.error ?? "Something went wrong");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-black/10 p-6 dark:border-white/15">
        <h3 className="text-lg font-semibold">Request sent</h3>
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">
          Thanks, {guestName.split(" ")[0] || "there"}! Your booking request has been sent to the
          host for confirmation. You&apos;ll hear back by email at {guestEmail}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-black/10 p-6 dark:border-white/15"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-semibold">{formatMoney(basePrice)} / night</p>
        {cleaningFee > 0 && (
          <p className="text-xs text-black/60 dark:text-white/60">
            + {formatMoney(cleaningFee)} cleaning fee
          </p>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={isDisabled}
          excludeDisabled
          numberOfMonths={1}
          className="!mx-auto"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <label className="flex flex-col gap-1">
          Check-in
          <input
            readOnly
            value={range?.from ? toISODate(range.from) : ""}
            className="rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20"
            placeholder="Select date"
          />
        </label>
        <label className="flex flex-col gap-1">
          Check-out
          <input
            readOnly
            value={range?.to ? toISODate(range.to) : ""}
            className="rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20"
            placeholder="Select date"
          />
        </label>
      </div>

      {nights > 0 && !meetsMinStay && (
        <p className="mt-2 text-sm text-red-600">Minimum stay is {minNights} nights.</p>
      )}

      <label className="mt-4 flex flex-col gap-1 text-sm">
        Guests
        <input
          type="number"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
          className="rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20"
        />
      </label>

      <label className="mt-3 flex flex-col gap-1 text-sm">
        Full name
        <input
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          className="rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20"
        />
      </label>

      <label className="mt-3 flex flex-col gap-1 text-sm">
        Email
        <input
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          required
          className="rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20"
        />
      </label>

      <label className="mt-3 flex flex-col gap-1 text-sm">
        Phone (optional)
        <input
          value={guestPhone}
          onChange={(e) => setGuestPhone(e.target.value)}
          className="rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20"
        />
      </label>

      <label className="mt-3 flex flex-col gap-1 text-sm">
        Message (optional)
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20"
        />
      </label>

      {nights > 0 && (
        <div className="mt-4 space-y-1 border-t border-black/10 pt-4 text-sm dark:border-white/15">
          <div className="flex justify-between">
            <span>
              {formatMoney(basePrice)} x {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>{formatMoney(basePrice * nights)}</span>
          </div>
          {cleaningFee > 0 && (
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>{formatMoney(cleaningFee)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/85"
      >
        {submitting ? "Sending request..." : "Request to book"}
      </button>
      <p className="mt-2 text-center text-xs text-black/50 dark:text-white/50">
        The host will confirm your dates before any payment is collected.
      </p>
    </form>
  );
}
