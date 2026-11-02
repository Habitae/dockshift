import type { ReactNode } from 'react';

export type IconName =
  | 'brand' | 'sun' | 'cloud' | 'today' | 'explore' | 'saved' | 'profile' | 'neighborhoods' | 'settings' | 'help'
  | 'coffee' | 'walk' | 'lunch' | 'view' | 'swipe' | 'search' | 'tram' | 'museum' | 'market' | 'rain'
  | 'chevron' | 'back' | 'close' | 'music' | 'train' | 'leaf' | 'bell' | 'route' | 'calendar' | 'pin'
  | 'dock' | 'copy' | 'external';

const iconPaths: Record<IconName, ReactNode> = {
  brand: <><path d="M20 10.2c0 5.5-8 11-8 11s-8-5.5-8-11a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></>,
  sun: <><circle cx="12" cy="12" r="3.7" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  cloud: <><path d="M7 18a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.5 1.5A3.8 3.8 0 0 1 17.5 18Z" /></>,
  today: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></>,
  explore: <><circle cx="12" cy="12" r="9" /><path d="m15.6 8.4-2.3 5-4.9 2.2 2.2-4.9Z" /></>,
  saved: <><path d="M5 4.8A1.8 1.8 0 0 1 6.8 3h10.4A1.8 1.8 0 0 1 19 4.8V21l-7-4.1L5 21Z" /></>,
  profile: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  neighborhoods: <><path d="M3 20V9l5-4v15m0-9 6-5v14m0-8 7-4v12M2 20h20" /><path d="M5 11h1m-1 3h1m5-3h1m-1 3h1m5-3h1m-1 3h1" /></>,
  settings: <><path d="M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 1 1 4.1 1.7c-1 .9-1.8 1.3-1.8 2.8m0 3.3h.01" /></>,
  coffee: <><path d="M4 8h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm13 2h2a2 2 0 1 1 0 4h-2M8 3v2m4-2v2" /></>,
  walk: <><circle cx="13" cy="5" r="2" /><path d="m10 21 2-6-3-3 2-4 4 3 3 1m-9 9-3-5-3 2m10-6 3 4-1 4" /></>,
  lunch: <><path d="M3 11h18M5 11l1 9h12l1-9M8 7c0-1.7 1-2.1 1-4m5 4c0-1.7 1-2.1 1-4m-9 7a6 6 0 0 1 12 0" /></>,
  view: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  swipe: <><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.6L3.7 15a1.6 1.6 0 0 1 2.5-2L8 14" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  tram: <><rect x="5" y="5" width="14" height="12" rx="3" /><path d="M5 11h14M9 21l1.5-4m4.5 4-1.5-4M8 2h8M12 2v3" /><path d="M8.5 14h.01m7 0h.01" /></>,
  museum: <><path d="m3 9 9-5 9 5M4 20h16M6 10v7m4-7v7m4-7v7m4-7v7" /></>,
  market: <><path d="M4 9h16l-1.5-5h-13ZM5 9v11h14V9M9 20v-6h6v6" /><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" /></>,
  rain: <><path d="M7 15a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.5 1.5A3.8 3.8 0 0 1 17.5 15Z" /><path d="m9 18-1 3m5-3-1 3m5-3-1 3" /></>,
  chevron: <><path d="m9 6 6 6-6 6" /></>,
  back: <><path d="m15 6-6 6 6 6" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
  train: <><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 10h14M8 21l2-4m6 4-2-4M9 14h.01m6 0h.01" /></>,
  leaf: <><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15ZM10 20.5a2 2 0 0 0 4 0" /></>,
  route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H16a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h7.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4m8-4v4" /></>,
  pin: <><path d="M20 10.2c0 5.5-8 11-8 11s-8-5.5-8-11a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></>,
  dock: <><rect x="3.5" y="12" width="17" height="8.5" rx="3.2" /><path d="M10 15h4M7 4.5h10M9 8h6" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" /></>,
  external: <><path d="M14 4h6v6m0-6-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" /></>,
};

export function Icon({ name, className, filled }: { name: IconName; className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}
