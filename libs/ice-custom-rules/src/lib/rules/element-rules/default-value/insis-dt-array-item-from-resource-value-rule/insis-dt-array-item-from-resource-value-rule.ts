import { DtArrayItemValueRule } from '@impeo/ice-core/default-rules/rules/element-rules';

export class InsisDtArrayItemFromResourceValueRule extends DtArrayItemValueRule {
  //
  //
  public getValue(index: number[] | null): any {
    const value = super.getValue(index);
    if (value == null) return null;

    return this.resource.resolve(value, value);
  }
}
