import { ListValuesRule } from '@impeo/ice-core/default-rules/rules/element-rules';
import * as _ from 'lodash';
import { IceConsole, IceList, IceElement, ValuesRule } from '@impeo/ice-core';

export class InsisDtListValuesRule extends ValuesRule {
  private dtElement: IceElement;

  private selectedIndex: number[];

  public getValues(index: number[] | null): any[] {
    const items = this.getItems(index);
    return _.map(items, (item) => this.checkAndConvertValue(item['value']));
  }

  //
  //
  getItems(index): any[] {
    this.selectedIndex = index;
    const list = this.requireList();
    return list.getItems();
  }

  //
  //
  getOptions(index: number[] | null): { value: string; label: string }[] {
    const items = this.getItems(index);
    return _.map(items, (item) => {
      const value = item['value'];
      const label = this.getLabel(item);
      return { value, label };
    });
  }

  requireList(): IceList {
    this.initialize();
    const dtName = _.get(this.recipe, 'dt');
    const dt = this.getDt();

    if (!dt) {
      IceConsole.error(`Required DT with name: ${dtName} not found.`);
      return null;
    }

    const customDtOutput = this.getParam('output') || 'output';

    const listName = dt.getOutputValue(customDtOutput, this.selectedIndex);

    if (!listName) {
      IceConsole.error(`List not found! DT '${dtName}' outputs list with name '${listName}'.`);
      return null;
    }

    const list = super.requireList(listName);

    return list;
  }

  //
  //
  private initialize(): void {
    if (this.dtElement != null) return;
    this.dtElement = this.requireElement('dtElement');
    this.triggerReevaluationOnElementsChange([this.dtElement]);
  }

  //
  //
  getAdditionalValue(value: any, additional: string): any {
    const list = this.requireList();
    if (this.listHasAdditional(list, additional) === false) return value;
    const items = list.getItems();
    const item = _(items).find((it) => it.value === value);
    if (item == null) {
      IceConsole.info(`the list ${list.name} does not contain an item for the ${value}`);
      return null;
    }
    return item[additional] == null ? value : item[additional];
  }

  //
  //
  getAdditionalsForValue(value: any): any {
    const list = this.requireList();
    const items = list.getItems();
    const item = _(items).find((it) => it.value === value);
    const additionalValues = {};
    _.keys(item).forEach((key: string) => {
      if (key === value) return;
      if (key.includes('label')) return;
      additionalValues[key] = item[key];
    });
    return additionalValues;
  }

  //
  //
  getValueForAdditional(additionalValue: any, additional: string): any {
    const list = this.requireList();
    if (this.listHasAdditional(list, additional) === false) return additionalValue;
    const items = list.getItems();
    const item = _(items).find((it) => it[additional] === additionalValue);
    return item == null ? additionalValue : item.value;
  }

  //
  //
  public getLabel(item: any): string {
    const locale = this.context.locale.split('-');
    while (locale.length > 0) {
      const label = item[`label_${locale.join('-')}`];
      if (label) return label;
      locale.pop();
    }
    if (item['label']) return item['label'];
    const value = item['value'];
    const listName = this.requireList().name;
    return this.context.iceResource.resolve(`lists.${listName}.${value}`, value);
  }

  //
  //
  listHasAdditional(list: IceList, additional: string): boolean {
    const additionals = list.recipe['additionals'];
    if (additionals == null) {
      IceConsole.warn(`the list ${list.name} does not have any additionals`);
      return false;
    }
    if (additionals[additional] == null) {
      IceConsole.warn(`the list ${list.name} does not contain the ${additional}`);
      return false;
    }

    return true;
  }
}
