import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon, type IconName } from './icons';
import { collections, exploreFilters, helpTopics, neighborhoods, places, type Place } from './content';
import { accents, type Appearance, type DemoConfig } from './theme';

export type Pace = 'slow' | 'balanced' | 'full';

export type Preferences = {
  pace: Pace;
  celsius: boolean;
  fewerStairs: boolean;
  vegetarian: boolean;
  reminders: boolean;
};

export type PageProps = {
  go: (route: string) => void;
  back?: () => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  prefs: Preferences;
  setPrefs: (next: Partial<Preferences>) => void;
  config: DemoConfig;
  updateConfig: (next: Partial<DemoConfig>) => void;
};

type Stop = { time: string; place: string; note: string; icon: IconName };

const stopsByPace: Record<Pace, Stop[]> = {
  slow: [
    { time: '09:30', place: 'Hello, Kristof', note: 'Coffee, and no hurry at all', icon: 'coffee' },
    { time: '12:30', place: 'Lunch at Prado', note: 'A table in the garden', icon: 'lunch' },
    { time: '17:00', place: 'São Pedro viewpoint', note: 'Stay for the golden hour', icon: 'view' },
  ],
  balanced: [
    { time: '09:00', place: 'Hello, Kristof', note: 'Coffee and something sweet', icon: 'coffee' },
    { time: '10:30', place: 'Wander through Alfama', note: 'Take the little streets uphill', icon: 'walk' },
    { time: '12:45', place: 'Lunch at Prado', note: 'A table in the garden', icon: 'lunch' },
    { time: '15:00', place: 'São Pedro viewpoint', note: 'Stay for the golden hour', icon: 'view' },
  ],
  full: [
    { time: '08:30', place: 'Manteigaria', note: 'Pastéis de nata, still warm', icon: 'coffee' },
    { time: '09:30', place: 'Wander through Alfama', note: 'Take the little streets uphill', icon: 'walk' },
    { time: '11:00', place: 'Feira da Ladra', note: 'Tiles, records and bargains', icon: 'market' },
    { time: '13:00', place: 'Lunch at Prado', note: 'A table in the garden', icon: 'lunch' },
    { time: '15:30', place: 'MAAT', note: 'Walk across the roof first', icon: 'museum' },
    { time: '18:30', place: 'São Pedro viewpoint', note: 'Stay for the golden hour', icon: 'view' },
  ],
};

const paceLabels: Record<Pace, string> = { slow: 'Slow', balanced: 'Balanced', full: 'Full day' };
const countWords = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];

export function stopsFor(prefs: Preferences) {
  return stopsByPace[prefs.pace].map(stop => (
    prefs.fewerStairs && stop.icon === 'walk'
      ? { ...stop, place: 'Tram 28 through Alfama', note: 'Ride up, then stroll back down', icon: 'tram' as IconName }
      : stop
  ));
}

function PageHeader({ eyebrow, title, intro, back }: { eyebrow: string; title: string; intro?: string; back?: () => void }) {
  return (
    <header className="demo-page-header">
      {back && (
        <button className="demo-back" type="button" onClick={back}>
          <Icon name="back" /> Back
        </button>
      )}
      <p className="demo-eyebrow">{eyebrow}</p>
      <h1 className="demo-page-title">{title}</h1>
      {intro && <p className="demo-intro">{intro}</p>}
    </header>
  );
}

function SaveButton({ place, saved, toggleSaved }: { place: Place; saved: string[]; toggleSaved: PageProps['toggleSaved'] }) {
  const isSaved = saved.includes(place.id);
  return (
    <button
      className={`demo-save${isSaved ? ' is-saved' : ''}`}
      type="button"
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${place.name} from saved` : `Save ${place.name}`}
      onClick={() => toggleSaved(place.id)}
    >
      <Icon name="saved" filled={isSaved} />
    </button>
  );
}

function PlaceList({ items, saved, toggleSaved, showHood = true }: { items: Place[]; saved: string[]; toggleSaved: PageProps['toggleSaved']; showHood?: boolean }) {
  return (
    <ul className="demo-places">
      {items.map(place => (
        <li className="demo-place" key={place.id}>
          <span className="demo-stop-icon"><Icon name={place.icon} /></span>
          <div className="demo-place-copy">
            <strong>{place.name}</strong>
            <span>{[place.when, showHood ? place.hood : undefined, place.when ? undefined : place.note].filter(Boolean).join(' · ')}</span>
          </div>
          <SaveButton place={place} saved={saved} toggleSaved={toggleSaved} />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="demo-empty">
      <span className="demo-empty-icon"><Icon name={icon} /></span>
      <strong>{title}</strong>
      <p>{body}</p>
      {action}
    </div>
  );
}

export function TodayPage({ prefs, go }: PageProps) {
  const stops = stopsFor(prefs);
  const temperature = prefs.celsius ? '22°' : '72°';

  return (
    <>
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
          <strong>{temperature}</strong>
          <span>Sunny</span>
        </div>
      </section>

      <section className="demo-itinerary" aria-labelledby="itinerary-title">
        <div className="demo-section-heading">
          <div>
            <p className="demo-section-label">The plan</p>
            <h2 id="itinerary-title">A day, mapped out</h2>
          </div>
          <button className="demo-stop-count" type="button" onClick={() => go('Preferences')}>
            {countWords[stops.length]} {prefs.pace === 'full' ? 'busy' : 'easy'} stops
          </button>
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
    </>
  );
}

export function ExplorePage({ saved, toggleSaved }: PageProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const results = useMemo(() => {
    const tag = exploreFilters.find(item => item.label === filter)?.tag;
    const needle = query.trim().toLocaleLowerCase();
    return places.filter(place => (
      (!tag || place.tags.includes(tag))
      && (!needle || `${place.name} ${place.hood} ${place.note}`.toLocaleLowerCase().includes(needle))
    ));
  }, [query, filter]);

  return (
    <>
      <PageHeader eyebrow="Explore" title="Find your next place." />
      <label className="demo-search">
        <Icon name="search" />
        <input type="search" placeholder="Cafés, views, neighborhoods" value={query} onChange={event => setQuery(event.target.value)} />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" /></button>
        )}
      </label>
      <div className="demo-chips" role="group" aria-label="Filter places" data-dockshift-no-drag>
        {exploreFilters.map(item => (
          <button
            className={`demo-chip${filter === item.label ? ' is-active' : ''}`}
            type="button"
            key={item.label}
            aria-pressed={filter === item.label}
            onClick={() => setFilter(item.label)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-result-count" aria-live="polite">{results.length} {results.length === 1 ? 'place' : 'places'}</p>
      {results.length > 0
        ? <PlaceList items={results} saved={saved} toggleSaved={toggleSaved} />
        : (
          <EmptyState
            icon="search"
            title="Nothing matches yet"
            body="Try a neighborhood, like Alfama, or clear the filters."
            action={<button className="demo-button" type="button" onClick={() => { setQuery(''); setFilter('All'); }}>Clear filters</button>}
          />
        )}
    </>
  );
}

export function SavedPage({ saved, toggleSaved, go }: PageProps) {
  const items = saved.map(id => places.find(place => place.id === id)).filter((place): place is Place => Boolean(place));

  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Your shortlist."
        intro={items.length ? `${items.length} ${items.length === 1 ? 'place' : 'places'} you want to get to this weekend.` : undefined}
      />
      {items.length > 0
        ? <PlaceList items={items} saved={saved} toggleSaved={toggleSaved} />
        : (
          <EmptyState
            icon="saved"
            title="Nothing saved yet"
            body="Tap the bookmark on any place and it will wait for you here."
            action={<button className="demo-button" type="button" onClick={() => go('Explore')}>Explore places</button>}
          />
        )}
    </>
  );
}

export function YouPage({ go, saved, prefs }: PageProps) {
  const links: Array<{ label: string; icon: IconName; detail: string }> = [
    { label: 'Saved', icon: 'saved', detail: `${saved.length} ${saved.length === 1 ? 'place' : 'places'}` },
    { label: 'Neighborhoods', icon: 'neighborhoods', detail: `${neighborhoods.length} areas` },
    { label: 'Preferences', icon: 'settings', detail: paceLabels[prefs.pace] },
    { label: 'Help & tips', icon: 'help', detail: '' },
  ];

  return (
    <>
      <section className="demo-profile">
        <span className="demo-profile-avatar" aria-hidden="true">M</span>
        <div>
          <h1 className="demo-page-title">Marta</h1>
          <p>In Lisbon · Friday to Sunday</p>
        </div>
      </section>
      <dl className="demo-stats">
        <div><dt>Saved</dt><dd>{saved.length}</dd></div>
        <div><dt>Stops</dt><dd>{stopsFor(prefs).length}</dd></div>
        <div><dt>Pace</dt><dd>{paceLabels[prefs.pace]}</dd></div>
      </dl>
      <nav className="demo-menu" aria-label="Your account">
        {links.map(link => (
          <button className="demo-menu-row" type="button" key={link.label} onClick={() => go(link.label)}>
            <span className="demo-drawer-link-icon"><Icon name={link.icon} /></span>
            <span>{link.label}</span>
            {link.detail && <span className="demo-menu-detail">{link.detail}</span>}
            <Icon name="chevron" className="demo-chevron" />
          </button>
        ))}
      </nav>
    </>
  );
}

export function NeighborhoodsPage({ go, back }: PageProps) {
  return (
    <>
      <PageHeader eyebrow="Your guide" title="Neighborhoods" intro="Five corners of the city, each with its own pace." back={back} />
      <div className="demo-hoods">
        {neighborhoods.map(hood => {
          const count = places.filter(place => place.hood === hood.name).length;
          return (
            <button className="demo-hood" type="button" key={hood.name} onClick={() => go(hood.name)} style={{ '--hood-tone': hood.tone } as CSSProperties}>
              <span className="demo-hood-swatch" aria-hidden="true"><Icon name="neighborhoods" /></span>
              <span className="demo-hood-copy">
                <strong>{hood.name}</strong>
                <span>{hood.blurb}</span>
              </span>
              <span className="demo-menu-detail">{count}</span>
              <Icon name="chevron" className="demo-chevron" />
            </button>
          );
        })}
      </div>
    </>
  );
}

function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="demo-toggle-row">
      <span className="demo-toggle-copy"><strong>{label}</strong><span>{detail}</span></span>
      <input className="demo-toggle" type="checkbox" role="switch" checked={checked} onChange={event => onChange(event.target.checked)} />
    </label>
  );
}

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (next: T) => void }) {
  return (
    <div className="demo-segmented" role="radiogroup" aria-label={label} data-dockshift-no-drag>
      {options.map(option => (
        <button
          type="button"
          role="radio"
          key={option.value}
          aria-checked={value === option.value}
          className={value === option.value ? 'is-active' : undefined}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function AccentPicker({ value, onChange }: { value: string; onChange: (accent: string) => void }) {
  return (
    <div className="demo-swatches" role="radiogroup" aria-label="Accent color" data-dockshift-no-drag>
      {accents.map(accent => (
        <button
          className="demo-swatch"
          type="button"
          role="radio"
          key={accent.id}
          aria-checked={value === accent.id}
          aria-label={accent.label}
          title={accent.label}
          style={{ '--swatch': accent.color } as CSSProperties}
          onClick={() => onChange(accent.id)}
        />
      ))}
    </div>
  );
}

const appearanceOptions: Array<{ value: Appearance; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function PreferencesPage({ prefs, setPrefs, back, config, updateConfig }: PageProps) {
  return (
    <>
      <PageHeader eyebrow="Your guide" title="Preferences" intro="Changes apply straight away. Have a look at Today afterwards." back={back} />

      <section className="demo-settings-group">
        <h2>Pace</h2>
        <Segmented
          label="Pace"
          value={prefs.pace}
          options={(Object.keys(paceLabels) as Pace[]).map(pace => ({ value: pace, label: paceLabels[pace] }))}
          onChange={pace => setPrefs({ pace })}
        />
        <p className="demo-settings-note">{countWords[stopsFor(prefs).length].replace(/^./, letter => letter.toUpperCase())} stops on today’s plan.</p>
      </section>

      <section className="demo-settings-group">
        <h2>Getting around</h2>
        <Toggle label="Fewer stairs" detail="Swap steep walks for trams and lifts" checked={prefs.fewerStairs} onChange={fewerStairs => setPrefs({ fewerStairs })} />
        <Toggle label="Vegetarian picks first" detail="Lead with meat-free menus" checked={prefs.vegetarian} onChange={vegetarian => setPrefs({ vegetarian })} />
      </section>

      <section className="demo-settings-group">
        <h2>Appearance</h2>
        <Segmented label="Appearance" value={config.appearance} options={appearanceOptions} onChange={appearance => updateConfig({ appearance })} />
        <div className="demo-setting-row">
          <span className="demo-toggle-copy"><strong>Accent</strong><span>Colors the dock, links and buttons</span></span>
          <AccentPicker value={config.accent} onChange={accent => updateConfig({ accent })} />
        </div>
      </section>

      <section className="demo-settings-group">
        <h2>Display</h2>
        <Segmented
          label="Temperature"
          value={prefs.celsius ? 'c' : 'f'}
          options={[{ value: 'c', label: 'Celsius' }, { value: 'f', label: 'Fahrenheit' }]}
          onChange={unit => setPrefs({ celsius: unit === 'c' })}
        />
        <Toggle label="Morning reminder" detail="A gentle nudge at 08:30 with the day’s plan" checked={prefs.reminders} onChange={reminders => setPrefs({ reminders })} />
      </section>
    </>
  );
}

export function HelpPage({ back }: PageProps) {
  return (
    <>
      <PageHeader eyebrow="Your guide" title="Help & tips" intro="Everything this little guide can do." back={back} />
      <div className="demo-faq">
        {helpTopics.map((topic, index) => (
          <details key={topic.question} open={index === 0}>
            <summary>{topic.question}<Icon name="chevron" className="demo-chevron" /></summary>
            <p>{topic.answer}</p>
          </details>
        ))}
      </div>
    </>
  );
}

export function CollectionPage({ route, saved, toggleSaved, back }: PageProps & { route: string }) {
  const collection = collections[route];
  const items = places.filter(collection.match);

  return (
    <>
      <PageHeader eyebrow={collection.eyebrow} title={collection.title} intro={collection.intro} back={back} />
      <p className="demo-result-count">{items.length} {items.length === 1 ? 'place' : 'places'}</p>
      <PlaceList items={items} saved={saved} toggleSaved={toggleSaved} showHood={collection.eyebrow !== 'Neighborhood'} />
    </>
  );
}

export function hasCollection(route: string) {
  return route in collections;
}
