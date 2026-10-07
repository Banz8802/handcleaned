'use client';

import React, { useState, useMemo } from 'react';
import type { AdminBooking } from '@/services/adminBookingService';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { BookingDetailModal } from '@/components/admin/BookingDetailModal';
import { EmptyState } from '@/components/admin/EmptyState';
import { KpiCard } from '@/components/admin/KpiCard';

interface TransactionsViewProps {
  initialBookings: AdminBooking[];
  dbError?: string | null;
}

export function TransactionsView({ initialBookings, dbError }: TransactionsViewProps) {
  const [bookings, setBookings] = useState<AdminBooking[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Summary Metrics calculation
  const summaryMetrics = useMemo(() => {
    let totalTransactions = bookings.length;
    let successfulCount = 0;
    let successfulAmount = 0;
    let pendingCount = 0;
    let pendingAmount = 0;
    let failedCount = 0;
    let totalRevenue = 0;

    for (const b of bookings) {
      if (b.payment_status === 'paid') {
        successfulCount++;
        successfulAmount += b.price;
        totalRevenue += b.price;
      } else if (b.payment_status === 'pending') {
        pendingCount++;
        pendingAmount += b.price;
      } else if (b.payment_status === 'failed') {
        failedCount++;
      }
    }

    return {
      totalTransactions,
      successfulCount,
      successfulAmount,
      pendingCount,
      pendingAmount,
      failedCount,
      totalRevenue,
    };
  }, [bookings]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return bookings.filter((b) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesRef = b.booking_reference.toLowerCase().includes(term);
        const matchesName = `${b.first_name} ${b.last_name}`.toLowerCase().includes(term);
        const matchesEmail = b.email.toLowerCase().includes(term);
        if (!matchesRef && !matchesName && !matchesEmail) return false;
      }

      if (paymentFilter !== 'all' && b.payment_status !== paymentFilter) {
        return false;
      }

      if (serviceFilter !== 'all' && !b.service.toLowerCase().includes(serviceFilter.toLowerCase())) {
        return false;
      }

      if (dateFrom && b.booking_date < dateFrom) {
        return false;
      }
      if (dateTo && b.booking_date > dateTo) {
        return false;
      }

      return true;
    });
  }, [bookings, searchTerm, paymentFilter, serviceFilter, dateFrom, dateTo]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Database Notice */}
      {dbError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-bold">Database Notice</p>
            <p className="text-xs text-amber-800 mt-0.5">{dbError}</p>
          </div>
        </div>
      )}

      {/* SUMMARY INFORMATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Transactions"
          value={summaryMetrics.totalTransactions}
          subtitle="All payment records"
          iconBgColor="bg-slate-100 text-slate-700"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />

        <KpiCard
          title="Successful Payments"
          value={summaryMetrics.successfulCount}
          subtitle={`$${summaryMetrics.successfulAmount.toFixed(2)} AUD processed`}
          iconBgColor="bg-emerald-100 text-emerald-700"
          textColor="text-emerald-700"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <KpiCard
          title="Pending Payments"
          value={summaryMetrics.pendingCount}
          subtitle={`$${summaryMetrics.pendingAmount.toFixed(2)} AUD outstanding`}
          iconBgColor="bg-amber-100 text-amber-700"
          textColor="text-amber-700"
          icon={
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <KpiCard
          title="Failed Payments"
          value={summaryMetrics.failedCount}
          subtitle="Declined or abandoned"
          iconBgColor="bg-rose-100 text-rose-700"
          textColor="text-rose-700"
          icon={
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <KpiCard
          title="Total Revenue"
          value={`$${summaryMetrics.totalRevenue.toFixed(2)}`}
          subtitle="Net revenue recorded"
          iconBgColor="bg-[#2CBAE8]/15 text-[#17739C]"
          textColor="text-[#1A2E44]"
          icon={
            <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference, customer name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white transition-all font-medium"
            />
          </div>

          {(searchTerm || paymentFilter !== 'all' || serviceFilter !== 'all' || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPaymentFilter('all');
                setServiceFilter('all');
                setDateFrom('');
                setDateTo('');
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Service
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            >
              <option value="all">All Services</option>
              <option value="Airbnb">Airbnb Cleaning</option>
              <option value="Residential">Residential Cleaning</option>
              <option value="Commercial">Commercial Cleaning</option>
              <option value="Linen">Linen Hire</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            title="No Transactions Found"
            description="No transactions match your current search or date range parameters."
          />
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Service & Package</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4">Booking Status</th>
                    <th className="py-3.5 px-4">Booking Date</th>
                    <th className="py-3.5 px-4">Recorded At</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTransactions.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#00AEEF] group-hover:underline">
                        {b.booking_reference}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">
                          {b.first_name} {b.last_name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{b.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">{b.service}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {b.package_name}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        ${b.price.toFixed(2)} AUD
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="payment" status={b.payment_status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="booking" status={b.booking_status} />
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{b.booking_date}</td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        {new Date(b.created_at).toLocaleString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b);
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

            {/* Mobile View */}
            <div className="lg:hidden divide-y divide-slate-100">
              {filteredTransactions.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-4 space-y-2 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#00AEEF]">
                      {b.booking_reference}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      ${b.price.toFixed(2)} AUD
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {b.first_name} {b.last_name}
                    </p>
                    <p className="text-[11px] text-slate-500">{b.service}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>📅 {b.booking_date}</span>
                    <span>{new Date(b.created_at).toLocaleDateString('en-AU')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <StatusBadge type="payment" status={b.payment_status} />
                    <span className="text-xs font-bold text-[#00AEEF]">View Details →</span>
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
        onUpdated={() => setBookings([...bookings])}
      />
    </div>
  );
}
