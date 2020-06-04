import { ValidationRule, ValidationMessages, IndexedValue } from '@impeo/ice-core';

export class InsisUniqueValueValidationRule extends ValidationRule {
  validateValue(messages: ValidationMessages, value: IndexedValue): void {
    const values = this.getIndexedElementValues();
    const duplicatedValues = this.getDuplicatedIndexedValues(values);
    const hasDuplicates = duplicatedValues.length !== 0;

    if (
      hasDuplicates &&
      duplicatedValues.some(duplicateValue => duplicateValue.value === value.value)
    ) {
      messages.addMessage(`Element value must be unique`, value.element.name, value.index);
    }
  }

  private getDuplicatedIndexedValues(values: IndexedValue[]): IndexedValue[] {
    const uniqueValues: IndexedValue[] = [];
    const duplicatedValues: IndexedValue[] = [];

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      if (uniqueValues.some(uniqueValue => uniqueValue.value === value.value)) {
        duplicatedValues.push(value);
      } else {
        uniqueValues.push(value);
      }
    }

    return duplicatedValues;
  }
}
