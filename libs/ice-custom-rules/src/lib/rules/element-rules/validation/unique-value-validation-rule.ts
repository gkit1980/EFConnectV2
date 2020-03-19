import {
  ValidationRule,
  ValidationMessages,
  IndexedValue,
  ItemElement,
  IceElement
} from '@impeo/ice-core';
import { uniqBy } from 'lodash';

export class UniqueValueValidationRule extends ValidationRule {
  validateValue(messages: ValidationMessages, value: IndexedValue): void {
    const values = this.getIndexedElementValues();
    const hasDuplicates = uniqBy(values, 'value').length !== values.length;

    if (hasDuplicates) {
      messages.addMessage(`Element value must be unique`, value.element.name, value.index);
    }
  }
}
