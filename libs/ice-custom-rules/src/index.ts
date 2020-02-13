import { RuleFactoryImpl, RuleHolder } from '@impeo/ice-core';
import * as ElementRules from './lib/rules/element-rules';
import * as IntegrationRules from './lib/rules/integration-rules';
import * as ActionRules from './lib/rules/action-rules';

export function registerCustomRules() {
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceElement, ElementRules);
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceIntegration, IntegrationRules);
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceAction, ActionRules);
}
