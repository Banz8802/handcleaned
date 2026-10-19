import { NextResponse } from 'next/server';
import { getAdminSiteContent } from '@/services/adminContentService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const content = await getAdminSiteContent();
    return NextResponse.json(content, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[API /api/site-content] Error fetching site content:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve site content' },
      { status: 500 }
    );
  }
}
