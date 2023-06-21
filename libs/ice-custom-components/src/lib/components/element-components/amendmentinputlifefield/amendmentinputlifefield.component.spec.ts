import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentinputlifefieldComponent } from './amendmentinputlifefield.component';

describe('AmendmentinputpropertyfieldComponent', () => {
  let component: AmendmentinputlifefieldComponent;
  let fixture: ComponentFixture<AmendmentinputlifefieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentinputlifefieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentinputlifefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
