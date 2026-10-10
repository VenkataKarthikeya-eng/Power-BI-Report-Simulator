/**
 * Power BI Report Simulator — Calculation & Measure Engine
 * Phase 5: Structured, safe aggregations and arithmetic evaluation.
 * No arbitrary DAX execution or eval(). Safe division and missing value handling.
 */

import {
  DataRow,
  AggregationType,
  MeasureDefinition,
  ComputedMetric,
  MetricStatus,
} from './types';

/**
 * Validates whether a value is numeric.
 */
export function isNumeric(val: any): boolean {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !Number.isNaN(num) && Number.isFinite(num);
}

/**
 * Safely extracts numeric value from row field.
 */
export function getNumericValue(row: DataRow, field: string): number | null {
  const val = row[field];
  if (isNumeric(val)) {
    return Number(val);
  }
  return null;
}

/**
 * Formats numeric outputs with optional currency or percentage notation.
 */
export function formatMetricValue(
  value: number | null,
  format: 'currency' | 'percent' | 'number' = 'number',
  prefix = '',
  suffix = ''
): string {
  if (value === null || Number.isNaN(value) || !Number.isFinite(value)) {
    return '—';
  }

  if (format === 'percent') {
    return `${prefix}${value.toFixed(1)}%${suffix}`;
  }

  const absVal = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (format === 'currency') {
    const curPrefix = prefix || '$';
    if (absVal >= 1_000_000_000) {
      return `${sign}${curPrefix}${(absVal / 1_000_000_000).toFixed(2)}B${suffix}`;
    }
    if (absVal >= 1_000_000) {
      return `${sign}${curPrefix}${(absVal / 1_000_000).toFixed(2)}M${suffix}`;
    }
    if (absVal >= 1_000) {
      return `${sign}${curPrefix}${(absVal / 1_000).toFixed(1)}K${suffix}`;
    }
    return `${sign}${curPrefix}${absVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}${suffix}`;
  }

  // Standard numeric formatting
  if (absVal >= 1_000_000) {
    return `${sign}${prefix}${(absVal / 1_000_000).toFixed(2)}M${suffix}`;
  }
  if (absVal >= 1_000) {
    return `${sign}${prefix}${(absVal / 1_000).toFixed(1)}K${suffix}`;
  }
  return `${sign}${prefix}${absVal.toLocaleString('en-US')}${suffix}`;
}

/**
 * Computes standard supported aggregations over a collection of data rows.
 */
export function calculateAggregation(
  rows: DataRow[],
  field: string,
  aggType: AggregationType
): { value: number | null; status: MetricStatus; warning?: string } {
  if (!rows || rows.length === 0) {
    return { value: null, status: 'no_data', warning: 'No rows available for aggregation.' };
  }

  if (!field) {
    return { value: null, status: 'unsupported', warning: 'Field binding is missing.' };
  }

  switch (aggType) {
    case 'sum': {
      let sum = 0;
      let validCount = 0;
      for (const row of rows) {
        const val = getNumericValue(row, field);
        if (val !== null) {
          sum += val;
          validCount++;
        }
      }
      return validCount > 0
        ? { value: sum, status: 'calculated' }
        : { value: null, status: 'no_data', warning: `No numeric values found in field "${field}".` };
    }

    case 'count': {
      let count = 0;
      for (const row of rows) {
        if (row[field] !== null && row[field] !== undefined && row[field] !== '') {
          count++;
        }
      }
      return { value: count, status: 'calculated' };
    }

    case 'distinctCount': {
      const distinctSet = new Set<string>();
      for (const row of rows) {
        const val = row[field];
        if (val !== null && val !== undefined && val !== '') {
          distinctSet.add(String(val));
        }
      }
      return { value: distinctSet.size, status: 'calculated' };
    }

    case 'avg': {
      let sum = 0;
      let count = 0;
      for (const row of rows) {
        const val = getNumericValue(row, field);
        if (val !== null) {
          sum += val;
          count++;
        }
      }
      if (count === 0) {
        return { value: null, status: 'division_by_zero', warning: 'Division by zero: 0 valid numeric rows to average.' };
      }
      return { value: sum / count, status: 'calculated' };
    }

    case 'min': {
      let minVal: number | null = null;
      for (const row of rows) {
        const val = getNumericValue(row, field);
        if (val !== null) {
          if (minVal === null || val < minVal) {
            minVal = val;
          }
        }
      }
      return minVal !== null
        ? { value: minVal, status: 'calculated' }
        : { value: null, status: 'no_data', warning: `No numeric values found in field "${field}".` };
    }

    case 'max': {
      let maxVal: number | null = null;
      for (const row of rows) {
        const val = getNumericValue(row, field);
        if (val !== null) {
          if (maxVal === null || val > maxVal) {
            maxVal = val;
          }
        }
      }
      return maxVal !== null
        ? { value: maxVal, status: 'calculated' }
        : { value: null, status: 'no_data', warning: `No numeric values found in field "${field}".` };
    }

    default:
      return {
        value: null,
        status: 'unsupported',
        warning: `Aggregation type "${aggType}" is not supported.`,
      };
  }
}

/**
 * Calculates a percentage ratio with strict division-by-zero protection.
 */
export function calculatePercentage(
  numerator: number | null,
  denominator: number | null
): { value: number | null; status: MetricStatus; warning?: string } {
  if (numerator === null || denominator === null) {
    return { value: null, status: 'no_data', warning: 'Missing input values for percentage calculation.' };
  }

  if (denominator === 0) {
    return {
      value: null,
      status: 'division_by_zero',
      warning: 'Division by zero: Denominator is 0.',
    };
  }

  const ratio = (numerator / denominator) * 100;
  return { value: ratio, status: 'calculated' };
}

/**
 * Calculates basic arithmetic between two validated numbers.
 */
export function calculateArithmetic(
  val1: number | null,
  op: '+' | '-' | '*' | '/',
  val2: number | null
): { value: number | null; status: MetricStatus; warning?: string } {
  if (val1 === null || val2 === null) {
    return { value: null, status: 'no_data', warning: 'Missing input values for arithmetic operation.' };
  }

  switch (op) {
    case '+':
      return { value: val1 + val2, status: 'calculated' };
    case '-':
      return { value: val1 - val2, status: 'calculated' };
    case '*':
      return { value: val1 * val2, status: 'calculated' };
    case '/': {
      if (val2 === 0) {
        return { value: null, status: 'division_by_zero', warning: 'Division by zero: Divisor is 0.' };
      }
      return { value: val1 / val2, status: 'calculated' };
    }
    default:
      return { value: null, status: 'unsupported', warning: `Operator "${op}" is unsupported.` };
  }
}

/**
 * Evaluates a structured MeasureDefinition against a dataset.
 */
export function evaluateMeasure(
  measure: MeasureDefinition,
  rows: DataRow[],
  whatIfMultiplier = 1.0
): ComputedMetric {
  if (!measure.supported) {
    return {
      id: measure.id,
      title: measure.name,
      rawValue: null,
      formattedValue: 'Unsupported',
      status: 'unsupported',
      warning: measure.warning || 'Measure requires unsupported DAX functions or external models.',
    };
  }

  if (!rows || rows.length === 0) {
    return {
      id: measure.id,
      title: measure.name,
      rawValue: null,
      formattedValue: 'No Data',
      status: 'no_data',
      warning: 'Dataset is empty or all rows filtered out.',
    };
  }

  if (measure.calculationType === 'aggregation') {
    if (!measure.field || !measure.aggregation) {
      return {
        id: measure.id,
        title: measure.name,
        rawValue: null,
        formattedValue: 'Unbound',
        status: 'unsupported',
        warning: 'Aggregation measure lacks field or aggregation type.',
      };
    }

    const res = calculateAggregation(rows, measure.field, measure.aggregation);
    const finalVal = res.value !== null ? res.value * whatIfMultiplier : null;

    return {
      id: measure.id,
      title: measure.name,
      rawValue: finalVal,
      formattedValue: formatMetricValue(finalVal, measure.format, measure.prefix, measure.suffix),
      status: res.status,
      warning: res.warning,
    };
  }

  if (measure.calculationType === 'percentage') {
    if (!measure.numeratorField || !measure.denominatorField) {
      return {
        id: measure.id,
        title: measure.name,
        rawValue: null,
        formattedValue: 'Unbound',
        status: 'unsupported',
        warning: 'Percentage measure requires both numerator and denominator fields.',
      };
    }

    const numRes = calculateAggregation(rows, measure.numeratorField, 'sum');
    const denRes = calculateAggregation(rows, measure.denominatorField, 'sum');

    const pctRes = calculatePercentage(numRes.value, denRes.value);
    const finalVal = pctRes.value !== null ? pctRes.value * whatIfMultiplier : null;

    return {
      id: measure.id,
      title: measure.name,
      rawValue: finalVal,
      formattedValue: formatMetricValue(finalVal, 'percent', measure.prefix, measure.suffix),
      status: pctRes.status,
      warning: pctRes.warning,
    };
  }

  if (measure.calculationType === 'arithmetic') {
    if (!measure.operand1Field || !measure.operand2Field || !measure.operator) {
      return {
        id: measure.id,
        title: measure.name,
        rawValue: null,
        formattedValue: 'Unbound',
        status: 'unsupported',
        warning: 'Arithmetic measure requires operands and an operator.',
      };
    }

    const val1Res = calculateAggregation(rows, measure.operand1Field, 'sum');
    const val2Res = calculateAggregation(rows, measure.operand2Field, 'sum');

    const arithRes = calculateArithmetic(val1Res.value, measure.operator, val2Res.value);
    const finalVal = arithRes.value !== null ? arithRes.value * whatIfMultiplier : null;

    return {
      id: measure.id,
      title: measure.name,
      rawValue: finalVal,
      formattedValue: formatMetricValue(finalVal, measure.format, measure.prefix, measure.suffix),
      status: arithRes.status,
      warning: arithRes.warning,
    };
  }

  return {
    id: measure.id,
    title: measure.name,
    rawValue: null,
    formattedValue: 'Unsupported',
    status: 'unsupported',
    warning: `Calculation type "${measure.calculationType}" is not supported.`,
  };
}
