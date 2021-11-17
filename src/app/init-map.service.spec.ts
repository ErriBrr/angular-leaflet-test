import { TestBed } from '@angular/core/testing';

import { InitMapService } from './init-map.service';

describe('InitMapService', () => {
  let service: InitMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
