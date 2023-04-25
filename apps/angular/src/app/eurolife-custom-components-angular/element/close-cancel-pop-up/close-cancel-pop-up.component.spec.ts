import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCancelPopUpComponent } from './close-cancel-pop-up.component';

describe('CloseCancelPopUpComponent', () => {
  let component: CloseCancelPopUpComponent;
  let fixture: ComponentFixture<CloseCancelPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseCancelPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseCancelPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
