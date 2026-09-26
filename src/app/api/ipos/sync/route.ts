import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';
import { getMergedIpos, getLastUpdatedTimestamp } from '../../../../lib/ipoService';

const execPromise = util.promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const projectRoot = process.cwd();
    const scraperScript = path.join(projectRoot, 'scraper', 'scrape_ipos.py');

    console.log(`Executing live scraper: python "${scraperScript}"...`);
    const { stdout, stderr } = await execPromise(`python "${scraperScript}"`, {
      timeout: 30000,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    console.log('Scraper finished:', stdout);

    const ipos = getMergedIpos();
    const lastUpdated = getLastUpdatedTimestamp();

    return NextResponse.json({
      success: true,
      message: 'Scraped and synced latest live Indian IPO data successfully.',
      count: ipos.length,
      lastUpdated,
      ipos,
    });
  } catch (error: any) {
    console.error('Scraper sync execution error:', error);
    // If execution fails, return existing data gracefully
    const ipos = getMergedIpos();
    return NextResponse.json({
      success: true,
      message: 'Using latest cached live data.',
      count: ipos.length,
      lastUpdated: getLastUpdatedTimestamp(),
      ipos,
    });
  }
}

export async function GET() {
  return POST();
}
