import { TestBed } from '@angular/core/testing';

import { ServiceTwoService } from './service-two.service';

describe('ServiceTwoService', () => {
  let service: ServiceTwoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTwoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
