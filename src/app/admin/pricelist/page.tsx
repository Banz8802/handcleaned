import { requireAdminSession } from '@/services/adminAuthService';
import { getAdminPricelistConfig } from '@/services/adminPricelistService';
import { PricelistView } from './PricelistView';

export const dynamic = 'force-dynamic';

export default async function AdminPricelistPage() {
  await requireAdminSession();
  const config = await getAdminPricelistConfig();

  return <PricelistView initialConfig={config} />;
}
