import { RuleFactoryImpl, RuleHolder } from '@impeo/ice-core';
import * as ElementRules from './lib/rules/element-rules';

export function registerCustomRules() {
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceElement, ElementRules);
}
