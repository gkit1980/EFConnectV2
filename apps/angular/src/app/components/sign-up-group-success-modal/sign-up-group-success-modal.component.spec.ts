import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpGroupSuccessModalComponent } from  './sign-up-group-success-modal.component';

describe('SignUpGroupSuccessModalComponent', () => {
  let component: SignUpGroupSuccessModalComponent;
  let fixture: ComponentFixture<SignUpGroupSuccessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpGroupSuccessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpGroupSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
