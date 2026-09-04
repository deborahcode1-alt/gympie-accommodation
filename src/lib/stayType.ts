export type StayType = "SHORT_TERM" | "LONG_TERM";

export function stayTypeLabel(stayType: StayType) {
  return stayType === "LONG_TERM" ? "Long-term stay" : "Short-term stay";
}
