'use server';

import { getStripeServerClient } from '@/lib/stripe/stripeServer';

export interface CreateStripeCheckoutInput {
  bookingReference: string;
  serviceName: string;
  packageName: string;
  finalPrice: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  bedrooms: string;
  bathrooms: string;
  bookingDate: string;
  bookingTime: string;
  origin: string;
}

export interface CreateStripeCheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Server action to create a Stripe Checkout Session for an existing pending booking.
 * Amount is derived directly from the server-calculated booking price.
 */
export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutInput
): Promise<CreateStripeCheckoutResult> {
  try {
    const {
      bookingReference,
      serviceName,
      packageName,
      finalPrice,
      firstName,
      lastName,
      email,
      propertyAddress,
      bedrooms,
      bathrooms,
      bookingDate,
      bookingTime,
      origin,
    } = input;

    if (!bookingReference) {
      return { success: false, error: 'Booking reference is required.' };
    }

    if (isNaN(finalPrice) || finalPrice <= 0) {
      return { success: false, error: 'Invalid booking price calculated.' };
    }

    // 1. Initialize Stripe server client
    const stripe = getStripeServerClient();
    if (!stripe) {
      return {
        success: false,
        error: 'Stripe payment service is not configured. Please use manual payment fallback.',
      };
    }

    // Determine clean origin URL fallback
    const baseUrl = (origin && origin.startsWith('http')) ? origin : 'http://localhost:3000';

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      client_reference_id: bookingReference,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: `HandCleaned — ${serviceName} (${packageName})`,
              description: `Ref: ${bookingReference} | ${bedrooms} Bed, ${bathrooms} Bath | ${propertyAddress} | ${bookingDate} @ ${bookingTime}`,
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingReference,
        customerEmail: email,
        customerName: `${firstName} ${lastName}`.trim(),
        service: serviceName,
        packageName,
        bedrooms: String(bedrooms),
        bathrooms: String(bathrooms),
        propertyAddress,
        bookingDate,
        bookingTime,
      },
      success_url: `${baseUrl}/booking/success?reference=${encodeURIComponent(bookingReference)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking/cancel?reference=${encodeURIComponent(bookingReference)}`,
    });

    if (!session.url) {
      return { success: false, error: 'Failed to generate Stripe checkout URL.' };
    }

    return {
      success: true,
      url: session.url,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Create Stripe Checkout Exception]:', message);
    return {
      success: false,
      error: `Failed to create Stripe payment session: ${message}`,
    };
  }
}
