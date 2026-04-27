import { useEffect, useRef, useState } from 'react';
import { formatDuration } from '../utils/format';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { Waveform } from './Waveform';

interface Props {
  duration: number;
  waveform: number[];
  title: string;
}

// Mock audio player. Simulates playback so the waveform animates.
export function AudioPlayer({ duration, waveform, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const tick = (t: number) => {
      if (last.current == null) last.current = t;
      const dt = (t - last.current) / 1000;
      last.current = t;
      setPosition((p) => {
        const next = p + dt;
        if (next >= duration) {
          setPlaying(false);
          return duration;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration]);

  const progress = Math.min(1, position / duration);

  const togglePlay = () => {
    if (position >= duration) setPosition(0);
    setPlaying((p) => !p);
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-[14px] bg-surface-strong border border-line">
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="w-12 h-12 rounded-full bg-accent-grad text-[#1a0c2e] flex items-center justify-center flex-shrink-0 shadow-[0_6px_18px_rgba(179,136,255,0.35)] transition-[transform,box-shadow] duration-100 hover:scale-[1.04] hover:shadow-[0_8px_22px_rgba(179,136,255,0.5)] active:scale-[0.97]"
      >
        {playing ? <FaPause size={20} /> : <FaPlay size={20} />}
      </button>
      <div className="flex-1 min-w-0">
        <Waveform
          data={waveform}
          progress={progress}
          height={48}
          onSeek={(p) => setPosition(p * duration)}
        />
        <div className="flex justify-between text-xs tabular-nums text-text-muted mt-1.5">
          <span>{formatDuration(position)}</span>
          <span className="text-text-dim">{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  );
}
