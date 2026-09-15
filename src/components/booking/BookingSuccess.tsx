'use client';

import React from 'react';
import Link from 'next/link';

interface BookingSuccessProps {
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  finalPrice?: number;
  emailSent?: boolean;
  emailError?: string;
  onReset?: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({
  bookingReference,
  customerName,
  customerEmail,
  finalPrice,
  emailSent = true,
  emailError,
  onReset,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-center p-8 sm:p-12">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Booking Request Received!
        </h1>
        <p className="text-slate-600 text-base mb-6">
          Thank you, <span className="font-semibold text-slate-900">{customerName}</span>.
        </p>

        {/* Reference Badge */}
        <div className="inline-flex flex-col items-center justify-center bg-slate-900 text-white rounded-xl px-6 py-4 mb-8 shadow-sm">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Booking Reference
          </span>
          <span className="text-2xl font-mono font-bold text-sky-400">
            {bookingReference}
          </span>
        </div>

        {/* Status Callout Box */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-5 mb-8 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 mb-1">
                Payment Status: PENDING (Manual Payment)
              </h3>
              <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                Online payment is not currently processed through the website. Your booking request is saved and logged under reference <strong className="font-semibold">{bookingReference}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Email Notification Status */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-left text-sm">
          {emailSent ? (
            <p className="text-slate-700 leading-relaxed">
              Your booking receipt/invoice has been sent to:{' '}
              <strong className="text-slate-900 font-semibold">{customerEmail}</strong>.
            </p>
          ) : (
            <p className="text-slate-700 leading-relaxed">
              Your booking request has been received. {emailError || 'We were unable to send the confirmation email at this moment.'} Please contact HandCleaned if you do not receive your confirmation shortly.
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2 text-xs uppercase tracking-wide">
              Next Steps for Payment Confirmation
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Please complete payment according to the instructions provided by HandCleaned and reply to your confirmation email or contact our support team with your payment confirmation.
            </p>
          </div>
        </div>

        {/* Summary Row */}
        {finalPrice !== undefined && (
          <div className="flex justify-between items-center bg-sky-50/60 border border-sky-100 rounded-xl px-5 py-3.5 mb-8">
            <span className="text-sm font-medium text-slate-700">Total Quoted Amount:</span>
            <span className="text-xl font-bold text-sky-700">${finalPrice.toFixed(2)}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md"
          >
            Back to Home
          </Link>
          {onReset && (
            <button
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Make Another Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
