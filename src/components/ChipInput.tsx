import { useRef } from 'react';

interface Props {
  chips: string[];
  onChange: (next: string[]) => void;
  draft: string;
  onDraftChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function ChipInput({
  chips,
  onChange,
  draft,
  onDraftChange,
  placeholder,
  ariaLabel,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    if (chips.some((c) => c.toLowerCase() === v.toLowerCase())) {
      onDraftChange('');
      return;
    }
    onChange([...chips, v]);
    onDraftChange('');
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 items-center bg-bg-1 border border-line rounded-[8px] px-2.5 py-2 min-h-11 cursor-text transition-[border-color,box-shadow] duration-100 focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(179,136,255,0.18)]"
      onClick={() => inputRef.current?.focus()}
    >
      {chips.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-accent-grad-soft border border-accent/28 text-[13px]"
        >
          {c}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(chips.filter((x) => x !== c));
            }}
            aria-label={`Remove ${c}`}
            className="w-5 h-5 rounded-full inline-flex items-center justify-center text-sm text-text-muted transition-colors duration-100 hover:bg-white/8 hover:text-text"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        aria-label={ariaLabel}
        placeholder={chips.length === 0 ? placeholder : ''}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Backspace' && !draft && chips.length > 0) {
            onChange(chips.slice(0, -1));
          }
        }}
        onBlur={commit}
        className="flex-1 min-w-[120px] bg-transparent border-0 outline-none px-0.5 py-1 text-sm placeholder:text-text-dim"
      />
    </div>
  );
}
