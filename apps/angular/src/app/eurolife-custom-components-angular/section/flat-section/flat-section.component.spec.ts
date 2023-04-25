import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatSectionComponent } from './flat-section.component';

describe('FlatSectionComponent', () => {
  let component: FlatSectionComponent;
  let fixture: ComponentFixture<FlatSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
