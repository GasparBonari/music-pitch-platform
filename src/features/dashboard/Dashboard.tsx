import { useMemo, useState } from 'react';
import { getSongwriter } from '../../data/mockData';
import { useSongStore } from '../../store/useSongStore';
import type { SongStatus } from '../../types';
import { LuSearch } from 'react-icons/lu';
import { StatCard } from './StatCard';
import { SongRow } from './SongRow';

interface Props {
  onOpenSong: (id: string) => void;
}

type Filter = 'all' | 'attention' | 'pitched' | 'new';
type SortKey = 'recent' | 'oldest' | 'title';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function Dashboard({ onOpenSong }: Props) {
  const { songs } = useSongStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortKey>('recent');
  const [query, setQuery] = useState('');
  const [now] = useState(() => Date.now());

  const stats = useMemo(() => {
    const counts: Record<SongStatus, number> = { new: 0, pitched: 0, needs_review: 0 };
    for (const s of songs) counts[s.status] += 1;
    const newThisWeek = songs.filter(
      (s) => new Date(s.uploadedAt).getTime() >= now - WEEK_MS,
    ).length;
    return { ...counts, newThisWeek, total: songs.length };
  }, [songs, now]);

  const filtered = useMemo(() => {
    let list = songs;
    if (filter === 'new') list = list.filter((s) => s.status === 'new');
    else if (filter === 'pitched') list = list.filter((s) => s.status === 'pitched');
    else if (filter === 'attention')
      list = list.filter((s) => s.status === 'new' || s.status === 'needs_review');

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) => {
        const writer = getSongwriter(s.songwriterId);
        return (
          s.title.toLowerCase().includes(q) ||
          writer?.name.toLowerCase().includes(q) ||
          s.pitch?.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    return [...list].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      const ta = new Date(a.uploadedAt).getTime();
      const tb = new Date(b.uploadedAt).getTime();
      return sort === 'recent' ? tb - ta : ta - tb;
    });
  }, [songs, filter, sort, query]);

  const tabs: ReadonlyArray<readonly [Filter, string]> = [
    ['all', `All (${stats.total})`],
    ['attention', `Needs attention (${stats.new + stats.needs_review})`],
    ['new', `Awaiting pitch (${stats.new})`],
    ['pitched', `Pitched (${stats.pitched})`],
  ];

  return (
    <div className="flex flex-col gap-7">
      <Hero stats={stats} />

      <section className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
        <StatCard label="Awaiting pitch" value={stats.new} tone="new" hint="Brand-new uploads from your songwriters" />
        <StatCard label="Active pitches" value={stats.pitched} tone="pitched" hint="Out to artists right now" />
        <StatCard label="Need review" value={stats.needs_review} tone="review" hint="Flagged or revisited" />
        <StatCard label="Total songs" value={stats.total} tone="muted" hint="In your organization" />
      </section>

      <section className="flex flex-wrap gap-3 justify-between items-center">
        <div role="tablist" className="inline-flex bg-surface border border-line rounded-full p-1 gap-0.5">
          {tabs.map(([key, label]) => {
            const active = filter === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-100 ${
                  active
                    ? 'bg-surface-hover text-text shadow-[inset_0_0_0_1px_var(--color-line-strong)]'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 items-center max-sm:w-full">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface border border-line text-text-muted focus-within:border-accent max-sm:flex-1">
            <LuSearch size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, writer, tag…"
              aria-label="Search songs"
              className="bg-transparent border-0 outline-none w-56 text-text placeholder:text-text-dim max-sm:w-full"
            />
          </div>
          <select
            className="bg-surface border border-line rounded-full text-text px-3 py-2 text-[13px]"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort"
          >
            <option className="bg-bg-1 text-text" value="recent">Most recent</option>
            <option className="bg-bg-1 text-text" value="oldest">Oldest</option>
            <option className="bg-bg-1 text-text" value="title">Title (A–Z)</option>
          </select>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((song) => (
            <SongRow key={song.id} song={song} onOpen={() => onOpenSong(song.id)} />
          ))
        )}
      </section>
    </div>
  );
}

interface Stats {
  new: number;
  pitched: number;
  needs_review: number;
  newThisWeek: number;
  total: number;
}

function Hero({ stats }: { stats: Stats }) {
  return (
    <section className="pt-2 pb-1">
      <div className="text-xs tracking-[0.18em] uppercase text-text-dim mb-2">
        Manager dashboard
      </div>
      <h1 className="text-4xl leading-[1.1] -tracking-[0.02em] m-0 mb-2 text-gradient max-sm:text-3xl">
        Your pipeline
      </h1>
      <p className="m-0 text-text-muted text-[15px]">
        {stats.newThisWeek > 0
          ? `${stats.newThisWeek} new ${stats.newThisWeek === 1 ? 'song' : 'songs'} this week.`
          : 'No new uploads this week.'}{' '}
        {stats.needs_review > 0 && (
          <span className="text-status-review font-medium">
            {stats.needs_review} need{stats.needs_review === 1 ? 's' : ''} review.
          </span>
        )}
      </p>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-6 rounded-[14px] bg-surface border border-dashed border-line-strong text-text-muted">
      <div className="text-4xl text-gradient">♪</div>
      <h3 className="mt-2 mb-1 text-text">No songs match those filters</h3>
      <p className="m-0">Try clearing your search or switching tabs.</p>
    </div>
  );
}
