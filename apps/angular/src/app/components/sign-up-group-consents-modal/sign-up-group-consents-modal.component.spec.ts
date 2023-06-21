import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpGroupConsentsModalComponent } from  './sign-up-group-consents-modal.component';

describe('SignUpGroupConsentsModalComponent', () => {
  let component: SignUpGroupConsentsModalComponent;
  let fixture: ComponentFixture<SignUpGroupConsentsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpGroupConsentsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpGroupConsentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
