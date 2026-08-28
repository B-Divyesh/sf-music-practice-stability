export type InputMode = 'tap' | 'microphone' | 'midi';

export interface Passage {
  id: string;
  name: string;
  bpm: number;
  beats: number;
  createdAt: string;
}

export interface Take {
  id: string;
  onsets: number[];
  deviationMs: number;
  controlled: boolean;
}

export interface Session {
  id: string;
  passageId: string;
  passageName: string;
  createdAt: string;
  bpm: number;
  beats: number;
  inputMode: InputMode;
  takes: Take[];
  spreadMs: number;
}

export interface AppData {
  passages: Passage[];
  sessions: Session[];
}

export interface CaptureState {
  passage: Passage;
  mode: InputMode;
  takes: Take[];
  recording: boolean;
  currentOnsets: number[];
  takeStartedAt: number;
}
