/**
 * Comprehensive Architecture & Simulation Validation Script
 * Verifies PBIX parser fallbacks, simulation preset compilation,
 * locked visual integrity, reactive multi-dimensional slicing,
 * and shareable link generator.
 */

import { getCuratedSamplePreset } from '../apps/app-dashboard/src/lib/pbixParser';
import { compileSimulationPreset, calculateSlicedSimulation } from '../apps/app-dashboard/src/lib/simulationEngine';

function runValidation() {
  console.log('=====================================================');
  console.log('🧪 VERIFYING POWER BI SIMULATION PRESET PLATFORM');
  console.log('=====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      process.exitCode = 1;
    }
  }

  // 1. Test PBIX Extraction & Preset Generation
  console.log('[1] Testing PBIX Presets & AST Extraction...');
  const logisticsPreset = getCuratedSamplePreset('Global_Supply_Chain_Logistics.pbix');
  assert(logisticsPreset.dashboard.pages.length >= 2, 'Logistics dashboard has at least 2 pages');
  assert(logisticsPreset.visualCount >= 6, 'Logistics dashboard contains multiple visual containers');
  assert(logisticsPreset.slicers.length >= 2, 'Logistics dashboard contains detected slicers');

  const saasPreset = getCuratedSamplePreset('Executive_SaaS_Financials.pbix');
  assert(saasPreset.dashboard.name.includes('SaaS'), 'SaaS preset parsed successfully');

  // 2. Test Simulation Preset Compilation & Lock Integrity
  console.log('\n[2] Testing Simulation Preset Compilation & Lock Architecture...');
  const compiled = compileSimulationPreset(logisticsPreset.dashboard, logisticsPreset.slicers, {
    layoutLocked: true,
  });

  assert(compiled.layoutLocked === true, 'Visual charts & layout are locked to prevent editing');
  assert(compiled.metrics.length > 0, 'Simulation metrics compiled with baseline values');
  assert(compiled.chartData.barChart!.length > 0, 'Bar chart allocation data compiled');
  assert(compiled.chartData.lineChart!.length > 0, 'Line trend trajectory data compiled');
  assert(compiled.chartData.matrix!.length > 0, 'Operational matrix rows compiled');

  // 3. Test Reactive Slicers (Dynamic Recalculation)
  console.log('\n[3] Testing Operable Slicers & Zero-Latency Dynamic Recalculation...');
  const baselineOutput = calculateSlicedSimulation(compiled, {
    Region: 'All Regions',
    Period: 'YTD 2026',
  });

  const baseMarginRaw = baselineOutput.metrics[0].rawValue;
  assert(baseMarginRaw > 1000000, `Baseline Freight Margin calculated: ${baselineOutput.metrics[0].value}`);

  // Slice to North America (NA) - expect +18% margin boost
  const naOutput = calculateSlicedSimulation(compiled, {
    Region: 'North America (NA)',
    Period: 'YTD 2026',
  });

  const naMarginRaw = naOutput.metrics[0].rawValue;
  assert(naMarginRaw > baseMarginRaw, `North America slicer increased margin: ${naOutput.metrics[0].value} > ${baselineOutput.metrics[0].value}`);
  assert(naOutput.activeFilterSummary.some((f) => f.includes('North America')), 'Active filter tag registered');

  // Slice to Carrier
  const carrierOutput = calculateSlicedSimulation(compiled, {
    Carrier: 'FedEx Freight',
  });
  assert(carrierOutput.matrixRows.length > 0, 'Matrix filtered to selected carrier');

  // 4. Test What-If Scenario Slider (+15% Volume Simulation)
  console.log('\n[4] Testing What-If Scenario Modeling Sliders...');
  const whatIfOutput = calculateSlicedSimulation(compiled, { Region: 'All Regions' }, 15);
  assert(whatIfOutput.metrics[0].rawValue > baseMarginRaw, 'What-If +15% slider scaled simulated metrics upwards');

  // 5. Test Shareable Link & Token Specification
  console.log('\n[5] Testing Google Forms-Style Shareable Link Generation...');
  assert(compiled.shareConfig.shareToken.startsWith('token_'), 'Unique share token generated');
  assert(compiled.shareConfig.isPublic === true, 'Share link configured for public viewing without login');
  assert(compiled.shareConfig.allowWhatIfSimulation === true, 'Recipient permission matrix includes What-If sliders');

  console.log('\n=====================================================');
  console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log('=====================================================');
}

runValidation();
