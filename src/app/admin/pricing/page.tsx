import { requireAdminSession } from '@/services/adminAuthService';
import { getAdminPricingRates } from '@/services/adminPricingService';
import { PricingView } from './PricingView';

export const dynamic = 'force-dynamic';

export default async function AdminPricingPage() {
  await requireAdminSession();
  const rates = await getAdminPricingRates();

  return <PricingView initialRates={rates} />;
}
