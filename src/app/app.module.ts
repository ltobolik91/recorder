import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AppComponent } from './app.component';
import { AppState } from './store/app.state';
import { CameraComponent } from './camera/camera.component';
import { VideoListComponent } from './video-list/video-list.component';
import { BandwidthService } from './services/bandwidth/bandwidth.service';
import { RecorderComponent } from './shared/recorder/recorder.component';

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    VideoListComponent,
    RecorderComponent,
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([AppState]),
    NgxsStoragePluginModule.forRoot({
      key: ['app.quality'],
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    }),
  ],
  providers: [BandwidthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
