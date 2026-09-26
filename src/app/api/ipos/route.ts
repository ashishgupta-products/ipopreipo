import { NextResponse } from 'next/server';
import { getMergedIpos, getLastUpdatedTimestamp } from '../../../lib/ipoService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ipos = getMergedIpos();
    const lastUpdated = getLastUpdatedTimestamp();

    return NextResponse.json({
      success: true,
      count: ipos.length,
      lastUpdated,
      ipos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch IPO data' },
      { status: 500 }
    );
  }
}
