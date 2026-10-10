/**
 * Power BI Report Simulator — Share URL Resolution Utility
 * Provides hydration-safe share URL generation for server and client execution.
 */

export const DEFAULT_FALLBACK_ORIGIN = 'https://powerbi-simulator.app';

/**
 * Returns the configured base origin from environment variables or the default fallback.
 * Strips any trailing slashes to guarantee clean URL construction.
 */
export function getBaseOrigin(envOrigin?: string): string {
  const candidate =
    envOrigin ||
    (typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL
      : undefined);

  if (candidate && typeof candidate === 'string') {
    const trimmed = candidate.trim().replace(/\/+$/, '');
    if (trimmed.length > 0) {
      return trimmed;
    }
  }

  return DEFAULT_FALLBACK_ORIGIN;
}

/**
 * Resolves a server-safe fallback share URL.
 * Guarantees a deterministic output during SSR and initial client hydration.
 */
export function getFallbackShareUrl(capsuleId?: string, customOrigin?: string): string {
  const cleanId = (capsuleId && capsuleId.trim().length > 0) ? capsuleId.trim() : 'demo';
  const baseOrigin = getBaseOrigin(customOrigin);
  return `${baseOrigin}/share/${cleanId}`;
}

/**
 * Resolves the share URL for the client environment using the actual window origin.
 */
export function getClientShareUrl(capsuleId?: string, clientOrigin?: string): string {
  const cleanId = (capsuleId && capsuleId.trim().length > 0) ? capsuleId.trim() : 'demo';

  if (clientOrigin && typeof clientOrigin === 'string') {
    const cleanOrigin = clientOrigin.trim().replace(/\/+$/, '');
    if (cleanOrigin.length > 0) {
      return `${cleanOrigin}/share/${cleanId}`;
    }
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    const cleanOrigin = window.location.origin.trim().replace(/\/+$/, '');
    return `${cleanOrigin}/share/${cleanId}`;
  }

  return getFallbackShareUrl(cleanId);
}
