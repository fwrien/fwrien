import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import type { EarthDataset } from '@/data/types';
import { ComingCards, DemoBadge, Globe, Shell } from '@/components/Site';
import { DataChart } from '@/components/DataChart';

export function HomePage({ dataset }: { dataset: EarthDataset }) {
  const first = Math.floor(dataset.points.length * 0.6);
  return (
    <Shell>
      <main>
        <section className="page hero">
          <div>
            <div className="eyebrow">A new way to notice the living system</div>
            <h1>HEAR THE<br /><em>PLANET CHANGE.</em></h1>
            <p>Experience Earth science through sight, sound, and data.</p>
            <div style={{ marginTop: 23 }}><DemoBadge /></div>
            <div className="hero-actions">
              <Link href="/explore" className="button" data-testid="link-explore-earth">EXPLORE EARTH <ArrowRight size={15} /></Link>
              <Link href="/method" className="button secondary" data-testid="link-how-it-works">HOW IT WORKS</Link>
            </div>
          </div>
          <Globe />
        </section>
        <section className="page section">
          <div className="section-heading"><div><div className="eyebrow">Temperature / illustrative series</div><h2>One pattern.<br />A different perspective.</h2></div><p>A small, transparent first step: move through a synthetic time series and hear how values become pitch.</p></div>
          <div className="preview-panel preview-grid">
            <DataChart dataset={dataset} index={first} className="mini-chart" />
            <div><div className="eyebrow">The stream</div><div className="stat-number">36<span style={{ fontSize: 16, color: '#88a1ad' }}> steps</span></div><p className="muted" style={{ lineHeight: 1.7 }}>A deliberately synthetic temperature pattern. It is not real scientific observation.</p><Link href="/listen" className="button secondary" data-testid="link-listen-preview">LISTEN TO THE DEMO <ArrowRight size={14} /></Link></div>
          </div>
        </section>
        <section className="page section">
          <div className="section-heading"><div><div className="eyebrow">More Earth systems</div><h2>Coming into view</h2></div><p>These pathways are not connected yet. We will only add them when their data and provenance are ready to show.</p></div>
          <ComingCards />
        </section>
      </main>
    </Shell>
  );
}
