'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import {
  getPackagesForService,
  getMappedPropertyType,
  calculatePackagePrice,
} from '@/lib/data/bookingData';
import {
  generateCustomerReceiptEmail,
  generateAdminNotificationEmail,
  type BookingEmailData,
} from '@/lib/email/emailTemplates';
import type { StoreyType } from '@/lib/data/airbnbPricing';
import { Resend } from 'resend';

export interface SubmitBookingInput {
  serviceId: string;
  serviceName: string;
  packageId: string;
  packageName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  bedrooms: string;
  bathrooms: string;
  cleaners: number;
  storey?: StoreyType;
  notes?: string;
  bookingDate: string;
  bookingTime: string;
  paymentMethod?: 'stripe' | 'manual';
}

export interface SubmitBookingResult {
  success: boolean;
  bookingReference?: string;
  customerEmail?: string;
  customerName?: string;
  finalPrice?: number;
  emailSent?: boolean;
  emailError?: string;
  error?: string;
}

/**
 * Server action to handle booking submission.
 * Validates inputs, recalculates package price, inserts into Supabase, and dispatches confirmation emails.
 */
export async function submitBooking(
  input: SubmitBookingInput
): Promise<SubmitBookingResult> {
  try {
    // 1. Basic Field Validation
    if (!input.firstName || !input.lastName) {
      return { success: false, error: 'Customer name is required.' };
    }
    if (!input.email || !input.email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }
    if (!input.phone) {
      return { success: false, error: 'Phone number is required.' };
    }
    if (!input.propertyAddress) {
      return { success: false, error: 'Property address is required.' };
    }
    if (!input.bookingDate || !input.bookingTime) {
      return { success: false, error: 'Booking date and time are required.' };
    }

    // 2. Server-side Price Calculation (Do NOT trust client price)
    const availablePackages = getPackagesForService(input.serviceId);
    const selectedPkg = availablePackages.find((p) => p.id === input.packageId) || availablePackages[0];

    if (!selectedPkg) {
      return { success: false, error: 'Invalid service or package selection.' };
    }

    const mappedProperty = getMappedPropertyType(input.bedrooms);
    const storey = input.storey || 'Single';
    const finalPrice = calculatePackagePrice(selectedPkg, mappedProperty, storey, input.cleaners || 1);

    // 3. Supabase Client Initialization
    const supabase = getSupabaseServerClient();

    // 4. Generate Unique Booking Reference (e.g. HC-2026-8492)
    const currentYear = new Date().getFullYear();
    let bookingReference = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      attempts++;
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const candidateRef = `HC-${currentYear}-${randomNum}`;

      // Check for collision in Supabase
      const { data: existing } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_reference', candidateRef)
        .maybeSingle();

      if (!existing) {
        bookingReference = candidateRef;
        isUnique = true;
      }
    }

    // Fallback timestamp if 5 collisions occurred
    if (!bookingReference) {
      bookingReference = `HC-${currentYear}-${Date.now().toString().slice(-4)}`;
    }

    // 5. Insert Record into Supabase (`public.bookings`)
    const parsedBedrooms = parseInt(input.bedrooms, 10);
    const parsedBathrooms = parseFloat(input.bathrooms);

    const bookingPayload = {
      booking_reference: bookingReference,
      service: input.serviceName || selectedPkg.serviceId,
      package_name: input.packageName || selectedPkg.name,
      price: finalPrice,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone,
      property_address: input.propertyAddress,
      bedrooms: isNaN(parsedBedrooms) ? 0 : parsedBedrooms,
      bathrooms: isNaN(parsedBathrooms) ? 0 : parsedBathrooms,
      notes: input.notes || '',
      booking_date: input.bookingDate,
      booking_time: input.bookingTime,
      payment_status: 'pending',
      booking_status: 'pending',
    };

    const { error: dbError } = await supabase.from('bookings').insert([bookingPayload]);

    if (dbError) {
      console.error('[Supabase DB Error]:', dbError);
      return {
        success: false,
        error: `Database error saving booking: ${dbError.message}`,
      };
    }

    // 6. Resend Email Dispatch (Only send immediately for manual payment; Stripe payment sends after webhook confirmation)
    let emailSent = false;
    let emailErrorMsg: string | undefined;

    if (input.paymentMethod === 'stripe') {
      // Defer email dispatch until Stripe webhook confirms payment
      emailSent = false;
    } else {
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.BOOKING_FROM_EMAIL || 'HandCleaned Bookings <onboarding@resend.dev>';
      const notificationEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'admin@handcleaned.com.au';

      const emailData: BookingEmailData = {
        bookingReference,
        service: input.serviceName || selectedPkg.serviceId,
        packageName: input.packageName || selectedPkg.name,
        price: finalPrice,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        propertyAddress: input.propertyAddress,
        bedrooms: isNaN(parsedBedrooms) ? 0 : parsedBedrooms,
        bathrooms: isNaN(parsedBathrooms) ? 0 : parsedBathrooms,
        cleaners: input.cleaners,
        notes: input.notes,
        bookingDate: input.bookingDate,
        bookingTime: input.bookingTime,
        paymentStatus: 'pending',
      };

      if (resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);

          // Send Email to Customer
          const customerTemplate = generateCustomerReceiptEmail(emailData);
          await resend.emails.send({
            from: fromEmail,
            to: input.email,
            subject: customerTemplate.subject,
            html: customerTemplate.html,
          });

          // Send Email to Admin/Client
          const adminTemplate = generateAdminNotificationEmail(emailData);
          await resend.emails.send({
            from: fromEmail,
            to: notificationEmail,
            subject: adminTemplate.subject,
            html: adminTemplate.html,
          });

          emailSent = true;
        } catch (err: unknown) {
          const errDetail = err instanceof Error ? err.message : String(err);
          console.error('[Resend Email Error]:', errDetail);
          emailErrorMsg = `Email dispatch notice: ${errDetail}`;
        }
      } else {
        console.warn('[Resend]: RESEND_API_KEY environment variable is not configured.');
        emailErrorMsg = 'Email service is not yet configured.';
      }
    }

    // 7. Return Success Result
    return {
      success: true,
      bookingReference,
      customerEmail: input.email,
      customerName: `${input.firstName} ${input.lastName}`.trim(),
      finalPrice,
      emailSent,
      emailError: emailErrorMsg,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Submit Booking Exception]:', message);
    return {
      success: false,
      error: `Server processing error: ${message}`,
    };
  }
}
