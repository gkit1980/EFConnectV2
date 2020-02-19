import { isUndefined, indexOf, isNil } from 'lodash';
import { Component, AfterViewInit, ViewChild, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatSlider } from '@angular/material';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import { ItemElement } from '@impeo/ice-core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ice-slider',
  templateUrl: './ice-slider.component.html'
})
export class IceSliderComponent extends MaterialElementComponentImplementation
  implements OnInit, AfterViewInit, OnDestroy {
  static componentName = 'IceSlider';

  @ViewChild(MatSlider, { static: false })
  slider: MatSlider;

  min = 0;
  max = Number.MAX_SAFE_INTEGER;
  step: number;
  showTicks: boolean;
  componentValue: number;
  updateValueBehaviour: 'onDrag' | 'onRelease' = 'onRelease';

  private debouncerSubscription: Subscription;
  private readonly ELEMENT_VALUE_UPDATE_DEBOUNCE_TIME_MS = 30;

  get tickInterval(): number {
    return this.showTicks ? this.getRecipeParam('tickInterval', 1) : 0;
  }

  get hasValue(): boolean {
    return !isNil(this.value);
  }

  private get values(): any[] | null {
    const itemElement = <ItemElement>this.element.element;
    return itemElement.valuesRule == null ? null : itemElement.valuesRule.getValues(this.index);
  }

  //
  //
  ngOnInit() {
    this.step = this.getRecipeParam('step', 1);
    this.showTicks = this.getRecipeParam('showTicks', false);
    this.updateValueBehaviour = this.getRecipeParam('updateValueBehaviour', 'onRelease');

    const itemElement = <ItemElement>this.element.element;
    if (itemElement.valuesRule) this.applyValuesRuleComponentSettings();
    else if (itemElement.rangeRule) this.applyRangeRuleComponentSettings();
    super.ngOnInit();
  }

  //
  //
  ngAfterViewInit(): void {
    if (this.updateValueBehaviour === 'onDrag' && this.slider) {
      this.debouncerSubscription = this.slider.input
        .pipe(
          debounceTime(this.ELEMENT_VALUE_UPDATE_DEBOUNCE_TIME_MS),
          distinctUntilChanged()
        )
        .subscribe(value => {
          this.componentValue = value.value;
          this.changeValue();
        });
    }
  }

  //
  //
  ngOnDestroy(): void {
    if (this.debouncerSubscription) this.debouncerSubscription.unsubscribe();
  }

  //
  //
  change() {
    if (this.updateValueBehaviour === 'onDrag' && this.slider) return;
    this.changeValue();
  }

  //
  //
  setComponentValue(value: any): void {
    if (isUndefined(value)) value = null;
    this.value = value;
    this.componentValue = this.value;

    if (this.values != null) {
      const valueIndex = indexOf(this.values, value);
      this.componentValue = valueIndex === -1 ? 0 : valueIndex + 1;
    }
  }

  //
  //
  private changeValue() {
    this.value = this.componentValue;
    if (this.values != null) this.value = this.values[this.componentValue - 1];
    this.onComponentValueChange();
  }

  //
  //
  private applyRangeRuleComponentSettings() {
    const itemElement = <ItemElement>this.element.element;
    this.setMinMaxFromRangeRule();
    itemElement.rangeRule.$reevaluate.subscribe(() => {
      this.setMinMaxFromRangeRule();
    });
  }

  //
  //
  private applyValuesRuleComponentSettings() {
    const itemElement = <ItemElement>this.element.element;
    this.setMinMax(0, this.values.length);
    itemElement.valuesRule.$reevaluate.subscribe(() => {
      this.setMinMax(0, this.values.length);
    });
  }

  //
  //
  private setMinMaxFromRangeRule(): void {
    const itemElement = <ItemElement>this.element.element;
    const minValue = itemElement.rangeRule.getMin(this.index) as number;
    const maxValue = itemElement.rangeRule.getMax(this.index) as number;
    this.setMinMax(minValue, maxValue);
  }

  //
  //
  private setMinMax(min: number, max: number) {
    this.min = min || this.min;
    this.max = max || this.max;
  }
}
