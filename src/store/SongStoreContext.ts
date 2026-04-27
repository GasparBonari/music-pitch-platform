import { createContext } from 'react';
import type { Pitch, Song } from '../types';

export interface SongStore {
  songs: Song[];
  upsertPitch: (songId: string, pitch: Pitch) => void;
  removePitch: (songId: string) => void;
}

export const SongStoreContext = createContext<SongStore | null>(null);
