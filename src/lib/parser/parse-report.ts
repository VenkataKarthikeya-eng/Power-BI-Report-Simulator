/**
 * Power BI Report Simulator — Report Ingestion Pipeline
 * Phase 4 Core Parser: orchestrates file validation, container inspection,
 * UTF-16LE/UTF-8 decoding, and normalized AST extraction.
 */

import JSZip from 'jszip';
import {
  ParseReportResult,
  ParseStatus,
  ReportFileFormat,
} from './types';
import { validateFile, DEFAULT_MAX_FILE_SIZE } from './validate-file';
import { inspectContainer } from './inspect-container';
import { normalizeReport } from './normalize-report';

/**
 * Decodes a raw byte buffer containing Power BI Report/Layout text.
 * Handles UTF-16LE (with or without BOM) and UTF-8 encodings accurately.
 */
export function decodeLayoutBuffer(bytes: Uint8Array): string {
  if (bytes.length === 0) return '';

  // 1. Check for standard BOMs
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    // UTF-16LE with BOM
    return new TextDecoder('utf-16le').decode(bytes.subarray(2));
  }
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    // UTF-8 with BOM
    return new TextDecoder('utf-8').decode(bytes.subarray(3));
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    // UTF-16BE with BOM
    return new TextDecoder('utf-16be').decode(bytes.subarray(2));
  }

  // 2. Power BI often outputs UTF-16LE WITHOUT BOM:
  // E.g., '{"id":0' -> 0x7B, 0x00, 0x22, 0x00...
  // Check if second and fourth bytes are null bytes (ASCII character in UTF-16LE)
  if (bytes.length >= 4 && bytes[1] === 0x00 && bytes[3] === 0x00) {
    try {
      return new TextDecoder('utf-16le').decode(bytes);
    } catch {
      // Fallback to UTF-8
    }
  }

  // 3. Default to UTF-8
  return new TextDecoder('utf-8').decode(bytes);
}

/**
 * Parses an in-memory buffer representing a .pbix or .pbit file.
 */
export async function parseReportBuffer(
  buffer: ArrayBuffer | Uint8Array,
  filename: string,
  maxSizeBytes: number = DEFAULT_MAX_FILE_SIZE
): Promise<ParseReportResult> {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. File metadata & magic bytes validation
  const header = bytes.subarray(0, 16);
  const validation = validateFile(filename, bytes.length, header, maxSizeBytes);

  if (!validation.valid) {
    return {
      success: false,
      status: 'error',
      validation,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  }

  // 2. Inspect ZIP Container
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(bytes);
  } catch (zipErr: any) {
    errors.push(`Failed to read ZIP archive: ${zipErr.message || 'Corrupted or invalid container'}`);
    return {
      success: false,
      status: 'error',
      validation,
      errors,
      warnings,
    };
  }

  let container;
  try {
    container = await inspectContainer(zip);
    warnings.push(...container.warnings);
  } catch (inspectErr: any) {
    errors.push(`Container inspection rejected: ${inspectErr.message}`);
    return {
      success: false,
      status: 'error',
      validation,
      errors,
      warnings,
    };
  }

  // 3. Extract and parse Report/Layout
  if (!container.hasLayout || !zip.files['Report/Layout']) {
    return {
      success: false,
      status: 'unsupported',
      validation,
      container,
      errors: ['Container does not contain "Report/Layout". Visual pages and layout cannot be extracted.'],
      warnings,
    };
  }

  let layoutText = '';
  try {
    const layoutBytes = await zip.files['Report/Layout'].async('uint8array');
    layoutText = decodeLayoutBuffer(layoutBytes);
  } catch (readErr: any) {
    errors.push(`Failed to extract "Report/Layout" entry: ${readErr.message}`);
    return {
      success: false,
      status: 'error',
      validation,
      container,
      errors,
      warnings,
    };
  }

  // 4. Parse Layout JSON
  let layoutJson: any = null;
  try {
    layoutJson = JSON.parse(layoutText);
  } catch (jsonErr: any) {
    errors.push(`Failed to parse Report/Layout JSON: ${jsonErr.message}`);
    return {
      success: false,
      status: 'error',
      validation,
      container,
      errors,
      warnings,
    };
  }

  // 5. Normalize Report AST
  try {
    const report = normalizeReport(layoutJson, container, validation.sanitizedFilename, validation.format);

    const overallStatus: ParseStatus = errors.length > 0
      ? 'error'
      : report.status;

    return {
      success: overallStatus === 'success' || overallStatus === 'partial',
      status: overallStatus,
      validation,
      container,
      report,
      errors: [...errors, ...report.errors],
      warnings: [...warnings, ...report.warnings],
    };
  } catch (normErr: any) {
    errors.push(`Failed to normalize report AST: ${normErr.message}`);
    return {
      success: false,
      status: 'error',
      validation,
      container,
      errors,
      warnings,
    };
  }
}

/**
 * Browser-friendly wrapper that reads a DOM File object.
 */
export async function parseReportFile(
  file: File,
  maxSizeBytes?: number
): Promise<ParseReportResult> {
  const arrayBuffer = await file.arrayBuffer();
  return parseReportBuffer(arrayBuffer, file.name, maxSizeBytes);
}
