import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenCardBackButtonComponent } from './green-card-back-button.component';

describe('GreenCardBackButtonComponent', () => {
  let component: GreenCardBackButtonComponent;
  let fixture: ComponentFixture<GreenCardBackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreenCardBackButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreenCardBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
