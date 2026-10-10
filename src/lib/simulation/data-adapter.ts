/**
 * Power BI Report Simulator — Data Adapter & Simulation Orchestrator
 * Phase 5: Connects parsed report AST to client-side simulation state,
 * keeping demo dataset explicitly separated from uploaded reports.
 */

import { NormalizedReport } from '../parser/types';
import {
  Dataset,
  FilterState,
  WhatIfParameter,
  SimulationState,
  ComputedVisualData,
} from './types';
import { DEMO_DATASET } from './demo-dataset';
import {
  createInitialFilterState,
  applyFilters,
  getActiveFilterCount,
} from './filter-engine';
import {
  createDefaultWhatIfParameter,
  resetWhatIfParameter,
} from './scenario-engine';
import { computeVisualData } from './visual-adapter';

/**
 * Resolves whether a dataset is available for the given report context.
 * Strict Integrity Rule: Never substitute demo data for uploaded reports.
 */
export function resolveDatasetForReport(
  report: NormalizedReport | null,
  isDemoMode: boolean
): {
  dataset: Dataset | null;
  hasAccessibleData: boolean;
  isDemoDataset: boolean;
  reason?: string;
} {
  // If explicitly in Demo Mode (or no report uploaded and demo requested)
  if (isDemoMode) {
    return {
      dataset: DEMO_DATASET,
      hasAccessibleData: true,
      isDemoDataset: true,
    };
  }

  // If a report is uploaded: check if VertiPaq or unexecutable binary model is present
  if (report) {
    if (report.summary.hasDataModel) {
      return {
        dataset: null,
        hasAccessibleData: false,
        isDemoDataset: false,
        reason: 'Binary VertiPaq DataModel present. Tabular data rows cannot be executed in browser memory without server-side tabular simulation.',
      };
    }
  }

  return {
    dataset: null,
    hasAccessibleData: false,
    isDemoDataset: false,
    reason: 'No dataset is attached to this report layout.',
  };
}

/**
 * Initializes a complete SimulationState for an active report page.
 */
export function initializeSimulationState(
  report: NormalizedReport | null,
  activePageId: string,
  isDemoMode: boolean
): SimulationState {
  const { dataset, hasAccessibleData, isDemoDataset } = resolveDatasetForReport(
    report,
    isDemoMode
  );

  const filters = createInitialFilterState();
  const whatIf = createDefaultWhatIfParameter('revenue_metric', hasAccessibleData);

  const allRows = dataset?.rows || [];
  const filteredRows = applyFilters(allRows, filters);

  const activePage = report?.pages.find((p) => p.id === activePageId) || report?.pages[0];
  const computedVisuals: Record<string, ComputedVisualData> = {};

  if (activePage) {
    for (const visual of activePage.visuals) {
      computedVisuals[visual.id] = computeVisualData(
        visual,
        dataset,
        filteredRows,
        allRows,
        filters,
        whatIf
      );
    }
  }

  return {
    dataset,
    hasAccessibleData,
    isDemoMode: isDemoDataset,
    filters,
    whatIf,
    computedVisuals,
    activePageId: activePage?.id || activePageId,
    summary: {
      totalRows: allRows.length,
      filteredRows: filteredRows.length,
      activeFilterCount: getActiveFilterCount(filters),
    },
  };
}

/**
 * Re-runs simulation calculations when filters or what-if parameters change.
 */
export function recalculateSimulation(
  currentState: SimulationState,
  report: NormalizedReport | null,
  updatedFilters?: FilterState,
  updatedWhatIf?: WhatIfParameter
): SimulationState {
  const filters = updatedFilters || currentState.filters;
  const whatIf = updatedWhatIf || currentState.whatIf;
  const dataset = currentState.dataset;

  const allRows = dataset?.rows || [];
  const filteredRows = applyFilters(allRows, filters);

  const activePage = report?.pages.find((p) => p.id === currentState.activePageId) || report?.pages[0];
  const computedVisuals: Record<string, ComputedVisualData> = {};

  if (activePage) {
    for (const visual of activePage.visuals) {
      computedVisuals[visual.id] = computeVisualData(
        visual,
        dataset,
        filteredRows,
        allRows,
        filters,
        whatIf
      );
    }
  }

  return {
    ...currentState,
    filters,
    whatIf,
    computedVisuals,
    summary: {
      totalRows: allRows.length,
      filteredRows: filteredRows.length,
      activeFilterCount: getActiveFilterCount(filters),
    },
  };
}

/**
 * Toggles a categorical slicer value.
 */
export function toggleSlicerFilter(
  currentFilters: FilterState,
  field: string,
  value: string
): FilterState {
  const currentList = currentFilters.categorical[field] || [];
  const exists = currentList.includes(value);

  const updatedList = exists
    ? currentList.filter((v) => v !== value)
    : [...currentList, value];

  const newCategorical = { ...currentFilters.categorical };
  if (updatedList.length > 0) {
    newCategorical[field] = updatedList;
  } else {
    delete newCategorical[field];
  }

  return {
    ...currentFilters,
    categorical: newCategorical,
  };
}
