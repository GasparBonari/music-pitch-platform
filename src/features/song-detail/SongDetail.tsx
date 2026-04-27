import { getSongwriter } from '../../data/mockData';
import { useSongStore } from '../../store/useSongStore';
import { formatDate, formatDuration, formatRelative } from '../../utils/format';
import { AudioPlayer } from '../../components/AudioPlayer';
import { Avatar } from '../../components/Avatar';
import { LuChevronLeft } from 'react-icons/lu';
import { StatusBadge } from '../../components/StatusBadge';
import { PitchEditor } from './PitchEditor';

interface Props {
  songId: string;
  onBack: () => void;
}

export function SongDetail({ songId, onBack }: Props) {
  const { songs, upsertPitch, removePitch } = useSongStore();
  const song = songs.find((s) => s.id === songId);

  if (!song) {
    return (
      <div className="text-center py-16 px-5 text-text-muted flex flex-col items-center gap-4">
        <p>Song not found.</p>
        <button
          onClick={onBack}
          className="px-[18px] py-2.5 rounded-full bg-accent-grad text-[#1a0c2e] font-semibold text-sm shadow-[0_6px_18px_rgba(179,136,255,0.3)] transition-[transform,box-shadow] duration-100 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(179,136,255,0.42)]"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const writer = getSongwriter(song.songwriterId);

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="self-start inline-flex items-center gap-1.5 text-[13px] text-text-muted px-3 py-2 rounded-full border border-line bg-surface transition-colors duration-100 hover:text-text hover:bg-surface-hover hover:border-line-strong"
      >
        <LuChevronLeft size={16} />
        Back to dashboard
      </button>

      <div className="grid grid-cols-2 gap-6 items-start max-lg:grid-cols-1">
        <section className="relative overflow-hidden p-7 rounded-[20px] bg-surface border border-line flex flex-col gap-6 before:absolute before:inset-0 before:bg-[radial-gradient(600px_200px_at_100%_0%,rgba(179,136,255,0.18),transparent_60%)] before:pointer-events-none">
          <header className="relative">
            <div className="flex items-center gap-2.5 mb-3">
              <StatusBadge status={song.status} />
              <span className="text-xs text-text-dim">
                Uploaded {formatRelative(song.uploadedAt)}
              </span>
            </div>
            <h1 className="m-0 mb-4 text-4xl -tracking-[0.025em] leading-[1.05] text-gradient">
              {song.title}
            </h1>
            {writer && (
              <div className="flex items-center gap-3">
                <Avatar
                  initials={writer.initials}
                  hue={writer.hue}
                  size={36}
                  title={writer.name}
                />
                <div>
                  <div className="font-semibold text-[15px]">{writer.name}</div>
                  <div className="text-xs text-text-dim">Songwriter</div>
                </div>
              </div>
            )}
          </header>

          <AudioPlayer duration={song.duration} waveform={song.waveform} title={song.title} />

          <dl className="grid grid-cols-2 gap-px m-0 bg-line rounded-[14px] overflow-hidden">
            <MetaCell label="Duration" value={formatDuration(song.duration)} />
            <MetaCell label="Uploaded" value={formatDate(song.uploadedAt)} />
            <div className="bg-bg-1 px-4 py-3.5 flex flex-col gap-1">
              <dt className="text-[11px] tracking-[0.1em] uppercase text-text-dim">Status</dt>
              <dd className="m-0">
                <StatusBadge status={song.status} />
              </dd>
            </div>
            <MetaCell
              label="Last pitched"
              value={song.pitch ? formatRelative(song.pitch.updatedAt) : '—'}
            />
          </dl>
        </section>

        <section className="lg:sticky lg:top-[88px]">
          <PitchEditor
            initial={song.pitch}
            onSave={(p) => upsertPitch(song.id, p)}
            onRemove={() => removePitch(song.id)}
          />
        </section>
      </div>
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-1 px-4 py-3.5 flex flex-col gap-1">
      <dt className="text-[11px] tracking-[0.1em] uppercase text-text-dim">{label}</dt>
      <dd className="m-0 text-sm font-medium text-text tabular-nums">{value}</dd>
    </div>
  );
}
