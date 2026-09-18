import Stripe from 'stripe';

/**
 * Returns a server-side Stripe SDK instance.
 * Reads process.env.STRIPE_SECRET_KEY.
 * Never expose STRIPE_SECRET_KEY to client-side components.
 */
export function getStripeServerClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.warn(
      '[Stripe] Missing STRIPE_SECRET_KEY environment variable. Server-side Stripe payments will be unavailable.'
    );
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
  });
}
