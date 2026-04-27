import type { Manager, Song, Songwriter } from '../types';

export const manager: Manager = {
  id: 'mgr-1',
  name: 'Alex Rivera',
  initials: 'AR',
};

export const songwriters: Songwriter[] = [
  { id: 'sw-1', name: 'Sarah Johnson', initials: 'SJ', hue: 280 },
  { id: 'sw-2', name: 'Marcus Chen', initials: 'MC', hue: 200 },
  { id: 'sw-3', name: 'Lisa Martinez', initials: 'LM', hue: 340 },
  { id: 'sw-4', name: 'James Wilson', initials: 'JW', hue: 30 },
  { id: 'sw-5', name: 'Nia Okafor', initials: 'NO', hue: 150 },
];

export function getSongwriter(id: string): Songwriter | undefined {
  return songwriters.find((s) => s.id === id);
}

// A simple deterministic "random" waveform generator for mock data.
function makeWaveform(seed: number, length = 64): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < length; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    out.push(0.25 + r * 0.75);
  }
  return out;
}

export const initialSongs: Song[] = [
  {
    id: 'song-1',
    title: 'Summer Nights',
    songwriterId: 'sw-1',
    status: 'new',
    duration: 204,
    uploadedAt: '2026-04-24T10:24:00Z',
    waveform: makeWaveform(11),
  },
  {
    id: 'song-2',
    title: 'Midnight Drive',
    songwriterId: 'sw-2',
    status: 'pitched',
    duration: 252,
    uploadedAt: '2026-04-22T15:10:00Z',
    waveform: makeWaveform(37),
    pitch: {
      tags: ['Synthwave', 'Cinematic', 'Nighttime'],
      description:
        'A pulsing, neon-lit late-night anthem built around an arpeggiated synth and a half-time chorus. We hear this on a road movie soundtrack — equal parts The Weeknd and Tame Impala.',
      targetArtists: ['The Weeknd', 'Tame Impala', 'Dua Lipa'],
      updatedAt: '2026-04-23T09:00:00Z',
    },
  },
  {
    id: 'song-3',
    title: 'Broken Hearts',
    songwriterId: 'sw-3',
    status: 'needs_review',
    duration: 225,
    uploadedAt: '2026-04-20T08:45:00Z',
    waveform: makeWaveform(73),
    pitch: {
      tags: ['Pop', 'Ballad'],
      description: 'Stripped piano demo. Needs a co-writer pass before we send it out.',
      targetArtists: ['Adele'],
      updatedAt: '2026-04-21T12:00:00Z',
    },
  },
  {
    id: 'song-4',
    title: 'Electric Soul',
    songwriterId: 'sw-4',
    status: 'pitched',
    duration: 236,
    uploadedAt: '2026-04-18T17:30:00Z',
    waveform: makeWaveform(101),
    pitch: {
      tags: ['Funk', 'Soul', 'Disco'],
      description:
        'Live-band energy with a slap-bass hook and a horn-stab pre-chorus. Built for a feature collab.',
      targetArtists: ['Bruno Mars', 'Anderson .Paak', 'Doja Cat'],
      updatedAt: '2026-04-19T11:20:00Z',
    },
  },
  {
    id: 'song-5',
    title: 'Golden Hour',
    songwriterId: 'sw-1',
    status: 'new',
    duration: 178,
    uploadedAt: '2026-04-25T07:15:00Z',
    waveform: makeWaveform(151),
  },
  {
    id: 'song-6',
    title: 'Paper Planes',
    songwriterId: 'sw-5',
    status: 'new',
    duration: 198,
    uploadedAt: '2026-04-25T14:02:00Z',
    waveform: makeWaveform(211),
  },
  {
    id: 'song-7',
    title: 'Coastline',
    songwriterId: 'sw-2',
    status: 'needs_review',
    duration: 263,
    uploadedAt: '2026-04-15T11:00:00Z',
    waveform: makeWaveform(257),
  },
  {
    id: 'song-8',
    title: 'Velvet Room',
    songwriterId: 'sw-3',
    status: 'pitched',
    duration: 214,
    uploadedAt: '2026-04-12T09:35:00Z',
    waveform: makeWaveform(307),
    pitch: {
      tags: ['R&B', 'Slow jam'],
      description: 'Late-night R&B groove with a sultry top-line. Strong sync potential.',
      targetArtists: ['SZA', 'H.E.R.'],
      updatedAt: '2026-04-13T16:40:00Z',
    },
  },
];
