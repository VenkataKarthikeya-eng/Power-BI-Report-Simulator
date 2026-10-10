/**
 * Power BI Report Simulator — AST Normalizer
 * Normalizes raw Power BI Report/Layout sections and visual containers into a clean, typed AST.
 */

import {
  NormalizedReport,
  NormalizedPage,
  NormalizedVisual,
  NormalizedVisualType,
  ContainerInspectionResult,
  ReportFileFormat,
  ParseStatus,
} from './types';

/**
 * Maps raw Power BI visualType strings to our normalized visual categories.
 */
export function mapVisualType(rawType: string): {
  normalizedType: NormalizedVisualType;
  isCustom: boolean;
  isSlicer: boolean;
  supported: boolean;
} {
  const t = (rawType || '').toLowerCase().trim();

  // Standard visual mapping
  switch (t) {
    case 'barchart':
    case 'clusteredbarchart':
    case 'hundredpercentstackedbarchart':
    case 'stackedbarchart':
      return { normalizedType: 'barChart', isCustom: false, isSlicer: false, supported: true };

    case 'columnchart':
    case 'clusteredcolumnchart':
    case 'hundredpercentstackedcolumnchart':
    case 'stackedcolumnchart':
      return { normalizedType: 'columnChart', isCustom: false, isSlicer: false, supported: true };

    case 'linechart':
    case 'linestackedcolumncombochart':
    case 'lineclusteredcolumncombochart':
      return { normalizedType: 'lineChart', isCustom: false, isSlicer: false, supported: true };

    case 'areachart':
    case 'stackedareachart':
      return { normalizedType: 'areaChart', isCustom: false, isSlicer: false, supported: true };

    case 'piechart':
      return { normalizedType: 'pieChart', isCustom: false, isSlicer: false, supported: true };

    case 'donutchart':
      return { normalizedType: 'donutChart', isCustom: false, isSlicer: false, supported: true };

    case 'card':
    case 'cardvisual': // Power BI modern card visual
      return { normalizedType: 'card', isCustom: false, isSlicer: false, supported: true };

    case 'multirowcard':
      return { normalizedType: 'multiRowCard', isCustom: false, isSlicer: false, supported: true };

    case 'kpi':
      return { normalizedType: 'kpi', isCustom: false, isSlicer: false, supported: true };

    case 'gauge':
      return { normalizedType: 'gauge', isCustom: false, isSlicer: false, supported: true };

    case 'table':
    case 'tableex':
      return { normalizedType: 'table', isCustom: false, isSlicer: false, supported: true };

    case 'matrix':
    case 'pivottable':
      return { normalizedType: 'matrix', isCustom: false, isSlicer: false, supported: true };

    case 'slicer':
      return { normalizedType: 'slicer', isCustom: false, isSlicer: true, supported: true };

    case 'textbox':
    case 'richtextbox':
      return { normalizedType: 'textbox', isCustom: false, isSlicer: false, supported: true };

    case 'image':
      return { normalizedType: 'image', isCustom: false, isSlicer: false, supported: true };

    case 'shape':
    case 'basicshape':
      return { normalizedType: 'shape', isCustom: false, isSlicer: false, supported: true };

    case 'map':
    case 'filledmap':
    case 'shapemap':
    case 'azuremap':
      return { normalizedType: 'map', isCustom: false, isSlicer: false, supported: false };

    case 'scatterchart':
      return { normalizedType: 'scatterChart', isCustom: false, isSlicer: false, supported: true };

    case 'treemap':
      return { normalizedType: 'treemap', isCustom: false, isSlicer: false, supported: true };

    case 'waterfallchart':
      return { normalizedType: 'waterfallChart', isCustom: false, isSlicer: false, supported: true };

    case 'funnel':
      return { normalizedType: 'funnel', isCustom: false, isSlicer: false, supported: true };

    default:
      // If it looks like a GUID or third party visual name
      const isCustom = t.length > 25 || t.includes('.') || t.includes('pbi_cv_');
      return {
        normalizedType: isCustom ? 'custom' : 'unknown',
        isCustom,
        isSlicer: t.includes('slicer'),
        supported: false,
      };
  }
}

/**
 * Safely extracts human-readable title from Power BI visual config JSON.
 */
function extractTitleFromConfig(config: any): string | undefined {
  if (!config) return undefined;
  try {
    const vcObjects = config.singleVisual?.vcObjects || config.objects;
    if (vcObjects?.title) {
      const titleObj = Array.isArray(vcObjects.title) ? vcObjects.title[0] : vcObjects.title;
      const textVal =
        titleObj?.properties?.text?.expr?.Literal?.Value ||
        titleObj?.properties?.text?.value;
      if (typeof textVal === 'string') {
        // Strip outer quotes if Power BI wrapped string in "'title'"
        return textVal.replace(/^'|'$/g, '').trim();
      }
    }
  } catch {
    // Non-critical title extraction
  }
  return undefined;
}

/**
 * Normalizes a raw layout object into a clean NormalizedReport.
 */
export function normalizeReport(
  rawLayout: any,
  container: ContainerInspectionResult,
  filename: string,
  format: ReportFileFormat
): NormalizedReport {
  const warnings: string[] = [...container.warnings];
  const errors: string[] = [];

  const rawSections = Array.isArray(rawLayout?.sections) ? rawLayout.sections : [];

  if (rawSections.length === 0) {
    warnings.push('No visual sections/pages found in report layout.');
  }

  const detectedTypesSet = new Set<string>();
  const supportedTypesSet = new Set<string>();
  const unsupportedTypesSet = new Set<string>();

  const pages: NormalizedPage[] = [];

  rawSections.forEach((section: any, sectionIdx: number) => {
    const rawVisualContainers = Array.isArray(section.visualContainers) ? section.visualContainers : [];
    const visuals: NormalizedVisual[] = [];
    let sectionHasSlicers = false;

    rawVisualContainers.forEach((vc: any, vcIdx: number) => {
      const visualWarnings: string[] = [];
      let visualConfig: any = null;
      let rawType = 'unknown';

      // Parse inner serialized config JSON
      if (typeof vc.config === 'string') {
        try {
          visualConfig = JSON.parse(vc.config);
          rawType = visualConfig.singleVisual?.visualType || 'unknown';
        } catch (e: any) {
          visualWarnings.push(`Failed to parse visual config JSON: ${e.message}`);
        }
      } else if (typeof vc.config === 'object') {
        visualConfig = vc.config;
        rawType = visualConfig?.singleVisual?.visualType || 'unknown';
      }

      detectedTypesSet.add(rawType);
      const mapped = mapVisualType(rawType);

      if (mapped.supported) {
        supportedTypesSet.add(rawType);
      } else {
        unsupportedTypesSet.add(rawType);
        if (mapped.isCustom) {
          visualWarnings.push(`Custom third-party visual plugin "${rawType}" detected. Rendering may require custom visual extension.`);
        } else {
          visualWarnings.push(`Visual type "${rawType}" is partially supported.`);
        }
      }

      if (mapped.isSlicer) {
        sectionHasSlicers = true;
      }

      const title = extractTitleFromConfig(visualConfig) || visualConfig?.name;

      visuals.push({
        id: visualConfig?.name || `vc-${sectionIdx}-${vcIdx}`,
        name: visualConfig?.name || `Visual_${vcIdx + 1}`,
        title,
        visualType: mapped.normalizedType,
        rawVisualType: rawType,
        position: {
          x: typeof vc.x === 'number' ? vc.x : 0,
          y: typeof vc.y === 'number' ? vc.y : 0,
          z: typeof vc.z === 'number' ? vc.z : vcIdx,
          width: typeof vc.width === 'number' ? vc.width : 200,
          height: typeof vc.height === 'number' ? vc.height : 150,
        },
        isSlicer: mapped.isSlicer,
        hasQuery: Boolean(vc.query),
        hasFilters: Boolean(vc.filters && vc.filters !== '[]'),
        isCustomVisual: mapped.isCustom,
        supported: mapped.supported,
        projections: visualConfig?.singleVisual?.projections,
        warnings: visualWarnings,
      });
    });

    pages.push({
      id: section.name || `page-${sectionIdx + 1}`,
      name: section.name || `Section_${sectionIdx + 1}`,
      displayName: section.displayName || `Page ${sectionIdx + 1}`,
      order: typeof section.ordinal === 'number' ? section.ordinal : sectionIdx,
      width: typeof section.width === 'number' ? section.width : 1280,
      height: typeof section.height === 'number' ? section.height : 720,
      displayOption: section.displayOption,
      visualCount: visuals.length,
      visuals,
      hasSlicers: sectionHasSlicers,
    });
  });

  const totalVisuals = pages.reduce((sum, p) => sum + p.visualCount, 0);

  // Determine overall parse status
  let status: ParseStatus = 'success';
  if (unsupportedTypesSet.size > 0 || container.warnings.length > 0) {
    status = 'partial';
  }
  if (!container.hasLayout || pages.length === 0) {
    status = 'unsupported';
  }

  return {
    reportId: typeof rawLayout?.id === 'number' ? `pbix-id-${rawLayout.id}` : `report-${Date.now()}`,
    filename,
    format,
    schemaVersion: rawLayout?.schemaVersion || rawLayout?.id,
    pages,
    totalPages: pages.length,
    totalVisuals,
    detectedVisualTypes: Array.from(detectedTypesSet),
    supportedVisualTypes: Array.from(supportedTypesSet),
    unsupportedVisualTypes: Array.from(unsupportedTypesSet),
    summary: {
      hasDataModel: container.hasDataModel,
      hasDataModelSchema: container.hasDataModelSchema,
      hasLayout: container.hasLayout,
      hasLinguisticSchema: container.hasLinguisticSchema,
      isEncrypted: container.isEncrypted,
      version: container.version,
    },
    status,
    warnings,
    errors,
    parsedAt: new Date().toISOString(),
  };
}
