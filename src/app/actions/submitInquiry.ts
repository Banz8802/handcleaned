'use server';

import { Resend } from 'resend';
import {
  generateInquiryAdminEmail,
  generateInquiryCustomerEmail,
  type InquiryEmailData,
} from '@/lib/email/emailTemplates';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface SubmitInquiryInput {
  name: string;
  email: string;
  phone: string;
  date?: string;
  service: string;
  message?: string;
}

export interface SubmitInquiryResult {
  success: boolean;
  inquiryReference?: string;
  error?: string;
}

/**
 * Server Action: Handles service inquiry form submission.
 * Validates inputs, sends notification emails via Resend, and records inquiry details.
 */
export async function submitInquiry(
  input: SubmitInquiryInput
): Promise<SubmitInquiryResult> {
  try {
    // 1. Input Validation
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: 'Your name is required.' };
    }
    if (!input.email || !input.email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }
    if (!input.phone || input.phone.trim().length === 0) {
      return { success: false, error: 'Phone number is required.' };
    }
    if (!input.service || input.service.trim().length === 0) {
      return { success: false, error: 'Please select a service.' };
    }

    // 2. Generate Unique Inquiry Reference (e.g. INQ-2026-7842)
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const inquiryReference = `INQ-${currentYear}-${randomNum}`;

    // 3. Optional DB Logging (graceful if table missing)
    try {
      const supabase = getSupabaseServerClient();
      await supabase.from('inquiries').insert([
        {
          inquiry_reference: inquiryReference,
          name: input.name,
          email: input.email,
          phone: input.phone,
          preferred_date: input.date || null,
          service: input.service,
          message: input.message || '',
        },
      ]);
    } catch (dbErr) {
      console.warn('[Supabase Inquiry Log Notice]:', dbErr);
    }

    // 4. Dispatch Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.BOOKING_FROM_EMAIL || 'HandCleaned Inquiries <onboarding@resend.dev>';
    const notificationEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'contact@handcleaned.com.au';

    const emailData: InquiryEmailData = {
      inquiryReference,
      name: input.name,
      email: input.email,
      phone: input.phone,
      date: input.date,
      service: input.service,
      message: input.message,
    };

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      // Send Admin Notification Email
      const adminTemplate = generateInquiryAdminEmail(emailData);
      await resend.emails.send({
        from: fromEmail,
        to: notificationEmail,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
      });

      // Send Customer Confirmation Email
      try {
        const customerTemplate = generateInquiryCustomerEmail(emailData);
        await resend.emails.send({
          from: fromEmail,
          to: input.email,
          subject: customerTemplate.subject,
          html: customerTemplate.html,
        });
      } catch (custErr) {
        console.error('[Resend Customer Email Notice]:', custErr);
      }
    } else {
      console.warn('[Resend]: RESEND_API_KEY environment variable is not configured.');
    }

    return {
      success: true,
      inquiryReference,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Submit Inquiry Exception]:', message);
    return {
      success: false,
      error: `Server processing error: ${message}`,
    };
  }
}
