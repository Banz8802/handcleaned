'use client';

import React, { useState, useMemo } from 'react';
import type { AdminBooking } from '@/services/adminBookingService';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { BookingDetailModal } from '@/components/admin/BookingDetailModal';
import { EmptyState } from '@/components/admin/EmptyState';
import { getContractedBathrooms } from '@/lib/data/pricingConfig';

interface BookingsViewProps {
  initialBookings: AdminBooking[];
  dbError?: string | null;
}

export function BookingsView({ initialBookings, dbError }: BookingsViewProps) {
  const [bookings, setBookings] = useState<AdminBooking[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [bathroomFilter, setBathroomFilter] = useState<'all' | 'extra_only' | 'standard'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'booking_date' | 'price'>('created_at');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtered and Sorted bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesRef = b.booking_reference.toLowerCase().includes(term);
        const matchesName = `${b.first_name} ${b.last_name}`.toLowerCase().includes(term);
        const matchesEmail = b.email.toLowerCase().includes(term);
        const matchesPhone = b.phone.toLowerCase().includes(term);
        const matchesAddress = b.property_address.toLowerCase().includes(term);
        if (!matchesRef && !matchesName && !matchesEmail && !matchesPhone && !matchesAddress) {
          return false;
        }
      }

      // Payment status
      if (paymentFilter !== 'all' && b.payment_status !== paymentFilter) {
        return false;
      }

      // Booking status
      if (statusFilter !== 'all' && b.booking_status !== statusFilter) {
        return false;
      }

      // Service filter
      if (serviceFilter !== 'all' && !b.service.toLowerCase().includes(serviceFilter.toLowerCase())) {
        return false;
      }

      // Bathroom filter
      if (bathroomFilter !== 'all') {
        const contracted = getContractedBathrooms(b.bedrooms.toString());
        const hasExtra = b.bathrooms > contracted;
        if (bathroomFilter === 'extra_only' && !hasExtra) return false;
        if (bathroomFilter === 'standard' && hasExtra) return false;
      }

      // Date Range
      if (dateFrom && b.booking_date < dateFrom) {
        return false;
      }
      if (dateTo && b.booking_date > dateTo) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comp = 0;
      if (sortBy === 'created_at') {
        comp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'booking_date') {
        comp = a.booking_date.localeCompare(b.booking_date);
      } else if (sortBy === 'price') {
        comp = a.price - b.price;
      }
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [bookings, searchTerm, paymentFilter, statusFilter, serviceFilter, bathroomFilter, dateFrom, dateTo, sortBy, sortOrder]);

  // Paginated items
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setPaymentFilter('all');
    setStatusFilter('all');
    setServiceFilter('all');
    setBathroomFilter('all');
    setDateFrom('');
    setDateTo('');
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Database Error Banner */}
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

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        {/* Row 1: Search bar */}
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search reference, customer name, email, phone, or address..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white transition-all font-medium"
            />
          </div>

          {(searchTerm || paymentFilter !== 'all' || statusFilter !== 'all' || serviceFilter !== 'all' || bathroomFilter !== 'all' || dateFrom || dateTo) && (
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Row 2: Select Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {/* Service Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Service
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            >
              <option value="all">All Services</option>
              <option value="Airbnb">Airbnb Cleaning</option>
              <option value="Residential">Residential Cleaning</option>
              <option value="Commercial">Commercial Cleaning</option>
              <option value="Linen">Linen Hire</option>
            </select>
          </div>

          {/* Bathroom Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Bathrooms
            </label>
            <select
              value={bathroomFilter}
              onChange={(e) => {
                setBathroomFilter(e.target.value as 'all' | 'extra_only' | 'standard');
                setCurrentPage(1);
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            >
              <option value="all">All Bathrooms</option>
              <option value="extra_only">Extra Baths (Above Contract)</option>
              <option value="standard">Standard Included Baths</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Booking Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Booking Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range: From */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            />
          </div>

          {/* Date Range: To */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
            />
          </div>
        </div>

        {/* Counter & Sort controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-600">
            Showing <span className="font-bold text-[#1A2E44]">{filteredBookings.length}</span> of{' '}
            <span className="font-bold text-[#1A2E44]">{bookings.length}</span> total bookings
          </span>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'created_at' | 'booking_date' | 'price')}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none"
            >
              <option value="created_at">Date Created</option>
              <option value="booking_date">Booking Date</option>
              <option value="price">Amount</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Toggle sort order"
            >
              {sortOrder === 'desc' ? '↓ Desc' : '↑ Asc'}
            </button>
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredBookings.length === 0 ? (
          <EmptyState
            title="No Bookings Match Your Criteria"
            description={
              bookings.length === 0
                ? "There are currently no bookings saved in Supabase. Real bookings will display automatically when submitted on the website."
                : "Try clearing or adjusting your search term and filter selections above to see more records."
            }
            action={
              bookings.length > 0
                ? {
                    label: 'Reset Filters',
                    onClick: handleResetFilters,
                  }
                : undefined
            }
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Package</th>
                    <th className="py-3.5 px-4">Booking Date</th>
                    <th className="py-3.5 px-4">Booking Time</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created At</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedBookings.map((b) => (
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
                      <td className="py-3.5 px-4 text-slate-800 font-medium">{b.service}</td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 font-semibold truncate max-w-[140px]">
                          {b.package_name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {b.bedrooms === 0 ? 'Studio' : `${b.bedrooms} Bed`}, {b.bathrooms} Bath
                          </span>
                          {(() => {
                            const contracted = getContractedBathrooms(b.bedrooms === 0 ? 'Studio' : b.bedrooms.toString());
                            const excess = Math.max(0, b.bathrooms - contracted);
                            return excess > 0 ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                                +{excess} Extra Bath
                              </span>
                            ) : null;
                          })()}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{b.booking_date}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{b.booking_time}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ${b.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="payment" status={b.payment_status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="booking" status={b.booking_status} />
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 font-medium">
                        {new Date(b.created_at).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
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

            {/* Mobile Responsive Cards */}
            <div className="lg:hidden divide-y divide-slate-100">
              {paginatedBookings.map((b) => (
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
                    <p className="text-[11px] text-slate-500">
                      {b.service} • {b.package_name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {b.bedrooms === 0 ? 'Studio' : `${b.bedrooms} Bed`}, {b.bathrooms} Bath
                      </span>
                      {(() => {
                        const contracted = getContractedBathrooms(b.bedrooms === 0 ? 'Studio' : b.bedrooms.toString());
                        const excess = Math.max(0, b.bathrooms - contracted);
                        return excess > 0 ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                            +{excess} Extra Bath
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>
                      📅 {b.booking_date} ({b.booking_time})
                    </span>
                    <span>Created: {new Date(b.created_at).toLocaleDateString('en-AU')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge type="payment" status={b.payment_status} />
                      <StatusBadge type="booking" status={b.booking_status} />
                    </div>
                    <span className="text-xs font-bold text-[#00AEEF]">View Details →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>

                <span className="font-medium text-slate-600">
                  Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-900">{totalPages}</span>
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdated={() => {
          setBookings([...bookings]);
        }}
      />
    </div>
  );
}
