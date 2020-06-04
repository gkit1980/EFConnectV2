import { ExecutionRule } from '@impeo/ice-core';
import { isEmpty, get } from 'lodash';

//
//
export class InsisFocusOnElementExecutionRule extends ExecutionRule {
  private componentTypesSelectors = {
    IceButtonToggle: `button[tabindex='0']`,
    IceButton: 'button',
    IceDropdown: `mat-select`,
    IceRadiobuttonGroup: 'mat-radio-button',
    IceTextarea: 'textarea',
    IceToggle: 'mat-slide-toggle'
  };

  private elementNodes: NodeListOf<Element>;

  //
  //
  async execute(actionContext?: any): Promise<void> {
    if (typeof document === 'undefined') return;

    const element = this.requireElement();

    await this.sleep(200);

    const pageName = get(element, 'iceModel.navigation.currentPage.name');
    const elementName = element.name;
    const componentRule = get(
      element,
      `iceModel.pages['${pageName}'].elements['${elementName}'].componentRule`
    );

    if (!componentRule) return;

    const componentName = componentRule.getComponent(null);

    const index: number[] =
      actionContext != null && actionContext.index != null ? actionContext.index : null;

    if (index) {
      const parentName = element.name
        .split('~')
        .slice(0, -1)
        .join('~');

      const parentNode = document.querySelector(
        `div[data-element="${parentName}"][data-index="${index.join(',')}"]`
      );

      if (!parentNode) return;

      this.elementNodes = parentNode.querySelectorAll(`[data-element="${element.name}"]`);
    } else {
      this.elementNodes = document.querySelectorAll(`[data-element="${element.name}"]`);
    }

    this.focusOnElement(componentName);
  }

  private focusOnElement(componentName) {
    const componentTypeSelector = get(this.componentTypesSelectors, componentName, 'input');

    if (isEmpty(this.elementNodes)) return;

    const elementNode = this.elementNodes[this.elementNodes.length - 1].querySelector(
      componentTypeSelector
    );

    if (!elementNode) return;

    elementNode.focus();
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
