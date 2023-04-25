import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpGroupWaitingModalComponent } from  './sign-up-group-waiting-modal.component';

describe('SignUpGroupWaitingModalComponent', () => {
  let component: SignUpGroupWaitingModalComponent;
  let fixture: ComponentFixture<SignUpGroupWaitingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpGroupWaitingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpGroupWaitingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
