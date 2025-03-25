import { StateContext } from '@ngxs/store';
import { AppStateModel, VideoQuality, VideoRecording } from './app.state.model';

export class SetBandwidth {
  static readonly type = '[App] Set Bandwidth';
  constructor(public bandwidth: number) {}
}

export class SetQuality {
  static readonly type = '[App] Set Quality';
  constructor(public quality: VideoQuality) {}
}

export class SetVideos {
  static readonly type = '[Video] Set Videos';
  constructor(public videos: VideoRecording[]) {}
}

export class AddVideo {
  static readonly type = '[App] Add Video';
  constructor(public video: VideoRecording) {}
}

export class DeleteVideo {
  static readonly type = '[Video] Delete Video';
  constructor(public id: string) {}
}

export class MarkVideoDeleted {
  static readonly type = '[App] Mark Video Deleted';
  constructor(public id: string) {}
}

export class ClearVideos {
  static readonly type = '[App] Clear Videos';
}

export class SetError {
  static readonly type = '[App] Set Error';
  constructor(public error: string | null) {}
}

export class ClearError {
  static readonly type = '[App] Clear Error';
}
