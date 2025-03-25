import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
})
export class RecorderComponent {
  countdown = 0;
  isRecording = false;
  private countdownInterval: any;

  @Output() recordingStarted = new EventEmitter<void>();
  @Output() recordingStopped = new EventEmitter<void>();

  stopRecording(): void {
    clearInterval(this.countdownInterval);
    this.isRecording = false;
    this.countdown = 0;
    this.recordingStopped.emit();
  }

  startCountdown(): void {
    this.isRecording = true;
    this.countdown = 0;
    this.countdownInterval = setInterval(() => {
      this.countdown++;
      if (this.countdown >= 10) {
        this.stopRecording();
      }
    }, 1000);
    this.recordingStarted.emit();
  }
}
