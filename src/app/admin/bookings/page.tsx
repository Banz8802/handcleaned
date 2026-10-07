import { requireAdminSession } from '@/services/adminAuthService';
import { getBookings } from '@/services/adminBookingService';
import { BookingsView } from './BookingsView';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  await requireAdminSession();

  const { bookings, error } = await getBookings({
    page_size: 200,
  });

  return (
    <BookingsView
      initialBookings={bookings}
      dbError={error}
    />
  );
}
