import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EurolifeMobileButtonComponent } from './eurolife-mobile-button.component';

describe('EurolifeMobileButtonComponent', () => {
  let component: EurolifeMobileButtonComponent;
  let fixture: ComponentFixture<EurolifeMobileButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurolifeMobileButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurolifeMobileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
