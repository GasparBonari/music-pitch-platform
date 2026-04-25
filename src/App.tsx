import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { Dashboard } from './components/Dashboard';
import { SongDetail } from './components/SongDetail';
import { SongStoreProvider } from './store';

type Route = { name: 'dashboard' } | { name: 'song'; id: string };

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h.startsWith('songs/')) {
    return { name: 'song', id: h.slice('songs/'.length) };
  }
  return { name: 'dashboard' };
}

function App() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  // Reset scroll on route change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route]);

  const goSong = (id: string) => {
    window.location.hash = `/songs/${id}`;
  };
  const goHome = () => {
    window.location.hash = '/';
  };

  return (
    <SongStoreProvider>
      <AppShell>
        {route.name === 'dashboard' ? (
          <Dashboard onOpenSong={goSong} />
        ) : (
          <SongDetail songId={route.id} onBack={goHome} />
        )}
      </AppShell>
    </SongStoreProvider>
  );
}

export default App;
