import type { EarthDataset } from './types';

const illustrativeUnit = '°C (illustrative)';
const illustrativeValues = [
  ['Step 01', 13.8], ['Step 02', 13.9], ['Step 03', 13.7], ['Step 04', 13.9],
  ['Step 05', 14.0], ['Step 06', 13.8], ['Step 07', 14.1], ['Step 08', 14.0],
  ['Step 09', 14.2], ['Step 10', 14.1], ['Step 11', 14.3], ['Step 12', 14.2],
  ['Step 13', 14.4], ['Step 14', 14.3], ['Step 15', 14.5], ['Step 16', 14.4],
  ['Step 17', 14.6], ['Step 18', 14.5], ['Step 19', 14.7], ['Step 20', 14.6],
  ['Step 21', 14.8], ['Step 22', 14.7], ['Step 23', 14.9], ['Step 24', 14.8],
  ['Step 25', 15.0], ['Step 26', 14.9], ['Step 27', 15.1], ['Step 28', 15.0],
  ['Step 29', 15.2], ['Step 30', 15.1], ['Step 31', 15.3], ['Step 32', 15.2],
  ['Step 33', 15.4], ['Step 34', 15.3], ['Step 35', 15.5], ['Step 36', 15.4],
] as const;

/**
 * Synthetic illustrative values, authored only for demonstrating the interface.
 * They are not observations, measurements, or a proxy for a scientific record.
 */
export const syntheticTemperatureDemo: EarthDataset = {
  id: 'temperature-synthetic-demo',
  title: 'Illustrative temperature pattern',
  variable: 'Temperature pattern',
  unit: illustrativeUnit,
  periodLabel: '36 ordered illustrative steps',
  sourceName: '',
  sourceUrl: '',
  attribution: '',
  description:
    'Synthetic illustrative values for exploring how a time series can be heard. Not real scientific observations.',
  isSynthetic: true,
  points: illustrativeValues.map(([date, value]) => ({
    date,
    value,
    unit: illustrativeUnit,
  })),
};

export function validateDataset(dataset: EarthDataset): string[] {
  const errors: string[] = [];
  if (!dataset.id || !dataset.title || !dataset.variable || !dataset.unit) {
    errors.push('Dataset identity, title, variable, and unit are required.');
  }
  if (!Array.isArray(dataset.points) || dataset.points.length < 2) {
    errors.push('A dataset must contain at least two data points.');
    return errors;
  }
  dataset.points.forEach((point, index) => {
    if (!point || typeof point.date !== 'string' || point.date.trim() === '') {
      errors.push(`Point ${index + 1} has a missing or malformed date.`);
    }
    if (typeof point.value !== 'number' || !Number.isFinite(point.value)) {
      errors.push(`Point ${index + 1} has a missing, malformed, or non-finite value.`);
    }
    if (typeof point.unit !== 'string' || point.unit.trim() === '') {
      errors.push(`Point ${index + 1} has a missing or malformed unit.`);
    }
  });
  return errors;
}
