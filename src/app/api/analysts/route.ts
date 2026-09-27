import { NextResponse } from 'next/server';
import { getAllAnalystsFromDb } from '../../../lib/db';
import { getAllAnalysts } from '../../../lib/analystService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbAnalysts = await getAllAnalystsFromDb();
    if (dbAnalysts && dbAnalysts.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'neon-postgresql',
        count: dbAnalysts.length,
        analysts: dbAnalysts,
      });
    }

    const localAnalysts = getAllAnalysts();
    return NextResponse.json({
      success: true,
      source: 'local-cache',
      count: localAnalysts.length,
      analysts: localAnalysts,
    });
  } catch (error: any) {
    console.error('API /api/analysts error:', error);
    const localAnalysts = getAllAnalysts();
    return NextResponse.json({
      success: true,
      source: 'local-fallback',
      count: localAnalysts.length,
      analysts: localAnalysts,
    });
  }
}
