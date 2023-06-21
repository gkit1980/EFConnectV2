import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpGroupErrorServiceModalComponent } from  './sign-up-group-errorService-modal.component';

describe('SignUpGroupWaitingModalComponent', () => {
  let component: SignUpGroupErrorServiceModalComponent;
  let fixture: ComponentFixture<SignUpGroupErrorServiceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpGroupErrorServiceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpGroupErrorServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
