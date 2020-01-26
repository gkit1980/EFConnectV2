import { RuleFactoryImpl, RuleHolder } from '@impeo/ice-core';
import * as IntegrationRules from './lib/rules/integration-rules';

export function registerCustomServerRules() {
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceIntegration, IntegrationRules);
}
