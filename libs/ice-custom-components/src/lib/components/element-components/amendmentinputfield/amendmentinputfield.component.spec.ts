import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentinputfieldComponent } from './amendmentinputfield.component';

describe('AmendmentinputfieldComponent', () => {
  let component: AmendmentinputfieldComponent;
  let fixture: ComponentFixture<AmendmentinputfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentinputfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentinputfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
