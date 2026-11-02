import { useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Dockshift } from 'dockshift';
import { Showcase } from './showcase';
import '../src/styles.css';
import './demo.css';

type IconName = 'brand' | 'sun' | 'today' | 'explore' | 'saved' | 'profile' | 'neighborhoods' | 'settings' | 'help' | 'coffee' | 'walk' | 'lunch' | 'view' | 'swipe';

const iconPaths: Record<IconName, ReactNode> = {
  brand: <><path d="M20 10.2c0 5.5-8 11-8 11s-8-5.5-8-11a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></>,
  sun: <><circle cx="12" cy="12" r="3.7" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  today: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></>,
  explore: <><circle cx="12" cy="12" r="9" /><path d="m15.6 8.4-2.3 5-4.9 2.2 2.2-4.9Z" /></>,
  saved: <><path d="M5 4.8A1.8 1.8 0 0 1 6.8 3h10.4A1.8 1.8 0 0 1 19 4.8V21l-7-4.1L5 21Z" /></>,
  profile: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  neighborhoods: <><path d="M3 20V9l5-4v15m0-9 6-5v14m0-8 7-4v12M2 20h20" /><path d="M5 11h1m-1 3h1m5-3h1m-1 3h1m5-3h1m-1 3h1" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a7.7 7.7 0 0 1-1.5.9L16 20.5h-2.8l-.3-1.8a7.7 7.7 0 0 1-1.7-.7l-1.6.8-1.7-2.2 1.3-1.3a7.4 7.4 0 0 1-.1-1.8l-1.4-1.1 1.3-2.5 1.8.6a7.6 7.6 0 0 1 1.5-.9L12.6 8h2.8l.3 1.8a7.7 7.7 0 0 1 1.7.7l1.6-.8 1.7 2.2-1.3 1.3a7.4 7.4 0 0 1 0 1.8Z" transform="translate(-1 -2) scale(1.08)" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 1 1 4.1 1.7c-1 .9-1.8 1.3-1.8 2.8m0 3.3h.01" /></>,
  coffee: <><path d="M4 8h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm13 2h2a2 2 0 1 1 0 4h-2M8 3v2m4-2v2" /></>,
  walk: <><circle cx="13" cy="5" r="2" /><path d="m10 21 2-6-3-3 2-4 4 3 3 1m-9 9-3-5-3 2m10-6 3 4-1 4" /></>,
  lunch: <><path d="M3 11h18M5 11l1 9h12l1-9M8 7c0-1.7 1-2.1 1-4m5 4c0-1.7 1-2.1 1-4m-9 7a6 6 0 0 1 12 0" /></>,
  view: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  swipe: <><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.6L3.7 15a1.6 1.6 0 0 1 2.5-2L8 14" /></>,
};

function Icon({ name, className }: { name: IconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
}

const dockLinks: Array<{ label: string; icon: IconName }> = [
  { label: 'Today', icon: 'today' },
  { label: 'Explore', icon: 'explore' },
  { label: 'Saved', icon: 'saved' },
  { label: 'You', icon: 'profile' },
];

const drawerLinks: Array<{ label: string; icon: IconName }> = [
  ...dockLinks,
  { label: 'Neighborhoods', icon: 'neighborhoods' },
  { label: 'Preferences', icon: 'settings' },
  { label: 'Help & tips', icon: 'help' },
];

const favoriteLinks: Array<{ label: string; icon: IconName }> = [
  { label: 'Coffee and bakeries', icon: 'coffee' },
  { label: 'Miradouros and views', icon: 'view' },
  { label: 'Neighborhood walks', icon: 'walk' },
  { label: 'Lunch and dinner', icon: 'lunch' },
  { label: 'Local markets', icon: 'neighborhoods' },
  { label: 'Saved recommendations', icon: 'saved' },
  { label: 'Weekend events', icon: 'help' },
];

const planningLinks: Array<{ label: string; icon: IconName }> = [
  { label: 'Getting around', icon: 'explore' },
  { label: 'Day trips', icon: 'brand' },
  { label: 'Rainy-day ideas', icon: 'sun' },
  { label: 'Museums and galleries', icon: 'profile' },
  { label: 'Hidden courtyards', icon: 'today' },
];

const stops: Array<{ time: string; place: string; note: string; icon: IconName }> = [
  { time: '09:00', place: 'Hello, Kristof', note: 'Coffee and something sweet', icon: 'coffee' },
  { time: '10:30', place: 'Wander through Alfama', note: 'Take the little streets uphill', icon: 'walk' },
  { time: '12:45', place: 'Lunch at Prado', note: 'A table in the garden', icon: 'lunch' },
  { time: '15:00', place: 'São Pedro viewpoint', note: 'Stay for the golden hour', icon: 'view' },
];

function Demo() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('Today');

  const select = (label: string) => {
    setActive(label);
    setOpen(false);
  };

  return (
    <>
      <main className="demo-page">
        <header className="demo-topbar">
          <div className="demo-brand">
            <span className="demo-brand-mark"><Icon name="brand" /></span>
            <span>Morrow</span>
          </div>
          <span className="demo-avatar" aria-label="Your profile">M</span>
        </header>

        <section className="demo-hero" aria-labelledby="demo-title">
          <p className="demo-eyebrow">A weekend, well spent</p>
          <h1 className="demo-title" id="demo-title">Lisbon, at your own pace.</h1>
          <p className="demo-intro">A little less rushing. A few more favorite places. Your Saturday is already taking shape.</p>
        </section>

        <section className="demo-feature" aria-label="Today's weather in Lisbon">
          <div className="demo-feature-copy">
            <span className="demo-feature-label">Today’s outlook · Lisbon</span>
            <h2>Start slow.<br />Stay curious.</h2>
          </div>
          <div className="demo-feature-weather">
            <Icon name="sun" className="demo-sun" />
            <strong>22°</strong>
            <span>Sunny</span>
          </div>
        </section>

        <section className="demo-itinerary" aria-labelledby="itinerary-title">
          <div className="demo-section-heading">
            <div>
              <p className="demo-section-label">The plan</p>
              <h2 id="itinerary-title">A day, mapped out</h2>
            </div>
            <span className="demo-stop-count">4 easy stops</span>
          </div>
          <div className="demo-stops">
            {stops.map(stop => (
              <article className="demo-stop" key={stop.time}>
                <time className="demo-stop-time">{stop.time}</time>
                <span className="demo-stop-icon"><Icon name={stop.icon} /></span>
                <div className="demo-stop-copy"><strong>{stop.place}</strong><span>{stop.note}</span></div>
              </article>
            ))}
          </div>
        </section>

        <p className="demo-hint"><Icon name="swipe" /> Drag the handle or tap it to open your full guide.</p>
      </main>

      <Dockshift
        open={open}
        onOpenChange={setOpen}
        title="Your Lisbon guide"
        description="Choose a place to explore."
        handleLabel={open ? 'Close navigation drawer' : 'Open navigation drawer'}
        dockLabel="Quick navigation"
        classNames={{ sheet: 'demo-sheet' }}
        dock={(
          <div className="demo-dock-items">
            {dockLinks.map(item => (
              <button
                className={`demo-dock-item${active === item.label ? ' is-active' : ''}`}
                type="button"
                key={item.label}
                aria-current={active === item.label ? 'page' : undefined}
                onClick={() => select(item.label)}
              >
                <span className="demo-dock-icon"><Icon name={item.icon} /></span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      >
        <div className="demo-drawer">
          <header className="demo-drawer-heading">
            <span className="demo-drawer-mark"><Icon name="brand" /></span>
          <div className="demo-drawer-heading-copy"><span>MORROW · CITY GUIDE</span><strong>Your Lisbon guide</strong></div>
          </header>
          <nav className="demo-drawer-links" aria-label="All destinations">
            <p>QUICK NAVIGATION</p>
            {drawerLinks.slice(0, dockLinks.length).map(item => (
              <button className={`demo-drawer-link${active === item.label ? ' is-active' : ''}`} type="button" key={item.label} onClick={() => select(item.label)}>
                <span className="demo-drawer-link-icon"><Icon name={item.icon} /></span>
                <span>{item.label}</span>
                {active === item.label && <span className="demo-current">Now</span>}
              </button>
            ))}
            <p className="demo-drawer-group">YOUR GUIDE</p>
            {drawerLinks.slice(dockLinks.length).map(item => (
              <button className={`demo-drawer-link${active === item.label ? ' is-active' : ''}`} type="button" key={item.label} onClick={() => select(item.label)}>
                <span className="demo-drawer-link-icon"><Icon name={item.icon} /></span>
                <span>{item.label}</span>
                {active === item.label && <span className="demo-current">Now</span>}
              </button>
            ))}
            <p className="demo-drawer-group">LOCAL FAVORITES</p>
            {favoriteLinks.map(item => (
              <button className={`demo-drawer-link${active === item.label ? ' is-active' : ''}`} type="button" key={item.label} onClick={() => select(item.label)}>
                <span className="demo-drawer-link-icon"><Icon name={item.icon} /></span>
                <span>{item.label}</span>
                {active === item.label && <span className="demo-current">Now</span>}
              </button>
            ))}
            <p className="demo-drawer-group">PLAN YOUR DAY</p>
            {planningLinks.map(item => (
              <button className={`demo-drawer-link${active === item.label ? ' is-active' : ''}`} type="button" key={item.label} onClick={() => select(item.label)}>
                <span className="demo-drawer-link-icon"><Icon name={item.icon} /></span>
                <span>{item.label}</span>
                {active === item.label && <span className="demo-current">Now</span>}
              </button>
            ))}
          </nav>
          <footer className="demo-drawer-footer"><Icon name="sun" /> Four lovely stops, all at your own pace.</footer>
        </div>
      </Dockshift>
    </>
  );
}

// Wide screens get the showcase, which loads this same page with ?embed inside its phone
const embedded = new URLSearchParams(window.location.search).has('embed');
const showcaseQuery = '(min-width: 900px) and (min-height: 600px)';

if (embedded) document.documentElement.classList.add('is-embedded');

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function Root() {
  const wide = useMediaQuery(showcaseQuery);
  return !embedded && wide ? <Showcase /> : <Demo />;
}

createRoot(document.getElementById('root')!).render(<Root />);
