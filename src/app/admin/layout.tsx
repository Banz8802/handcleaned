import type { Metadata } from 'next';
import { getAdminSession } from '@/services/adminAuthService';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

export const metadata: Metadata = {
  title: 'Admin CRM | Handcleaned Sydney',
  description: 'Internal business management system for Handcleaned Sydney.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <AdminLayoutShell
      userEmail={session.user?.email}
      userName={session.user?.name}
    >
      {children}
    </AdminLayoutShell>
  );
}
