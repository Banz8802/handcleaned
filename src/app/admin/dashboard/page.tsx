import { requireAdminSession } from '@/services/adminAuthService';
import { getDashboardKPIs, getRecentBookings } from '@/services/adminBookingService';
import { DashboardView } from './DashboardView';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // 1. Enforce Server-Side Auth Guard
  await requireAdminSession();

  // 2. Fetch Data from Data/Service Layer
  const [kpiRes, recentRes] = await Promise.all([
    getDashboardKPIs(),
    getRecentBookings(8),
  ]);

  return (
    <DashboardView
      stats={kpiRes.stats}
      recentBookings={recentRes.bookings}
      dbError={kpiRes.error || recentRes.error}
    />
  );
}
