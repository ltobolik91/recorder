import { Injectable } from '@angular/core';
import { SetBandwidth, SetError, SetQuality } from '../../store/app.actions';
import { Store } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class BandwidthService {
  private testFileUrl = 'https://example.com/test-file.jpg';

  constructor(private store: Store) {}

  async measureBandwidth(): Promise<void> {
    try {
      const startTime = Date.now();
      const response = await fetch(this.testFileUrl);
      const blob = await response.blob();
      const duration = (Date.now() - startTime) / 1000;
      const sizeBits = blob.size * 8;
      const bandwidth = parseFloat((sizeBits / duration / 1000000).toFixed(2));

      this.store.dispatch(new SetBandwidth(bandwidth));
      this.determineQuality(bandwidth);
    } catch (error) {
      this.store.dispatch(
        new SetError('Bandwidth detection failed. Using medium quality.')
      );
      this.store.dispatch(new SetQuality('medium'));
    }
  }

  private determineQuality(bandwidth: number): void {
    if (bandwidth < 2) this.store.dispatch(new SetQuality('low'));
    else if (bandwidth <= 5) this.store.dispatch(new SetQuality('medium'));
    else this.store.dispatch(new SetQuality('high'));
  }
}
