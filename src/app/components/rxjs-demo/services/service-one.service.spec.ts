import { TestBed } from '@angular/core/testing';

import { ServiceOneService } from './service-one.service';

describe('ServiceOneService', () => {
  let service: ServiceOneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceOneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
