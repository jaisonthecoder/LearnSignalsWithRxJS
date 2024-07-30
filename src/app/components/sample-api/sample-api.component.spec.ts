import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleApiComponent } from './sample-api.component';

describe('SampleApiComponent', () => {
  let component: SampleApiComponent;
  let fixture: ComponentFixture<SampleApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
