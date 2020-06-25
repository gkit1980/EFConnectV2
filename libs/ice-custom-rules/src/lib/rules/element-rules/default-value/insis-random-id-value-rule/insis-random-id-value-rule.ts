import { ValueRule } from '@impeo/ice-core';
import { random } from 'lodash';

export class InsisRandomIDValueRule extends ValueRule {
  public getValue(): any {
    return random(1000000, 999999999);
  }
}
