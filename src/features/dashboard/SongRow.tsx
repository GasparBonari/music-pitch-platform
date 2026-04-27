import { getSongwriter } from '../../data/mockData';
import type { Song } from '../../types';
import { formatDate, formatDuration, formatRelative } from '../../utils/format';
import { Avatar } from '../../components/Avatar';
import { LuChevronRight } from 'react-icons/lu';
import { StatusBadge } from '../../components/StatusBadge';
import { Waveform } from '../../components/Waveform';

interface Props {
  song: Song;
  onOpen: () => void;
}

export function SongRow({ song, onOpen }: Props) {
  const writer = getSongwriter(song.songwriterId);
  const writerName = writer?.name ?? 'Unknown';

  return (
    <button
      onClick={onOpen}
      aria-label={`Open ${song.title}`}
      className="group grid grid-cols-[1.6fr_1fr_1.2fr_auto] gap-6 items-center px-5 py-4 rounded-[14px] bg-surface border border-line text-left transition-[background-color,border-color] duration-150 hover:bg-surface-hover hover:border-line-strong focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 max-lg:grid-cols-[1fr_auto] max-lg:gap-3"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="font-semibold text-[15px] -tracking-[0.01em] truncate">
            {song.title}
          </span>
          <StatusBadge status={song.status} />
        </div>
        <div className="flex items-center gap-2 text-text-muted text-[13px]">
          <span className="inline-flex items-center gap-1.5">
            {writer && (
              <Avatar
                initials={writer.initials}
                hue={writer.hue}
                size={20}
                title={writer.name}
              />
            )}
            {writerName}
          </span>
          <Dot />
          <span title={formatDate(song.uploadedAt)}>{formatRelative(song.uploadedAt)}</span>
          <Dot />
          <span>{formatDuration(song.duration)}</span>
        </div>
      </div>

      <div className="text-text-muted max-lg:hidden">
        <Waveform data={song.waveform} height={36} compact />
      </div>

      <div className="flex items-center max-lg:hidden">
        {song.pitch ? (
          <div className="flex flex-wrap gap-1.5 items-center">
            {song.pitch.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full bg-accent-grad-soft border border-accent/20 text-text"
              >
                {t}
              </span>
            ))}
            {song.pitch.tags.length > 2 && (
              <span className="text-xs text-text-dim">+{song.pitch.tags.length - 2}</span>
            )}
          </div>
        ) : (
          <span className="text-[13px] text-text-dim italic">No pitch yet</span>
        )}
      </div>

      <span
        className="inline-flex items-center gap-1.5 text-[13px] text-text-muted px-2.5 py-1.5 rounded-full border border-transparent transition-colors duration-100 group-hover:text-text group-hover:border-line-strong"
        aria-hidden
      >
        Open
        <LuChevronRight size={16} />
      </span>
    </button>
  );
}

function Dot() {
  return (
    <span className="text-text-dim" aria-hidden>
      ·
    </span>
  );
}
