import { syntheticTemperatureDemo, validateDataset } from './dataset';
import type { DatasetLoadResult, EarthDataset } from './types';

export const USE_DEMO_DATA = true;

/**
 * Intentionally unconfigured. A verified source must provide a real provider,
 * URL, attribution, and validated records before demo mode can be disabled.
 */
export const NASA_DATA_CONFIG = {
  provider: '',
  sourceUrl: '',
  attribution: '',
  configured: false,
};

export class DatasetLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatasetLoadError';
  }
}

export async function loadTemperatureDataset(): Promise<DatasetLoadResult> {
  if (USE_DEMO_DATA) {
    const errors = validateDataset(syntheticTemperatureDemo);
    if (errors.length) throw new DatasetLoadError(errors.join(' '));
    return { dataset: syntheticTemperatureDemo, mode: 'demo' };
  }

  if (
    !NASA_DATA_CONFIG.configured ||
    !NASA_DATA_CONFIG.provider.trim() ||
    !NASA_DATA_CONFIG.sourceUrl.trim() ||
    !NASA_DATA_CONFIG.attribution.trim()
  ) {
    throw new DatasetLoadError(
      'No verified temperature source is configured. Demo fallback is disabled.',
    );
  }

  // A real provider adapter must be implemented and reviewed before enabling this branch.
  throw new DatasetLoadError('The configured verified-data adapter is not implemented.');
}

export function assertValidDataset(dataset: EarthDataset): EarthDataset {
  const errors = validateDataset(dataset);
  if (errors.length) throw new DatasetLoadError(errors.join(' '));
  return dataset;
}
