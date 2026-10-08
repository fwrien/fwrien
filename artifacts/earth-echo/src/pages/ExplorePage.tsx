import { useState } from 'react';
import type { EarthDataset } from '@/data/types';
import type { ViewMode } from '@/data/series';
import { ComingCards, PageTitle, Shell } from '@/components/Site';
import { SeriesPanel } from '@/components/SeriesPanel';

export function ExplorePage({ dataset }: { dataset: EarthDataset }) {
  const [index, setIndex] = useState(Math.floor(dataset.points.length / 2));
  const [mode, setMode] = useState<ViewMode>('visual');
  return (
    <Shell>
      <main>
        <PageTitle eyebrow="Explore / 01" title="Temperature, made audible.">Browse an illustrative series point by point. This demo is synthetic—not a scientific record.</PageTitle>
        <div className="page explore-layout">
          <SeriesPanel dataset={dataset} index={index} setIndex={setIndex} mode={mode} setMode={setMode} />
          <div style={{ gridColumn: '1 / -1' }}><ComingCards /></div>
        </div>
      </main>
    </Shell>
  );
}
