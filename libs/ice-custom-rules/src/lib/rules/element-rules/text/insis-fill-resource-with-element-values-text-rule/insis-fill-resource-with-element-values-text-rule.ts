import { TextRule, IceElement, IndexedValue } from '@impeo/ice-core';

export class InsisFillResourceWithElementValuesTextRule extends TextRule {
  getText(key: string, fallback: string, index: number[]): string {
    const elements = this.requireElements(`${key}.elements`);
    const paramList: any = {};

    elements.forEach((element, elementIndex) => {
      const indexFoElement = IndexedValue.sliceIndexToElementLevel(element.name, index);
      const _value = element.getValue().getIndexedValue(indexFoElement).value;
      if (element.type === 'date')
        paramList[`param${elementIndex + 1}`] = this.resource.format(<Date>_value);
      else paramList[`param${elementIndex + 1}`] = _value;
    });

    const resourceKey = this.getParam(`${key}.resourceKey`);
    return this.resource.resolve(resourceKey, paramList);
  }

  private requireElements(paramName: string): IceElement[] {
    const elementNames: string[] = this.requireParam(paramName);
    return elementNames.map((elementName) => {
      const element = this.context.iceModel.elements[elementName];
      if (!element) {
        throw new Error(`Element ${element} does not exists`);
      }
      return element;
    });
  }
}
