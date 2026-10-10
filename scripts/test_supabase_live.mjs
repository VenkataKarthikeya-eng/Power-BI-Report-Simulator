import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

// Parse .env.local without logging values
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('--- SUPABASE CONFIGURATION SAFE CHECK ---');
console.log('NEXT_PUBLIC_SUPABASE_URL present:', Boolean(url));
if (url) {
  try {
    const parsed = new URL(url);
    console.log('Target Project Host:', parsed.hostname);
  } catch {
    console.log('Target Project URL is invalid format');
  }
}
console.log('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY present:', Boolean(key));
console.log('Key length in characters:', key.length);

if (!url || !key) {
  console.error('FAILED: Missing URL or Key in .env.local');
  process.exit(1);
}

// Dynamically import @supabase/supabase-js
import('@supabase/supabase-js').then(async ({ createClient }) => {
  try {
    console.log('\n--- ATTEMPTING LIVE CONNECTION TEST ---');
    const start = Date.now();
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: authData, error: authError } = await supabase.auth.getSession();
    const latency = Date.now() - start;

    console.log('Latency:', `${latency}ms`);
    if (authError) {
      console.log('Auth getSession response error:', authError.message);
    } else {
      console.log('Auth getSession response: SUCCESS (Session object received, no auth errors)');
    }

    // Direct endpoint checks
    try {
      const healthRes = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: key }
      });
      console.log('Auth /health HTTP status:', healthRes.status, healthRes.statusText);
      const healthJson = await healthRes.json().catch(() => null);
      if (healthJson) console.log('Auth health payload:', JSON.stringify(healthJson));
    } catch (e) {
      console.log('Auth health fetch failed:', e.message);
    }

    try {
      const restRes = await fetch(`${url}/rest/v1/`, {
        headers: { apikey: key }
      });
      console.log('PostgREST root HTTP status:', restRes.status, restRes.statusText);
    } catch (e) {
      console.log('PostgREST fetch failed:', e.message);
    }

    console.log('\nConnection test completed.');
  } catch (err) {
    console.error('Fatal connection error:', err.message);
  }
});
