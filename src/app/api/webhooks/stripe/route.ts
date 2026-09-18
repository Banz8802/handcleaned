import { NextResponse } from 'next/server';
import { getStripeServerClient } from '@/lib/stripe/stripeServer';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import {
  generateCustomerReceiptEmail,
  generateAdminNotificationEmail,
  type BookingEmailData,
} from '@/lib/email/emailTemplates';
import type Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const stripe = getStripeServerClient();
    if (!stripe) {
      console.error('[Stripe Webhook Error] STRIPE_SECRET_KEY is not configured.');
      return NextResponse.json(
        { error: 'Stripe is not configured on server.' },
        { status: 500 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[Stripe Webhook Error] STRIPE_WEBHOOK_SECRET environment variable is not set.');
      return NextResponse.json(
        { error: 'Stripe webhook secret is not configured.' },
        { status: 400 }
      );
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('[Stripe Webhook Error] Missing stripe-signature header.');
      return NextResponse.json(
        { error: 'Missing stripe-signature header.' },
        { status: 400 }
      );
    }

    const bodyText = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Stripe Webhook Verification Error]:', msg);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${msg}` },
        { status: 400 }
      );
    }

    // Handle Event Types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingReference =
          session.metadata?.bookingReference || session.client_reference_id;

        if (!bookingReference) {
          console.warn('[Stripe Webhook] Session completed without booking reference metadata.');
          return NextResponse.json({ received: true, warning: 'Missing booking reference' });
        }

        const supabase = getSupabaseServerClient();

        // 1. Fetch existing booking to verify state
        const { data: booking, error: fetchError } = await supabase
          .from('bookings')
          .select('*')
          .eq('booking_reference', bookingReference)
          .maybeSingle();

        if (fetchError || !booking) {
          console.error(`[Stripe Webhook Error] Booking ${bookingReference} not found in Supabase:`, fetchError);
          return NextResponse.json(
            { error: `Booking ${bookingReference} not found.` },
            { status: 404 }
          );
        }

        // 2. Idempotency Check: Ignore if already marked paid
        if (booking.payment_status === 'paid') {
          console.log(`[Stripe Webhook] Booking ${bookingReference} is already marked as paid. Skipping duplicate processing.`);
          return NextResponse.json({ received: true, message: 'Duplicate event ignored' });
        }

        // 3. Update Supabase payment_status to 'paid' & booking_status to 'confirmed'
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            booking_status: 'confirmed',
          })
          .eq('booking_reference', bookingReference);

        if (updateError) {
          console.error(`[Stripe Webhook Error] Failed to update booking ${bookingReference} to paid:`, updateError);
          return NextResponse.json(
            { error: `Failed to update database: ${updateError.message}` },
            { status: 500 }
          );
        }

        console.log(`[Stripe Webhook Success] Booking ${bookingReference} successfully updated to paid.`);

        // 4. Dispatch Email Notifications via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          try {
            const resend = new Resend(resendApiKey);
            const fromEmail = process.env.BOOKING_FROM_EMAIL || 'HandCleaned Bookings <onboarding@resend.dev>';
            const notificationEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'admin@handcleaned.com.au';

            const emailData: BookingEmailData = {
              bookingReference: booking.booking_reference,
              service: booking.service,
              packageName: booking.package_name,
              price: typeof booking.price === 'number' ? booking.price : parseFloat(booking.price || '0'),
              firstName: booking.first_name,
              lastName: booking.last_name,
              email: booking.email,
              phone: booking.phone,
              propertyAddress: booking.property_address,
              bedrooms: booking.bedrooms,
              bathrooms: booking.bathrooms,
              notes: booking.notes,
              bookingDate: booking.booking_date,
              bookingTime: booking.booking_time,
              paymentStatus: 'paid',
            };

            const customerEmail = generateCustomerReceiptEmail(emailData);
            const adminEmail = generateAdminNotificationEmail(emailData);

            await Promise.all([
              resend.emails.send({
                from: fromEmail,
                to: booking.email,
                subject: customerEmail.subject,
                html: customerEmail.html,
              }),
              resend.emails.send({
                from: fromEmail,
                to: notificationEmail,
                subject: adminEmail.subject,
                html: adminEmail.html,
              }),
            ]);

            console.log(`[Stripe Webhook] Receipt emails dispatched for booking ${bookingReference}.`);
          } catch (emailErr) {
            console.error(`[Stripe Webhook Email Error] Failed to send email for ${bookingReference}:`, emailErr);
            // Do not fail the webhook request if email fails, DB update succeeded
          }
        }
        break;
      }

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const object = event.data.object as { metadata?: Record<string, string>; client_reference_id?: string };
        const bookingReference = object.metadata?.bookingReference || object.client_reference_id;

        if (bookingReference) {
          const supabase = getSupabaseServerClient();
          const { data: booking } = await supabase
            .from('bookings')
            .select('payment_status')
            .eq('booking_reference', bookingReference)
            .maybeSingle();

          if (booking && booking.payment_status !== 'paid') {
            await supabase
              .from('bookings')
              .update({ payment_status: 'failed' })
              .eq('booking_reference', bookingReference);
            console.log(`[Stripe Webhook] Booking ${bookingReference} payment marked as failed/expired.`);
          }
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Stripe Webhook Fatal Exception]:', msg);
    return NextResponse.json(
      { error: `Internal server error: ${msg}` },
      { status: 500 }
    );
  }
}
