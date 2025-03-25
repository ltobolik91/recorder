import { State, Action, StateContext } from '@ngxs/store';
import { patch, updateItem, removeItem } from '@ngxs/store/operators';
import { AppStateModel, VideoRecording } from './app.state.model';
import {
  SetBandwidth,
  SetQuality,
  AddVideo,
  SetError,
  ClearError,
  DeleteVideo,
  SetVideos,
} from './app.actions';

@State<AppStateModel>({
  name: 'app',
  defaults: {
    bandwidth: null,
    quality: 'medium',
    videos: [],
    error: null,
  },
})
export class AppState {
  @Action(SetBandwidth)
  handleSetBandwidth(
    ctx: StateContext<AppStateModel>,
    { bandwidth }: SetBandwidth
  ) {
    ctx.patchState({ bandwidth });
  }

  @Action(SetQuality)
  handleSetQuality(ctx: StateContext<AppStateModel>, { quality }: SetQuality) {
    ctx.patchState({ quality });
  }

  @Action(AddVideo)
  handleAddVideo(ctx: StateContext<AppStateModel>, { video }: AddVideo) {
    ctx.setState(
      patch({
        videos: (videos: readonly VideoRecording[]) => [...videos, video],
      })
    );
  }

  @Action(SetVideos)
  setVideos(ctx: StateContext<AppStateModel>, { videos }: SetVideos) {
    const validatedVideos = videos.filter(
      (video) =>
        video.id &&
        video.blob instanceof Blob &&
        video.timestamp instanceof Date
    );

    ctx.setState(
      patch({
        videos: (existing: readonly VideoRecording[]) => validatedVideos,
      })
    );
  }

  @Action(DeleteVideo)
  deleteVideo(ctx: StateContext<AppStateModel>, { id }: DeleteVideo) {
    ctx.setState(
      patch({
        videos: removeItem<VideoRecording>((video) => video?.id === id),
      })
    );
  }

  @Action(SetError)
  handleSetError(ctx: StateContext<AppStateModel>, { error }: SetError) {
    ctx.patchState({ error });
  }

  @Action(ClearError)
  handleClearError(ctx: StateContext<AppStateModel>) {
    ctx.patchState({ error: null });
  }
}
