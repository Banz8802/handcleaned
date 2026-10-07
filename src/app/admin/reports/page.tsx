import { requireAdminSession } from '@/services/adminAuthService';
import { getExportBookings } from '@/services/adminBookingService';
import { ReportsView } from './ReportsView';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  await requireAdminSession();

  const { bookings } = await getExportBookings({});

  return <ReportsView initialBookings={bookings} />;
}
