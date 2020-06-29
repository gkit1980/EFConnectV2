import { ConfirmationRule, IceDt, IceConsole } from '@impeo/ice-core';

//
//
export class InsisDtConfirmationRule extends ConfirmationRule {
  private dt: IceDt;
  //
  //
  public isRequired(componentValue: any, index: number[] | null): boolean {
    this.initialize();
    const dtIndex = this.parseIndex('dtIndex');

    const dtResult = dtIndex
      ? this.dt.getOutputValue(this.recipe['output'], dtIndex)
      : this.dt.getOutputValue(this.recipe['output']);

    return dtResult == null ? false : dtResult;
  }

  //
  //
  public getMessage(componentValue: any, index: number[]): string {
    const elementIndex = this.parseIndex('elementIndex');
    const element = this.getElement('elementForResourceValue');
    let name;

    if (!element)
      IceConsole.error(
        `InsisDtConfirmationRule: No such element ${this.recipe['elementForResourceValue']}`
      );
    else
      name = elementIndex
        ? element.getValue().values[elementIndex[elementIndex.length - 1]].value
        : element.getValue().values[0].value;

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
  private parseIndex(param: string): number[] {
    if (!this.recipe[param]) return null;

    const index = String(this.recipe[param])
      .split(',')
      .map((_index) => Number.parseInt(_index, 10));

    return index.includes(NaN)
      ? IceConsole.error(
          `InsisDtConfirmationRule: ${param} contains characters other than numbers and commas`
        )
      : index;
  }

  //
  //
  private initialize() {
    if (this.dt) return;
    this.dt = this.requireDt();
    this.triggerReevaluationOnElementsChange(this.dt.elements);
  }
}
