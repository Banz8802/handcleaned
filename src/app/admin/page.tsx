import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getAdminSession } from '@/services/adminAuthService';

export default async function AdminIndexPage() {
  const session = await getAdminSession();
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isSubdomain = host.startsWith('admin.') || host.includes('admin.handcleaned');

  if (session.authenticated) {
    redirect(isSubdomain ? '/dashboard' : '/admin/dashboard');
  } else {
    redirect(isSubdomain ? '/login' : '/admin/login');
  }
}
