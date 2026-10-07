'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { usePathname } from 'next/navigation';

interface AdminLayoutShellProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': {
    title: 'Business Overview',
    subtitle: 'Real-time performance metrics and recent customer bookings',
  },
  '/dashboard': {
    title: 'Business Overview',
    subtitle: 'Real-time performance metrics and recent customer bookings',
  },
  '/admin/bookings': {
    title: 'Booking Management',
    subtitle: 'Filter, search, inspect, and update cleaning service requests',
  },
  '/bookings': {
    title: 'Booking Management',
    subtitle: 'Filter, search, inspect, and update cleaning service requests',
  },
  '/admin/transactions': {
    title: 'Transaction History',
    subtitle: 'Financial logs, payment statuses, and revenue breakdown',
  },
  '/transactions': {
    title: 'Transaction History',
    subtitle: 'Financial logs, payment statuses, and revenue breakdown',
  },
  '/admin/reports': {
    title: 'Reports & Export',
    subtitle: 'Export business transactions to CSV for accounting and analytics',
  },
  '/reports': {
    title: 'Reports & Export',
    subtitle: 'Export business transactions to CSV for accounting and analytics',
  },
};

export function AdminLayoutShell({ children, userEmail, userName }: AdminLayoutShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // If on login page, render clean full-screen view without admin chrome
  if (pathname === '/admin/login' || pathname === '/login') {
    return <>{children}</>;
  }

  const pageInfo = PAGE_TITLES[pathname || ''] || {
    title: 'Admin CRM',
    subtitle: 'Handcleaned Management System',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#1A2E44]">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={userEmail}
        userName={userName}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <AdminHeader
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
