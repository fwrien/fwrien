import type { EarthDataPoint, EarthDataset } from './types';

export type ViewMode = 'visual' | 'audio' | 'text';

export function formatDelta(delta: number): string {
  if (delta === 0) return '0.00';
  return `${delta > 0 ? '+' : '−'}${Math.abs(delta).toFixed(2)}`;
}

export function getPointFrequency(points: EarthDataPoint[], index: number): number {
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const normalized = max === min ? 0.5 : (points[index].value - min) / (max - min);
  return Math.round(180 + normalized * 540);
}

export function getPattern(points: EarthDataPoint[]): 'Mostly stable' | 'Gradual change' | 'Rapid change' {
  const values = points.map((point) => point.value);
  const totalRange = Math.max(...values) - Math.min(...values);
  const averageStep = values.slice(1).reduce((sum, value, index) => sum + Math.abs(value - values[index]), 0) / (values.length - 1);
  if (averageStep > totalRange * 0.2) return 'Rapid change';
  if (totalRange > 0 && totalRange > averageStep * 5) return 'Gradual change';
  return 'Mostly stable';
}

export function explainPoint(dataset: EarthDataset, index: number): string {
  const point = dataset.points[index];
  const frequency = getPointFrequency(dataset.points, index);
  if (index === 0) {
    return `${point.date} is ${point.value.toFixed(1)} ${point.unit}. This is the first point, so there is no previous value or prior pitch to compare. Its normalized pitch is ${frequency} hertz. These are synthetic demo values, not observations.`;
  }
  const previous = dataset.points[index - 1];
  const difference = point.value - previous.value;
  const direction = difference > 0 ? 'higher' : difference < 0 ? 'lower' : 'unchanged';
  const pitchChange = difference > 0
    ? `The pitch rises because the displayed value increased by ${Math.abs(difference).toFixed(1)} ${point.unit} from the previous point.`
    : difference < 0
      ? `The pitch falls because the displayed value decreased by ${Math.abs(difference).toFixed(1)} ${point.unit} from the previous point.`
      : 'The pitch stays level because the displayed value did not change from the previous point.';
  return `${point.date} is ${point.value.toFixed(1)} ${point.unit}. That is ${Math.abs(difference).toFixed(1)} ${point.unit} ${direction} than the previous step. ${pitchChange} Its normalized pitch is ${frequency} hertz. These are synthetic demo values, not observations.`;
}
