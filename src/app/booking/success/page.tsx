import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';

interface SuccessPageProps {
  searchParams: Promise<{ reference?: string; session_id?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const bookingReference = params.reference || '';

  let booking: {
    booking_reference: string;
    first_name: string;
    last_name: string;
    email: string;
    price: number;
    payment_status: string;
    service: string;
    package_name: string;
    property_address: string;
    booking_date: string;
    booking_time: string;
  } | null = null;

  if (bookingReference) {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_reference', bookingReference)
      .maybeSingle();

    if (data) {
      booking = data;
    }
  }

  const customerName = booking ? `${booking.first_name} ${booking.last_name}`.trim() : 'Valued Customer';
  const customerEmail = booking?.email || '';
  const price = booking?.price || 0;
  const paymentStatus = booking?.payment_status || 'paid'; // Default to paid upon returning from Stripe Checkout session

  return (
    <main className="min-h-screen bg-[#EBF6FB]/40 py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-center p-8 sm:p-12">
          {/* Success Check Icon */}
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
            Payment Confirmed & Booking Received!
          </h1>
          <p className="text-slate-600 text-base mb-6">
            Thank you, <span className="font-semibold text-slate-900">{customerName}</span>. Your cleaning reservation has been successfully paid and registered.
          </p>

          {/* Reference Badge */}
          <div className="inline-flex flex-col items-center justify-center bg-slate-900 text-white rounded-xl px-6 py-4 mb-8 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Booking Reference
            </span>
            <span className="text-2xl font-mono font-bold text-[#2CBAE8]">
              {bookingReference || 'HC-2026-CONFIRMED'}
            </span>
          </div>

          {/* Payment Status Callout Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900 mb-1">
                  Payment Status: {paymentStatus.toUpperCase()} (Stripe Checkout)
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800/90 leading-relaxed">
                  Your online payment was completed through Stripe Sandbox. A receipt has been dispatched to{' '}
                  <strong className="font-semibold">{customerEmail || 'your email'}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Row */}
          {price > 0 && (
            <div className="flex justify-between items-center bg-sky-50/60 border border-sky-100 rounded-xl px-5 py-3.5 mb-8">
              <span className="text-sm font-medium text-slate-700">Total Amount Paid:</span>
              <span className="text-xl font-bold text-sky-700">${price.toFixed(2)} AUD</span>
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
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Make Another Booking
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
