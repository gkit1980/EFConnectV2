import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EurolifeOutputColorComponent } from './eurolife-output-color.component';

describe('EurolifeOutputColorComponent', () => {
  let component: EurolifeOutputColorComponent;
  let fixture: ComponentFixture<EurolifeOutputColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurolifeOutputColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurolifeOutputColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
