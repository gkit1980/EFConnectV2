import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EurolifeButtonComponent } from './eurolife-button.component';

describe('EurolifeButtonComponent', () => {
  let component: EurolifeButtonComponent;
  let fixture: ComponentFixture<EurolifeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurolifeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurolifeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
