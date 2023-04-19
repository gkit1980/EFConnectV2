import { Component, OnInit } from '@angular/core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import { ItemElement, ArrayElement, ValueOrigin } from '@impeo/ice-core';

@Component({
  selector: 'insis-portal-insis-chip-component',
  templateUrl: './insis-chip.component.html',
  styleUrls: ['./insis-chip.mixin.scss'],
})
export class InsisChipComponent extends MaterialElementComponentImplementation implements OnInit {
  static componentName = 'InsisChip';

  private _removable: boolean;

  ngOnInit(): void {
    this._removable = this.getRecipeParam('removable', false);
  }

  public get removable(): boolean {
    return this._removable;
  }

  public get value(): string {
    return this?.element.getValue().forIndex(this.index);
  }

  public onRemoveHandler() {
    if (this.isArrayItem) {
      this.getParentArrayElement.removeItem(this.index, [...this.index].pop(), ValueOrigin.UI);
    }
  }

  private get isArrayItem(): boolean {
    return this.element.isArrayItem();
  }

  private get getParentArrayElement(): ArrayElement {
    return (this.element as ItemElement).getParentArrayElement?.() as ArrayElement;
  }
}
