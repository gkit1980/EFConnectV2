import 'jest-preset-angular';
import { RuleRecipeValidator, IceResource } from '@impeo/ice-core';
import { registerDefaultRules } from '@impeo/ice-core/default-rules';

// Disable messages for missing descriptors
RuleRecipeValidator.prototype.ignoreMissignDescriptors = true;

// Ignore missing resources
IceResource.prototype.ignoreMissingEntries = true;

// Register default rules
registerDefaultRules();
