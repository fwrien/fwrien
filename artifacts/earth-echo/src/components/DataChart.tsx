import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { EarthDataset } from '@/data/types';

export function DataChart({ dataset, index, className = '' }: { dataset: EarthDataset; index: number; className?: string }) {
  const active = dataset.points[index];
  const stepInterval = dataset.points.length > 18 ? Math.ceil(dataset.points.length / 6) : 1;
  return (
    <div className={`chart-wrap ${className}`} role="img" aria-label={`Synthetic illustrative temperature time series. Current point ${active.date}, ${active.value.toFixed(1)} ${active.unit}.`} data-testid="chart-temperature-series">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataset.points} margin={{ top: 12, right: 15, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="rgba(150,193,209,.13)" vertical={false} />
          <XAxis dataKey="date" interval={stepInterval - 1} tick={{ fill: '#91a6b2', fontSize: 10 }} axisLine={{ stroke: 'rgba(150,193,209,.2)' }} tickLine={false} />
          <YAxis domain={['dataMin - 0.25', 'dataMax + 0.25']} tick={{ fill: '#91a6b2', fontSize: 10 }} axisLine={false} tickLine={false} width={46} />
          <Tooltip contentStyle={{ background: '#111f2d', border: '1px solid rgba(110,203,218,.3)', color: '#e5f0f3', borderRadius: 5, fontSize: 11 }} formatter={(value: number) => [`${Number(value).toFixed(1)} ${active.unit}`, 'Illustrative value']} labelStyle={{ color: '#8ddde7' }} />
          <ReferenceLine x={active.date} stroke="#f2bd67" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="value" stroke="#63d8e7" strokeWidth={2.4} dot={false} activeDot={{ r: 5, fill: '#f2bd67', stroke: '#09131f', strokeWidth: 2 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
