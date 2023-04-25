import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleGridViewQuotationComponent } from './simple-grid-view-quotation.component';

describe('SimpleGridViewQuotationComponent', () => {
  let component: SimpleGridViewQuotationComponent;
  let fixture: ComponentFixture<SimpleGridViewQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleGridViewQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGridViewQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
