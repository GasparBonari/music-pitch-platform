interface Props {
  label: string;
  value: number;
  tone: 'new' | 'pitched' | 'review' | 'muted';
  hint: string;
}

const VALUE_COLOR: Record<Props['tone'], string> = {
  new: 'text-status-new',
  pitched: 'text-status-pitched',
  review: 'text-status-review',
  muted: 'text-text',
};

const BORDER_TONE: Record<Props['tone'], string> = {
  new: 'border-status-new/20',
  pitched: 'border-status-pitched/22',
  review: 'border-status-review/22',
  muted: 'border-line',
};

export function StatCard({ label, value, tone, hint }: Props) {
  return (
    <div
      className={`relative p-5 rounded-[20px] bg-surface border ${BORDER_TONE[tone]} overflow-hidden transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-strong before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] before:pointer-events-none`}
    >
      <div className="text-xs tracking-[0.08em] uppercase text-text-dim font-medium">{label}</div>
      <div
        className={`text-[40px] font-bold leading-[1.1] -tracking-[0.03em] my-1.5 tabular-nums ${VALUE_COLOR[tone]}`}
      >
        {value}
      </div>
      <div className="text-xs text-text-muted">{hint}</div>
    </div>
  );
}
