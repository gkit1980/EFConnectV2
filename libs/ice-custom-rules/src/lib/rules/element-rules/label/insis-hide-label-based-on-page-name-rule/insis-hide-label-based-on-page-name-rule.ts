import { IndexedValue, LabelRule } from '@impeo/ice-core';

export class InsisHideLabelBasedOnPageNameRule extends LabelRule {
  getLabel(index: number[]): string {
    const pageName = this.requireParam('page');
    const currentPage = this.iceModel.navigation.currentPage?.name;

    if (pageName === currentPage) {
      return '';
    }

    return (
      this.element.labelRule?.getLabel(index) ||
      this.resource.resolve(`elements.${this.element.name}.label`, `[${this.element.name}]`)
    );
  }
}
