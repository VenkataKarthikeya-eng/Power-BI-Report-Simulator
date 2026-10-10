/**
 * Power BI Report Simulator — Comprehensive Simulation Engine Automated Test Suite
 * Phase 5: Verification of filtering, multi-select, numeric ranges, aggregations,
 * division-by-zero protection, What-If scenarios, demo mode, and data integrity safeguards.
 */

import {
  calculateAggregation,
  calculatePercentage,
  calculateArithmetic,
  evaluateMeasure,
  formatMetricValue,
  createInitialFilterState,
  applyFilters,
  getActiveFilterCount,
  extractUniqueFieldValues,
  extractFieldNumericExtent,
  createDefaultWhatIfParameter,
  getWhatIfMultiplier,
  resetWhatIfParameter,
  DEMO_DATASET,
  DEMO_MEASURES,
  resolveDatasetForReport,
  initializeSimulationState,
  recalculateSimulation,
  toggleSlicerFilter,
  MeasureDefinition,
  DataRow,
} from '../src/lib/simulation';
import { NormalizedReport } from '../src/lib/parser/types';

async function runSimulationTestSuite() {
  console.log('===============================================================');
  console.log('🧪 POWER BI REPORT SIMULATOR — PHASE 5 SIMULATION TEST SUITE');
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

  const sampleRows: DataRow[] = [
    { id: 1, Region: 'North America', Category: 'Hardware', Revenue: 1000, Units: 10, Score: 85 },
    { id: 2, Region: 'North America', Category: 'Software', Revenue: 2000, Units: 20, Score: 90 },
    { id: 3, Region: 'EMEA', Category: 'Hardware', Revenue: 1500, Units: 15, Score: 75 },
    { id: 4, Region: 'APAC', Category: 'Software', Revenue: 2500, Units: 25, Score: null }, // Null score
    { id: 5, Region: 'LATAM', Category: 'Hardware', Revenue: 500, Units: 5, Score: 60 },
  ];

  // 1. Filtering Categorical Data (Single Selection)
  console.log('[1] Testing Categorical Filtering (Single Selection)...');
  const filter1 = createInitialFilterState();
  filter1.categorical['Region'] = ['North America'];
  const res1 = applyFilters(sampleRows, filter1);
  assert(res1.length === 2, 'Filters to exactly 2 North America rows');
  assert(res1.every((r) => r.Region === 'North America'), 'All filtered rows belong to North America');

  // 2. Multiple Selections
  console.log('\n[2] Testing Multiple Selections...');
  const filter2 = createInitialFilterState();
  filter2.categorical['Region'] = ['North America', 'EMEA'];
  const res2 = applyFilters(sampleRows, filter2);
  assert(res2.length === 3, 'Multi-select filters to 3 rows (North America + EMEA)');

  // 3. Numeric Ranges
  console.log('\n[3] Testing Numeric Range Filtering...');
  const filter3 = createInitialFilterState();
  filter3.numericRange['Revenue'] = { min: 1000, max: 2000 };
  const res3 = applyFilters(sampleRows, filter3);
  assert(res3.length === 3, 'Filters exactly 3 rows in range [1000, 2000] (1000, 2000, 1500)');

  // 4. Empty Filter Results
  console.log('\n[4] Testing Empty Filter Results...');
  const filter4 = createInitialFilterState();
  filter4.categorical['Region'] = ['Antarctica'];
  const res4 = applyFilters(sampleRows, filter4);
  assert(res4.length === 0, 'Returns empty array for non-matching categorical filter');

  // 5. Clearing Filters
  console.log('\n[5] Testing Filter Clearing & Resetting...');
  const activeFilters = createInitialFilterState();
  activeFilters.categorical['Category'] = ['Hardware'];
  assert(getActiveFilterCount(activeFilters) === 1, 'Correctly reports 1 active filter');
  const cleared = createInitialFilterState();
  assert(getActiveFilterCount(cleared) === 0, 'Clearing resets active filter count to 0');
  const res5 = applyFilters(sampleRows, cleared);
  assert(res5.length === sampleRows.length, 'Cleared filter returns all original rows');

  // 6. Aggregations (Sum, Count, Distinct Count, Average, Min, Max)
  console.log('\n[6] Testing Standard Aggregations...');
  const sumRes = calculateAggregation(sampleRows, 'Revenue', 'sum');
  assert(sumRes.status === 'calculated' && sumRes.value === 7500, 'Sum calculation matches 7500');

  const countRes = calculateAggregation(sampleRows, 'Revenue', 'count');
  assert(countRes.status === 'calculated' && countRes.value === 5, 'Count calculation returns 5 rows');

  const distinctRes = calculateAggregation(sampleRows, 'Category', 'distinctCount');
  assert(distinctRes.status === 'calculated' && distinctRes.value === 2, 'Distinct count on Category returns 2');

  const avgRes = calculateAggregation(sampleRows, 'Revenue', 'avg');
  assert(avgRes.status === 'calculated' && avgRes.value === 1500, 'Average calculation matches 1500');

  const minRes = calculateAggregation(sampleRows, 'Revenue', 'min');
  assert(minRes.status === 'calculated' && minRes.value === 500, 'Minimum calculation matches 500');

  const maxRes = calculateAggregation(sampleRows, 'Revenue', 'max');
  assert(maxRes.status === 'calculated' && maxRes.value === 2500, 'Maximum calculation matches 2500');

  // 7. Division by Zero and Missing Values
  console.log('\n[7] Testing Division by Zero Protection & Missing Values...');
  const divZero = calculatePercentage(500, 0);
  assert(divZero.status === 'division_by_zero' && divZero.value === null, 'Division by zero caught safely without throwing');
  assert(divZero.warning?.includes('Division by zero') === true, 'Provides informative warning on division by zero');

  const avgWithNull = calculateAggregation(sampleRows, 'Score', 'avg');
  // Valid scores: 85, 90, 75, 60 -> sum: 310 / 4 = 77.5
  assert(avgWithNull.status === 'calculated' && avgWithNull.value === 77.5, 'Average safely ignores null values in rows');

  const emptyAvg = calculateAggregation([], 'Revenue', 'avg');
  assert(emptyAvg.status === 'no_data', 'Average on empty rows returns no_data safely');

  // 8. Unsupported Calculations
  console.log('\n[8] Testing Unsupported Calculations Handling...');
  const unsupportedMeasure: MeasureDefinition = {
    id: 'dax_complex',
    name: 'Dynamic Time Intelligence',
    calculationType: 'aggregation',
    supported: false,
    warning: 'CALCULATE() function requires DAX VertiPaq tabular engine.',
  };
  const unsuppEval = evaluateMeasure(unsupportedMeasure, sampleRows);
  assert(unsuppEval.status === 'unsupported', 'Flags unsupported DAX measure with status: unsupported');
  assert(unsuppEval.warning?.includes('VertiPaq') === true, 'Returns structured warning without eval()');

  // 9. Scenario Updates and Reset
  console.log('\n[9] Testing What-If Scenario Engine...');
  const whatIf = createDefaultWhatIfParameter('revenue_metric', true);
  whatIf.currentValue = 20; // +20%
  const mult20 = getWhatIfMultiplier(whatIf);
  assert(mult20 === 1.2, '+20% variance produces 1.20 multiplier');

  whatIf.currentValue = -15; // -15%
  const multMinus15 = getWhatIfMultiplier(whatIf);
  assert(Math.abs(multMinus15 - 0.85) < 0.001, '-15% variance produces 0.85 multiplier');

  const resetWhatIf = resetWhatIfParameter(whatIf);
  assert(resetWhatIf.currentValue === 0, 'Reset returns variance slider to 0% baseline');
  assert(getWhatIfMultiplier(resetWhatIf) === 1.0, 'Baseline multiplier is exactly 1.0');

  // 10. Unknown Field Bindings
  console.log('\n[10] Testing Unknown Field Bindings...');
  const unknownFieldRes = calculateAggregation(sampleRows, 'NonExistentField', 'sum');
  assert(unknownFieldRes.status === 'no_data', 'Unknown field returns status: no_data');
  assert(unknownFieldRes.warning?.includes('No numeric values') === true, 'Provides clear warning for missing field binding');

  // 11. Empty or Unavailable Datasets
  console.log('\n[11] Testing Empty Datasets Handling...');
  const emptyRes = calculateAggregation([], 'Revenue', 'sum');
  assert(emptyRes.status === 'no_data', 'Empty array returns status: no_data without crashing');

  // 12. Demo Calculations Responding to Filters & Scenarios
  console.log('\n[12] Testing Demo Mode Filter & Scenario Interaction...');
  const demoAllRevenue = calculateAggregation(DEMO_DATASET.rows, 'Revenue', 'sum');
  assert(demoAllRevenue.status === 'calculated' && (demoAllRevenue.value || 0) > 0, 'Demo dataset computes total revenue');

  // Filter to North America only in demo dataset
  const demoNAFilter = createInitialFilterState();
  demoNAFilter.categorical['Region'] = ['North America'];
  const demoNARows = applyFilters(DEMO_DATASET.rows, demoNAFilter);
  const demoNARevenue = calculateAggregation(demoNARows, 'Revenue', 'sum');
  assert((demoNARevenue.value || 0) < (demoAllRevenue.value || 0), 'Filtered revenue strictly less than total revenue');

  // Apply What-If multiplier to demo revenue
  const scenarioWhatIf = createDefaultWhatIfParameter('revenue_metric', true);
  scenarioWhatIf.currentValue = 25; // +25%
  const scenarioEval = evaluateMeasure(DEMO_MEASURES.revenue_metric, demoNARows, getWhatIfMultiplier(scenarioWhatIf));
  const expectedScaled = (demoNARevenue.value || 0) * 1.25;
  assert(Math.abs((scenarioEval.rawValue || 0) - expectedScaled) < 0.01, 'What-If +25% correctly scales demo metric by 1.25');

  // 13. Data Integrity: Preventing Demo Values from being Claimed as Uploaded Report Data
  console.log('\n[13] Testing Data Integrity Safeguards...');
  const mockUploadedReport: NormalizedReport = {
    reportId: 'test-report',
    filename: 'Forecast_Analysis_Dashboard.pbix',
    format: 'pbix',
    pages: [],
    totalPages: 1,
    totalVisuals: 10,
    detectedVisualTypes: [],
    supportedVisualTypes: [],
    unsupportedVisualTypes: [],
    summary: {
      hasDataModel: true,
      hasDataModelSchema: false,
      hasLayout: true,
      hasLinguisticSchema: false,
      isEncrypted: false,
    },
    status: 'partial',
    warnings: [],
    errors: [],
    parsedAt: new Date().toISOString(),
  };

  const uploadedDataResolution = resolveDatasetForReport(mockUploadedReport, false);
  assert(uploadedDataResolution.dataset === null, 'Never attaches demo dataset to uploaded report with binary model');
  assert(uploadedDataResolution.hasAccessibleData === false, 'Strictly marks uploaded report data as inaccessible');
  assert(uploadedDataResolution.isDemoDataset === false, 'Strictly flags isDemoDataset as false');
  assert(uploadedDataResolution.reason?.includes('VertiPaq') === true, 'Accurately documents VertiPaq tabular limitation');

  console.log('\n===============================================================');
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSimulationTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
