import { useMemo, useState } from 'react';
import { AudioLines, Eye, Pause, Play, Square, Type } from 'lucide-react';
import type { EarthDataset } from '@/data/types';
import { explainPoint, getPattern, getPointFrequency, type ViewMode } from '@/data/series';
import { DataChart } from '@/components/DataChart';
import { DemoBadge, PageTitle, Shell } from '@/components/Site';
import { useSonification } from '@/components/useSonification';

export function ListenPage({ dataset }: { dataset: EarthDataset }) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<ViewMode>('audio');
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState('');
  const points = dataset.points;
  const current = points[index];
  const frequency = getPointFrequency(points, index);
  const pattern = useMemo(() => getPattern(points), [points]);
  const { playing, audioError, play, pause, stop } = useSonification(points, index, setIndex);

  const chooseIndex = (nextIndex: number) => {
    if (playing) pause();
    setIndex(nextIndex);
  };

  return (
    <Shell>
      <main>
        <PageTitle eyebrow="Listen / 02" title="Hear it before you see it.">Listen to the changing synthetic values. The sound represents only this illustrative demo series.</PageTitle>
        <div className="page listen-layout">
          <section>
            <div className="panel" aria-label="Audio player">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}><div><div className="eyebrow">Temperature · {current.date}</div><h2 style={{ margin: '8px 0', fontSize: 21 }}>A tone for each step</h2></div><DemoBadge /></div>
              <div className="mode-row" role="group" aria-label="Choose presentation mode">
                <button className="mode-button" type="button" aria-pressed={mode === 'visual'} onClick={() => setMode('visual')} data-testid="button-listen-mode-visual"><Eye size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Visual</button>
                <button className="mode-button" type="button" aria-pressed={mode === 'audio'} onClick={() => setMode('audio')} data-testid="button-listen-mode-audio"><AudioLines size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Audio</button>
                <button className="mode-button" type="button" aria-pressed={mode === 'text'} onClick={() => setMode('text')} data-testid="button-listen-mode-text"><Type size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Text</button>
              </div>
              {mode === 'text'
                ? <div className="panel" data-testid="text-listen-description">{explainPoint(dataset, index)}</div>
                : mode === 'visual'
                  ? revealed
                    ? <DataChart dataset={dataset} index={index} />
                    : <div className="panel muted" role="status" data-testid="status-blind-chart-hidden">The chart stays hidden until you reveal the data.</div>
                  : <div className={`meter${playing ? ' playing' : ''}`} aria-label={playing ? `Playing ${frequency} hertz tone` : `Current mapped frequency ${frequency} hertz`} role="img" data-testid="meter-listen">{Array.from({ length: 40 }, (_, i) => <i key={i} style={{ height: playing ? undefined : `${6 + ((i * 9 + frequency) % 13)}px` }} />)}</div>}
              <div className="player">
                {!playing
                  ? <button className="icon-button" type="button" aria-label="Play temperature sonification" onClick={() => void play()} data-testid="button-audio-play"><Play size={19} fill="currentColor" /></button>
                  : <button className="icon-button" type="button" aria-label="Pause playback" onClick={pause} data-testid="button-audio-pause"><Pause size={18} fill="currentColor" /></button>}
                <button className="mode-button" type="button" onClick={stop} aria-label="Stop playback and return to first point" data-testid="button-audio-stop"><Square size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Stop</button>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}><div className="value-reading" style={{ fontSize: 27 }} data-testid="text-listen-frequency">{frequency} <span style={{ fontSize: 12, color: '#91a6b2' }}>Hz</span></div><div className="value-date" data-testid="text-listen-date">{current.date} · {current.value.toFixed(1)} {current.unit}</div></div>
              </div>
              <label className="eyebrow" htmlFor="listen-index" style={{ display: 'block', marginTop: 22 }}>DATE INDEX · {index + 1} / {points.length}</label>
              <input id="listen-index" className="range" type="range" min="0" max={points.length - 1} value={index} onChange={(event) => chooseIndex(Number(event.currentTarget.value))} aria-label="Choose date index" aria-valuetext={`${current.date}, ${current.value.toFixed(1)} ${current.unit}, ${frequency} hertz`} data-testid="input-listen-index" />
              <div className="range-meta"><span>{points[0].date}</span><span>{current.date}</span><span>{points[points.length - 1].date}</span></div>
              {audioError && <div className="error-box" role="alert" style={{ marginTop: 18 }} data-testid="status-audio-error">{audioError}</div>}
              <div className="source-state" style={{ marginBottom: 0 }} data-testid="text-hearing-explanation"><strong>What am I hearing?</strong><br />{explainPoint(dataset, index)} No meaning beyond the displayed data is implied.</div>
            </div>
          </section>
          <section className="panel blind-card" aria-labelledby="blind-title" data-testid="panel-listen-first">
            <div className="eyebrow">LISTEN FIRST · Blind mode</div>
            <h2 id="blind-title">What pattern do you hear?</h2>
            <p className="muted" style={{ lineHeight: 1.7, fontSize: 13 }}>Listen to the demo stream, then choose the shape you noticed. The chart stays hidden until you reveal the data.</p>
            {!revealed ? <>
              <div className="status-tag" style={{ margin: '8px 0 18px' }}>CHART HIDDEN</div>
              <p className="muted" style={{ fontSize: 12 }}>What pattern did you hear?</p>
              <div className="choice-row">{(['Mostly stable', 'Gradual change', 'Rapid change'] as const).map((option) => <button key={option} type="button" className={`answer-button${guess === option ? ' selected' : ''}`} aria-pressed={guess === option} onClick={() => setGuess(option)} data-testid={`button-guess-${option.toLowerCase().replaceAll(' ', '-')}`}>{option}</button>)}</div>
              <button className="button" type="button" onClick={() => setRevealed(true)} disabled={!guess} data-testid="button-reveal-data">REVEAL DATA <Eye size={14} /></button>
            </> : <>
              <DataChart dataset={dataset} index={index} className="mini-chart" />
              {guess && <div className="feedback" aria-live="polite" data-testid="text-blind-feedback">{guess === pattern ? 'Your answer matches the pattern in the displayed demo values.' : `Your answer: ${guess}. The displayed demo values are classified as ${pattern}.`} This grading is calculated from this synthetic series, not a scientific conclusion.</div>}
            </>}
          </section>
        </div>
      </main>
    </Shell>
  );
}
