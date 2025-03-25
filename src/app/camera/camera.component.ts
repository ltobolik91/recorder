import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddVideo, SetError, SetQuality } from '../store/app.actions';
import { AppStateModel, VideoRecording } from '../store/app.state.model';
import { VideoStorageService } from '../services/video-storage/video-storage.service';
import { Observable, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit, OnDestroy {
  private mediaRecorder!: MediaRecorder;
  public stream!: MediaStream | null;
  private recordedChunks: Blob[] = [];
  private qualitySubscription!: Subscription;

  isRecording = false;
  quality$: Observable<'low' | 'medium' | 'high'>;

  constructor(public store: Store, private videoStorage: VideoStorageService) {
    this.quality$ = this.store.select((state) => state.app.quality);
  }

  async ngOnInit() {
    try {
      await this.setupCamera();
    } catch (error) {
      this.store.dispatch(
        new SetError('Camera access denied. Please enable camera permissions.')
      );
    }

    this.qualitySubscription = this.quality$.pipe(skip(1)).subscribe(() => {
      this.handleQualityChange();
    });
  }

  private async handleQualityChange(): Promise<void> {
    try {
      this.stopCurrentStream();
      await this.setupCamera();
    } catch (error) {
      this.store.dispatch(
        new SetError(
          'Failed to update camera quality. Please check permissions.'
        )
      );
    }
  }

  private async setupCamera(): Promise<void> {
    const state = this.store.selectSnapshot<AppStateModel>(
      (state) => state.app
    );
    const constraints = this.getVideoConstraints(state.quality);

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: constraints,
        audio: {
          channelCount: 2,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      const videoElement = document.getElementById(
        'camera-preview'
      ) as HTMLVideoElement;
      videoElement.srcObject = this.stream;
    } catch (error) {
      this.store.dispatch(
        new SetError('Camera setup failed. Please check your permissions.')
      );
    }
  }

  private getVideoConstraints(quality: string): MediaTrackConstraints {
    switch (quality) {
      case 'low':
        return { width: 480, height: 360 };
      case 'medium':
        return { width: 1280, height: 720 };
      case 'high':
        return { width: 1920, height: 1080 };
      default:
        return { width: 1280, height: 720 };
    }
  }

  startRecording(): void {
    if (!this.stream) {
      this.store.dispatch(new SetError('No camera stream available.'));
      return;
    }

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });

    this.mediaRecorder.ondataavailable = (e) =>
      this.recordedChunks.push(e.data);
    this.mediaRecorder.onstop = () => this.saveRecording();

    this.mediaRecorder.start();
    this.isRecording = true;
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

  onQualityChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const quality = select.value as 'low' | 'medium' | 'high';
    this.store.dispatch(new SetQuality(quality));
  }

  private async saveRecording(): Promise<void> {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const video: VideoRecording = {
      id: Date.now().toString(),
      blob,
      timestamp: new Date(),
      quality: this.store.selectSnapshot((state) => state.app.quality),
    };

    await this.videoStorage.saveVideo(video);
    this.store.dispatch(new AddVideo(video));
    this.recordedChunks = [];
  }

  ngOnDestroy(): void {
    this.qualitySubscription?.unsubscribe();
    this.stopCurrentStream();
  }

  private stopCurrentStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      const videoElement = document.getElementById(
        'camera-preview'
      ) as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = null;
      }
      this.stream = null;
    }
  }
}
