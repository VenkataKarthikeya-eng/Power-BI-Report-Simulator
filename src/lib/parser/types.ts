/**
 * Power BI Report Simulator — Ingestion & Parser Type Definitions
 * Phase 4: Safe, modular PBIX and PBIT inspection & AST normalization.
 */

export type ReportFileFormat = 'pbix' | 'pbit' | 'unknown';

export type ParseStatus = 'success' | 'partial' | 'unsupported' | 'error';

export type NormalizedVisualType =
  | 'barChart'
  | 'columnChart'
  | 'lineChart'
  | 'areaChart'
  | 'pieChart'
  | 'donutChart'
  | 'card'
  | 'multiRowCard'
  | 'kpi'
  | 'table'
  | 'matrix'
  | 'slicer'
  | 'textbox'
  | 'image'
  | 'shape'
  | 'map'
  | 'gauge'
  | 'scatterChart'
  | 'treemap'
  | 'waterfallChart'
  | 'funnel'
  | 'custom'
  | 'unknown';

export interface VisualPosition {
  x: number;
  y: number;
  z?: number;
  width: number;
  height: number;
}

export interface NormalizedVisual {
  id: string;
  name: string;
  title?: string;
  visualType: NormalizedVisualType;
  rawVisualType: string;
  position: VisualPosition;
  isSlicer: boolean;
  hasQuery: boolean;
  hasFilters: boolean;
  isCustomVisual: boolean;
  supported: boolean;
  projections?: Record<string, any>;
  warnings: string[];
}

export interface NormalizedPage {
  id: string;
  name: string;
  displayName: string;
  order: number;
  width: number;
  height: number;
  displayOption?: number;
  visualCount: number;
  visuals: NormalizedVisual[];
  hasSlicers: boolean;
}

export interface ContainerEntryInfo {
  name: string;
  compressedSize: number;
  uncompressedSize: number;
  isDirectory: boolean;
}

export interface ContainerInspectionResult {
  entryCount: number;
  totalCompressedSize: number;
  totalUncompressedSize: number;
  entries: ContainerEntryInfo[];
  entryNames: string[];
  isPbix: boolean;
  isPbit: boolean;
  hasLayout: boolean;
  hasDataModel: boolean;
  hasDataModelSchema: boolean;
  hasLinguisticSchema: boolean;
  hasDiagramLayout: boolean;
  hasSecurityBindings: boolean;
  isEncrypted: boolean;
  version?: string;
  themeFiles: string[];
  warnings: string[];
}

export interface FileValidationResult {
  valid: boolean;
  filename: string;
  sanitizedFilename: string;
  sizeBytes: number;
  format: ReportFileFormat;
  isZipMagic: boolean;
  errors: string[];
  warnings: string[];
}

export interface NormalizedReport {
  reportId: string;
  filename: string;
  format: ReportFileFormat;
  schemaVersion?: number | string;
  pages: NormalizedPage[];
  totalPages: number;
  totalVisuals: number;
  detectedVisualTypes: string[];
  supportedVisualTypes: string[];
  unsupportedVisualTypes: string[];
  summary: {
    hasDataModel: boolean;
    hasDataModelSchema: boolean;
    hasLayout: boolean;
    hasLinguisticSchema: boolean;
    isEncrypted: boolean;
    version?: string;
  };
  status: ParseStatus;
  warnings: string[];
  errors: string[];
  parsedAt: string;
}

export interface ParseReportResult {
  success: boolean;
  status: ParseStatus;
  validation: FileValidationResult;
  container?: ContainerInspectionResult;
  report?: NormalizedReport;
  errors: string[];
  warnings: string[];
}
