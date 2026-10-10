/**
 * Power BI Report Simulator — Visual Adapter
 * Phase 5: Maps normalized AST visual containers to computed dataset series,
 * metric values, slicer chips, and structured unsupported-data states.
 */

import { NormalizedVisual } from '../parser/types';
import {
  Dataset,
  DataRow,
  FilterState,
  WhatIfParameter,
  ComputedVisualData,
  ComputedChartItem,
  ComputedTimelineItem,
} from './types';
import {
  evaluateMeasure,
  calculateAggregation,
  formatMetricValue,
  isNumeric,
} from './measure-engine';
import { extractUniqueFieldValues } from './filter-engine';
import { getWhatIfMultiplier } from './scenario-engine';
import { DEMO_MEASURES } from './demo-dataset';

const PALETTE = ['#e5322d', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

/**
 * Computes visual state and chart data from the current simulation state.
 */
export function computeVisualData(
  visual: NormalizedVisual,
  dataset: Dataset | null,
  filteredRows: DataRow[],
  allRows: DataRow[],
  filters: FilterState,
  whatIf: WhatIfParameter
): ComputedVisualData {
  const title = visual.title || visual.name;
  const isDemo = Boolean(dataset?.isDemo);

  // 1. If dataset is missing or unavailable (e.g. real uploaded PBIX where VertiPaq is unextracted)
  if (!dataset || !allRows || allRows.length === 0) {
    return {
      visualId: visual.id,
      title,
      visualType: visual.visualType,
      status: 'unsupported_data',
      isDemoData: false,
      warnings: [
        'Proprietary Power BI binary VertiPaq DataModel detected. Underlying rows and DAX calculations cannot be extracted in the browser without server-side Analysis Services.',
      ],
    };
  }

  // 2. If visual type is flagged as unsupported in parser (e.g., custom marketplace visuals or map)
  if (!visual.supported) {
    return {
      visualId: visual.id,
      title,
      visualType: visual.visualType,
      status: 'unsupported_visual',
      isDemoData: isDemo,
      warnings: visual.warnings.length > 0 ? visual.warnings : [`Visual type "${visual.visualType}" is not supported for simulation.`],
    };
  }

  // 3. Slicers
  if (visual.isSlicer) {
    // Determine slicer field from title or fallback to Region/Category
    const titleLower = title.toLowerCase();
    let slicerField = 'Region';
    if (titleLower.includes('segment')) slicerField = 'Segment';
    else if (titleLower.includes('category') || titleLower.includes('product')) slicerField = 'Category';
    else if (titleLower.includes('quarter') || titleLower.includes('period')) slicerField = 'Quarter';

    const uniqueValues = extractUniqueFieldValues(allRows, slicerField);
    const selected = filters.categorical[slicerField] || [];

    const slicerItems = uniqueValues.map((item) => ({
      value: item.value,
      count: item.count,
      selected: selected.includes(item.value),
    }));

    return {
      visualId: visual.id,
      title: `${title} (${slicerField})`,
      visualType: visual.visualType,
      status: 'calculated',
      isDemoData: isDemo,
      slicerItems,
      warnings: [],
    };
  }

  // 4. KPI & Metric Cards
  if (visual.visualType === 'card' || visual.visualType === 'multiRowCard' || visual.visualType === 'kpi') {
    const titleLower = title.toLowerCase();
    let measure = DEMO_MEASURES.revenue_metric;
    let appliesWhatIf = true;

    if (titleLower.includes('unit') || titleLower.includes('volume') || titleLower.includes('count')) {
      measure = DEMO_MEASURES.units_metric;
      appliesWhatIf = false;
    } else if (titleLower.includes('avg') || titleLower.includes('deal') || titleLower.includes('order')) {
      measure = DEMO_MEASURES.avg_deal_metric;
      appliesWhatIf = false;
    } else if (titleLower.includes('profit') || titleLower.includes('margin')) {
      measure = DEMO_MEASURES.operating_profit;
      appliesWhatIf = true;
    }

    const multiplier = appliesWhatIf ? getWhatIfMultiplier(whatIf) : 1.0;
    const metric = evaluateMeasure(measure, filteredRows, multiplier);

    return {
      visualId: visual.id,
      title,
      visualType: visual.visualType,
      status: metric.status === 'calculated' ? 'calculated' : 'no_data',
      isDemoData: isDemo,
      metric,
      warnings: metric.warning ? [metric.warning] : [],
    };
  }

  // 5. Bar & Column Charts
  if (visual.visualType === 'barChart' || visual.visualType === 'columnChart') {
    const titleLower = title.toLowerCase();
    const groupField = titleLower.includes('category') ? 'Category' : 'Region';
    const groups = new Map<string, number>();

    const multiplier = getWhatIfMultiplier(whatIf);

    for (const row of filteredRows) {
      const g = String(row[groupField] || 'Other');
      const rev = Number(row.Revenue || 0) * multiplier;
      groups.set(g, (groups.get(g) || 0) + rev);
    }

    const total = Array.from(groups.values()).reduce((sum, v) => sum + v, 0);

    const chartItems: ComputedChartItem[] = Array.from(groups.entries()).map(([cat, val], idx) => ({
      category: cat,
      value: val,
      formattedValue: formatMetricValue(val, 'currency'),
      percentage: total > 0 ? (val / total) * 100 : 0,
      color: PALETTE[idx % PALETTE.length],
    }));

    return {
      visualId: visual.id,
      title,
      visualType: visual.visualType,
      status: chartItems.length > 0 ? 'calculated' : 'empty',
      isDemoData: isDemo,
      chartItems,
      warnings: [],
    };
  }

  // 6. Line & Area Charts (Timeline)
  if (visual.visualType === 'lineChart' || visual.visualType === 'areaChart') {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const multiplier = getWhatIfMultiplier(whatIf);

    const timelineItems: ComputedTimelineItem[] = quarters.map((q, idx) => {
      const qRows = filteredRows.filter((r) => r.Quarter === q);
      const qRev = qRows.reduce((sum, r) => sum + Number(r.Revenue || 0), 0) * multiplier;
      const target = (1_200_000 + idx * 150_000);
      return {
        label: q,
        value: qRev,
        target,
        formattedValue: formatMetricValue(qRev, 'currency'),
      };
    });

    return {
      visualId: visual.id,
      title,
      visualType: visual.visualType,
      status: 'calculated',
      isDemoData: isDemo,
      timelineItems,
      warnings: [],
    };
  }

  // 7. Pie & Donut Charts
  if (visual.visualType === 'pieChart' || visual.visualType === 'donutChart') {
    const groups = new Map<string, number>();
    const multiplier = getWhatIfMultiplier(whatIf);

    for (const row of filteredRows) {
      const seg = String(row.Segment || 'Enterprise');
      const rev = Number(row.Revenue || 0) * multiplier;
      groups.set(seg, (groups.get(seg) || 0) + rev);
    }

    const total = Array.from(groups.values()).reduce((sum, v) => sum + v, 0);

    const chartItems: ComputedChartItem[] = Array.from(groups.entries()).map(([cat, val], idx) => ({
      category: cat,
      value: val,
      formattedValue: formatMetricValue(val, 'currency'),
      percentage: total > 0 ? (val / total) * 100 : 0,
      color: PALETTE[idx % PALETTE.length],
    }));

    return {
      visualId: visual.id,
      title,
      visualType: visual.visualType,
      status: chartItems.length > 0 ? 'calculated' : 'empty',
      isDemoData: isDemo,
      chartItems,
      warnings: [],
    };
  }

  // 8. Tables and Matrices
  if (visual.visualType === 'table' || visual.visualType === 'matrix') {
    const tableColumns = ['Region', 'Segment', 'Quarter', 'Revenue', 'Units'];
    const multiplier = getWhatIfMultiplier(whatIf);

    const tableRows = filteredRows.slice(0, 10).map((r) => ({
      Region: r.Region,
      Segment: r.Segment,
      Quarter: r.Quarter,
      Revenue: formatMetricValue(Number(r.Revenue || 0) * multiplier, 'currency'),
      Units: r.Units,
    }));

    return {
      visualId: visual.id,
      title,
      visualType: visual.visualType,
      status: tableRows.length > 0 ? 'calculated' : 'empty',
      isDemoData: isDemo,
      tableColumns,
      tableRows,
      warnings: [],
    };
  }

  // 9. Textbox & Annotations
  if (visual.visualType === 'textbox' || visual.visualType === 'shape') {
    return {
      visualId: visual.id,
      title,
      visualType: visual.visualType,
      status: 'calculated',
      isDemoData: isDemo,
      warnings: [],
    };
  }

  // Fallback for unhandled visual types
  return {
    visualId: visual.id,
    title,
    visualType: visual.visualType,
    status: 'unsupported_visual',
    isDemoData: isDemo,
    warnings: [`Simulation adapter does not support visual type "${visual.visualType}".`],
  };
}
