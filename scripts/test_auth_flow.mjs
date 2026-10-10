import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq !== -1) {
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

import('@supabase/supabase-js').then(async ({ createClient }) => {
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  console.log('--- TEST 1: INVALID CREDENTIALS REJECTION ---');
  const { data: failData, error: failError } = await supabase.auth.signInWithPassword({
    email: 'nonexistent_test_user_999@example.com',
    password: 'wrong_password_123',
  });
  console.log('Expected error received:', Boolean(failError));
  console.log('Error message:', failError?.message);

  console.log('\n--- TEST 2: SIGN UP TEST VALIDATION ---');
  // Attempt signup with a unique test email
  const testEmail = `test_simulator_${Date.now()}@example.com`;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'SecureSimulatorPassword2026!',
    options: {
      data: {
        full_name: 'Simulator Test User',
      },
    },
  });

  if (signUpError) {
    console.log('Sign up error:', signUpError.message);
  } else {
    console.log('Sign up result -> User created:', Boolean(signUpData?.user));
    console.log('User ID present:', Boolean(signUpData?.user?.id));
    console.log('User metadata full_name:', signUpData?.user?.user_metadata?.full_name);
    console.log('Session present (auto-confirm enabled):', Boolean(signUpData?.session));
    console.log('Confirmation email required:', !signUpData?.session);
  }

  console.log('\nAuth testing complete.');
});
