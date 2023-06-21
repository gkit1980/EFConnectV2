import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EurolifeOutputClickableComponent } from './eurolife-output-clickable.component';

describe('EurolifeOutputClickableComponent', () => {
  let component: EurolifeOutputClickableComponent;
  let fixture: ComponentFixture<EurolifeOutputClickableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurolifeOutputClickableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurolifeOutputClickableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
