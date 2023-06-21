import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUnpaidReceiptsComponent } from './home-unpaid-receipts.component';

describe('HomeUnpaidReceiptsComponent', () => {
  let component: HomeUnpaidReceiptsComponent;
  let fixture: ComponentFixture<HomeUnpaidReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeUnpaidReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUnpaidReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
