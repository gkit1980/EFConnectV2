import { ValuesRule, IceElement, IceType } from '@impeo/ice-core';
import { map } from 'lodash';

//
//
export class InsisArrayItemBasedValuesRule extends ValuesRule {
  private valueElement: IceElement;
  private labelElement: IceElement;

  //
  //

  //
  //
  public getValues(index: number[] | null): any[] {
    this.initialize();
    return map(this.getItems(index), (item) =>
      IceType.sanitizeValueToElementType(item.value, this.element)
    );
  }

  //
  //
  getOptions(index: number[] | null): { value: string; label: string }[] {
    this.initialize();
    return this.getItems(index);
  }

  protected getItems(index: number[] | null): any[] {
    const items = map(
      this.valueElement.getValue().values.filter((value) => value.value !== null),
      (value) => {
        return {
          value: value.value,
          label: this.labelElement.getValue().forIndex(value.index),
        };
      }
    );
    const hideEmptyOption = this.getParam('hideEmpty', false);
    if (!hideEmptyOption) {
      const emptyItemResourceKey = `elements.${this.element.name}.empty`;
      items.push({
        value: this.getParam('emptyValueIsString', false) ? '' : null,
        label: this.resource.resolve(
          emptyItemResourceKey,
          `Add resourse your ${emptyItemResourceKey}`
        ),
      });
    }
    return items;
  }

  //
  //
  private initialize(): void {
    if (this.valueElement != null) return;
    this.valueElement = this.requireElement('valueElement');
    this.labelElement = this.requireElement('labelElement');
    const arrayElement = this.getElement('arrayElement');
    const elements = [this.valueElement, this.labelElement];
    if (arrayElement) elements.push(arrayElement);

    this.triggerReevaluationOnElementsChange(elements);
  }
}
