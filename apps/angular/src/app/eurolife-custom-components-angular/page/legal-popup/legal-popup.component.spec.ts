import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalPopupComponent } from './legal-popup.component';

describe('LegalPopupComponent', () => {
  let component: LegalPopupComponent;
  let fixture: ComponentFixture<LegalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
