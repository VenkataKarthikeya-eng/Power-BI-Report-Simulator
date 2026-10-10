/**
 * Power BI Report Simulator — Simulation Engine Type Definitions
 * Phase 5: Client-side interactive simulation, calculation registry,
 * filter engine, What-If scenarios, and visual adapters.
 */

import { NormalizedVisual, NormalizedPage, NormalizedReport, NormalizedVisualType } from '../parser/types';

export type SimulationDataType = 'string' | 'number' | 'date' | 'boolean';

export interface DatasetField {
  name: string;
  type: SimulationDataType;
  label?: string;
  format?: 'currency' | 'percent' | 'number' | 'text' | 'date';
}

export type DataRow = Record<string, string | number | boolean | null | undefined>;

export interface Dataset {
  id: string;
  name: string;
  isDemo: boolean;
  fields: DatasetField[];
  rows: DataRow[];
  description?: string;
}

export type AggregationType = 'sum' | 'count' | 'distinctCount' | 'avg' | 'min' | 'max';

export type CalculationType = 'aggregation' | 'percentage' | 'arithmetic' | 'whatif';

export interface MeasureDefinition {
  id: string;
  name: string;
  calculationType: CalculationType;
  aggregation?: AggregationType;
  field?: string;
  numeratorField?: string;
  denominatorField?: string;
  operand1Field?: string;
  operand2Field?: string;
  operator?: '+' | '-' | '*' | '/';
  format?: 'currency' | 'percent' | 'number';
  prefix?: string;
  suffix?: string;
  supported: boolean;
  warning?: string;
}

export interface FilterState {
  categorical: Record<string, string[]>; // fieldName -> selected values
  numericRange: Record<string, { min: number; max: number }>; // fieldName -> { min, max }
  dateRange: Record<string, { start?: string; end?: string }>; // fieldName -> { start, end }
}

export interface WhatIfParameter {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  currentValue: number;
  targetMeasureId?: string;
  supported: boolean;
  unsupportedReason?: string;
}

export type MetricStatus = 'calculated' | 'unsupported' | 'no_data' | 'division_by_zero';

export interface ComputedMetric {
  id: string;
  title: string;
  rawValue: number | null;
  formattedValue: string;
  status: MetricStatus;
  warning?: string;
  trend?: string;
  isPositiveTrend?: boolean;
}

export interface ComputedChartItem {
  category: string;
  value: number;
  formattedValue: string;
  percentage?: number;
  color?: string;
}

export interface ComputedTimelineItem {
  label: string;
  value: number;
  target?: number;
  formattedValue: string;
}

export type VisualComputeStatus =
  | 'calculated'
  | 'unsupported_data'
  | 'unsupported_visual'
  | 'empty'
  | 'no_data';

export interface ComputedVisualData {
  visualId: string;
  title: string;
  visualType: NormalizedVisualType;
  status: VisualComputeStatus;
  isDemoData: boolean;
  metric?: ComputedMetric;
  chartItems?: ComputedChartItem[];
  timelineItems?: ComputedTimelineItem[];
  tableColumns?: string[];
  tableRows?: Record<string, any>[];
  slicerItems?: { value: string; count: number; selected: boolean }[];
  warnings: string[];
}

export interface SimulationState {
  dataset: Dataset | null;
  hasAccessibleData: boolean;
  isDemoMode: boolean;
  filters: FilterState;
  whatIf: WhatIfParameter;
  computedVisuals: Record<string, ComputedVisualData>;
  activePageId: string;
  summary: {
    totalRows: number;
    filteredRows: number;
    activeFilterCount: number;
  };
}
