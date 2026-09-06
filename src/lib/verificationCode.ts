import crypto from "crypto";

export const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_CODE_ATTEMPTS = 5;

export function generateCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}
