export type EarthSeriesId = 'temperature';

export interface EarthDataPoint {
  date: string;
  value: number;
  unit: string;
}

export interface EarthDataset {
  id: string;
  title: string;
  variable: string;
  unit: string;
  periodLabel: string;
  sourceName: string;
  sourceUrl: string;
  attribution: string;
  description: string;
  isSynthetic: boolean;
  points: EarthDataPoint[];
}

export interface DatasetLoadResult {
  dataset: EarthDataset;
  mode: 'demo' | 'verified';
}
