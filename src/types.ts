export type SongStatus = 'new' | 'pitched' | 'needs_review';

export interface Songwriter {
  id: string;
  name: string;
  initials: string;
  hue: number;
}

export interface Pitch {
  tags: string[];
  description: string;
  targetArtists: string[];
  updatedAt: string;
}

export interface Song {
  id: string;
  title: string;
  songwriterId: string;
  status: SongStatus;
  duration: number;
  uploadedAt: string;
  waveform: number[];
  pitch?: Pitch;
}

export interface Manager {
  id: string;
  name: string;
  initials: string;
}
