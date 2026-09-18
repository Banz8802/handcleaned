import Link from 'next/link';

interface CancelPageProps {
  searchParams: Promise<{ reference?: string }>;
}

export default async function BookingCancelPage({ searchParams }: CancelPageProps) {
  const params = await searchParams;
  const bookingReference = params.reference || '';

  return (
    <main className="min-h-screen bg-[#EBF6FB]/40 py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-center p-8 sm:p-12">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Stripe Payment Cancelled
          </h1>
          <p className="text-slate-600 text-base mb-6">
            You exited the Stripe Checkout session before completing payment.
          </p>

          {/* Reference Badge */}
          {bookingReference && (
            <div className="inline-flex flex-col items-center justify-center bg-slate-900 text-white rounded-xl px-6 py-4 mb-8 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Saved Booking Reference
              </span>
              <span className="text-2xl font-mono font-bold text-amber-400">
                {bookingReference}
              </span>
            </div>
          )}

          {/* Status Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-left text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900 mb-2">What happens next?</h4>
            <p className="mb-3">
              Your booking reservation details have been saved under status <strong className="text-amber-700">PENDING</strong>.
            </p>
            <p>
              You can choose to attempt online card payment again, or pay manually via bank transfer/invoice by contacting our customer support team with reference code <strong className="font-semibold text-slate-900">{bookingReference}</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#2CBAE8] hover:bg-[#17739C] transition-colors shadow-md"
            >
              Return to Booking System
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
