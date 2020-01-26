import { ViewModeRule, IceConsole } from '@impeo/ice-core';
import { get } from 'lodash';

export class DummyViewModeRuleOne extends ViewModeRule {
  getViewMode(actionContext?: any): string {
    IceConsole.info('DummyViewModeRuleOne executed !', this.recipe.viewMode);
    return get(this.recipe, 'viewMode') || 'default';
  }
}
