import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputWithIconComponent } from './output-with-icon.component';

describe('OutputWithIconComponent', () => {
  let component: OutputWithIconComponent;
  let fixture: ComponentFixture<OutputWithIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputWithIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
