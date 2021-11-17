import { TestBed } from '@angular/core/testing';

import { FeaturesDataService } from './features-data.service';

describe('FeaturesDataService', () => {
  let service: FeaturesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
