import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDafsComponent } from './my-dafs.component';

describe('MyDafsComponent', () => {
  let component: MyDafsComponent;
  let fixture: ComponentFixture<MyDafsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDafsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDafsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
