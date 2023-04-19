import { ValuesRule, IceElement, IceType, IceList, IndexedValue } from '@impeo/ice-core';
import { map, find, filter } from 'lodash';

//
//
export class InsisInsuranceDurationsValuesRule extends ValuesRule {
  private ageElement: IceElement;
  private list: IceList;
  private mainIndex: number[];

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
    const ageMainPerson = this.mainIndex
      ? this.ageElement.getValue().forIndex(this.mainIndex)
      : this.ageElement.getValue().forIndex([0]);

    const substractedAge = Math.abs(this.getParam('maxAge') - ageMainPerson);

    const listItems = this.list.getItems();

    const filteredListValues = filter(listItems, (item) => {
      const listValue = this.getSanitizedStringValue(item['value']);
      return Number.parseInt(listValue, 10) <= substractedAge;
    });

    const items = map(filteredListValues, (item) => {
      return {
        value: item.value,
        label: this.getLabel(item),
      };
    });

    return items;
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
    const listName = this.list.name;
    return this.context.iceResource.resolve(`lists.${listName}.${value}`, value);
  }

  //
  //
  private initialize(): void {
    if (this.ageElement != null) return;
    this.ageElement = this.requireElement('ageElement');
    const listName = this.getParam('list');
    this.list = this.requireList(listName);
    this.mainIndex = IndexedValue.key2Index(this.recipe['mainIndex']);
    this.triggerReevaluationOnElementsChange([this.ageElement]);
  }
}
