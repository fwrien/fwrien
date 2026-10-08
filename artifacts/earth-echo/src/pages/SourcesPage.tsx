import { PageTitle, Shell } from '@/components/Site';

export function SourcesPage() {
  return (
    <Shell>
      <main>
        <PageTitle eyebrow="Sources / 04" title="Provenance before presentation.">We show what is connected, what is not, and which values are demo-only.</PageTitle>
        <div className="page" style={{ paddingBottom: 72 }}>
          <div className="source-state" role="status" data-testid="status-source-not-connected"><strong>There is no verified dataset connected yet.</strong><br />EARTH//ECHO currently uses synthetic illustrative values in DEMO MODE. No NASA source or provider has been verified or attributed.</div>
          <section className="panel" data-testid="panel-source-details">
            <div className="eyebrow">Current stream · Temperature</div><h2 style={{ fontSize: 23 }}>Synthetic illustrative demo</h2>
            <p className="muted" style={{ lineHeight: 1.75 }}>The displayed series exists only to demonstrate controls, plotting, and sonification. It is not a scientific observation, official record, or representation of a verified dataset.</p>
            <div className="metric-row"><span>Dataset name</span><strong data-testid="text-source-dataset-name">Synthetic illustrative demo</strong></div>
            <div className="metric-row"><span>Agency / provider</span><strong data-testid="text-source-provider">Not connected</strong></div>
            <div className="metric-row"><span>Source URL</span><strong data-testid="text-source-url">Not connected</strong></div>
            <div className="metric-row"><span>Variable</span><strong data-testid="text-source-variable">Synthetic temperature pattern</strong></div>
            <div className="metric-row"><span>Units</span><strong data-testid="text-source-units">°C (illustrative only)</strong></div>
            <div className="metric-row"><span>Time period</span><strong data-testid="text-source-time-period">36 ordered illustrative steps</strong></div>
            <div className="metric-row"><span>Access date</span><strong data-testid="text-source-access-date">Not applicable · no external source accessed</strong></div>
            <div className="metric-row"><span>Attribution</span><strong data-testid="text-source-attribution">Not connected</strong></div>
          </section>
          <section className="panel" style={{ marginTop: 14 }}><div className="eyebrow">Integrity safeguard</div><p className="muted" style={{ lineHeight: 1.75, fontSize: 13 }}>The data service is explicitly configured with USE_DEMO_DATA = true. If demo mode is disabled, the service refuses to load until a verified provider, source URL, attribution, and data adapter are configured; it will not silently fall back to demo values.</p></section>
        </div>
      </main>
    </Shell>
  );
}
