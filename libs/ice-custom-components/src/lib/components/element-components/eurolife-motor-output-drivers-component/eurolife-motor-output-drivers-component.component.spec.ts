import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EurolifeMotorOutputDriversComponentComponent } from './eurolife-motor-output-drivers-component.component';

describe('EurolifeMotorOutputDriversComponentComponent', () => {
  let component: EurolifeMotorOutputDriversComponentComponent;
  let fixture: ComponentFixture<EurolifeMotorOutputDriversComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurolifeMotorOutputDriversComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurolifeMotorOutputDriversComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
