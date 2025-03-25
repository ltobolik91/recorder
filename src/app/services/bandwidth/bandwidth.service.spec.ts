import { TestBed } from '@angular/core/testing';

import { BandwidthService } from './bandwidth.service';

describe('BandwidthService', () => {
  let service: BandwidthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BandwidthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
