import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageMainSectionComponent } from './home-page-main-section.component';

describe('HomePageMainSectionComponent', () => {
  let component: HomePageMainSectionComponent;
  let fixture: ComponentFixture<HomePageMainSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageMainSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageMainSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
