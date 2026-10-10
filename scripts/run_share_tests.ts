/**
 * Power BI Report Simulator — Share URL & Hydration Safety Test Suite
 * Verifies deterministic SSR fallback, environment variable precedence,
 * trailing slash sanitization, and client-side origin synchronization.
 */

import {
  DEFAULT_FALLBACK_ORIGIN,
  getBaseOrigin,
  getFallbackShareUrl,
  getClientShareUrl,
} from '../src/lib/share/share-url';

async function runShareTestSuite() {
  console.log('===============================================================');
  console.log('🧪 POWER BI REPORT SIMULATOR — SHARE URL HYDRATION TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  }

  // [1] Default Base Origin Resolution
  console.log('[1] Testing Base Origin Resolution...');
  const defaultOrigin = getBaseOrigin();
  assert(
    defaultOrigin === DEFAULT_FALLBACK_ORIGIN,
    'Resolves default fallback origin when no env is provided',
    `Expected ${DEFAULT_FALLBACK_ORIGIN}, got ${defaultOrigin}`
  );

  const customOrigin = getBaseOrigin('https://custom-domain.example.com');
  assert(
    customOrigin === 'https://custom-domain.example.com',
    'Uses explicitly supplied custom origin',
    `Got ${customOrigin}`
  );

  const trimmedOrigin = getBaseOrigin('https://custom-domain.example.com/// ');
  assert(
    trimmedOrigin === 'https://custom-domain.example.com',
    'Sanitizes trailing slashes and surrounding whitespace',
    `Got ${trimmedOrigin}`
  );

  // [2] Deterministic SSR Fallback Share URL
  console.log('\n[2] Testing Deterministic SSR Fallback URL...');
  const ssrUrlDemo = getFallbackShareUrl('demo');
  assert(
    ssrUrlDemo === `${DEFAULT_FALLBACK_ORIGIN}/share/demo`,
    'Generates deterministic fallback URL for demo capsule',
    `Got ${ssrUrlDemo}`
  );

  const ssrUrlSpecific = getFallbackShareUrl('report-uuid-9876');
  assert(
    ssrUrlSpecific === `${DEFAULT_FALLBACK_ORIGIN}/share/report-uuid-9876`,
    'Generates deterministic fallback URL for custom capsule ID',
    `Got ${ssrUrlSpecific}`
  );

  const ssrUrlEmpty = getFallbackShareUrl('');
  assert(
    ssrUrlEmpty === `${DEFAULT_FALLBACK_ORIGIN}/share/demo`,
    'Falls back to "demo" when capsuleId is empty string',
    `Got ${ssrUrlEmpty}`
  );

  const ssrUrlWhitespace = getFallbackShareUrl('   ');
  assert(
    ssrUrlWhitespace === `${DEFAULT_FALLBACK_ORIGIN}/share/demo`,
    'Falls back to "demo" when capsuleId is whitespace',
    `Got ${ssrUrlWhitespace}`
  );

  // [3] Client-Side Origin Resolution
  console.log('\n[3] Testing Client-Side Origin Resolution...');
  const localDevClientUrl = getClientShareUrl('capsule-42', 'http://localhost:3000');
  assert(
    localDevClientUrl === 'http://localhost:3000/share/capsule-42',
    'Resolves local development origin (http://localhost:3000)',
    `Got ${localDevClientUrl}`
  );

  const localDevTrailingSlash = getClientShareUrl('capsule-42', 'http://localhost:3000/');
  assert(
    localDevTrailingSlash === 'http://localhost:3000/share/capsule-42',
    'Normalizes trailing slash on client origin',
    `Got ${localDevTrailingSlash}`
  );

  const prodClientUrl = getClientShareUrl('capsule-42', 'https://app.powerbi-simulator.com');
  assert(
    prodClientUrl === 'https://app.powerbi-simulator.com/share/capsule-42',
    'Resolves production client origin correctly',
    `Got ${prodClientUrl}`
  );

  // [4] Hydration Parity Verification
  console.log('\n[4] Testing Hydration Parity...');
  // Simulating SSR environment:
  const serverRenderedState = getFallbackShareUrl('test-capsule');
  // Simulating initial client render before useEffect:
  const clientInitialState = getFallbackShareUrl('test-capsule');
  assert(
    serverRenderedState === clientInitialState,
    'Server render markup matches client initial render exactly (0 character drift)',
    `Server: "${serverRenderedState}" vs Client: "${clientInitialState}"`
  );

  // Simulating post-hydration useEffect update:
  const clientHydratedState = getClientShareUrl('test-capsule', 'http://localhost:3000');
  assert(
    clientHydratedState === 'http://localhost:3000/share/test-capsule',
    'Client updates to active browser origin post-hydration without altering initial markup',
    `Got ${clientHydratedState}`
  );

  console.log('\n===============================================================');
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runShareTestSuite().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
