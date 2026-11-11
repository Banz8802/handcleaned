'use server';

import { authenticateAdmin, logoutAdmin, getAdminSession } from '@/services/adminAuthService';
import { updateBookingStatus, updatePaymentStatus, updateBookingDetails, type AdminBooking } from '@/services/adminBookingService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export interface AdminActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Handle Admin Login submission.
 */
export async function loginAdminAction(
  prevState: AdminActionResponse | null,
  formData: FormData
): Promise<AdminActionResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Please enter both your email and password.' };
  }

  const result = await authenticateAdmin(email, password);

  if (!result.success) {
    return { success: false, error: result.error || 'Authentication failed.' };
  }

  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isSubdomain = host.startsWith('admin.') || host.includes('admin.handcleaned');

  redirect(isSubdomain ? '/dashboard' : '/admin/dashboard');
}

/**
 * Handle Admin Logout.
 */
export async function logoutAdminAction(): Promise<void> {
  await logoutAdmin();
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isSubdomain = host.startsWith('admin.') || host.includes('admin.handcleaned');

  redirect(isSubdomain ? '/login' : '/admin/login');
}

/**
 * Update booking status (Pending, Confirmed, Completed, Cancelled).
 */
export async function updateBookingStatusAction(
  id: string,
  newStatus: AdminBooking['booking_status']
): Promise<AdminActionResponse> {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  const result = await updateBookingStatus(id, newStatus);
  if (!result.success) {
    return { success: false, error: result.error || 'Failed to update booking status.' };
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

/**
 * Update payment status (Pending, Paid, Failed, Refunded).
 */
export async function updatePaymentStatusAction(
  id: string,
  newStatus: AdminBooking['payment_status']
): Promise<AdminActionResponse> {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  const result = await updatePaymentStatus(id, newStatus);
  if (!result.success) {
    return { success: false, error: result.error || 'Failed to update payment status.' };
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/admin/transactions');
  revalidatePath('/admin/dashboard');
  revalidatePath('/bookings');
  revalidatePath('/transactions');
  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Save / Update pricing rates from Admin CRM.
 */
export async function savePricingRatesAction(
  rates: Partial<import('@/lib/data/pricingConfig').PricingRatesConfig>
): Promise<AdminActionResponse<import('@/lib/data/pricingConfig').PricingRatesConfig>> {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  const { saveAdminPricingRates } = await import('@/services/adminPricingService');
  const result = await saveAdminPricingRates(rates, session.user?.email || 'admin@handcleaned.com.au');

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to save pricing rates.' };
  }

  // Revalidate all pages that depend on pricing
  revalidatePath('/admin/pricing');
  revalidatePath('/pricing');
  revalidatePath('/admin/bookings');
  revalidatePath('/bookings');
  revalidatePath('/booking');
  revalidatePath('/airbnb-cleaning');
  revalidatePath('/residential-cleaning');
  revalidatePath('/commercial-cleaning');
  revalidatePath('/linen-hire');
  revalidatePath('/');

  return { success: true, data: result.data };
}

/**
 * Update booking details (bathrooms, bedrooms, price, notes, etc.)
 */
export async function updateBookingDetailsAction(
  id: string,
  updates: Parameters<typeof updateBookingDetails>[1]
): Promise<AdminActionResponse> {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  const result = await updateBookingDetails(id, updates);

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to update booking details.' };
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/admin/transactions');
  revalidatePath('/admin/dashboard');
  revalidatePath('/bookings');
  revalidatePath('/transactions');
  revalidatePath('/dashboard');

  return { success: true };
}

/**
 * Save / Update Website Content (wordings, images, hero video, pages, testimonials).
 */
export async function saveSiteContentAction(
  content: Partial<import('@/lib/data/contentConfig').SiteContentConfig>
): Promise<AdminActionResponse<import('@/lib/data/contentConfig').SiteContentConfig>> {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  const { saveAdminSiteContent } = await import('@/services/adminContentService');
  const result = await saveAdminSiteContent(content, session.user?.email || 'admin@handcleaned.com.au');

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to save website content.' };
  }

  // Revalidate all public and admin pages that display this content
  revalidatePath('/');
  revalidatePath('/about-us');
  revalidatePath('/residential-cleaning');
  revalidatePath('/airbnb-cleaning');
  revalidatePath('/commercial-cleaning');
  revalidatePath('/linen-hire');
  revalidatePath('/admin/content');
  revalidatePath('/content');

  return { success: true, data: result.data };
}

/**
 * Save / Update Pricelist configuration, category cards, custom prices, and branding.
 */
export async function savePricelistAction(
  config: Partial<import('@/lib/data/pricelistConfig').PricelistConfig>
): Promise<AdminActionResponse<import('@/lib/data/pricelistConfig').PricelistConfig>> {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  const { saveAdminPricelistConfig } = await import('@/services/adminPricelistService');
  const result = await saveAdminPricelistConfig(config, session.user?.email || 'admin@handcleaned.com.au');

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to save pricelist.' };
  }

  revalidatePath('/admin/pricelist');
  revalidatePath('/pricelist');
  revalidatePath('/admin/pricing');
  revalidatePath('/pricing');

  return { success: true, data: result.data };
}

/**
 * Reset Pricelist configuration back to standard defaults.
 */
export async function resetPricelistAction(): Promise<
  AdminActionResponse<import('@/lib/data/pricelistConfig').PricelistConfig>
> {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  const { resetAdminPricelistConfig } = await import('@/services/adminPricelistService');
  const result = await resetAdminPricelistConfig(session.user?.email || 'admin@handcleaned.com.au');

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to reset pricelist.' };
  }

  revalidatePath('/admin/pricelist');
  revalidatePath('/pricelist');
  revalidatePath('/admin/pricing');
  revalidatePath('/pricing');

  return { success: true, data: result.data };
}
