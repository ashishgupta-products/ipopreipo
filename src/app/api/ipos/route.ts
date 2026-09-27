import { NextResponse } from 'next/server';
import { getAllIposFromDb, getLastSyncFromDb } from '../../../lib/db';
import { getMergedIpos, getLastUpdatedTimestamp } from '../../../lib/ipoService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Try fetching live data from Neon PostgreSQL
    const dbIpos = await getAllIposFromDb();
    if (dbIpos && dbIpos.length > 0) {
      const dbLastUpdated = await getLastSyncFromDb();
      return NextResponse.json({
        success: true,
        source: 'neon-postgresql',
        count: dbIpos.length,
        lastUpdated: dbLastUpdated || getLastUpdatedTimestamp(),
        ipos: dbIpos,
      });
    }

    // 2. Fallback to local cached data
    const ipos = getMergedIpos();
    const lastUpdated = getLastUpdatedTimestamp();

    return NextResponse.json({
      success: true,
      source: 'local-cache',
      count: ipos.length,
      lastUpdated,
      ipos,
    });
  } catch (error: any) {
    console.error('API /api/ipos error, falling back to local:', error);
    const ipos = getMergedIpos();
    return NextResponse.json({
      success: true,
      source: 'local-fallback',
      count: ipos.length,
      lastUpdated: getLastUpdatedTimestamp(),
      ipos,
    });
  }
}
