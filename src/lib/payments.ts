// Square isn't connected for any host yet. Once a host has real Square API
// credentials, store them on their Host record (squareAccessToken,
// squareLocationId) and implement createSquareCheckout below to create a
// real payment against that host's account. Until then, bookings stay
// request-only: the host confirms manually and arranges payment themselves.

export type HostPaymentConfig = {
  squareAccessToken: string | null;
  squareLocationId: string | null;
};

export function canTakeRealPayment(host: HostPaymentConfig | null): boolean {
  return !!host?.squareAccessToken && !!host?.squareLocationId;
}

export async function createSquareCheckout(params: {
  host: HostPaymentConfig;
  amount: number;
  currency: string;
  referenceId: string;
}): Promise<{ checkoutUrl: string }> {
  if (!canTakeRealPayment(params.host)) {
    throw new Error(
      "Square is not configured for this host yet — add their squareAccessToken and " +
        "squareLocationId before calling createSquareCheckout."
    );
  }
  throw new Error("createSquareCheckout is not implemented yet.");
}
