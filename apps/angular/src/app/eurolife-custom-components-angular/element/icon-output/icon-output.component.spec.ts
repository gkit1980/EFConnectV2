import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconOutputComponent } from './icon-output.component';

describe('IconOutputComponent', () => {
  let component: IconOutputComponent;
  let fixture: ComponentFixture<IconOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
