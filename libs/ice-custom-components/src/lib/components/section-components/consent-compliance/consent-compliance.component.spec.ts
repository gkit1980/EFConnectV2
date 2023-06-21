import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentComplianceComponent } from './consent-compliance.component';

describe('ConsentComplianceComponent', () => {
  let component: ConsentComplianceComponent;
  let fixture: ComponentFixture<ConsentComplianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentComplianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
