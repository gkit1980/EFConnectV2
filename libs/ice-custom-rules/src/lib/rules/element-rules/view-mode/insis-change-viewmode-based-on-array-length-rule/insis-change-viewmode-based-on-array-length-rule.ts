import {
  SectionViewModeRule,
  SectionViewMode,
  IceConsole,
  ArrayElement,
  ViewModeRule,
} from '@impeo/ice-core';
import { get } from 'lodash';

export enum Conditions {
  LESS_THAN = 'lesser',
  EQUALS = 'equals',
  GREATER_THAN = 'greater',
}

export class InsisChangeViewModeBasedOnArrayLengthRule extends ViewModeRule {
  getViewMode(actionContext?: any): SectionViewMode {
    const array = this.requireElement('array');
    const condition = this.requireParam('condition');
    const conditionValue = parseInt(this.requireParam('conditionValue'), 10);
    const viewMode = this.requireParam('viewMode');
    let elseViewMode = this.getParam('elseViewMode', SectionViewMode.DEFAULT);

    if (array.type !== 'array') {
      IceConsole.warn(
        `${InsisChangeViewModeBasedOnArrayLengthRule.name} specified element is not of type array`
      );
      return SectionViewMode.DEFAULT;
    }

    if (!condition || !Object.values(Conditions).includes(condition)) {
      IceConsole.warn(
        `${InsisChangeViewModeBasedOnArrayLengthRule.name} condition param is not set or is not a correct condition value (lesser, equals, greater).`
      );
      return SectionViewMode.DEFAULT;
    }

    if (conditionValue === NaN) {
      IceConsole.warn(
        `${InsisChangeViewModeBasedOnArrayLengthRule.name} conditionValue is not set or is not an integer.`
      );
      return SectionViewMode.DEFAULT;
    }

    if (!viewMode || viewMode.trim() === '' || !Object.values(SectionViewMode).includes(viewMode)) {
      IceConsole.warn(
        `${InsisChangeViewModeBasedOnArrayLengthRule.name} viewmode param is not set or is invalid.`
      );
      return SectionViewMode.DEFAULT;
    }

    if (elseViewMode && !Object.values(SectionViewMode).includes(elseViewMode)) {
      IceConsole.warn(
        `${InsisChangeViewModeBasedOnArrayLengthRule.name} elseViewMode is invalid viewmode. Fallsback on default view mode if length is different`
      );
      elseViewMode = SectionViewMode.DEFAULT;
    }

    const arrayLength = get(
      (array as ArrayElement).getValue(),
      ['values', 0, 'value', 'length'],
      0
    );
    const equals =
      condition.toLowerCase() === 'equals' &&
      ((arrayLength === conditionValue && viewMode) || elseViewMode);
    const lesser =
      condition.toLowerCase() === 'lesser' &&
      ((arrayLength < conditionValue && viewMode) || elseViewMode);
    const greater =
      condition.toLowerCase() === 'greater' &&
      ((arrayLength > conditionValue && viewMode) || elseViewMode);
    return equals || lesser || greater;
  }
}
