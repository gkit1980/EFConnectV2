import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputonchangeactionComponent } from './inputonchangeaction.component';

describe('InputonchangeactionComponent', () => {
  let component: InputonchangeactionComponent;
  let fixture: ComponentFixture<InputonchangeactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputonchangeactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputonchangeactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
