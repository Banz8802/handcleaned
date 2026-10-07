import { requireAdminSession } from '@/services/adminAuthService';
import { getBookings } from '@/services/adminBookingService';
import { TransactionsView } from './TransactionsView';

export const dynamic = 'force-dynamic';

export default async function AdminTransactionsPage() {
  await requireAdminSession();

  const { bookings, error } = await getBookings({
    page_size: 200,
  });

  return (
    <TransactionsView
      initialBookings={bookings}
      dbError={error}
    />
  );
}
