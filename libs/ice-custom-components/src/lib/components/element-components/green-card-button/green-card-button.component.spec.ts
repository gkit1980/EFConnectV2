import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenCardButtonComponent } from './green-card-button.component';

describe('GreenCardButtonComponent', () => {
  let component: GreenCardButtonComponent;
  let fixture: ComponentFixture<GreenCardButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreenCardButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreenCardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
