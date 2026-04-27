import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Pitch, Song } from '../types';
import { initialSongs } from '../data/mockData';
import { SongStoreContext, type SongStore } from './SongStoreContext';

export function SongStoreProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);

  const upsertPitch = useCallback((songId: string, pitch: Pitch) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, pitch, status: 'pitched' } : s)),
    );
  }, []);

  const removePitch = useCallback((songId: string) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, pitch: undefined, status: 'new' } : s)),
    );
  }, []);

  const value = useMemo<SongStore>(
    () => ({ songs, upsertPitch, removePitch }),
    [songs, upsertPitch, removePitch],
  );

  return <SongStoreContext.Provider value={value}>{children}</SongStoreContext.Provider>;
}
