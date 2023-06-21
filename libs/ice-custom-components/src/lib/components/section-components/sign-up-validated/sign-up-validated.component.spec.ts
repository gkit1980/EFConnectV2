import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpValidatedComponent } from './sign-up-validated.component';

describe('SignUpValidatedComponent', () => {
  let component: SignUpValidatedComponent;
  let fixture: ComponentFixture<SignUpValidatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpValidatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpValidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
