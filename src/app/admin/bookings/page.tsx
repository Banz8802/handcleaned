import { requireAdminSession } from '@/services/adminAuthService';
import { getBookings } from '@/services/adminBookingService';
import { getAdminPricingRates } from '@/services/adminPricingService';
import { BookingsView } from './BookingsView';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  await requireAdminSession();

  const [{ bookings, error }, pricingRates] = await Promise.all([
    getBookings({ page_size: 200 }),
    getAdminPricingRates(),
  ]);

  return (
    <BookingsView
      initialBookings={bookings}
      dbError={error}
      pricingRates={pricingRates}
    />
  );
}

