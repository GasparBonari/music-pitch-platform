# Pitchwave — Music Pipeline

A workflow tool that connects songwriters with their managers, replacing the email-and-Excel pitch loop with a single dashboard.

- **Songwriters** (implicit, off-screen) upload song ideas.
- **Managers** triage incoming songs and write pitches — tags, description, target artists — to send to artists.

This repo implements the **Manager** side: a dashboard and a song detail view, with an in-memory mock store. No backend.

## What’s in the app

- **Manager dashboard** focused on pipeline triage: summary cards, filter buttons, search, sort, and song rows with workflow context
- **Song detail view** with metadata, a mock audio player, and an inline pitch editor
- **Pitch flow**: create, edit, confirm-remove, and immediate dashboard/detail sync via in-memory state
- **Responsive polish** for mobile controls, waveform overflow, and stacked detail layouts

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — design tokens defined in `src/index.css` with `@theme`
- In-memory store via React Context + `useState`
- Hash-based routing (`#/` and `#/songs/:id`) — no router dependency

## Project layout

```
src/
  App.tsx                    Routing + provider wiring
  main.tsx                   Entry
  index.css                  Tailwind import + @theme tokens + globals
  types.ts                   Domain types: Song, Pitch, Songwriter, ...
  components/                Generic, reusable UI
    AppShell.tsx             Header + page chrome
    Avatar.tsx               Initialed avatar
    StatusBadge.tsx          Pill for song status
    Waveform.tsx             Bar-style waveform
    AudioPlayer.tsx          Mock audio player (simulated playback)
    ChipInput.tsx            Tags / artists chip input
  features/                  Page-level features
    dashboard/
      Dashboard.tsx          Manager dashboard
      StatCard.tsx           Stat tile
      SongRow.tsx            Row in the song list
    song-detail/
      SongDetail.tsx         Song view: info + pitch editor
      PitchEditor.tsx        Pitch form
  store/
    SongStoreContext.ts      Context + types
    SongStoreProvider.tsx    Provider with state + mutations
    useSongStore.ts          Consumer hook
  data/mockData.ts           Seeded songs, songwriters, manager
  utils/format.ts            Date/duration formatting
```

## Design

- Original Figma: <https://rating-bass-73526857.figma.site/>
- Final UI: dark theme, violet gradient, glassy surfaces, and stronger workflow emphasis around review states and manager actions.

See [SOLUTION.md](./SOLUTION.md) for design decisions, trade-offs, and what's next.
