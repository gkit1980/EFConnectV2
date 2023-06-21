import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentinputpropertyfieldComponent } from './amendmentinputpropertyfield.component';

describe('AmendmentinputpropertyfieldComponent', () => {
  let component: AmendmentinputpropertyfieldComponent;
  let fixture: ComponentFixture<AmendmentinputpropertyfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentinputpropertyfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentinputpropertyfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
