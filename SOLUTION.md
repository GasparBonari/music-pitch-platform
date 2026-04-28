# SOLUTION.md

## Approach & design decisions

### What I built
A two-view manager-side app: a **Dashboard** that summarizes the pipeline and a **Song Detail** view that lets the manager review a song and create, edit, and remove its pitch. State is in-memory; pitch changes update both the dashboard and song view immediately.

### Information architecture
The Figma design treated the dashboard primarily as a flat table. I kept the same data but reframed the page around the manager's actual question: *"what needs my attention right now?"*

- **Stat cards** at the top split songs into the three states a manager cares about: *Awaiting pitch*, *Active pitches*, *Need review*, plus a total. Each card uses a status-tinted accent so the eye lands on what's most actionable.
- **Filter buttons** mirror those states and add a synthetic "Needs attention" group (new + needs_review) so the manager can triage in one click.
- **Search + sort** for when the list grows — search covers title, songwriter, pitch tags, target artists, and pitch description.
- **List rows** (not a dense table) show title, status, songwriter, relative upload time, duration, a mini-waveform preview, pitch tags, and a short workflow-context line. That extra line answers practical questions like "who is this pitched to?" or "why does this need review?" without forcing a click.
- **Needs review rows** are visually elevated with a warning-tinted treatment so urgent items surface faster than routine `new` or `pitched` songs.

On the **Song Detail** view I split the screen into two columns:
- Left: song info, audio player with an interactive waveform, and a key/value meta grid.
- Right: the pitch editor — sticky on desktop so it stays in view while you scroll the song info, collapsing to a stacked layout on small screens.

The pitch editor uses a chip input for tags and target artists (Enter / comma to add, Backspace to remove last, click × to remove specific). Description has a 600-char counter. Save is disabled until all three fields are populated *and* the form is dirty, so the button always means "there is something to save". Removing a pitch uses an inline confirm step instead of deleting immediately.

### Visual design
Dark theme, single violet → teal gradient as the brand accent, glassy `backdrop-filter` header. The Figma's lighter aesthetic worked but felt generic; a darker, more focused palette better matches the "music industry tool" framing and lets the status colors carry weight.

I used Tailwind CSS v4 with a small token layer in `src/index.css` instead of a component library. The brief explicitly warned that using a library doesn't excuse a generic UI, so I treated the styling as part of the deliverable.

### Audio
There is no real audio file. The player simulates playback with `requestAnimationFrame` — clicking play animates the waveform progress, clicking the waveform seeks. This is honest about the mock data while still demonstrating the interaction model.

## Architecture choices

- **No router**: With two views, a hash router (`#/`, `#/songs/:id`) keeps the back button working and URLs shareable without adding a dependency.
- **Context + `useState`** instead of Redux/Zustand. The state surface is tiny: a `songs` array and two mutations (`upsertPitch`, `removePitch`). A reducer would have added boilerplate without any clarity gain.
- **Tailwind + token globals**: most styling lives inline with tokens and utility classes, while design tokens and shared visual primitives sit in `index.css`.
- **Component-per-file structure**, including small primitives (`Avatar`, `StatusBadge`, `Waveform`). Keeps each unit self-contained without introducing a larger design-system abstraction.
- **Domain in `types.ts`**: `Song`, `Pitch`, `Songwriter`, `SongStatus`. Status changes are derived from pitch operations (`upsertPitch` flips status to `pitched`; `removePitch` flips to `new`).

## AI tools I used

- **GitHub Copilot** assistant while implementing the React/TypeScript application. It helped writing some tailwind CSS variants quickly, repetitive TypeScript structures, and speeding up small implementation details. All changes were reviewed and adjusted by myself.
- **Figma Make** generated the initial mockup that served as the design artifact. I used it as a reference for the implementation rather than as a strict target.

## Trade-offs / what I cut

- **No real audio**: simulating playback was the right scope choice for a 2-view exercise; wiring real `<audio>` elements with file upload would have eaten time without changing the design conversation.
- **No persistence**: refresh wipes pitch edits. `localStorage` would be ~10 lines but would mask demo resets.
- **No tests**: for a UI exercise of this size, the value-to-time ratio favored polishing the design. With a real backend I'd start with reducer-level tests for `upsertPitch`/`removePitch` and a Playwright happy-path.
- **No songwriter view**: the brief is manager-focused.
- **Single manager / single org**: no auth, no scoping, no per-user data.

## What I'd do next with more time

1. **Clickable dashboard cards** — let `Awaiting pitch`, `Active pitches`, and `Need review` set the current filter directly, turning the summary area into a fast triage surface instead of a passive readout.
2. **State-specific row actions** — replace the generic `Open` affordance with context-aware actions like `Create pitch`, `Review pitch`, or `Edit pitch`, so the dashboard feels more like a task queue.
3. **Stronger editor feedback** — make dirty, saved, and removed states more explicit so the manager always knows whether edits are pending or safely committed.
4. **Search-result highlighting** — highlight matched text in titles, tags, target artists, and pitch copy when a search is active to reduce scanning effort.
5. **Richer review-state UX** — allow a lightweight review reason such as `Needs rewrite`, `Needs better targets`, or `Waiting on songwriter`, so `needs_review` carries clearer operational meaning.
6. **Keyboard-first navigation** — support fast list traversal with `j`/`k`, arrow keys, Enter, and Escape, since managers are likely to review many songs in one sitting.
7. **Responsive density pass** — preserve more workflow context on smaller screens without making rows feel cramped, especially for `needs_review` songs and pitch targets.
8. **Light and dark mode** — keep the current dark theme as the default, but add a light theme for preference and accessibility while preserving the same visual hierarchy and status emphasis.
9. **Tests** — add unit tests for the store and an integration test for the main pitch flow.
10. **Songwriter upload view** — add a lightweight upload flow for mp3 demos and metadata, plus a small inbox so songwriters can see manager responses.

## Interesting challenges

- **Reframing the dashboard**: the Figma design is a stat-cards-plus-table layout that's easy to copy and easy to dismiss as generic. The interesting question wasn't "how do I render this?" but "what does a manager want to know in the first 2 seconds?" — that's why the stat cards became status-actionable counts and why the filters include a "Needs attention" superset.
- **Save-button semantics**: it's tempting to allow saving partial pitches, but a pitch with no tags or no artists isn't really a pitch. Disabling save until the pitch is meaningful and dirty makes the button truthful and reduces the need for inline error messages.
- **Mini-waveforms in the list**: a tiny visual touch, but it changes how the dashboard feels — from "spreadsheet" to "music tool" — for almost no code.
- **Small-state polish**: a lot of the final refinement came from edge cases rather than features — fixing mobile control overflow, preventing waveform spill on small screens, making remove destructive-confirmed, and syncing the editor immediately after a pitch is removed.
