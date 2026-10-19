import { requireAdminSession } from '@/services/adminAuthService';
import { getAdminSiteContent, getAvailableMediaAssets } from '@/services/adminContentService';
import { ContentView } from './ContentView';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  await requireAdminSession();
  const content = await getAdminSiteContent();
  const mediaAssets = getAvailableMediaAssets();

  return <ContentView initialContent={content} mediaAssets={mediaAssets} />;
}
