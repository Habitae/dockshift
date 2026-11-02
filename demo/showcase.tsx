import { useEffect, useState } from 'react';
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
  { title: 'Drag from anywhere', body: 'Touch and mouse gestures on the dock or drawer, with taps still reaching controls.' },
  { title: 'Controlled state', body: 'Own the open state with open and onOpenChange.' },
  { title: 'Accessible', body: 'Radix Dialog semantics, a keyboard handle and reduced-motion styles.' },
  { title: 'Themed with CSS', body: 'Colors, radius, heights and shadow are CSS variables.' },
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

function DockshiftMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <rect x="3.5" y="12" width="17" height="8.5" rx="3.2" />
      <path d="M10 15h4M7 4.5h10M9 8h6" />
    </svg>
  );
}

function InstallCommand() {
  const command = 'npm install dockshift';
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be refused; the command stays selectable
    }
  };

  return (
    <div className="showcase-install">
      <code><span aria-hidden="true">$</span> {command}</code>
      <button type="button" onClick={copy} aria-live="polite">{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

export function Showcase() {
  const scale = useDeviceScale();

  return (
    <div className="showcase">
      <section className="showcase-copy" aria-labelledby="showcase-title">
        <header className="showcase-brand">
          <span className="showcase-brand-mark"><DockshiftMark /></span>
          <span>Dockshift</span>
          <span className="showcase-version">v0.1.0</span>
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
          <span>MPL-2.0</span>
        </footer>
      </section>

      <figure className="showcase-stage">
        <div className="showcase-device-box" style={{ width: DEVICE_WIDTH * scale, height: DEVICE_HEIGHT * scale }}>
          <div className="showcase-device" style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, transform: `scale(${scale})` }}>
            <iframe
              className="showcase-screen"
              src="./?embed"
              title="Dockshift live demo"
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
            />
            <span className="showcase-island" aria-hidden="true" />
          </div>
        </div>
        <figcaption className="showcase-try">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.6L3.7 15a1.6 1.6 0 0 1 2.5-2L8 14" /></svg>
          Live demo. Drag the handle up, or tap it.
        </figcaption>
      </figure>
    </div>
  );
}
