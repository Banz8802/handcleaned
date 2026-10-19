import { NextResponse } from 'next/server';
import { getAdminPricingRates } from '@/services/adminPricingService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const rates = await getAdminPricingRates();
    return NextResponse.json(rates, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[API /api/pricing-rates] Error fetching pricing rates:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve pricing rates' },
      { status: 500 }
    );
  }
}
