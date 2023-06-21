import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EurolifeDropdownComponent } from './eurolife-dropdown.component';

describe('EurolifeDropdownComponent', () => {
  let component: EurolifeDropdownComponent;
  let fixture: ComponentFixture<EurolifeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurolifeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurolifeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
