import type { IconName } from './icons';

export type Tag = 'coffee' | 'view' | 'walk' | 'food' | 'market' | 'museum' | 'courtyard' | 'daytrip' | 'transport' | 'rainy' | 'event';

export type Place = {
  id: string;
  name: string;
  hood: string;
  note: string;
  icon: IconName;
  tags: Tag[];
  when?: string;
};

export const places: Place[] = [
  { id: 'kristof', name: 'Hello, Kristof', hood: 'Cais do Sodré', note: 'Flat whites and magazines by the window', icon: 'coffee', tags: ['coffee'] },
  { id: 'manteigaria', name: 'Manteigaria', hood: 'Baixa & Chiado', note: 'Pastéis de nata, still warm', icon: 'coffee', tags: ['coffee'] },
  { id: 'fabrica', name: 'Fábrica Coffee Roasters', hood: 'Baixa & Chiado', note: 'Roasted on site, quiet back room', icon: 'coffee', tags: ['coffee', 'rainy'] },
  { id: 'senhora-monte', name: 'Senhora do Monte', hood: 'Alfama & Graça', note: 'The highest view in the city', icon: 'view', tags: ['view'] },
  { id: 'sao-pedro', name: 'São Pedro de Alcântara', hood: 'Bairro Alto', note: 'Golden hour over the castle', icon: 'view', tags: ['view', 'event'], when: 'Daily · 19:30' },
  { id: 'portas-sol', name: 'Portas do Sol', hood: 'Alfama & Graça', note: 'Rooftops tumbling to the river', icon: 'view', tags: ['view'] },
  { id: 'santa-catarina', name: 'Santa Catarina', hood: 'Bairro Alto', note: 'A lawn, a kiosk and the bridge', icon: 'view', tags: ['view'] },
  { id: 'alfama-loop', name: 'Alfama, uphill and back', hood: 'Alfama & Graça', note: 'Ninety minutes of stairs and alleys', icon: 'walk', tags: ['walk'] },
  { id: 'river-belem', name: 'Along the river to Belém', hood: 'Belém', note: 'Flat, breezy, about two hours', icon: 'walk', tags: ['walk'] },
  { id: 'principe-loop', name: 'Príncipe Real garden loop', hood: 'Bairro Alto', note: 'Shops, a giant cedar and shade', icon: 'walk', tags: ['walk'] },
  { id: 'prado', name: 'Prado', hood: 'Baixa & Chiado', note: 'Seasonal plates, natural wine', icon: 'lunch', tags: ['food'] },
  { id: 'time-out', name: 'Mercado da Ribeira', hood: 'Cais do Sodré', note: 'A little of everything, under one roof', icon: 'lunch', tags: ['food', 'market', 'rainy'] },
  { id: 'ramiro', name: 'Cervejaria Ramiro', hood: 'Baixa & Chiado', note: 'Seafood, then a steak sandwich', icon: 'lunch', tags: ['food'] },
  { id: 'taberna', name: 'Taberna da Rua das Flores', hood: 'Baixa & Chiado', note: 'Small room, chalkboard menu', icon: 'lunch', tags: ['food'] },
  { id: 'ladra', name: 'Feira da Ladra', hood: 'Alfama & Graça', note: 'Flea market of tiles and records', icon: 'market', tags: ['market', 'event'], when: 'Saturday · 09:00' },
  { id: 'campo-ourique', name: 'Mercado de Campo de Ourique', hood: 'Bairro Alto', note: 'Fruit stalls by day, tables by night', icon: 'market', tags: ['market'] },
  { id: 'lx-sunday', name: 'LX Factory Sunday market', hood: 'Belém', note: 'Makers, vinyl and a giant bookshop', icon: 'market', tags: ['market', 'event', 'rainy'], when: 'Sunday · 10:00' },
  { id: 'gulbenkian', name: 'Gulbenkian Museum', hood: 'Avenidas Novas', note: 'A garden with a museum in it', icon: 'museum', tags: ['museum', 'rainy'] },
  { id: 'maat', name: 'MAAT', hood: 'Belém', note: 'Walk over the roof, then go inside', icon: 'museum', tags: ['museum'] },
  { id: 'azulejo', name: 'National Tile Museum', hood: 'Alfama & Graça', note: 'Five centuries of blue and white', icon: 'museum', tags: ['museum', 'rainy'] },
  { id: 'torel', name: 'Jardim do Torel', hood: 'Baixa & Chiado', note: 'A hidden garden above Avenida', icon: 'leaf', tags: ['courtyard'] },
  { id: 'cerca-moura', name: 'Cerca Moura', hood: 'Alfama & Graça', note: 'A terrace behind the old wall', icon: 'leaf', tags: ['courtyard'] },
  { id: 'principe-garden', name: 'Príncipe Real garden', hood: 'Bairro Alto', note: 'Under the great cedar’s shade', icon: 'leaf', tags: ['courtyard'] },
  { id: 'fado', name: 'Fado in Alfama', hood: 'Alfama & Graça', note: 'Small tavern, candles, no microphones', icon: 'music', tags: ['event', 'rainy'], when: 'Saturday · 21:30' },
  { id: 'sintra', name: 'Sintra', hood: 'Day trip', note: '40 minutes by train from Rossio', icon: 'train', tags: ['daytrip'] },
  { id: 'cascais', name: 'Cascais', hood: 'Day trip', note: 'Seaside town, 40 minutes along the coast', icon: 'train', tags: ['daytrip'] },
  { id: 'arrabida', name: 'Arrábida', hood: 'Day trip', note: 'Clear water beaches south of the river', icon: 'sun', tags: ['daytrip'] },
  { id: 'tram-28', name: 'Tram 28', hood: 'Getting around', note: 'Ride it early, before the queues', icon: 'tram', tags: ['transport'] },
  { id: 'ferry', name: 'Ferry to Cacilhas', hood: 'Getting around', note: 'Ten minutes across, best view back', icon: 'route', tags: ['transport'] },
  { id: 'viva', name: 'Viva Viagem card', hood: 'Getting around', note: 'One card for metro, trams and ferries', icon: 'route', tags: ['transport'] },
];

export const initialSaved = ['manteigaria', 'senhora-monte', 'fado'];

export type Collection = { eyebrow: string; title: string; intro: string; icon: IconName; match: (place: Place) => boolean };

const byTag = (tag: Tag) => (place: Place) => place.tags.includes(tag);
const byHood = (hood: string) => (place: Place) => place.hood === hood;

export const collections: Record<string, Collection> = {
  'Coffee and bakeries': { eyebrow: 'Local favorites', title: 'Coffee and bakeries', intro: 'Somewhere to start slow, and something sweet to go with it.', icon: 'coffee', match: byTag('coffee') },
  'Miradouros and views': { eyebrow: 'Local favorites', title: 'Miradouros and views', intro: 'Seven hills means plenty of places to stop and look back.', icon: 'view', match: byTag('view') },
  'Neighborhood walks': { eyebrow: 'Local favorites', title: 'Neighborhood walks', intro: 'Comfortable shoes. The best routes go up before they come down.', icon: 'walk', match: byTag('walk') },
  'Lunch and dinner': { eyebrow: 'Local favorites', title: 'Lunch and dinner', intro: 'Long lunches and late dinners, the Lisbon way.', icon: 'lunch', match: byTag('food') },
  'Local markets': { eyebrow: 'Local favorites', title: 'Local markets', intro: 'Tiles, vinyl, fruit and a bit of everything else.', icon: 'market', match: byTag('market') },
  'Weekend events': { eyebrow: 'Local favorites', title: 'Weekend events', intro: 'What’s on this Saturday and Sunday.', icon: 'calendar', match: byTag('event') },
  'Getting around': { eyebrow: 'Plan your day', title: 'Getting around', intro: 'Trams, ferries and one card that covers them all.', icon: 'tram', match: byTag('transport') },
  'Day trips': { eyebrow: 'Plan your day', title: 'Day trips', intro: 'Easy escapes, all under an hour away.', icon: 'train', match: byTag('daytrip') },
  'Rainy-day ideas': { eyebrow: 'Plan your day', title: 'Rainy-day ideas', intro: 'Rain is rare here, but these are lovely anyway.', icon: 'rain', match: byTag('rainy') },
  'Museums and galleries': { eyebrow: 'Plan your day', title: 'Museums and galleries', intro: 'Tiles, gardens and a rooftop you can walk across.', icon: 'museum', match: byTag('museum') },
  'Hidden courtyards': { eyebrow: 'Plan your day', title: 'Hidden courtyards', intro: 'Quiet gardens and terraces most people walk right past.', icon: 'leaf', match: byTag('courtyard') },
};

export const neighborhoods: Array<{ name: string; blurb: string; tone: string }> = [
  { name: 'Alfama & Graça', blurb: 'The oldest streets, fado and the best views.', tone: '#c9785a' },
  { name: 'Baixa & Chiado', blurb: 'Grand squares, bookshops and pastry counters.', tone: '#c9a35a' },
  { name: 'Bairro Alto', blurb: 'Quiet by day, lively by night, gardens on top.', tone: '#6d8f7a' },
  { name: 'Cais do Sodré', blurb: 'Riverside, the market hall and the ferries.', tone: '#5a7fa3' },
  { name: 'Belém', blurb: 'Monuments, museums and the walk along the river.', tone: '#9a7fb0' },
];

for (const hood of neighborhoods) {
  collections[hood.name] = { eyebrow: 'Neighborhood', title: hood.name, intro: hood.blurb, icon: 'neighborhoods', match: byHood(hood.name) };
}

export const exploreFilters: Array<{ label: string; tag?: Tag }> = [
  { label: 'All' },
  { label: 'Coffee', tag: 'coffee' },
  { label: 'Views', tag: 'view' },
  { label: 'Food', tag: 'food' },
  { label: 'Walks', tag: 'walk' },
  { label: 'Markets', tag: 'market' },
  { label: 'Museums', tag: 'museum' },
];

export const helpTopics: Array<{ question: string; answer: string }> = [
  { question: 'How do I open the full guide?', answer: 'Drag the handle above the dock upwards, or tap it. You can start the drag from anywhere on the dock.' },
  { question: 'How do I close it again?', answer: 'Drag the drawer down, tap the handle, tap outside it, or press Escape.' },
  { question: 'How do I save a place?', answer: 'Tap the bookmark next to any place. Everything you save collects under Saved in the dock.' },
  { question: 'Can I change how busy my day is?', answer: 'Yes. Pick a pace in Preferences, and the plan on Today adjusts how many stops it suggests.' },
];
