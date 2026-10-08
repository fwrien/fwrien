import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { AudioLines, ArrowRight, Menu, RotateCcw, X } from 'lucide-react';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="EARTH//ECHO home" data-testid="link-brand-home">
      <span className="brand-mark" aria-hidden="true"><AudioLines size={16} /></span>
      <span>EARTH<span style={{ color: '#68dce8' }}>//</span>ECHO</span>
    </Link>
  );
}

export function Navigation() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const links = [['Home', '/'], ['Explore', '/explore'], ['Listen', '/listen'], ['Method', '/method'], ['Sources', '/sources']];
  return (
    <header className="topbar">
      <Brand />
      <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-navigation-menu">
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Main navigation" data-testid="navigation-main">
        {links.map(([label, href]) => <Link key={href} href={href} className={location === href ? 'active' : ''} aria-current={location === href ? 'page' : undefined} onClick={() => setOpen(false)} data-testid={`link-nav-${label.toLowerCase()}`}>{label}</Link>)}
      </nav>
    </header>
  );
}

export function Footer() {
  return <footer className="footer page"><span>EARTH//ECHO — HEAR THE PLANET CHANGE.</span><span>DEMO MODE · Synthetic illustrative values · No verified dataset connected</span></footer>;
}

export function Shell({ children }: { children: ReactNode }) {
  return <div className="app-shell"><Navigation />{children}<Footer /></div>;
}

export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="page page-heading"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{children && <p>{children}</p>}</div>;
}

export function DemoBadge() {
  return <span className="status-tag" data-testid="status-demo-mode"><span className="dot" />DEMO MODE · SYNTHETIC VALUES</span>;
}

export function Globe() {
  return <div className="globe-stage" aria-label="Illustrated wireframe globe" role="img" data-testid="illustration-earth-globe"><div className="globe-orbit" /><div className="globe" /><span className="orbital-data one">PATTERN / 01</span><span className="orbital-data two">SIGHT — SOUND — DATA</span></div>;
}

export function ComingCards() {
  const cards = [
    ['Ocean', 'A future look at changing ocean patterns. Not connected yet.'],
    ['Vegetation', 'A future look at shifts across living landscapes. Not connected yet.'],
    ['Atmosphere', 'A future look at atmospheric patterns. Not connected yet.'],
  ];
  return <div className="coming-grid">{cards.map(([title, copy]) => <article className="coming-card" key={title} data-testid={`card-coming-${title.toLowerCase()}`}><div className="eyebrow">Coming next</div><h3>{title}</h3><p>{copy}</p></article>)}</div>;
}

export function LoadingState() {
  return <div className="page" style={{ padding: '80px 0' }} aria-live="polite" data-testid="status-dataset-loading"><div className="panel"><div className="eyebrow">Preparing demo stream</div><p className="muted">Checking the illustrative series and its values…</p><div className="meter playing" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} />)}</div></div></div>;
}

export function LoadFailure({ message, retry }: { message: string; retry: () => void }) {
  return <div className="page" style={{ padding: '54px 0' }}><div className="error-box" role="alert" data-testid="status-dataset-error"><strong>Stream unavailable.</strong><p>{message}</p><button className="button secondary" type="button" onClick={retry} data-testid="button-retry-dataset"><RotateCcw size={14} /> Retry check</button></div></div>;
}

export function NotFoundPage() {
  return <Shell><main className="page not-found"><div><div className="eyebrow">Signal not found</div><h1>That route is quiet.</h1><p className="muted">The page you requested does not exist.</p><Link href="/" className="button" data-testid="link-not-found-home">Back home <ArrowRight size={14} /></Link></div></main></Shell>;
}
