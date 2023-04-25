import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieDeclarationComponent } from './cookie-declaration.component';

describe('CookieDeclarationComponent', () => {
  let component: CookieDeclarationComponent;
  let fixture: ComponentFixture<CookieDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CookieDeclarationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
