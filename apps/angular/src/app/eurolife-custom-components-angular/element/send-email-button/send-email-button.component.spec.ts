import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailButtonComponent } from './send-email-button.component';

describe('SendEmailButtonComponent', () => {
  let component: SendEmailButtonComponent;
  let fixture: ComponentFixture<SendEmailButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmailButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
