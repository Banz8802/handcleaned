import { redirect } from 'next/navigation';
import { getAdminSession } from '@/services/adminAuthService';

export default async function AdminIndexPage() {
  const session = await getAdminSession();
  if (session.authenticated) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}
