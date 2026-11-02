import { useState, type CSSProperties } from 'react';
import { accentColor, accents, defaultConfig, dockshiftSizing, type Appearance, type DemoConfig } from './theme';
import './showcase.css';

// Shared by the desktop showcase and the app's own Dockshift page

export const PACKAGE_VERSION = '0.1.2';
export const INSTALL_COMMAND = 'npm install @itsneufox/dockshift';
export const links = {
  github: 'https://github.com/Habitae/dockshift',
  docs: 'https://github.com/Habitae/dockshift#readme',
  npm: 'https://www.npmjs.com/package/@itsneufox/dockshift',
};

export const features = [
  { title: 'Drag from anywhere', body: 'Touch and mouse, and taps still reach controls.' },
  { title: 'Controlled state', body: 'Own it with open and onOpenChange.' },
  { title: 'Accessible', body: 'Dialog semantics, keyboard and reduced motion.' },
  { title: 'Themed with CSS', body: 'Every color and size is a variable.' },
];

const appearances: Array<{ value: Appearance; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be refused; the text stays selectable
    }
  };

  return { copied, copy };
}

export function DockshiftMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <rect x="3.5" y="12" width="17" height="8.5" rx="3.2" />
      <path d="M10 15h4M7 4.5h10M9 8h6" />
    </svg>
  );
}

export function InstallCommand() {
  const { copied, copy } = useCopy(INSTALL_COMMAND);

  return (
    <div className="showcase-install">
      <code><span aria-hidden="true">$</span> {INSTALL_COMMAND}</code>
      <button type="button" onClick={copy} aria-live="polite">{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

function snippetFor(config: DemoConfig, dark: boolean) {
  const sizing = dockshiftSizing(config);
  const variables: Array<[string, string]> = [
    ['--dockshift-radius', `${config.radius}px`],
    ['--dockshift-backdrop-blur', `${config.blur}px`],
    ['--dockshift-focus', accentColor(config)],
    ...(dark ? [['--dockshift-surface', '#1c201c'], ['--dockshift-text', '#ecece5']] as Array<[string, string]> : []),
  ];

  return [
    '<Dockshift',
    `  dockHeight={${sizing.dockHeight}}`,
    `  collapsedHeight={${sizing.collapsedHeight}}`,
    '  style={{',
    ...variables.map(([name, value]) => `    '${name}': '${value}',`),
    '  }}',
    '  …',
    '/>',
  ].join('\n');
}

function Slider({ label, value, min, max, unit = 'px', onChange }: { label: string; value: number; min: number; max: number; unit?: string; onChange: (value: number) => void }) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <label className="showcase-slider">
      <span className="showcase-control-label">{label}<output>{value}{unit}</output></span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ '--progress': `${progress}%` } as CSSProperties}
        onChange={event => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function Customizer({ config, dark, update }: { config: DemoConfig; dark: boolean; update: (next: Partial<DemoConfig>) => void }) {
  const code = snippetFor(config, dark);
  const { copied, copy } = useCopy(code);
  const changed = JSON.stringify(config) !== JSON.stringify(defaultConfig);

  return (
    <section className="showcase-panel" aria-labelledby="customizer-title">
      <header className="showcase-panel-header">
        <h2 id="customizer-title">Make it yours</h2>
        <button type="button" onClick={() => update(defaultConfig)} disabled={!changed}>Reset</button>
      </header>

      <div className="showcase-control">
        <span className="showcase-control-label">Appearance</span>
        <div className="showcase-segmented" role="radiogroup" aria-label="Appearance">
          {appearances.map(option => (
            <button
              type="button"
              role="radio"
              key={option.value}
              aria-checked={config.appearance === option.value}
              onClick={() => update({ appearance: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="showcase-control">
        <span className="showcase-control-label">Accent<output>{accents.find(accent => accent.id === config.accent)?.label}</output></span>
        <div className="showcase-swatches" role="radiogroup" aria-label="Accent color">
          {accents.map(accent => (
            <button
              type="button"
              role="radio"
              key={accent.id}
              aria-checked={config.accent === accent.id}
              aria-label={accent.label}
              title={accent.label}
              style={{ '--swatch': accent.color } as CSSProperties}
              onClick={() => update({ accent: accent.id })}
            />
          ))}
        </div>
      </div>

      <Slider label="Corner radius" value={config.radius} min={8} max={36} onChange={radius => update({ radius })} />
      <Slider label="Dock height" value={config.dockHeight} min={56} max={80} onChange={dockHeight => update({ dockHeight })} />
      <Slider label="Backdrop blur" value={config.blur} min={0} max={12} onChange={blur => update({ blur })} />

      <div className="showcase-code">
        <pre><code>{code}</code></pre>
        <button type="button" onClick={copy} aria-live="polite">{copied ? 'Copied' : 'Copy'}</button>
      </div>
    </section>
  );
}
