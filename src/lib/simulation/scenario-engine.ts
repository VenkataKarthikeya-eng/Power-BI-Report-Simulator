/**
 * Power BI Report Simulator — Scenario & What-If Engine
 * Phase 5: Parameterized What-If sensitivity testing.
 * Strictly applies scenario scaling to designated measures only.
 */

import { WhatIfParameter, MeasureDefinition } from './types';

/**
 * Creates the standard What-If parameter definition matching the Studio UI.
 */
export function createDefaultWhatIfParameter(
  targetMeasureId = 'revenue_metric',
  isSupported = true
): WhatIfParameter {
  return {
    id: 'variance_slider',
    name: 'Forecast Variance Multiplier',
    unit: '%',
    min: -30,
    max: 50,
    step: 5,
    defaultValue: 0,
    currentValue: 0,
    targetMeasureId,
    supported: isSupported,
    unsupportedReason: isSupported
      ? undefined
      : 'What-If simulation is disabled because no underlying measure inputs are accessible.',
  };
}

/**
 * Computes the multiplier factor for a given percentage variance value.
 * e.g., +20% -> 1.20, -15% -> 0.85
 */
export function getWhatIfMultiplier(param: WhatIfParameter): number {
  if (!param.supported) {
    return 1.0;
  }
  const clamped = Math.max(param.min, Math.min(param.max, param.currentValue));
  return 1.0 + clamped / 100;
}

/**
 * Determines whether a measure is eligible for What-If scenario adjustment.
 */
export function isMeasureScenarioEligible(
  measure: MeasureDefinition,
  param: WhatIfParameter
): boolean {
  if (!param.supported || !measure.supported) return false;
  // Strictly applies only to the target measure or growth/revenue metrics
  if (param.targetMeasureId && measure.id === param.targetMeasureId) {
    return true;
  }
  return false;
}

/**
 * Resets a What-If parameter back to its default baseline value.
 */
export function resetWhatIfParameter(param: WhatIfParameter): WhatIfParameter {
  return {
    ...param,
    currentValue: param.defaultValue,
  };
}
