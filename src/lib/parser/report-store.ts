/**
 * Power BI Report Simulator — Client-Side Report Session Store
 * Bridges parsed report AST between the upload page and the studio workspace.
 */

import { NormalizedReport } from './types';

const STORAGE_KEY = 'pbix_active_normalized_report';

export function saveActiveReport(report: NormalizedReport): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(report));
  } catch (err) {
    console.warn('Failed to save parsed report to sessionStorage:', err);
  }
}

export function getActiveReport(): NormalizedReport | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as NormalizedReport;
  } catch (err) {
    console.warn('Failed to retrieve parsed report from sessionStorage:', err);
    return null;
  }
}

export function clearActiveReport(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear active report from sessionStorage:', err);
  }
}
