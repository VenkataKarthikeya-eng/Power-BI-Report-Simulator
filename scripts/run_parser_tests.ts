/**
 * Power BI Report Simulator — Comprehensive Parser Automated Test Suite
 * Tests all Phase 4 ingestion, validation, container inspection, security limits,
 * AST normalization, and sample file verification.
 */

import fs from 'node:fs';
import JSZip from 'jszip';
import {
  validateFile,
  checkZipMagicBytes,
  inspectContainer,
  mapVisualType,
  parseReportBuffer,
} from '../src/lib/parser';

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🧪 POWER BI REPORT SIMULATOR — PHASE 4 PARSER TEST SUITE');
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

  // Helper to create synthetic UTF-16LE buffer
  function encodeUtf16Le(str: string): Buffer {
    const buf = Buffer.alloc(str.length * 2);
    for (let i = 0; i < str.length; i++) {
      buf.writeUInt16LE(str.charCodeAt(i), i * 2);
    }
    return buf;
  }

  // 1. Test Unsupported Extensions
  console.log('[1] Testing Unsupported File Extensions...');
  const res1 = validateFile('analysis.pdf', 1024);
  assert(!res1.valid && res1.errors.some(e => e.includes('Unsupported file extension')), 'Rejects .pdf extension');

  const res1b = validateFile('dataset.xlsx', 5000);
  assert(!res1b.valid && res1b.format === 'unknown', 'Rejects .xlsx extension');

  // 2. Test Invalid File Contents (Not a ZIP)
  console.log('\n[2] Testing Non-ZIP Content Validation...');
  const textBytes = new TextEncoder().encode('Hello, this is not a zip file!');
  assert(!checkZipMagicBytes(textBytes), 'Magic bytes check detects non-ZIP content');

  const res2 = validateFile('fake.pbix', textBytes.length, textBytes);
  assert(!res2.valid && res2.errors.some(e => e.includes('ZIP container signature')), 'Rejects renamed non-ZIP file with .pbix extension');

  // 3. Test Valid ZIP Containers
  console.log('\n[3] Testing Valid Synthetic ZIP Archive...');
  const zip3 = new JSZip();
  const sampleLayout = {
    id: 1,
    sections: [
      {
        name: 'section-1',
        displayName: 'Overview Page',
        width: 1280,
        height: 720,
        visualContainers: [
          {
            x: 50,
            y: 50,
            width: 300,
            height: 200,
            config: JSON.stringify({
              name: 'vc_1',
              singleVisual: { visualType: 'barChart' },
            }),
          },
        ],
      },
    ],
  };
  zip3.file('Report/Layout', encodeUtf16Le(JSON.stringify(sampleLayout)));
  zip3.file('Version', '2.128.0');
  const buf3 = await zip3.generateAsync({ type: 'nodebuffer' });

  const res3 = await parseReportBuffer(buf3, 'valid_report.pbix');
  assert(res3.success && res3.status === 'success', 'Successfully parses valid synthetic .pbix container');
  assert(res3.report?.totalPages === 1, 'Extracted 1 page correctly');
  assert(res3.report?.totalVisuals === 1, 'Extracted 1 visual container correctly');
  assert(res3.report?.pages[0].visuals[0].visualType === 'barChart', 'Correctly normalized visualType to barChart');

  // 4. Test Corrupted ZIP Containers
  console.log('\n[4] Testing Corrupted ZIP Archive...');
  const brokenZipBuf = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0xff, 0xff]); // truncated header
  const res4 = await parseReportBuffer(brokenZipBuf, 'corrupt.pbix');
  assert(!res4.success && res4.status === 'error', 'Gracefully flags corrupted archive');
  assert(res4.errors.some(e => e.includes('ZIP')), 'Returns structured ZIP decompression error');

  // 5. Test Malformed Metadata (Invalid JSON in Report/Layout)
  console.log('\n[5] Testing Malformed Metadata...');
  const zip5 = new JSZip();
  zip5.file('Report/Layout', encodeUtf16Le('{ broken_json: [ unclosed '));
  const buf5 = await zip5.generateAsync({ type: 'nodebuffer' });
  const res5 = await parseReportBuffer(buf5, 'malformed_layout.pbix');
  assert(!res5.success && res5.status === 'error', 'Rejects malformed JSON in Report/Layout');
  assert(res5.errors.some(e => e.includes('JSON')), 'Returns clear JSON parse error');

  // 6. Test Missing Expected Report Entries (No Report/Layout)
  console.log('\n[6] Testing Missing Report/Layout...');
  const zip6 = new JSZip();
  zip6.file('Version', '1.0');
  zip6.file('Settings', 'settings');
  const buf6 = await zip6.generateAsync({ type: 'nodebuffer' });
  const res6 = await parseReportBuffer(buf6, 'no_layout.pbix');
  assert(res6.status === 'unsupported', 'Returns status: unsupported when Report/Layout is missing');
  assert(res6.errors.some(e => e.includes('Report/Layout')), 'Identifies missing layout entry');

  // 7. Test Oversized Files
  console.log('\n[7] Testing Oversized File Limits...');
  const res7 = validateFile('huge.pbix', 300 * 1024 * 1024, undefined, 250 * 1024 * 1024);
  assert(!res7.valid && res7.errors.some(e => e.includes('exceeds the maximum allowed size')), 'Rejects files over configured size limit');

  // 8. Test ZIP Entry Limit (ZIP bomb vector)
  console.log('\n[8] Testing ZIP Entry Limits (Resource Safeguard)...');
  const zip8 = new JSZip();
  for (let i = 0; i < 25; i++) {
    zip8.file(`file_${i}.txt`, 'small data');
  }
  let threwEntryLimit = false;
  try {
    await inspectContainer(zip8, { maxEntries: 20 });
  } catch (err: any) {
    threwEntryLimit = err.message.includes('maximum entry threshold');
  }
  assert(threwEntryLimit, 'Aborts parsing when ZIP entry count exceeds threshold');

  // 9. Test Unknown & Custom Visual Types
  console.log('\n[9] Testing Unknown & Custom Visual Types...');
  const mappedCustom = mapVisualType('com.custom.vendor.superChart1234567890');
  assert(mappedCustom.normalizedType === 'custom' && mappedCustom.isCustom === true, 'Maps long vendor identifier to custom visual');

  const mappedSlicer = mapVisualType('slicer');
  assert(mappedSlicer.isSlicer === true && mappedSlicer.supported === true, 'Maps slicer visual accurately');

  // 10. Test Partial Parsing & Warning Generation
  console.log('\n[10] Testing Partial Parsing with Warnings...');
  const zip10 = new JSZip();
  const partialLayout = {
    id: 1,
    sections: [
      {
        name: 'page1',
        displayName: 'Mixed Page',
        visualContainers: [
          {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            config: JSON.stringify({ singleVisual: { visualType: 'columnChart' } }),
          },
          {
            x: 100,
            y: 0,
            width: 100,
            height: 100,
            config: JSON.stringify({ singleVisual: { visualType: 'super_unsupported_3d_globe_plugin' } }),
          },
        ],
      },
    ],
  };
  zip10.file('Report/Layout', encodeUtf16Le(JSON.stringify(partialLayout)));
  zip10.file('DataModel', 'binary_datamodel'); // VertiPaq
  const buf10 = await zip10.generateAsync({ type: 'nodebuffer' });
  const res10 = await parseReportBuffer(buf10, 'mixed_report.pbix');
  assert(res10.status === 'partial', 'Assigns status: partial when unsupported visual is detected');
  assert(res10.warnings.length > 0, 'Generates structured warnings for partial support');

  // 11. Test .pbix vs .pbit Format Detection
  console.log('\n[11] Testing .pbix vs .pbit Format Detection...');
  const zipPbit = new JSZip();
  zipPbit.file('Report/Layout', encodeUtf16Le(JSON.stringify(sampleLayout)));
  zipPbit.file('DataModelSchema', '{"model":{}}');
  const bufPbit = await zipPbit.generateAsync({ type: 'nodebuffer' });
  const resPbit = await parseReportBuffer(bufPbit, 'template.pbit');
  assert(resPbit.report?.format === 'pbit', 'Identifies .pbit template format correctly');
  assert(resPbit.container?.isPbit === true, 'Container inspection flags isPbit correctly');

  // 12. Test Normalization of Visual Coordinates & Titles
  console.log('\n[12] Testing AST Normalization Integrity...');
  const zipNorm = new JSZip();
  const normLayout = {
    id: 42,
    sections: [
      {
        name: 'finance-sec',
        displayName: 'Financial Results',
        width: 1920,
        height: 1080,
        visualContainers: [
          {
            x: 120,
            y: 80,
            width: 500,
            height: 350,
            config: JSON.stringify({
              name: 'net_income_card',
              singleVisual: {
                visualType: 'card',
                vcObjects: {
                  title: [{ properties: { text: { expr: { Literal: { Value: "'Net Income YTD'" } } } } }],
                },
              },
            }),
          },
        ],
      },
    ],
  };
  zipNorm.file('Report/Layout', encodeUtf16Le(JSON.stringify(normLayout)));
  const bufNorm = await zipNorm.generateAsync({ type: 'nodebuffer' });
  const resNorm = await parseReportBuffer(bufNorm, 'finance.pbix');
  const page = resNorm.report?.pages[0];
  const vis = page?.visuals[0];
  assert(page?.width === 1920 && page?.height === 1080, 'Preserves page viewport resolution (1920x1080)');
  assert(vis?.position.x === 120 && vis?.position.y === 80, 'Preserves bounding box coordinates (120, 80)');
  assert(vis?.title === 'Net Income YTD', 'Extracts and sanitizes visual title from vcObjects');

  // 13. Test Real Repository Sample Files (Read-Only)
  console.log('\n[13] Testing Real Repository PBIX Models (Read-Only)...');
  const forecastBuf = fs.readFileSync('Forecast_Analysis_Dashboard.pbix');
  const forecastRes = await parseReportBuffer(forecastBuf, 'Forecast_Analysis_Dashboard.pbix');
  assert(forecastRes.success, 'Forecast_Analysis_Dashboard.pbix parsed successfully');
  assert(forecastRes.report?.totalPages === 6, 'Forecast model contains exactly 6 pages');
  assert(forecastRes.report?.totalVisuals === 54, 'Forecast model contains exactly 54 visuals');
  assert(forecastRes.status === 'partial', 'Forecast model correctly tagged as partial (due to DataModel binary presence)');

  const customerBuf = fs.readFileSync('customer_behavior_dashboard.pbix');
  const customerRes = await parseReportBuffer(customerBuf, 'customer_behavior_dashboard.pbix');
  assert(customerRes.success, 'customer_behavior_dashboard.pbix parsed successfully');
  assert(customerRes.report?.totalPages === 1, 'Customer model contains exactly 1 page');
  assert(customerRes.report?.totalVisuals === 20, 'Customer model contains exactly 20 visuals');

  console.log('\n===============================================================');
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
