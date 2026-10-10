/**
 * Power BI Report Simulator — File Validator
 * Validates file extensions, size limits, filename safety, and container magic bytes.
 */

import { FileValidationResult, ReportFileFormat } from './types';

// Default maximum file size: 250 MB
export const DEFAULT_MAX_FILE_SIZE = 250 * 1024 * 1024;

/**
 * Sanitizes an untrusted filename to prevent path traversal or injection.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'unnamed_report.pbix';
  // Remove directory separators and null bytes
  const baseName = filename.replace(/^.*[\\/]/, '').replace(/\0/g, '').trim();
  // Strip control characters
  const clean = baseName.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  return clean || 'unnamed_report.pbix';
}

/**
 * Checks whether the given buffer starts with standard ZIP magic bytes.
 * Standard ZIP Local Header: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
 * Empty archive / Spanned: PK\x05\x06 or PK\x07\x08
 */
export function checkZipMagicBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;
  return (
    (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) ||
    (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x05 && bytes[3] === 0x06) ||
    (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x07 && bytes[3] === 0x08)
  );
}

/**
 * Validates file metadata and container magic header.
 */
export function validateFile(
  filename: string,
  sizeBytes: number,
  headerBytes?: Uint8Array,
  maxSizeBytes: number = DEFAULT_MAX_FILE_SIZE
): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sanitized = sanitizeFilename(filename);
  const lowerName = sanitized.toLowerCase();

  let format: ReportFileFormat = 'unknown';
  if (lowerName.endsWith('.pbix')) {
    format = 'pbix';
  } else if (lowerName.endsWith('.pbit')) {
    format = 'pbit';
  } else {
    errors.push(`Unsupported file extension for "${sanitized}". Only .pbix and .pbit files are supported.`);
  }

  // Size boundary checks
  if (sizeBytes <= 0) {
    errors.push('File is empty (0 bytes).');
  } else if (sizeBytes > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    errors.push(`File exceeds the maximum allowed size limit of ${maxMb} MB (${sizeBytes.toLocaleString()} bytes).`);
  }

  // Magic bytes check (if header bytes provided)
  let isZipMagic = false;
  if (headerBytes && headerBytes.length > 0) {
    isZipMagic = checkZipMagicBytes(headerBytes);
    if (!isZipMagic) {
      errors.push('File does not have a valid ZIP container signature (PK header). Content appears corrupted or malformed.');
    }
  }

  return {
    valid: errors.length === 0,
    filename,
    sanitizedFilename: sanitized,
    sizeBytes,
    format,
    isZipMagic,
    errors,
    warnings,
  };
}
