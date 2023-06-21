import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EurolifeEmailButtonComponentComponent } from './eurolife-email-button-component.component';

describe('EurolifeEmailButtonComponentComponent', () => {
  let component: EurolifeEmailButtonComponentComponent;
  let fixture: ComponentFixture<EurolifeEmailButtonComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurolifeEmailButtonComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurolifeEmailButtonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
