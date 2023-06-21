import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectionGreenCardComponent } from './redirection-green-card.component';

describe('RedirectionGreenCardComponent', () => {
  let component: RedirectionGreenCardComponent;
  let fixture: ComponentFixture<RedirectionGreenCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectionGreenCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectionGreenCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
