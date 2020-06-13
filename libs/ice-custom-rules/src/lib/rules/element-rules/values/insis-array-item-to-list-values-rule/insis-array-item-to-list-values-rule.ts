import {
  ValuesRule,
  IceElement,
  IceType,
  IceList,
  IndexedValue,
  IceConsole,
} from '@impeo/ice-core';
import { map, find } from 'lodash';

//
//
export class InsisArrayItemToListValuesRule extends ValuesRule {
  private valueElement: IceElement;
  private labelList: IceList;
  private addEmptyValue: boolean;

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
    const items = map(this.valueElement.getValue().values, (value) => {
      return {
        value: value.value,
        label: this.getLabelFromList(value),
      };
    });

    if (this.addEmptyValue === true) {
      const emptyItemResourceKey = this.element.name + '.empty';
      items.push({
        value: null,
        label: this.resource.resolve(emptyItemResourceKey, 'Add resourse yourElementName.empty'),
      });
    }

    return items;
  }

  getLabelFromList(value: IndexedValue): string {
    const listItems = this.labelList.getItems();

    const item = find(listItems, (_item) => {
      const listValue = this.getSanitizedStringValue(_item['value']);
      return value.value === listValue;
    });

    if (!item) {
      IceConsole.info(
        `The list ${this.labelList.name} does not contain an item for the array item value: ${value.value}`
      );
      return value.value;
    }

    return this.getLabel(item);
  }

  //
  //
  private getLabel(item: any): string {
    const locale = this.context.locale.split('-');
    while (locale.length > 0) {
      const label = item[`label_${locale.join('-')}`];
      if (label) return label;
      locale.pop();
    }
    if (item['label']) return item['label'];
    const value = item['value'];
    const listName = this.labelList.name;
    return this.context.iceResource.resolve(`lists.${listName}.${value}`, value);
  }

  //
  //
  private initialize(): void {
    if (this.valueElement != null) return;
    this.valueElement = this.requireElement('valueElement');
    const listName = this.getParam('labelList');
    this.labelList = this.requireList(listName);
    this.addEmptyValue = this.getParam('addEmptyValue');
    this.triggerReevaluationOnElementsChange([this.valueElement]);
  }
}
