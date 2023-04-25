import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentMaskComponent } from './amendmentmask.component';

describe('AmendmentMaskComponent', () => {
  let component: AmendmentMaskComponent;
  let fixture: ComponentFixture<AmendmentMaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AmendmentMaskComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
