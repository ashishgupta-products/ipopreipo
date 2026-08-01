import { neon } from "@neondatabase/serverless";

const host = "ep-red-haze-az6iq9lp.c-3.ap-southeast-1.aws.neon.tech";
const user = "neondb_owner";
const db = "neondb";

// Generate variations of characters
const replacements: { [key: string]: string[] } = {
  "o": ["o", "0", "O"],
  "0": ["0", "O", "o"],
  "I": ["I", "l", "1"],
  "w": ["w", "W"],
  "C": ["C", "c"],
  "G": ["G", "6"],
  "K": ["K", "k"],
};

// Base string characters
const base = ["n", "p", "g", "_", "4", "W", "u", "o", "G", "K", "G", "I", "0", "P", "w", "C"];

function getCombinations(index: number, current: string[]): string[] {
  if (index === base.length) {
    return [current.join("")];
  }

  const char = base[index];
  const options = replacements[char] || [char];
  
  let results: string[] = [];
  for (const option of options) {
    current.push(option);
    results = results.concat(getCombinations(index + 1, current));
    current.pop();
  }
  return results;
}

async function testPassword(pwd: string): Promise<boolean> {
  const url = `postgresql://${user}:${pwd}@${host}/${db}?sslmode=require`;
  const sql = neon(url);
  try {
    await sql`SELECT 1`;
    console.log(`\nFOUND WORKING PASSWORD: ${pwd}`);
    return true;
  } catch (err: any) {
    if (err.message && err.message.includes("authentication failed")) {
      process.stdout.write(".");
      return false;
    }
    console.log(`\nError for ${pwd}: ${err.message}`);
    return false;
  }
}

async function main() {
  const combinations = getCombinations(0, []);
  console.log(`Testing ${combinations.length} password variations...`);
  
  for (const pwd of combinations) {
    const success = await testPassword(pwd);
    if (success) {
      process.exit(0);
    }
  }
  console.log("\nNo password variations worked.");
}

main();
