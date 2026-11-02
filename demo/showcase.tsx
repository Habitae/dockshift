import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { accentColor, accents, defaultConfig, dockshiftSizing, loadConfig, postConfig, saveConfig, useApplyConfig, useConfigMessages, type Appearance, type DemoConfig } from './theme';
import './showcase.css';

// The phone's logical screen, in CSS pixels, and its bezel
const SCREEN_WIDTH = 393;
const SCREEN_HEIGHT = 852;
const BEZEL = 12;
const DEVICE_WIDTH = SCREEN_WIDTH + BEZEL * 2;
const DEVICE_HEIGHT = SCREEN_HEIGHT + BEZEL * 2;
const PAGE_GUTTER = 48;
const CAPTION_HEIGHT = 40;

const features = [
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

function useDeviceScale() {
  const read = () => Math.min(1, Math.max(0.55, (window.innerHeight - PAGE_GUTTER * 2 - CAPTION_HEIGHT) / DEVICE_HEIGHT));
  const [scale, setScale] = useState(read);

  useEffect(() => {
    const update = () => setScale(read());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return scale;
}

function useCopy(text: string) {
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

function DockshiftMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <rect x="3.5" y="12" width="17" height="8.5" rx="3.2" />
      <path d="M10 15h4M7 4.5h10M9 8h6" />
    </svg>
  );
}

function InstallCommand() {
  const command = 'npm install @itsneufox/dockshift';
  const { copied, copy } = useCopy(command);

  return (
    <div className="showcase-install">
      <code><span aria-hidden="true">$</span> {command}</code>
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

function Customizer({ config, dark, update }: { config: DemoConfig; dark: boolean; update: (next: Partial<DemoConfig>) => void }) {
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

export function Showcase() {
  const scale = useDeviceScale();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [config, setConfig] = useState<DemoConfig>(loadConfig);
  const dark = useApplyConfig(config);

  // Changes made inside the phone, in its own Preferences, come back here
  useConfigMessages(useCallback((next: DemoConfig) => setConfig(next), []));

  useEffect(() => {
    saveConfig(config);
    postConfig(frameRef.current?.contentWindow, config);
  }, [config]);

  const update = (next: Partial<DemoConfig>) => setConfig(current => ({ ...current, ...next }));

  return (
    <div className="showcase">
      <section className="showcase-copy" aria-labelledby="showcase-title">
        <header className="showcase-brand">
          <span className="showcase-brand-mark"><DockshiftMark /></span>
          <span>Dockshift</span>
          <span className="showcase-version">v0.1.1</span>
        </header>

        <h1 className="showcase-title" id="showcase-title">A dock that opens into a drawer.</h1>
        <p className="showcase-lede">
          A React component that keeps a compact dock on screen and expands that same surface into a full
          navigation drawer when it’s pressed or dragged.
        </p>

        <InstallCommand />

        <dl className="showcase-features">
          {features.map(feature => (
            <div key={feature.title}>
              <dt>{feature.title}</dt>
              <dd>{feature.body}</dd>
            </div>
          ))}
        </dl>

        <footer className="showcase-links">
          <a href="https://github.com/Habitae/dockshift">GitHub</a>
          <a href="https://github.com/Habitae/dockshift#readme">Documentation</a>
          <a href="https://www.npmjs.com/package/@itsneufox/dockshift">npm</a>
          <span>MPL-2.0</span>
        </footer>
      </section>

      <figure className="showcase-stage">
        <div className="showcase-device-box" style={{ width: DEVICE_WIDTH * scale, height: DEVICE_HEIGHT * scale }}>
          <div className="showcase-device" style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, transform: `scale(${scale})` }}>
            <iframe
              ref={frameRef}
              className="showcase-screen"
              src="./?embed"
              title="Dockshift live demo"
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              onLoad={() => postConfig(frameRef.current?.contentWindow, config)}
            />
            <span className="showcase-island" aria-hidden="true" />
          </div>
        </div>
        <figcaption className="showcase-try">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.6L3.7 15a1.6 1.6 0 0 1 2.5-2L8 14" /></svg>
          Live demo. Every screen works; drag the handle or tap it.
        </figcaption>
      </figure>

      <Customizer config={config} dark={dark} update={update} />
    </div>
  );
}
