import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/services/adminAuthService';
import { getExportBookings } from '@/services/adminBookingService';

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).trim();
  // Escape quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Admin Session
    const session = await getAdminSession();
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Query Filters
    const { searchParams } = new URL(req.url);
    const date_from = searchParams.get('date_from') || undefined;
    const date_to = searchParams.get('date_to') || undefined;
    const payment_status = searchParams.get('payment_status') || undefined;
    const service = searchParams.get('service') || undefined;

    // 3. Fetch Bookings from Service Layer
    const { bookings, error } = await getExportBookings({
      date_from,
      date_to,
      payment_status,
      service,
    });

    if (error) {
      return NextResponse.json(
        { error: `Database error while exporting: ${error}` },
        { status: 500 }
      );
    }

    // 4. Construct CSV Content
    const headers = [
      'Booking Reference',
      'Customer Name',
      'Email',
      'Phone',
      'Service',
      'Package',
      'Booking Date',
      'Booking Time',
      'Amount (AUD)',
      'Payment Status',
      'Booking Status',
      'Property Address',
      'Bedrooms',
      'Bathrooms',
      'Created Date',
    ];

    const rows = (bookings || []).map((b) => [
      escapeCsvCell(b.booking_reference),
      escapeCsvCell(`${b.first_name} ${b.last_name}`.trim()),
      escapeCsvCell(b.email),
      escapeCsvCell(b.phone),
      escapeCsvCell(b.service),
      escapeCsvCell(b.package_name),
      escapeCsvCell(b.booking_date),
      escapeCsvCell(b.booking_time),
      escapeCsvCell(b.price.toFixed(2)),
      escapeCsvCell(b.payment_status.toUpperCase()),
      escapeCsvCell(b.booking_status.toUpperCase()),
      escapeCsvCell(b.property_address),
      escapeCsvCell(b.bedrooms),
      escapeCsvCell(b.bathrooms),
      escapeCsvCell(new Date(b.created_at).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\r\n');

    const dateSlug = new Date().toISOString().slice(0, 10);
    const filename = `handcleaned-transactions-${dateSlug}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CSV Export Error]:', msg);
    return NextResponse.json(
      { error: `Export processing error: ${msg}` },
      { status: 500 }
    );
  }
}
