import { OnInit, ViewChild, TemplateRef, Inject, Directive, Optional } from '@angular/core';
import { MaterialArrayElementComponentImplementation, TEMPLATE_TOKEN } from '@impeo/ng-ice';
import { IceElement } from '@impeo/ice-core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { concat } from 'lodash';

@Directive()
export abstract class InsisArrayComponentImplementation
  extends MaterialArrayElementComponentImplementation
  implements OnInit {
  @ViewChild('default', { static: true })
  protected template: TemplateRef<any>;

  addButtonLabel = '';
  removeButtonLabel = '';

  constructor(
    @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) defaults: MatFormFieldDefaultOptions,
    @Inject(TEMPLATE_TOKEN) @Optional() public externalTemplate: TemplateRef<any>
  ) {
    super(defaults);
  }

  ngOnInit() {
    super.ngOnInit();
    this.template = this.externalTemplate || this.template;
    this.determineLabels();
  }

  private determineLabels() {
    this.addButtonLabel = this.resource.resolve(
      this.getRecipeParam('addButtonLabelResourceKey'),
      'Add'
    );
    this.removeButtonLabel = this.resource.resolve(
      this.getRecipeParam('removeButtonLabelResourceKey'),
      'Remove'
    );
  }

  itemElements(): IceElement[] {
    return this.externalTemplate ? [] : this.arrayElement.getArrayItemElements();
  }

  childIndex(index: number) {
    return this.index ? concat(this.index, index) : [index];
  }
}
