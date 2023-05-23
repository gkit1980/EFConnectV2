import { RuleFactoryImpl, RuleHolder } from '@impeo/ice-core';
import * as ElementRules from './lib/rules/element-rules';
import * as IntegrationRules from './lib/rules/integration-rules';
import * as DefinitionRules from './lib/rules/definition-rules';
import * as ActionRules from './lib/rules/action-rules';
import * as SectionRules from './lib/rules/section-rules';
// import * as NavigationRules from './lib/rules/navigation-rules';
// import * as BucketRules from './lib/rules/bucket-rules';

export function registerCustomRules() {
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceElement, ElementRules);
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceIntegration, IntegrationRules);
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceAction, ActionRules);
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceSection, SectionRules);
  RuleFactoryImpl.addRuleImplementations(RuleHolder.IceDefinition, DefinitionRules);
  // RuleFactoryImpl.addRuleImplementations(RuleHolder.IceDefinition, BucketRules);
  // RuleFactoryImpl.addRuleImplementations(RuleHolder.IceDefinition, NavigationRules);
}
