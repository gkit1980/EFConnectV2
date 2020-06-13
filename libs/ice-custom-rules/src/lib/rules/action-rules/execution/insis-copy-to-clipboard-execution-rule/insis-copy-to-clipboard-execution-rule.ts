import { ExecutionRule, ItemElement } from '@impeo/ice-core';

import { get, set, toString, merge } from 'lodash';

//
//
export class InsisCopyToClipboardExecutionRule extends ExecutionRule {
  private actionContext: any;

  //
  //
  async execute(actionContext?: any): Promise<any> {
    this.actionContext = actionContext;

    const listener = (e: ClipboardEvent) => {
      const simpleElement = this.getParam('simpleElement', '');
      const clipboard = e.clipboardData || window['clipboardData'];

      // this only copy the value from another element
      if (simpleElement) {
        const element = get(this.iceModel, ['elements', simpleElement]);
        if (!element) return;
        const elementValue = element.getValue().forIndex(this.index);
        clipboard.setData('text/plain', elementValue);

        // this creates an template
      } else {
        clipboard.setData('text/html', `<a href="${this.copyUrl}">${this.link}</a> ${this.info}`);
        clipboard.setData('text/plain', `${this.info} | ${this.copyUrl}`);
      }
      e.preventDefault();
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }

  get info(): string {
    const linkResource = this.getParam('templateinfo', '');
    return this.resource.resolve(linkResource, this.infoPlaceholderValues);
  }

  get link(): string {
    const linkResource = this.getParam('templateLink', '');
    return this.resource.resolve(linkResource, this.linkPlaceholderValues);
  }

  get linkPlaceholderValues(): { [T: string]: string } {
    return this.getPlaceholderElementsValues(this.getParam('linkPlaceholders', []));
  }

  get infoPlaceholderValues(): { [T: string]: string } {
    return this.getPlaceholderElementsValues(this.getParam('infoPlaceholders', []));
  }

  get index(): number[] | null {
    return get(this.actionContext, 'index');
  }

  get copyUrl() {
    const urlElementName = this.getParam('urlElement', '');
    const element = get(this.iceModel.elements, [urlElementName]);
    if (!element) return window.location.href;
    const elementValue = element.getValue().forIndex(this.index);
    return elementValue ? elementValue : window.location.href;
  }

  private getPlaceholderElementsValues(placeholderElementNames: string[]): { [T: string]: string } {
    const placeholders = placeholderElementNames
      .filter((elementName) => get(this.iceModel.elements, [elementName]))
      .map((elementName) => get(this.iceModel.elements, [elementName]))
      .map((element, index) => {
        let currentValue = element.getValue().forIndex(this.index);
        if ((element as ItemElement).valuesRule) {
          const values = (element as ItemElement).valuesRule
            .getOptions(this.index)
            .filter((value) => value.value === currentValue);
          currentValue = get(values, [0, 'label']) || currentValue;
        }

        currentValue = this.iceModel.context.iceResource.format(currentValue);

        return set({}, [`param${index}`], toString(currentValue || ''));
      });
    return merge({}, ...placeholders);
  }
}
