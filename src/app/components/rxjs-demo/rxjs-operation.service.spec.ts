import { TestBed } from '@angular/core/testing';

import { RxjsOperationService } from './rxjs-operation.service';

describe('RxjsOperationService', () => {
  let service: RxjsOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxjsOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
