import { useCallback, useEffect, useRef, useState } from 'react';
import { loadConfig, postConfig, saveConfig, useApplyConfig, useConfigMessages, type DemoConfig } from './theme';
import { Customizer, DockshiftMark, InstallCommand, PACKAGE_VERSION, features, links } from './customizer';
import './showcase.css';

// The phone's logical screen, in CSS pixels, and its bezel
const SCREEN_WIDTH = 393;
const SCREEN_HEIGHT = 852;
const BEZEL = 12;
const DEVICE_WIDTH = SCREEN_WIDTH + BEZEL * 2;
const DEVICE_HEIGHT = SCREEN_HEIGHT + BEZEL * 2;
const PAGE_GUTTER = 48;
const CAPTION_HEIGHT = 40;

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
          <span className="showcase-version">v{PACKAGE_VERSION}</span>
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
          <a href={links.github}>GitHub</a>
          <a href={links.docs}>Documentation</a>
          <a href={links.npm}>npm</a>
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
