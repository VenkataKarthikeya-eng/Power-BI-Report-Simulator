/**
 * Power BI Report Simulator — Deterministic Demo Dataset
 * Phase 5: Explicitly labeled illustrative data for testing calculations,
 * slicer filtering, and What-If sensitivity without external dependencies.
 */

import { Dataset, MeasureDefinition } from './types';

export const DEMO_DATASET: Dataset = {
  id: 'demo-enterprise-analytics',
  name: 'Illustrative Enterprise Performance Model',
  isDemo: true,
  description: 'Deterministic demo model designed to demonstrate client-side Power BI visual simulation and slicing.',
  fields: [
    { name: 'Region', type: 'string', label: 'Geographic Region', format: 'text' },
    { name: 'Segment', type: 'string', label: 'Customer Segment', format: 'text' },
    { name: 'Category', type: 'string', label: 'Product Category', format: 'text' },
    { name: 'Quarter', type: 'string', label: 'Fiscal Quarter', format: 'text' },
    { name: 'Revenue', type: 'number', label: 'Total Revenue', format: 'currency' },
    { name: 'Units', type: 'number', label: 'Units Sold', format: 'number' },
    { name: 'Cost', type: 'number', label: 'Cost of Goods', format: 'currency' },
  ],
  rows: [
    // North America
    { Region: 'North America', Segment: 'Enterprise', Category: 'Cloud Services', Quarter: 'Q1', Revenue: 450000, Units: 120, Cost: 210000 },
    { Region: 'North America', Segment: 'Enterprise', Category: 'Software', Quarter: 'Q2', Revenue: 520000, Units: 140, Cost: 230000 },
    { Region: 'North America', Segment: 'Mid-Market', Category: 'Cloud Services', Quarter: 'Q3', Revenue: 380000, Units: 110, Cost: 180000 },
    { Region: 'North America', Segment: 'SMB', Category: 'Hardware', Quarter: 'Q4', Revenue: 290000, Units: 210, Cost: 190000 },

    // EMEA
    { Region: 'EMEA', Segment: 'Enterprise', Category: 'Cloud Services', Quarter: 'Q1', Revenue: 390000, Units: 95, Cost: 185000 },
    { Region: 'EMEA', Segment: 'Mid-Market', Category: 'Software', Quarter: 'Q2', Revenue: 340000, Units: 105, Cost: 160000 },
    { Region: 'EMEA', Segment: 'SMB', Category: 'Hardware', Quarter: 'Q3', Revenue: 260000, Units: 180, Cost: 175000 },
    { Region: 'EMEA', Segment: 'Enterprise', Category: 'Cloud Services', Quarter: 'Q4', Revenue: 480000, Units: 130, Cost: 220000 },

    // APAC
    { Region: 'APAC', Segment: 'Enterprise', Category: 'Hardware', Quarter: 'Q1', Revenue: 310000, Units: 240, Cost: 215000 },
    { Region: 'APAC', Segment: 'Mid-Market', Category: 'Cloud Services', Quarter: 'Q2', Revenue: 410000, Units: 115, Cost: 195000 },
    { Region: 'APAC', Segment: 'Enterprise', Category: 'Software', Quarter: 'Q3', Revenue: 460000, Units: 135, Cost: 205000 },
    { Region: 'APAC', Segment: 'SMB', Category: 'Cloud Services', Quarter: 'Q4', Revenue: 330000, Units: 150, Cost: 170000 },

    // LATAM
    { Region: 'LATAM', Segment: 'Mid-Market', Category: 'Hardware', Quarter: 'Q1', Revenue: 180000, Units: 130, Cost: 125000 },
    { Region: 'LATAM', Segment: 'SMB', Category: 'Software', Quarter: 'Q2', Revenue: 150000, Units: 90, Cost: 95000 },
    { Region: 'LATAM', Segment: 'Enterprise', Category: 'Cloud Services', Quarter: 'Q3', Revenue: 240000, Units: 85, Cost: 135000 },
    { Region: 'LATAM', Segment: 'Enterprise', Category: 'Hardware', Quarter: 'Q4', Revenue: 220000, Units: 140, Cost: 145000 },
  ],
};

export const DEMO_MEASURES: Record<string, MeasureDefinition> = {
  revenue_metric: {
    id: 'revenue_metric',
    name: 'Total Revenue',
    calculationType: 'aggregation',
    aggregation: 'sum',
    field: 'Revenue',
    format: 'currency',
    prefix: '$',
    supported: true,
  },
  units_metric: {
    id: 'units_metric',
    name: 'Total Units Sold',
    calculationType: 'aggregation',
    aggregation: 'sum',
    field: 'Units',
    format: 'number',
    suffix: ' units',
    supported: true,
  },
  avg_deal_metric: {
    id: 'avg_deal_metric',
    name: 'Average Order Value',
    calculationType: 'aggregation',
    aggregation: 'avg',
    field: 'Revenue',
    format: 'currency',
    prefix: '$',
    supported: true,
  },
  operating_profit: {
    id: 'operating_profit',
    name: 'Gross Operating Profit',
    calculationType: 'arithmetic',
    operand1Field: 'Revenue',
    operand2Field: 'Cost',
    operator: '-',
    format: 'currency',
    prefix: '$',
    supported: true,
  },
  unsupported_dax_measure: {
    id: 'unsupported_dax_measure',
    name: 'Time-Intelligence Dynamic YTD YoY',
    calculationType: 'aggregation',
    supported: false,
    warning: 'CALCULATE(..., SAMEPERIODLASTYEAR(...)) requires DAX VertiPaq tabular engine.',
  },
};
