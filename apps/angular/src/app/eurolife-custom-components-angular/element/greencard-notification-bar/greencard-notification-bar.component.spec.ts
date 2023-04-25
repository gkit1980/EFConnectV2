import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreencardNotificationBarComponent } from './greencard-notification-bar.component';

describe('GreencardNotificationBarComponent', () => {
  let component: GreencardNotificationBarComponent;
  let fixture: ComponentFixture<GreencardNotificationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreencardNotificationBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreencardNotificationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
