import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { AddVideo, DeleteVideo, SetVideos } from '../store/app.actions';
import { AppStateModel, VideoRecording } from '../store/app.state.model';
import { VideoStorageService } from '../services/video-storage/video-storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoListComponent implements OnInit, OnDestroy {
  @Select((state: { app: AppStateModel }) => state.app.videos)
  videos$!: Observable<VideoRecording[]>;

  private objectURLs: string[] = [];

  constructor(
    private store: Store,
    private videoStorage: VideoStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadVideos();
  }

  private async loadVideos(): Promise<void> {
    const storedVideos = await this.videoStorage.getVideos();
    storedVideos.forEach((video) => {
      if (
        !this.store.selectSnapshot((state) =>
          state.app.videos.some((v: VideoRecording) => v.id === video.id)
        )
      ) {
        this.store.dispatch(new AddVideo(video));
      }
    });
  }

  createObjectURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    this.objectURLs.push(url);
    return url;
  }

  async deleteVideo(id: string): Promise<void> {
    await this.videoStorage.deleteVideo(id);
    this.store.dispatch(new DeleteVideo(id));
    this.revokeDeletedURL(id);
  }

  private revokeDeletedURL(id: string): void {
    const video = this.store.selectSnapshot((state) =>
      state.app.videos.find((v: VideoRecording) => v.id === id)
    );
    if (video) {
      URL.revokeObjectURL(this.createObjectURL(video.blob));
    }
  }

  private refreshVideoList(): void {
    const currentVideos = this.store.selectSnapshot<AppStateModel>(
      (state) => state.app.videos
    );

    if (Array.isArray(currentVideos)) {
      this.store.dispatch(new SetVideos([...currentVideos]));
    } else {
      console.error("Expected 'currentVideos' to be an array, but it is not.");
    }
  }

  ngOnDestroy(): void {
    this.objectURLs.forEach((url) => URL.revokeObjectURL(url));
  }
}
