import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentsInprogressComponent } from './amendments-inprogress.component';

describe('AmendmentsInprogressComponent', () => {
  let component: AmendmentsInprogressComponent;
  let fixture: ComponentFixture<AmendmentsInprogressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentsInprogressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentsInprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
