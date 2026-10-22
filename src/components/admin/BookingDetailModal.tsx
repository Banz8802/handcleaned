'use client';

import React, { useState, useTransition } from 'react';
import type { AdminBooking } from '@/services/adminBookingService';
import { StatusBadge } from './StatusBadge';
import {
  updateBookingStatusAction,
  updatePaymentStatusAction,
  updateBookingDetailsAction,
} from '@/app/actions/adminActions';
import {
  getContractedBathrooms,
  calculateExtraBathroomFee,
} from '@/lib/data/pricingConfig';

import type { PricingRatesConfig } from '@/lib/data/pricingConfig';
import { InvoiceModal } from './InvoiceModal';

interface BookingDetailModalProps {
  booking: AdminBooking | null;
  onClose: () => void;
  onUpdated?: () => void;
  pricingRates?: PricingRatesConfig;
}

export function BookingDetailModal({
  booking,
  onClose,
  onUpdated,
  pricingRates,
}: BookingDetailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedBookingStatus, setSelectedBookingStatus] = useState<AdminBooking['booking_status']>(
    booking?.booking_status || 'pending'
  );
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<AdminBooking['payment_status']>(
    booking?.payment_status || 'pending'
  );
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [editedBathrooms, setEditedBathrooms] = useState<number>(booking?.bathrooms || 1);
  const [editedPrice, setEditedPrice] = useState<number>(booking?.price || 0);
  const [editedNotes, setEditedNotes] = useState<string>(booking?.notes || '');
  const [showInvoice, setShowInvoice] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync if booking changes
  React.useEffect(() => {
    if (booking) {
      setSelectedBookingStatus(booking.booking_status);
      setSelectedPaymentStatus(booking.payment_status);
      setEditedBathrooms(booking.bathrooms);
      setEditedPrice(booking.price);
      setEditedNotes(booking.notes || '');
      setIsEditingSpecs(false);
      setMessage(null);
    }
  }, [booking]);

  if (!booking) return null;

  const contractedBaths = getContractedBathrooms(
    booking.bedrooms === 0 ? 'Studio' : booking.bedrooms.toString(),
    pricingRates
  );
  const excessBaths = Math.max(0, booking.bathrooms - contractedBaths);
  const excessFee = calculateExtraBathroomFee(
    booking.bedrooms === 0 ? 'Studio' : booking.bedrooms.toString(),
    booking.bathrooms,
    pricingRates
  );

  const handleSaveSpecs = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await updateBookingDetailsAction(booking.id, {
        bathrooms: editedBathrooms,
        price: editedPrice,
        notes: editedNotes,
      });
      if (res.success) {
        booking.bathrooms = editedBathrooms;
        booking.price = editedPrice;
        booking.notes = editedNotes;
        setIsEditingSpecs(false);
        setMessage({ type: 'success', text: 'Booking specifications and bathroom details updated.' });
        if (onUpdated) onUpdated();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update specifications.' });
      }
    });
  };

  const handleSaveChanges = () => {
    setMessage(null);
    startTransition(async () => {
      let bSuccess = true;
      let pSuccess = true;

      if (selectedBookingStatus !== booking.booking_status) {
        const res = await updateBookingStatusAction(booking.id, selectedBookingStatus);
        bSuccess = res.success;
      }

      if (selectedPaymentStatus !== booking.payment_status) {
        const res = await updatePaymentStatusAction(booking.id, selectedPaymentStatus);
        pSuccess = res.success;
      }

      if (bSuccess && pSuccess) {
        setMessage({ type: 'success', text: 'Booking updated successfully.' });
        booking.booking_status = selectedBookingStatus;
        booking.payment_status = selectedPaymentStatus;
        if (onUpdated) onUpdated();
      } else {
        setMessage({ type: 'error', text: 'Failed to update. Check database connection.' });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#1A2E44] text-white">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2CBAE8]">
                Booking Details
              </span>
              <span className="font-mono text-sm font-semibold bg-white/10 px-2.5 py-0.5 rounded-md text-white">
                {booking.booking_reference}
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1 text-white">
              {booking.first_name} {booking.last_name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <span>{message.text}</span>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
          )}

          {/* SECTION 1: CUSTOMER */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17739C] mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Customer Name</p>
                <p className="text-slate-900 font-bold text-sm mt-0.5">
                  {booking.first_name} {booking.last_name}
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Email Address</p>
                <a
                  href={`mailto:${booking.email}`}
                  className="text-[#00AEEF] hover:underline font-semibold text-sm mt-0.5 inline-block"
                >
                  {booking.email}
                </a>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Phone Number</p>
                <a
                  href={`tel:${booking.phone}`}
                  className="text-slate-800 hover:text-[#00AEEF] font-semibold text-sm mt-0.5 inline-block"
                >
                  {booking.phone}
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 2: SERVICE & PROPERTY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17739C] flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Service Details
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingSpecs(!isEditingSpecs)}
                  className="text-[11px] font-bold text-[#00AEEF] hover:underline cursor-pointer"
                >
                  {isEditingSpecs ? 'Cancel Edit' : 'Edit Specs / Bathrooms'}
                </button>
              </div>

              {isEditingSpecs ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Bathrooms Count
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={editedBathrooms}
                      onChange={(e) => setEditedBathrooms(parseFloat(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Contract Allowance: {contractedBaths} Baths
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Total Booking Price (AUD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editedPrice}
                      onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Admin / Customer Notes
                    </label>
                    <textarea
                      rows={2}
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSpecs}
                    disabled={isPending}
                    className="w-full py-2 rounded-lg bg-[#00AEEF] text-white text-xs font-bold hover:bg-[#0098d4] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPending ? 'Saving Specs...' : 'Save Updated Specifications'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-slate-500 font-medium">Service</p>
                    <p className="text-slate-900 font-bold mt-0.5">{booking.service}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Package</p>
                    <p className="text-slate-800 font-semibold mt-0.5">{booking.package_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <p className="text-slate-500 font-medium">Bedrooms</p>
                      <p className="text-slate-800 font-bold">
                        {booking.bedrooms === 0 ? 'Studio' : `${booking.bedrooms} Bed`}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Bathrooms</p>
                      <p className="text-slate-800 font-bold">{booking.bathrooms} Bath(s)</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Contract Allowance:</span>
                      <span className="font-semibold text-slate-700">{contractedBaths} Baths</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Excess Bathrooms:</span>
                      <span className={`font-bold ${excessBaths > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
                        {excessBaths > 0 ? `+${excessBaths} Extra` : 'None (Included)'}
                      </span>
                    </div>
                    {excessFee > 0 && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Bathroom Surcharge:</span>
                        <span className="font-extrabold text-amber-700">+${excessFee.toFixed(2)} AUD</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#17739C] mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Property & Notes
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Property Address</p>
                  <p className="text-slate-900 font-semibold mt-0.5 leading-relaxed">
                    {booking.property_address}
                  </p>
                </div>
                <div className="pt-1">
                  <p className="text-slate-500 font-medium">Customer Notes</p>
                  <p className="text-slate-700 italic mt-0.5 bg-white p-2 rounded-lg border border-slate-200/80">
                    {booking.notes || 'No notes provided by customer.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: BOOKING SCHEDULE */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17739C] mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule & Timestamps
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Booking Date</p>
                <p className="text-slate-900 font-bold mt-0.5">{booking.booking_date}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Booking Time</p>
                <p className="text-slate-900 font-bold mt-0.5">{booking.booking_time}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Created At</p>
                <p className="text-slate-700 font-medium mt-0.5">
                  {new Date(booking.created_at).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Updated At</p>
                <p className="text-slate-700 font-medium mt-0.5">
                  {booking.updated_at
                    ? new Date(booking.updated_at).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: PAYMENT & STATUS CONTROLS */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#2CBAE8]/20 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-4 flex items-center justify-between">
              <span>Status & Payment Management</span>
              <span className="text-base font-extrabold text-[#1A2E44]">
                ${booking.price.toFixed(2)} AUD
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Booking Status Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Booking Status
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge type="booking" status={selectedBookingStatus} />
                </div>
                <select
                  value={selectedBookingStatus}
                  onChange={(e) => setSelectedBookingStatus(e.target.value as AdminBooking['booking_status'])}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Status Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Status
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge type="payment" status={selectedPaymentStatus} />
                </div>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value as AdminBooking['payment_status'])}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => setShowInvoice(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#00AEEF] hover:text-[#17739C] hover:bg-sky-50 border border-[#00AEEF]/40 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Invoice
            </button>
          </div>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#00AEEF] hover:bg-[#17739C] shadow-xs hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save Status Changes'
            )}
          </button>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      <InvoiceModal
        booking={showInvoice ? booking : null}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
}
