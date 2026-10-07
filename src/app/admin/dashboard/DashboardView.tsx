'use client';

import React, { useState } from 'react';
import type { BookingKPIs, AdminBooking } from '@/services/adminBookingService';
import { KpiCard } from '@/components/admin/KpiCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { BookingDetailModal } from '@/components/admin/BookingDetailModal';
import { EmptyState } from '@/components/admin/EmptyState';
import Link from 'next/link';

interface DashboardViewProps {
  stats: BookingKPIs;
  recentBookings: AdminBooking[];
  dbError?: string | null;
}

export function DashboardView({ stats, recentBookings, dbError }: DashboardViewProps) {
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [bookingsList, setBookingsList] = useState<AdminBooking[]>(recentBookings);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Database Error Banner (if connection failed) */}
      {dbError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="font-bold">Database Notice</p>
            <p className="mt-0.5 text-xs text-amber-800">
              {dbError.includes('fetch failed') || dbError.includes('ENOTFOUND')
                ? 'Could not connect to the remote Supabase database instance. Real-time data will sync as soon as network connection is restored.'
                : dbError}
            </p>
          </div>
        </div>
      )}

      {/* TOP-LEVEL KPI CARDS (5 Cards required by specification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Bookings */}
        <KpiCard
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="All-time customer requests"
          iconBgColor="bg-[#2CBAE8]/15 text-[#17739C]"
          icon={
            <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />

        {/* 2. Pending Bookings */}
        <KpiCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          subtitle="Awaiting staff action"
          iconBgColor="bg-amber-100 text-amber-700"
          textColor="text-amber-700"
          icon={
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* 3. Confirmed Bookings */}
        <KpiCard
          title="Confirmed"
          value={stats.confirmedBookings}
          subtitle="Scheduled & verified"
          iconBgColor="bg-sky-100 text-sky-700"
          textColor="text-sky-700"
          icon={
            <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* 4. Completed Bookings */}
        <KpiCard
          title="Completed"
          value={stats.completedBookings}
          subtitle="Finished cleaning jobs"
          iconBgColor="bg-emerald-100 text-emerald-700"
          textColor="text-emerald-700"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          }
        />

        {/* 5. Total Revenue */}
        <KpiCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`${stats.paidTransactions} successful payments`}
          iconBgColor="bg-emerald-50 text-emerald-800"
          textColor="text-[#1A2E44]"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* SERVICE BREAKDOWN CLEAN VISUALIZATION (Clean & data-driven) */}
      {stats.totalBookings > 0 && Object.keys(stats.serviceBreakdown).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1A2E44]">Service Volume Distribution</h3>
              <p className="text-xs text-slate-500">Booking distribution by cleaning category</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {stats.totalBookings} Total Jobs
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.serviceBreakdown).map(([service, count]) => {
              const pct = Math.round((count / stats.totalBookings) * 100);
              return (
                <div key={service} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{service}</span>
                    <span className="text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#00AEEF] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RECENT BOOKINGS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#1A2E44]">Recent Bookings</h2>
            <p className="text-xs text-slate-500">Latest cleaning bookings received from customers</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={
                typeof window !== 'undefined' &&
                (window.location.hostname.startsWith('admin.') || !window.location.pathname.startsWith('/admin'))
                  ? '/bookings'
                  : '/admin/bookings'
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#00AEEF] bg-[#00AEEF]/10 hover:bg-[#00AEEF]/20 transition-colors"
            >
              <span>View All Bookings</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Empty State when no records */}
        {bookingsList.length === 0 ? (
          <EmptyState
            title="No Bookings Recorded Yet"
            description="When clients submit bookings through the website, their details, dates, and payment states will automatically display here."
            action={{
              label: 'View Live Booking Form',
              href: 'https://handcleaned.com.au/booking',
            }}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Booking Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {bookingsList.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#00AEEF] group-hover:underline">
                        {booking.booking_reference}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">
                          {booking.first_name} {booking.last_name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {booking.email}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{booking.service}</td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[140px]">
                        {booking.package_name}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {booking.booking_date}
                        <span className="block text-[11px] text-slate-400">{booking.booking_time}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ${booking.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="payment" status={booking.payment_status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="booking" status={booking.booking_status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#17739C] hover:bg-[#2CBAE8]/10 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Responsive Cards View */}
            <div className="lg:hidden divide-y divide-slate-100">
              {bookingsList.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="p-4 space-y-2.5 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#00AEEF]">
                      {booking.booking_reference}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      ${booking.price.toFixed(2)} AUD
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {booking.first_name} {booking.last_name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {booking.service} • {booking.package_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">
                      📅 {booking.booking_date}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge type="payment" status={booking.payment_status} />
                      <StatusBadge type="booking" status={booking.booking_status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdated={() => {
          setBookingsList([...bookingsList]);
        }}
      />
    </div>
  );
}
