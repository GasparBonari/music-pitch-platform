import { manager } from '../data/mockData';
import { Avatar } from './Avatar';
import { LuMusic } from 'react-icons/lu';

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b border-line glass-blur bg-bg-0/70 max-md:px-4 max-md:py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent-grad text-[#1a0c2e] shadow-[0_8px_22px_rgba(179,136,255,0.35)]"
            aria-hidden
          >
            <LuMusic size={22} />
          </div>
          <div>
            <div className="font-bold text-[15px] -tracking-[0.01em]">Pitchwave</div>
            <div className="text-xs text-text-dim">Music pipeline</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right max-md:hidden">
            <div className="font-semibold text-sm">{manager.name}</div>
            <div className="text-xs text-text-dim">Manager</div>
          </div>
          <Avatar initials={manager.initials} hue={260} size={36} title={manager.name} />
        </div>
      </header>
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-8 py-8 max-md:px-4 max-md:py-5">
        {children}
      </main>
    </div>
  );
}
