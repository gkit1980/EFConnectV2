import { async, TestBed } from '@angular/core/testing';
import { IceCustomComponentsModule } from './ice-custom-components.module';

describe('IceCustomComponentsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IceCustomComponentsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(IceCustomComponentsModule).toBeDefined();
  });
});
