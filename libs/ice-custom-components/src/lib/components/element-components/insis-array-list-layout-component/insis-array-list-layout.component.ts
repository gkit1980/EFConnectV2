import { Component } from '@angular/core';
import { InsisArrayComponentImplementation } from '../insis-array-component-implementation';

@Component({
  selector: 'insis-array',
  templateUrl: './insis-array-list-layout.component.html',
})
export class InsisArrayListLayoutComponent extends InsisArrayComponentImplementation {
  static componentName = 'InsisArrayListLayout';
}
