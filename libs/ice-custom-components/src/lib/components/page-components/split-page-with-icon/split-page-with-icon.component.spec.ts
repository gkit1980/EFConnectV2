import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitPageWithIconComponent } from './split-page-with-icon.component';

describe('SplitPageWithIconComponent', () => {
  let component: SplitPageWithIconComponent;
  let fixture: ComponentFixture<SplitPageWithIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitPageWithIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitPageWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
