export type VideoQuality = 'low' | 'medium' | 'high';

export interface VideoRecording {
  id: string;
  blob: Blob;
  timestamp: Date;
  quality: VideoQuality;
}

export interface AppStateModel {
  bandwidth: number | null;
  quality: VideoQuality;
  videos: VideoRecording[];
  error: string | null;
}
