interface Props {
  data: number[];
  /** progress 0..1, when provided draws a played-state */
  progress?: number;
  height?: number;
  compact?: boolean;
  onSeek?: (progress: number) => void;
}

export function Waveform({ data, progress, height = 56, compact, onSeek }: Props) {
  const interactive = Boolean(onSeek);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(p);
  };

  return (
    <div
      className={`flex items-center gap-0.5 w-full py-1 ${interactive ? 'cursor-pointer' : ''}`}
      style={{ height }}
      onClick={handleClick}
      role={interactive ? 'slider' : undefined}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? 100 : undefined}
      aria-valuenow={interactive ? Math.round((progress ?? 0) * 100) : undefined}
    >
      {data.map((v, i) => {
        const played = progress !== undefined && i / data.length <= progress;
        return (
          <span
            key={i}
            className={`flex-1 rounded-[2px] transition-colors duration-100 ${
              played
                ? 'bg-accent shadow-[0_0_6px_rgba(179,136,255,0.5)]'
                : 'bg-white/20'
            }`}
            style={{
              height: `${Math.max(8, v * 100)}%`,
              minWidth: compact ? '1.5px' : '2px',
            }}
          />
        );
      })}
    </div>
  );
}
