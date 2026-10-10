/**
 * Power BI Report Simulator — Filter Engine
 * Phase 5: Slicer state management, multi-select categorical filtering,
 * numeric ranges, and date range filtering over validated tabular datasets.
 */

import { DataRow, FilterState } from './types';
import { isNumeric } from './measure-engine';

/**
 * Creates an empty, default filter state.
 */
export function createInitialFilterState(): FilterState {
  return {
    categorical: {},
    numericRange: {},
    dateRange: {},
  };
}

/**
 * Counts the total number of active filters.
 */
export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;
  for (const field of Object.keys(filters.categorical)) {
    if (filters.categorical[field] && filters.categorical[field].length > 0) {
      count++;
    }
  }
  for (const field of Object.keys(filters.numericRange)) {
    if (filters.numericRange[field]) {
      count++;
    }
  }
  for (const field of Object.keys(filters.dateRange)) {
    const r = filters.dateRange[field];
    if (r && (r.start || r.end)) {
      count++;
    }
  }
  return count;
}

/**
 * Filters a collection of data rows based on current active FilterState.
 */
export function applyFilters(rows: DataRow[], filters: FilterState): DataRow[] {
  if (!rows || rows.length === 0) return [];

  return rows.filter((row) => {
    // 1. Categorical Filters (multi-selection)
    for (const [field, selectedValues] of Object.entries(filters.categorical)) {
      if (selectedValues && selectedValues.length > 0) {
        const val = row[field];
        if (val === null || val === undefined) {
          return false;
        }
        const stringVal = String(val).trim().toLowerCase();
        const matches = selectedValues.some(
          (sel) => sel.trim().toLowerCase() === stringVal
        );
        if (!matches) {
          return false;
        }
      }
    }

    // 2. Numeric Range Filters
    for (const [field, range] of Object.entries(filters.numericRange)) {
      if (range) {
        const val = row[field];
        if (!isNumeric(val)) {
          return false;
        }
        const num = Number(val);
        if (num < range.min || num > range.max) {
          return false;
        }
      }
    }

    // 3. Date Range Filters (ISO dates or year comparisons)
    for (const [field, range] of Object.entries(filters.dateRange)) {
      if (range && (range.start || range.end)) {
        const val = row[field];
        if (!val) return false;
        const rowTime = new Date(String(val)).getTime();
        if (Number.isNaN(rowTime)) return false;

        if (range.start) {
          const startTime = new Date(range.start).getTime();
          if (!Number.isNaN(startTime) && rowTime < startTime) {
            return false;
          }
        }
        if (range.end) {
          const endTime = new Date(range.end).getTime();
          if (!Number.isNaN(endTime) && rowTime > endTime) {
            return false;
          }
        }
      }
    }

    return true;
  });
}

/**
 * Extracts unique values from a dataset field, sorted alphabetically.
 */
export function extractUniqueFieldValues(
  rows: DataRow[],
  field: string
): { value: string; count: number }[] {
  if (!rows || rows.length === 0 || !field) return [];

  const counts = new Map<string, number>();

  for (const row of rows) {
    const val = row[field];
    if (val !== null && val !== undefined && val !== '') {
      const str = String(val).trim();
      counts.set(str, (counts.get(str) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

/**
 * Extracts min and max bounds for numeric fields.
 */
export function extractFieldNumericExtent(
  rows: DataRow[],
  field: string
): { min: number; max: number } | null {
  if (!rows || rows.length === 0 || !field) return null;

  let min: number | null = null;
  let max: number | null = null;

  for (const row of rows) {
    const val = row[field];
    if (isNumeric(val)) {
      const num = Number(val);
      if (min === null || num < min) min = num;
      if (max === null || num > max) max = num;
    }
  }

  if (min === null || max === null) return null;
  return { min, max };
}

/**
 * Generates human-readable descriptions of active filters.
 */
export function getActiveFilterSummary(filters: FilterState): string[] {
  const summary: string[] = [];

  for (const [field, values] of Object.entries(filters.categorical)) {
    if (values && values.length > 0) {
      summary.push(`${field}: ${values.join(', ')}`);
    }
  }

  for (const [field, range] of Object.entries(filters.numericRange)) {
    if (range) {
      summary.push(`${field}: between ${range.min} and ${range.max}`);
    }
  }

  for (const [field, range] of Object.entries(filters.dateRange)) {
    if (range && (range.start || range.end)) {
      summary.push(`${field}: ${range.start || 'Start'} to ${range.end || 'End'}`);
    }
  }

  return summary;
}
