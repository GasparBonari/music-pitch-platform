import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { Dashboard } from './features/dashboard/Dashboard';
import { SongDetail } from './features/song-detail/SongDetail';
import { SongStoreProvider } from './store/SongStoreProvider';

type Route = { name: 'dashboard' } | { name: 'song'; id: string };

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h.startsWith('songs/')) {
    return { name: 'song', id: h.slice('songs/'.length) };
  }
  return { name: 'dashboard' };
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route]);

  return (
    <SongStoreProvider>
      <AppShell>
        {route.name === 'dashboard' ? (
          <Dashboard onOpenSong={(id) => (window.location.hash = `/songs/${id}`)} />
        ) : (
          <SongDetail songId={route.id} onBack={() => (window.location.hash = '/')} />
        )}
      </AppShell>
    </SongStoreProvider>
  );
}
