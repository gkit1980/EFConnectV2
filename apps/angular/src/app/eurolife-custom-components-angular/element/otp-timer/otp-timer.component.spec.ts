import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpTimerComponent } from './otp-timer.component';

describe('OtpTimerComponent', () => {
  let component: OtpTimerComponent;
  let fixture: ComponentFixture<OtpTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
