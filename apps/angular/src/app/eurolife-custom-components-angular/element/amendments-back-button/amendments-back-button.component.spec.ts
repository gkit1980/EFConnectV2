import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentsBackButtonComponent } from './amendments-back-button.component';

describe('AmendmentsBackButtonComponent', () => {
  let component: AmendmentsBackButtonComponent;
  let fixture: ComponentFixture<AmendmentsBackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AmendmentsBackButtonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentsBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
