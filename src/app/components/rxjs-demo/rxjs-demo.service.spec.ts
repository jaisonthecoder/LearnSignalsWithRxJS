import { TestBed } from '@angular/core/testing';

import { RxjsDemoService } from './rxjs-demo.service';

describe('RxjsDemoService', () => {
  let service: RxjsDemoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxjsDemoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
