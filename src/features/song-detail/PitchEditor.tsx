import { useEffect, useMemo, useState } from 'react';
import type { Pitch } from '../../types';
import { formatRelative } from '../../utils/format';
import { LuCheck } from 'react-icons/lu';
import { ChipInput } from '../../components/ChipInput';

interface Props {
  initial?: Pitch;
  onSave: (pitch: Pitch) => void;
  onRemove: () => void;
}

export function PitchEditor({ initial, onSave, onRemove }: Props) {
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [artists, setArtists] = useState<string[]>(initial?.targetArtists ?? []);
  const [tagDraft, setTagDraft] = useState('');
  const [artistDraft, setArtistDraft] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const original = useMemo(
    () => ({
      tags: initial?.tags ?? [],
      description: initial?.description ?? '',
      artists: initial?.targetArtists ?? [],
    }),
    [initial],
  );

  const currentKey = `${tags.join('|')}::${description}::${artists.join('|')}`;
  const originalKey = `${original.tags.join('|')}::${original.description}::${original.artists.join('|')}`;
  const dirty = currentKey !== originalKey;
  const saved = savedKey !== null && savedKey === currentKey;

  const canSave =
    tags.length > 0 && description.trim().length > 0 && artists.length > 0 && dirty;

  useEffect(() => {
    setTags(initial?.tags ?? []);
    setDescription(initial?.description ?? '');
    setArtists(initial?.targetArtists ?? []);
    setTagDraft('');
    setArtistDraft('');
    setSavedKey(null);
    setConfirmingRemove(false);
  }, [initial]);

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      tags,
      description: description.trim(),
      targetArtists: artists,
      updatedAt: new Date().toISOString(),
    });
    setSavedKey(currentKey);
  };

  return (
    <div className="p-7 rounded-[20px] bg-surface border border-line flex flex-col gap-5">
      <header className="flex justify-between items-end gap-3">
        <div>
          <div className="text-[11px] tracking-[0.16em] uppercase text-accent mb-1">Pitch</div>
          <h2 className="m-0 text-[22px] -tracking-[0.015em]">
            {initial ? 'Edit pitch' : 'Create pitch'}
          </h2>
        </div>
        {initial && (
          <span className="text-xs text-text-dim">Updated {formatRelative(initial.updatedAt)}</span>
        )}
      </header>

      <Field label="Tags" help="Vibe, genre, mood — anything an artist would search for.">
        <ChipInput
          chips={tags}
          onChange={setTags}
          draft={tagDraft}
          onDraftChange={setTagDraft}
          placeholder="Add a tag and press Enter"
          ariaLabel="Pitch tags"
        />
      </Field>

      <Field
        label="Description"
        labelFor="pitch-desc"
        help="The grand vision — what makes this song special?"
      >
        <textarea
          id="pitch-desc"
          rows={5}
          value={description}
          maxLength={600}
          placeholder="Describe the song's vision, sound, and collaboration potential…"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-y min-h-[110px] bg-bg-1 border border-line rounded-[8px] px-3.5 py-3 outline-none text-sm leading-[1.5] transition-[border-color,box-shadow] duration-100 focus:border-accent focus:shadow-[0_0_0_3px_rgba(179,136,255,0.18)]"
        />
        <div className="self-end text-[11px] text-text-dim tabular-nums">
          {description.length}/600
        </div>
      </Field>

      <Field label="Target artists" help="Who would you like to pitch this to first?">
        <ChipInput
          chips={artists}
          onChange={setArtists}
          draft={artistDraft}
          onDraftChange={setArtistDraft}
          placeholder="Add an artist and press Enter"
          ariaLabel="Target artists"
        />
      </Field>

      <footer className="flex items-center justify-between mt-1 pt-4 border-t border-line gap-3 flex-wrap">
        {initial && (
          confirmingRemove ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] text-[#ffb3b3]">Remove this pitch?</span>
              <button
                type="button"
                onClick={onRemove}
                className="px-4 py-2.5 rounded-full text-[13px] font-medium text-[#ffb3b3] border border-[rgba(255,138,138,0.38)] bg-[rgba(255,138,138,0.08)] transition-colors duration-100 hover:bg-[rgba(255,138,138,0.14)]"
              >
                Confirm remove
              </button>
              <button
                type="button"
                onClick={() => setConfirmingRemove(false)}
                className="px-4 py-2.5 rounded-full text-[13px] text-text-muted border border-line transition-colors duration-100 hover:text-text hover:border-line-strong"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingRemove(true)}
              className="px-4 py-2.5 rounded-full text-[13px] text-text-muted border border-line transition-colors duration-100 hover:text-[#ff8a8a] hover:border-[rgba(255,138,138,0.4)] hover:bg-[rgba(255,138,138,0.06)]"
            >
              Remove pitch
            </button>
          )
        )}
        <div className="ml-auto inline-flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-status-new">
              <LuCheck size={14} />
              Saved
            </span>
          )}
          <button
            disabled={!canSave}
            onClick={handleSave}
            className="px-[18px] py-2.5 rounded-full bg-accent-grad text-[#1a0c2e] font-semibold text-sm shadow-[0_6px_18px_rgba(179,136,255,0.3)] transition-[transform,box-shadow,opacity] duration-100 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_rgba(179,136,255,0.42)] disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {initial ? 'Save changes' : 'Save pitch'}
          </button>
        </div>
      </footer>
    </div>
  );
}

function Field({
  label,
  labelFor,
  help,
  children,
}: {
  label: string;
  labelFor?: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-text" htmlFor={labelFor}>
        {label}
      </label>
      <p className="m-0 mb-1 text-xs text-text-dim">{help}</p>
      {children}
    </div>
  );
}
