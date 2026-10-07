'use server';

import { authenticateAdmin, logoutAdmin, getAdminSession } from '@/services/adminAuthService';
import { updateBookingStatus, updatePaymentStatus, type AdminBooking } from '@/services/adminBookingService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export interface AdminActionResponse {
  success: boolean;
  error?: string;
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
