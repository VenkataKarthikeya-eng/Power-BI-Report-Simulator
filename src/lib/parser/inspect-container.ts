/**
 * Power BI Report Simulator — Container Inspector
 * Safely inspects ZIP archive entries with limits against ZIP bombs and path traversal.
 */

import JSZip from 'jszip';
import { ContainerInspectionResult, ContainerEntryInfo } from './types';

// Resource safeguards
export const MAX_ZIP_ENTRIES = 500;
export const MAX_TOTAL_UNCOMPRESSED_SIZE = 500 * 1024 * 1024; // 500 MB
export const MAX_COMPRESSION_RATIO = 100; // Decompression bomb threshold

export interface ContainerInspectOptions {
  maxEntries?: number;
  maxUncompressedSize?: number;
}

/**
 * Safely inspects the structure of a Power BI ZIP container without extracting all files into memory.
 */
export async function inspectContainer(
  zip: JSZip,
  options?: ContainerInspectOptions
): Promise<ContainerInspectionResult> {
  const maxEntries = options?.maxEntries ?? MAX_ZIP_ENTRIES;
  const maxUncompressed = options?.maxUncompressedSize ?? MAX_TOTAL_UNCOMPRESSED_SIZE;

  const warnings: string[] = [];
  const entries: ContainerEntryInfo[] = [];
  const entryNames: string[] = [];
  const themeFiles: string[] = [];

  let totalCompressedSize = 0;
  let totalUncompressedSize = 0;

  const rawKeys = Object.keys(zip.files);

  // 1. Guard against excessive entry count (ZIP bomb vector)
  if (rawKeys.length > maxEntries) {
    throw new Error(
      `ZIP container exceeds maximum entry threshold (${rawKeys.length} entries > limit of ${maxEntries}). Parsing aborted for safety.`
    );
  }

  for (const key of rawKeys) {
    const file = zip.files[key];

    // Path traversal safety check
    if (key.includes('..') || key.startsWith('/') || key.startsWith('\\')) {
      throw new Error(`Suspicious entry path detected in ZIP container: "${key}". Path traversal rejected.`);
    }

    entryNames.push(key);

    const compSize = (file as any)._data?.compressedSize || 0;
    const uncompSize = (file as any)._data?.uncompressedSize || 0;

    totalCompressedSize += compSize;
    totalUncompressedSize += uncompSize;

    entries.push({
      name: key,
      compressedSize: compSize,
      uncompressedSize: uncompSize,
      isDirectory: file.dir,
    });

    if (key.includes('BaseThemes') || key.endsWith('.json')) {
      if (key.startsWith('Report/StaticResources/')) {
        themeFiles.push(key);
      }
    }
  }

  // 2. Guard against decompressed size bomb
  if (totalUncompressedSize > maxUncompressed) {
    throw new Error(
      `Container uncompressed size (${(totalUncompressedSize / (1024 * 1024)).toFixed(1)} MB) exceeds resource limit of ${(maxUncompressed / (1024 * 1024)).toFixed(1)} MB.`
    );
  }

  // 3. Compression ratio check
  if (totalCompressedSize > 1024 && totalUncompressedSize / totalCompressedSize > MAX_COMPRESSION_RATIO) {
    warnings.push(
      `Unusually high compression ratio detected (${(totalUncompressedSize / totalCompressedSize).toFixed(1)}x).`
    );
  }

  // 4. Identify critical Power BI metadata entries
  const hasLayout = entryNames.includes('Report/Layout');
  const hasDataModel = entryNames.includes('DataModel');
  const hasDataModelSchema = entryNames.includes('DataModelSchema');
  const hasLinguisticSchema = entryNames.includes('Report/LinguisticSchema');
  const hasDiagramLayout = entryNames.includes('DiagramLayout');
  const hasSecurityBindings = entryNames.includes('SecurityBindings');

  if (!hasLayout) {
    warnings.push('Container is missing "Report/Layout". Visual pages and container positions cannot be extracted.');
  }

  // Distinguish .pbix vs .pbit
  const isPbix = hasDataModel || (hasLayout && !hasDataModelSchema);
  const isPbit = hasDataModelSchema && !hasDataModel;

  if (hasDataModel) {
    warnings.push('Binary VertiPaq data model ("DataModel") detected. Visual AST layout can be extracted, but binary database evaluation is not supported in browser.');
  }

  // Read Version entry if present
  let version: string | undefined;
  if (zip.files['Version']) {
    try {
      const verText = await zip.files['Version'].async('text');
      version = verText.trim();
    } catch {
      // Non-critical
    }
  }

  // Check encryption / security bindings
  let isEncrypted = false;
  if (hasSecurityBindings) {
    isEncrypted = true;
    warnings.push('"SecurityBindings" detected. File may have Microsoft Information Protection (MIP) or sensitivity labels applied.');
  }

  return {
    entryCount: rawKeys.length,
    totalCompressedSize,
    totalUncompressedSize,
    entries,
    entryNames,
    isPbix,
    isPbit,
    hasLayout,
    hasDataModel,
    hasDataModelSchema,
    hasLinguisticSchema,
    hasDiagramLayout,
    hasSecurityBindings,
    isEncrypted,
    version,
    themeFiles,
    warnings,
  };
}
