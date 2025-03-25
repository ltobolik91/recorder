import { Injectable } from '@angular/core';
import localforage from 'localforage';
import { VideoRecording } from '../../store/app.state.model';

@Injectable({ providedIn: 'root' })
export class VideoStorageService {
  private storage = localforage.createInstance({
    name: 'videoStorage',
    storeName: 'videos',
  });

  async saveVideo(video: Omit<VideoRecording, 'url'>): Promise<void> {
    await this.storage.setItem(video.id, video);
  }

  async getVideos(): Promise<VideoRecording[]> {
    const keys = await this.storage.keys();
    const videos = await Promise.all(
      keys.map((key) => this.storage.getItem<VideoRecording>(key))
    );
    return videos.filter((v): v is VideoRecording => v !== null);
  }

  async deleteVideo(id: string): Promise<void> {
    await this.storage.removeItem(id);
  }
}
