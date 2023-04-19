import { ConfirmationRule, IceDt, IceConsole, IndexedValue } from '@impeo/ice-core';

//
//
export class InsisDtConfirmationRule extends ConfirmationRule {
  private dt: IceDt;
  //
  //
  public isRequired(componentValue: any, index: number[] | null): boolean {
    this.initialize();
    const dtIndex = this.parseIndex('dtIndex');

    const dtResult = this.dt.getOutputValue(this.recipe['output'], dtIndex);
    return dtResult == null ? false : dtResult;
  }

  //
  //
  public getMessage(componentValue: any, index: number[]): string {
    const elementIndex = this.parseIndex('elementIndex');
    const element = this.getElement('elementForResourceValue');
    let name: any;

    if (!element)
      IceConsole.error(
        `InsisDtConfirmationRule: No such element ${this.recipe['elementForResourceValue']}`
      );
    else
      name = elementIndex
        ? element.getValue().forIndex(elementIndex).value
        : element.getValue().forIndex([0]).value;

    const defaultConfimation = this.context.iceResource.resolve(
      'common.confirmation',
      '[Confirm?]'
    );

    return this.context.iceResource.resolve(
      this.recipe['messageKey'],
      { name },
      defaultConfimation
    );
  }

  //
  //
  private parseIndex(param: string): number[] | null {
    if (!this.recipe[param]) return null;
    return IndexedValue.key2Index(this.recipe[param]);
  }

  //
  //
  private initialize() {
    if (this.dt) return;
    this.dt = this.requireDt();
    this.triggerReevaluationOnElementsChange(this.dt.elements);
  }
}
