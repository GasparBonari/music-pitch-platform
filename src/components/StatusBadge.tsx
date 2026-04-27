import type { SongStatus } from '../types';

const LABEL: Record<SongStatus, string> = {
  new: 'New',
  pitched: 'Pitched',
  needs_review: 'Needs Review',
};

const STYLES: Record<SongStatus, string> = {
  new: 'text-status-new bg-status-new/12 border-status-new/25',
  pitched: 'text-status-pitched bg-status-pitched/14 border-status-pitched/30',
  needs_review: 'text-status-review bg-status-review/14 border-status-review/28',
};

export function StatusBadge({ status }: { status: SongStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium tracking-wide px-2.5 py-1 rounded-full border whitespace-nowrap ${STYLES[status]}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-current"
        style={{ boxShadow: '0 0 8px currentColor' }}
        aria-hidden
      />
      {LABEL[status]}
    </span>
  );
}
