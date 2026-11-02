import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Dockshift } from '@itsneufox/dockshift';
import { Icon, type IconName } from './icons';
import {
  CollectionPage, ExplorePage, HelpPage, NeighborhoodsPage, PreferencesPage, SavedPage, TodayPage, YouPage,
  hasCollection, type PageProps, type Preferences,
} from './pages';
import { initialSaved } from './content';
import { dockshiftSizing, loadConfig, postConfig, saveConfig, useApplyConfig, useConfigMessages, type DemoConfig } from './theme';
import { Showcase } from './showcase';
import '../src/styles.css';
import './demo.css';

type Link = { label: string; icon: IconName; route?: string };

const dockLinks: Link[] = [
  { label: 'Today', icon: 'today' },
  { label: 'Explore', icon: 'explore' },
  { label: 'Saved', icon: 'saved' },
  { label: 'You', icon: 'profile' },
];

const guideLinks: Link[] = [
  { label: 'Neighborhoods', icon: 'neighborhoods' },
  { label: 'Preferences', icon: 'settings' },
  { label: 'Help & tips', icon: 'help' },
];

const favoriteLinks: Link[] = [
  { label: 'Coffee and bakeries', icon: 'coffee' },
  { label: 'Miradouros and views', icon: 'view' },
  { label: 'Neighborhood walks', icon: 'walk' },
  { label: 'Lunch and dinner', icon: 'lunch' },
  { label: 'Local markets', icon: 'market' },
  { label: 'Saved recommendations', icon: 'saved', route: 'Saved' },
  { label: 'Weekend events', icon: 'calendar' },
];

const planningLinks: Link[] = [
  { label: 'Getting around', icon: 'tram' },
  { label: 'Day trips', icon: 'train' },
  { label: 'Rainy-day ideas', icon: 'rain' },
  { label: 'Museums and galleries', icon: 'museum' },
  { label: 'Hidden courtyards', icon: 'leaf' },
];

const drawerGroups: Array<{ title: string; links: Link[] }> = [
  { title: 'QUICK NAVIGATION', links: dockLinks },
  { title: 'YOUR GUIDE', links: guideLinks },
  { title: 'LOCAL FAVORITES', links: favoriteLinks },
  { title: 'PLAN YOUR DAY', links: planningLinks },
];

const initialPrefs: Preferences = { pace: 'balanced', celsius: true, fewerStairs: false, vegetarian: false, reminders: true };

// Wide screens get the showcase, which loads this same page with ?embed inside its phone
const embedded = new URLSearchParams(window.location.search).has('embed');
const showcaseQuery = '(min-width: 900px) and (min-height: 600px)';

if (embedded) document.documentElement.classList.add('is-embedded');

function Page({ route, ...props }: PageProps & { route: string }) {
  switch (route) {
    case 'Today': return <TodayPage {...props} />;
    case 'Explore': return <ExplorePage {...props} />;
    case 'Saved': return <SavedPage {...props} />;
    case 'You': return <YouPage {...props} />;
    case 'Neighborhoods': return <NeighborhoodsPage {...props} />;
    case 'Preferences': return <PreferencesPage {...props} />;
    case 'Help & tips': return <HelpPage {...props} />;
    default: return hasCollection(route) ? <CollectionPage route={route} {...props} /> : <TodayPage {...props} />;
  }
}

function Demo() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(['Today']);
  const [saved, setSaved] = useState<string[]>(initialSaved);
  const [prefs, setPrefsState] = useState<Preferences>(initialPrefs);
  const [config, setConfig] = useState<DemoConfig>(loadConfig);
  const route = history[history.length - 1];

  useApplyConfig(config);
  useConfigMessages(useCallback((next: DemoConfig) => setConfig(next), []));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route]);

  const go = (target: string) => {
    setOpen(false);
    if (target === route) return;
    // The dock's destinations are top level, so they start a fresh trail
    setHistory(dockLinks.some(link => link.label === target) ? [target] : [...history, target]);
  };

  const back = history.length > 1 ? () => setHistory(history.slice(0, -1)) : undefined;

  const toggleSaved = (id: string) => setSaved(current => (
    current.includes(id) ? current.filter(item => item !== id) : [...current, id]
  ));

  const updateConfig = (next: Partial<DemoConfig>) => {
    const merged = { ...config, ...next };
    setConfig(merged);
    if (embedded) postConfig(window.parent, merged);
    else saveConfig(merged);
  };

  const pageProps: PageProps = {
    go,
    back,
    saved,
    toggleSaved,
    prefs,
    setPrefs: next => setPrefsState(current => ({ ...current, ...next })),
    config,
    updateConfig,
  };

  const sizing = dockshiftSizing(config);
  const isCurrent = (link: Link) => (link.route ?? link.label) === route;

  return (
    <>
      <main className="demo-page">
        <header className="demo-topbar">
          <button className="demo-brand" type="button" onClick={() => go('Today')}>
            <span className="demo-brand-mark"><Icon name="brand" /></span>
            <span>Morrow</span>
          </button>
          <button className="demo-avatar" type="button" aria-label="Your profile" onClick={() => go('You')}>M</button>
        </header>

        <div className="demo-view" key={route}>
          <Page route={route} {...pageProps} />
        </div>
      </main>

      <Dockshift
        open={open}
        onOpenChange={setOpen}
        title="Your Lisbon guide"
        description="Choose a place to explore."
        handleLabel={open ? 'Close navigation drawer' : 'Open navigation drawer'}
        dockLabel="Quick navigation"
        classNames={{ sheet: 'demo-sheet' }}
        dockHeight={sizing.dockHeight}
        collapsedHeight={sizing.collapsedHeight}
        style={sizing.style}
        dock={(
          <div className="demo-dock-items">
            {dockLinks.map(item => (
              <button
                className={`demo-dock-item${isCurrent(item) ? ' is-active' : ''}`}
                type="button"
                key={item.label}
                aria-current={isCurrent(item) ? 'page' : undefined}
                onClick={() => go(item.label)}
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
            {drawerGroups.map((group, index) => (
              <div className="demo-drawer-section" key={group.title}>
                <p className={index > 0 ? 'demo-drawer-group' : undefined}>{group.title}</p>
                {group.links.map(item => (
                  <button
                    className={`demo-drawer-link${isCurrent(item) ? ' is-active' : ''}`}
                    type="button"
                    key={item.label}
                    aria-current={isCurrent(item) ? 'page' : undefined}
                    onClick={() => go(item.route ?? item.label)}
                  >
                    <span className="demo-drawer-link-icon"><Icon name={item.icon} /></span>
                    <span>{item.label}</span>
                    {isCurrent(item) && <span className="demo-current">Now</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <footer className="demo-drawer-footer"><Icon name="saved" /> {saved.length} {saved.length === 1 ? 'place' : 'places'} saved for the weekend.</footer>
        </div>
      </Dockshift>
    </>
  );
}

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
