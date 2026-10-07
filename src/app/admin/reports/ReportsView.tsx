'use client';

import React, { useState } from 'react';
import type { AdminBooking } from '@/services/adminBookingService';

interface ReportsViewProps {
  initialBookings: AdminBooking[];
}

export function ReportsView({ initialBookings }: ReportsViewProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [service, setService] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Calculate matching items count
  const matchingCount = initialBookings.filter((b) => {
    if (paymentStatus !== 'all' && b.payment_status !== paymentStatus) return false;
    if (service !== 'all' && !b.service.toLowerCase().includes(service.toLowerCase())) return false;
    if (dateFrom && b.booking_date < dateFrom) return false;
    if (dateTo && b.booking_date > dateTo) return false;
    return true;
  }).length;

  const handleExportCsv = async () => {
    setIsExporting(true);
    setExportNotice(null);

    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);
      if (paymentStatus && paymentStatus !== 'all') params.set('payment_status', paymentStatus);
      if (service && service !== 'all') params.set('service', service);

      const url = `/api/admin/export-csv?${params.toString()}`;

      // Trigger browser download via anchor
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `handcleaned-report-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportNotice('CSV report generated and download started successfully.');
    } catch {
      setExportNotice('Failed to generate export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* SECTION 1: EXPORT TRANSACTIONS & BOOKINGS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2CBAE8]/15 text-[#17739C] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Data Reporting
            </div>
            <h2 className="text-xl font-extrabold text-[#1A2E44]">
              Export Transactions & Bookings
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Filter by date range, payment status, and cleaning service, then export complete business records to CSV for accounting or spreadsheet analysis.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl shrink-0 text-center sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Matching Records
            </span>
            <span className="text-2xl font-extrabold text-[#1A2E44]">
              {matchingCount}
            </span>
          </div>
        </div>

        {/* Filters Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          {/* Date From */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Service
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            >
              <option value="all">All Services</option>
              <option value="Airbnb">Airbnb Cleaning</option>
              <option value="Residential">Residential Cleaning</option>
              <option value="Commercial">Commercial Cleaning</option>
              <option value="Linen">Linen Hire</option>
            </select>
          </div>
        </div>

        {/* Notice Message */}
        {exportNotice && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {exportNotice}
            </span>
            <button onClick={() => setExportNotice(null)} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
        )}

        {/* Export Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Format: UTF-8 CSV containing customer, booking date, amount, and payment status.</span>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#00AEEF] hover:bg-[#17739C] shadow-md shadow-[#00AEEF]/20 hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Preparing Export...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV ({matchingCount} records)
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 2: FUTURE PDF REPORTS EXTENSION PREVIEW */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Future Capability
            </span>
            <h3 className="text-base font-extrabold text-[#1A2E44] mt-2">
              PDF Documents & Invoices
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ready for client review. Additional PDF formats can be activated based on client workflow requirements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 opacity-75">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs mb-3">
              PDF
            </div>
            <h4 className="text-xs font-bold text-slate-900">Monthly Revenue Summary</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Formatted monthly financial report with GST breakdowns and totals.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 opacity-75">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs mb-3">
              PDF
            </div>
            <h4 className="text-xs font-bold text-slate-900">Customer Tax Invoices</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Branded printable customer tax receipt PDFs with ABN and booking details.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 opacity-75">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs mb-3">
              PDF
            </div>
            <h4 className="text-xs font-bold text-slate-900">Cleaner Run Sheet</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Printable schedule with client addresses, property specs, and instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
