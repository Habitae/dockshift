import { useEffect, useState } from 'react';

// What a visitor can change live: shared by the showcase's controls and the
// app's own Preferences, and passed into the phone with postMessage
export type Appearance = 'system' | 'light' | 'dark';

export type DemoConfig = {
  appearance: Appearance;
  accent: string;
  radius: number;
  dockHeight: number;
  blur: number;
};

export const accents: Array<{ id: string; label: string; color: string }> = [
  { id: 'sage', label: 'Sage', color: '#416d56' },
  { id: 'harbor', label: 'Harbor', color: '#2f6690' },
  { id: 'terracotta', label: 'Terracotta', color: '#b05a3c' },
  { id: 'plum', label: 'Plum', color: '#7a4a86' },
  { id: 'graphite', label: 'Graphite', color: '#3f4542' },
];

export const defaultConfig: DemoConfig = { appearance: 'system', accent: 'sage', radius: 28, dockHeight: 64, blur: 3 };

const HANDLE_HEIGHT = 36;
const MESSAGE = 'dockshift-demo:config';
const STORAGE_KEY = 'dockshift-demo-config';

export const accentColor = (config: DemoConfig) => accents.find(accent => accent.id === config.accent)?.color ?? accents[0].color;

export function loadConfig(): DemoConfig {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return stored ? { ...defaultConfig, ...stored } : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export function saveConfig(config: DemoConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Storage can be unavailable; the choice then lasts for this visit only
  }
}

function usePrefersDark() {
  const query = '(prefers-color-scheme: dark)';
  const [dark, setDark] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setDark(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return dark;
}

// Applies the look to this document: the theme and the accent
export function useApplyConfig(config: DemoConfig) {
  const prefersDark = usePrefersDark();
  const dark = config.appearance === 'dark' || (config.appearance === 'system' && prefersDark);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = dark ? 'dark' : 'light';
    root.style.colorScheme = dark ? 'dark' : 'light';
    root.style.setProperty('--accent-base', accentColor(config));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#161916' : '#faf9f5');
  }, [dark, config]);

  return dark;
}

// The Dockshift props this config stands for, used by the demo and shown as code
export function dockshiftSizing(config: DemoConfig) {
  return {
    dockHeight: config.dockHeight,
    collapsedHeight: config.dockHeight + HANDLE_HEIGHT,
    style: { '--dockshift-radius': `${config.radius}px`, '--dockshift-backdrop-blur': `${config.blur}px` },
  };
}

export function postConfig(target: Window | null | undefined, config: DemoConfig) {
  target?.postMessage({ type: MESSAGE, config }, window.location.origin);
}

export function useConfigMessages(onConfig: (config: DemoConfig) => void) {
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== MESSAGE) return;
      onConfig({ ...defaultConfig, ...event.data.config });
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [onConfig]);
}
