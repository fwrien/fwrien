import { useState, type Dispatch, type SetStateAction } from 'react';
import { ArrowRight, AudioLines, CircleHelp, Eye, Pause, Play, Square, Type } from 'lucide-react';
import { explainPoint, formatDelta, getPattern, getPointFrequency, type ViewMode } from '@/data/series';
import type { EarthDataset } from '@/data/types';
import { DataChart } from '@/components/DataChart';
import { DemoBadge } from '@/components/Site';
import { useSonification } from '@/components/useSonification';

export function SeriesPanel({ dataset, index, setIndex, mode, setMode }: {
  dataset: EarthDataset;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}) {
  const point = dataset.points[index];
  const previous = index > 0 ? dataset.points[index - 1] : undefined;
  const difference = previous ? point.value - previous.value : undefined;
  const frequency = getPointFrequency(dataset.points, index);
  const textSummary = explainPoint(dataset, index);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { playing, audioError, play, pause, stop } = useSonification(dataset.points, index, setIndex);

  const answerQuestion = () => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('change') || lowerQuestion.includes('trend')) {
      const overall = dataset.points[dataset.points.length - 1].value - dataset.points[0].value;
      setAnswer(`Across the displayed demo series, the value changes by ${formatDelta(overall)} ${dataset.unit} from ${dataset.points[0].date} to ${dataset.points[dataset.points.length - 1].date}. The pattern is classified as ${getPattern(dataset.points).toLowerCase()}. This describes only the synthetic values shown here.`);
    } else if (lowerQuestion.includes('pitch') || lowerQuestion.includes('sound') || lowerQuestion.includes('hear')) {
      const values = dataset.points.map((item) => item.value);
      const midpoint = (Math.min(...values) + Math.max(...values)) / 2;
      setAnswer(`${point.date} maps to ${frequency} hertz from its min–max position in this demo series. ${point.value.toFixed(1)} is ${point.value < midpoint ? 'below' : 'at or above'} the series midpoint. No outside data is used.`);
    } else if (!previous) {
      setAnswer(`At ${point.date}, the displayed synthetic value is ${point.value.toFixed(1)} ${point.unit}. This is the first point, so there is no previous value or difference to report. ${textSummary}`);
    } else {
      setAnswer(`At ${point.date}, the displayed synthetic value is ${point.value.toFixed(1)} ${point.unit}; the difference from the previous step is ${formatDelta(difference!)} ${point.unit}. ${textSummary}`);
    }
  };

  const chooseIndex = (newIndex: number) => {
    if (playing) pause();
    setIndex(newIndex);
  };

  return (
    <>
      <section className="panel" aria-label="Temperature series controls">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div><div className="eyebrow">Temperature · Synthetic illustration</div><h2 style={{ fontSize: 20, margin: '8px 0 4px' }}>A pattern to explore</h2><span className="muted" style={{ fontSize: 12 }}>{dataset.periodLabel} · {dataset.unit}</span></div>
          <DemoBadge />
        </div>
        <div className="mode-row" role="group" aria-label="Choose presentation mode" data-testid="group-view-modes">
          <button className="mode-button" type="button" aria-pressed={mode === 'visual'} onClick={() => setMode('visual')} data-testid="button-mode-visual"><Eye size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Visual</button>
          <button className="mode-button" type="button" aria-pressed={mode === 'audio'} onClick={() => setMode('audio')} data-testid="button-mode-audio"><AudioLines size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Audio</button>
          <button className="mode-button" type="button" aria-pressed={mode === 'text'} onClick={() => setMode('text')} data-testid="button-mode-text"><Type size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Text</button>
        </div>
        {mode === 'visual'
          ? <DataChart dataset={dataset} index={index} />
          : mode === 'audio'
            ? <div className={`meter${playing ? ' playing' : ''}`} aria-label={`${playing ? 'Playing' : 'Current'} frequency meter, ${frequency} hertz`} role="img" data-testid="meter-explore-audio">{Array.from({ length: 40 }, (_, bar) => <i key={bar} style={{ height: `${playing ? undefined : 6 + ((bar * 9 + frequency) % 14)}px` }} />)}</div>
            : <div className="panel" style={{ margin: '16px 0', color: '#c6d6dc', lineHeight: 1.8 }} data-testid="text-current-point"><div className="eyebrow">Text description · displayed point</div><p>{textSummary}</p></div>}
        <label className="eyebrow" htmlFor="series-index">POINT INDEX · {index + 1} / {dataset.points.length}</label>
        <input id="series-index" className="range" type="range" min={0} max={dataset.points.length - 1} value={index} onChange={(event) => chooseIndex(Number(event.currentTarget.value))} aria-label="Choose date index" aria-valuetext={`${point.date}, ${point.value.toFixed(1)} ${point.unit}`} data-testid="input-date-index" />
        <div className="range-meta"><span>{dataset.points[0].date}</span><span>{point.date}</span><span>{dataset.points[dataset.points.length - 1].date}</span></div>
        <div className="player" aria-label="Temperature sonification controls">
          {!playing
            ? <button className="icon-button" type="button" aria-label="Play temperature sonification from selected point" onClick={() => void play()} data-testid="button-explore-audio-play"><Play size={18} fill="currentColor" /></button>
            : <button className="icon-button" type="button" aria-label="Pause temperature sonification" onClick={pause} data-testid="button-explore-audio-pause"><Pause size={18} fill="currentColor" /></button>}
          <button className="mode-button" type="button" aria-label="Stop sonification and return to first point" onClick={stop} data-testid="button-explore-audio-stop"><Square size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Stop</button>
          <span className="muted" style={{ fontSize: 11 }}>Play begins only after your click or tap.</span>
        </div>
        {audioError && <div className="error-box" role="alert" style={{ marginTop: 13 }} data-testid="status-explore-audio-error">{audioError}</div>}
      </section>
      <aside className="panel value-card" aria-label="Current data point" data-testid="panel-current-point">
        <div className="eyebrow">Selected point</div>
        <h3>Illustrative value</h3>
        <div className="value-reading" data-testid="text-current-value">{point.value.toFixed(1)}</div>
        <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 5 }}>{point.unit}</div>
        <div className="value-date" data-testid="text-current-date">{point.date}</div>
        <div className="metric-row"><span>Difference from previous</span><strong data-testid="text-current-difference">{difference === undefined ? 'No previous point' : formatDelta(difference)}</strong></div>
        <div className="metric-row"><span>Mapped frequency</span><strong data-testid="text-current-frequency">{frequency} Hz</strong></div>
        <div className={`meter${playing ? ' playing' : ''}`} aria-label={`${playing ? 'Playing' : 'Current'} frequency meter, ${frequency} hertz`} role="img" data-testid="meter-frequency">{Array.from({ length: 28 }, (_, bar) => <i key={bar} style={{ height: `${playing ? undefined : 7 + ((bar * 13 + frequency) % 16)}px` }} />)}</div>
        <p className="muted" style={{ fontSize: 11, lineHeight: 1.6 }}>Low values map to lower tones; high values map to higher tones. {index === 0 ? 'There is no prior point or prior pitch for this first point.' : ''}</p>
        <div style={{ borderTop: '1px solid rgba(150,193,209,.12)', paddingTop: 17, marginTop: 18 }}>
          <div className="eyebrow"><CircleHelp size={12} style={{ verticalAlign: 'middle', marginRight: 6 }} />EARTH INTERPRETER</div>
          <p className="muted" style={{ fontSize: 11, lineHeight: 1.6 }}>Answers are computed only from this displayed demo series.</p>
          <label className="eyebrow" htmlFor="interpreter-question">Ask about the displayed data</label>
          <input id="interpreter-question" value={question} onChange={(event) => setQuestion(event.currentTarget.value)} placeholder="e.g. What changed?" aria-label="Question about displayed data" data-testid="input-interpreter-question" style={{ width: '100%', boxSizing: 'border-box', margin: '9px 0', border: '1px solid rgba(150,193,209,.25)', background: '#0a1420', color: '#e7f0f4', padding: 10, borderRadius: 3 }} />
          <button className="button secondary" type="button" onClick={answerQuestion} disabled={!question.trim()} data-testid="button-interpreter-answer">Answer from demo data <ArrowRight size={13} /></button>
          {answer && <p className="feedback" aria-live="polite" data-testid="text-interpreter-answer">{answer}</p>}
        </div>
      </aside>
    </>
  );
}
