import { PageTitle, Shell } from '@/components/Site';

const details = [
  ['Units', 'The values are synthetic illustrative numbers labelled °C (illustrative) to demonstrate a temperature-shaped series. They are not measurements and should not be interpreted as Earth temperatures.'],
  ['Period', 'There are 36 ordered illustrative steps labelled Step 01 through Step 36. These are not calendar dates, actual monthly observations, or an observational period.'],
  ['Normalization', 'For each value x, min–max normalization is (x − series minimum) / (series maximum − series minimum). A constant series maps to the midpoint.'],
  ['Pitch mapping', 'The normalized value maps linearly to 180–720 Hz. Lower values therefore sound lower and higher values sound higher. Each step is played as a short sine tone.'],
  ['Limits', 'This sonification is a listening aid, not a forecast or scientific analysis. The stream is synthetic, has no verified source, and omits uncertainty, spatial variation, and measurement context.'],
  ['Accessibility', 'Visual, Audio, and Text controls offer different ways to explore the same selected point. Keyboard-operable range inputs, explicit labels, and live status messages support navigation without a pointer.'],
];

export function MethodPage() {
  return (
    <Shell>
      <main>
        <PageTitle eyebrow="Method / 03" title="A mapping you can inspect.">The demonstration is intentionally plain about what its sound means—and what it does not.</PageTitle>
        <div className="page method-grid">{details.map(([title, text], index) => <article className="panel method-card" key={title} data-testid={`card-method-${index}`}><div className="eyebrow">0{index + 1} / Method note</div><h2>{title}</h2><p>{text}</p></article>)}</div>
      </main>
    </Shell>
  );
}
