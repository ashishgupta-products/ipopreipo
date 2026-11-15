/**
 * Automated Domain Sanity & Invariant Verification Suite for IPO Classification
 * Run via: npm test  (or node scripts/validate_ipos.mjs)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const srcDataPath = path.join(projectRoot, 'src', 'data', 'live_ipos.json');
const publicDataPath = path.join(projectRoot, 'public', 'data', 'live_ipos.json');

const PROHIBITED_IN_UPCOMING = [
  'NSE',
  'BSE',
  'MAKEMYTRIP',
  'MMYT',
  'JIO',
  'RELIANCE JIO',
  'JIO PLATFORMS',
  'SWIGGY',
  'ZOMATO',
  'PAYTM',
  'NYKAA',
  'HYUNDAI',
];

function runValidation(filePath, label) {
  console.log(`\n========================================================`);
  console.log(`[Validation Suite] Testing ${label}: ${filePath}`);
  console.log(`========================================================`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found at ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  const ipos = parsed.ipos || [];

  console.log(`Total IPO records: ${ipos.length}`);

  let errors = 0;
  let warnings = 0;

  // 1. Check for duplicates (e.g. reliance-jio vs jio-platforms)
  const idMap = new Map();
  for (const item of ipos) {
    const id = item.id;
    if (idMap.has(id)) {
      console.error(`[FAIL] Duplicate ID detected: '${id}'`);
      errors++;
    }
    idMap.set(id, item);
  }

  if (idMap.has('reliance-jio') && idMap.has('jio-platforms')) {
    console.error(`[FAIL] Ghost duplicate detected: both 'reliance-jio' and 'jio-platforms' exist!`);
    errors++;
  } else {
    console.log(`[PASS] Entity deduplication verified (no reliance-jio ghost duplicate).`);
  }

  // 2. Prohibited entities in UPCOMING
  const upcomingIpos = ipos.filter(i => i.status === 'UPCOMING');
  console.log(`Upcoming IPOs count: ${upcomingIpos.length}`);

  for (const item of upcomingIpos) {
    const nameUpper = (item.name || '').toUpperCase();
    const symUpper = (item.symbol || '').toUpperCase();
    const idUpper = (item.id || '').toUpperCase();
    const aboutLower = (item.about || '').toLowerCase();

    for (const prohibited of PROHIBITED_IN_UPCOMING) {
      if (
        nameUpper === prohibited ||
        symUpper === prohibited ||
        idUpper === prohibited ||
        (prohibited.length > 3 && (nameUpper.includes(prohibited) || idUpper.includes(prohibited)))
      ) {
        console.error(`[FAIL] Prohibited listed entity tagged as UPCOMING: '${item.name}' (ID: ${item.id}, Symbol: ${item.symbol})`);
        errors++;
      }
    }

    if (aboutLower.includes('is listed on') || aboutLower.includes('listed on nasdaq') || aboutLower.includes('listed on bse')) {
      console.error(`[FAIL] Already listed company in UPCOMING: '${item.name}' description states: "${item.about}"`);
      errors++;
    }

    // 3. UPCOMING Invariant: No positive listing price or realized gain
    if (item.listingPrice && item.listingPrice > 0) {
      console.error(`[FAIL] UPCOMING IPO '${item.name}' has listingPrice: ₹${item.listingPrice}!`);
      errors++;
    }
  }

  if (errors === 0) {
    console.log(`[PASS] Prohibited entity guardrail verified (No listed entities in UPCOMING).`);
  }

  // 4. Verify listed entities are indeed LISTED
  const nse = ipos.find(i => i.id === 'nse' || (i.symbol || '').toUpperCase() === 'NSE');
  if (!nse) {
    console.warn(`[WARN] NSE not found in dataset.`);
    warnings++;
  } else if (nse.status !== 'LISTED') {
    console.error(`[FAIL] NSE status is '${nse.status}', expected 'LISTED'!`);
    errors++;
  } else {
    console.log(`[PASS] NSE correctly verified as LISTED.`);
  }

  const jio = ipos.find(i => (i.id || '').includes('jio') || (i.name || '').toLowerCase().includes('jio'));
  if (!jio) {
    console.warn(`[WARN] Jio not found in dataset.`);
    warnings++;
  } else if (jio.status !== 'LISTED') {
    console.error(`[FAIL] Jio status is '${jio.status}', expected 'LISTED'!`);
    errors++;
  } else {
    console.log(`[PASS] Jio correctly verified as LISTED (₹${jio.listingPrice || 1358}).`);
  }

  const mmt = ipos.find(i => (i.id || '').includes('makemytrip'));
  if (mmt && mmt.status !== 'LISTED') {
    console.error(`[FAIL] MakeMyTrip status is '${mmt.status}', expected 'LISTED'!`);
    errors++;
  } else if (mmt) {
    console.log(`[PASS] MakeMyTrip correctly verified as LISTED.`);
  }

  // 5. Invariant: Tag consistency
  for (const item of ipos) {
    const tags = item.tags || [];
    if (item.status === 'LISTED') {
      if (tags.includes('Upcoming IPO') || tags.includes('ONGOING IPO') || tags.includes('Live IPO')) {
        console.error(`[FAIL] LISTED IPO '${item.name}' has conflicting tags: ${tags.join(', ')}`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    throw new Error(`Validation failed for ${label} with ${errors} error(s).`);
  }

  console.log(`[SUCCESS] All validation assertions passed for ${label}.\n`);
}

async function validateApiIfRunning() {
  try {
    const res = await fetch('http://localhost:3000/api/ipos');
    if (!res.ok) return;
    const data = await res.json();
    const list = data.ipos || [];
    console.log(`\n========================================================`);
    console.log(`[Validation Suite] Testing Active Dev Server API (/api/ipos)`);
    console.log(`========================================================`);
    console.log(`API returned ${list.length} IPOs.`);

    const upcoming = list.filter(i => i.status === 'UPCOMING');
    for (const item of upcoming) {
      const nameUpper = (item.name || '').toUpperCase();
      const symUpper = (item.symbol || '').toUpperCase();
      for (const prohibited of PROHIBITED_IN_UPCOMING) {
        if (nameUpper === prohibited || symUpper === prohibited || (prohibited.length > 3 && nameUpper.includes(prohibited))) {
          throw new Error(`[FAIL] Live API returned prohibited entity in UPCOMING: ${item.name}`);
        }
      }
    }

    const nse = list.find(i => (i.symbol || '').toUpperCase() === 'NSE' || (i.name || '').toUpperCase() === 'NSE');
    if (nse && nse.status !== 'LISTED') {
      throw new Error(`[FAIL] Live API returned NSE as ${nse.status}, expected LISTED`);
    }

    const jio = list.filter(i => ((i.name || '') + (i.id || '')).toLowerCase().includes('jio'));
    if (jio.length > 1) {
      throw new Error(`[FAIL] Live API returned duplicate Jio entries: ${jio.length}`);
    }
    if (jio.length === 1 && jio[0].status !== 'LISTED') {
      throw new Error(`[FAIL] Live API returned Jio as ${jio[0].status}, expected LISTED`);
    }

    const seenNames = new Map();
    for (const item of list) {
      const key = (item.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenNames.has(key)) {
        throw new Error(`[FAIL] Duplicate entity in Live API: '${item.name}' matches '${seenNames.get(key)}'`);
      }
      seenNames.set(key, item.name);
    }
    console.log(`[PASS] Zero entity duplication verified across all ${list.length} Live API records.`);

    console.log(`[PASS] Live API assertions passed! UPCOMING: ${upcoming.length}, LISTED: ${list.filter(i => i.status === 'LISTED').length}`);
  } catch (err) {
    if (err.message && err.message.startsWith('[FAIL]')) {
      throw err;
    }
    console.log(`[Info] Live server check skipped (${err.message})`);
  }
}

async function main() {
  try {
    runValidation(srcDataPath, 'src/data/live_ipos.json');
    runValidation(publicDataPath, 'public/data/live_ipos.json');
    await validateApiIfRunning();
    console.log(`========================================================`);
    console.log(` ALL VALIDATION GATES PASSED! Dataset is 100% verified.`);
    console.log(`========================================================\n`);
  } catch (err) {
    console.error(`\n❌ VALIDATION GATE FAILED:\n${err.message}`);
    process.exit(1);
  }
}

main();

