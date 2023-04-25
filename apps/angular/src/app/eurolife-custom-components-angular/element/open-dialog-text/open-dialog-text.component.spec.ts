import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDialogTextComponent } from './open-dialog-text.component';

describe('OpenDialogTextComponent', () => {
  let component: OpenDialogTextComponent;
  let fixture: ComponentFixture<OpenDialogTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDialogTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDialogTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
