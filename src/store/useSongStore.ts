import { useContext } from 'react';
import { SongStoreContext, type SongStore } from './SongStoreContext';

export function useSongStore(): SongStore {
  const ctx = useContext(SongStoreContext);
  if (!ctx) throw new Error('useSongStore must be used inside SongStoreProvider');
  return ctx;
}
