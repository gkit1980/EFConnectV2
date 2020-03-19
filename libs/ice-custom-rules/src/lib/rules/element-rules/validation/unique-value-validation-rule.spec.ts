import { UniqueValueValidationRule } from './unique-value-validation-rule';
import { RuleHolder, ValidationMessages, IndexedValue, ValueOrigin } from '@impeo/ice-core';
import { IceTesting } from '@impeo/ice-core/testing';

describe(UniqueValueValidationRule.name, () => {
  let iceTesting: IceTesting;
  beforeEach(
    () =>
      (iceTesting = IceTesting.initializeTestingRuntime().registerRule(
        RuleHolder.IceElement,
        UniqueValueValidationRule
      ))
  );

  const elementName = 'parent-array~test-element';
  const createIceContext = async () =>
    await iceTesting
      .contextBuilder()
      .element('parent-array', 'array')
      .element(elementName, 'text', element =>
        element.validationRule(UniqueValueValidationRule.name, {})
      )
      .build();

  it('should not add any validation errors if parent array does not have any children (length 0)', async () => {
    const context = await createIceContext();
    const iceModel = context.iceModel;

    const element = iceModel.elements[elementName];
    const validationMessages: ValidationMessages = new ValidationMessages();
    element.validate(validationMessages);

    expect(validationMessages.isEmpty).toBeTruthy();
  });

  it('should not add any validation errors if element has only one index (parent array length 1)', async () => {
    const context = await createIceContext();
    const iceModel = context.iceModel;

    const element = iceModel.elements[elementName];

    const indexedValue = new IndexedValue(element, 'test value', [0], ValueOrigin.UNKNOWN);
    element.setValue(indexedValue);

    const validationMessages: ValidationMessages = new ValidationMessages();
    element.validate(validationMessages);

    expect(validationMessages.isEmpty).toBeTruthy();
  });

  it('should add validation errors if element has more than one index and has duplicating values', async () => {
    const context = await createIceContext();
    const iceModel = context.iceModel;

    const element = iceModel.elements[elementName];

    const indexedValue = new IndexedValue(element, 'test value', [0], ValueOrigin.UNKNOWN);
    const secondIndexedValue = new IndexedValue(element, 'test value', [1], ValueOrigin.UNKNOWN);
    element.setValue(indexedValue);
    element.setValue(secondIndexedValue);

    const validationMessages: ValidationMessages = new ValidationMessages();
    element.validate(validationMessages);

    expect(validationMessages.isEmpty).toBeFalsy();
    expect(validationMessages.hasMessagesFor(elementName, [0])).toBeTruthy();
    expect(validationMessages.hasMessagesFor(elementName, [1])).toBeTruthy();
  });

  it('should not add any validation errors if element have non duplicating values', async () => {
    const context = await createIceContext();
    const iceModel = context.iceModel;

    const element = iceModel.elements[elementName];

    const indexedValue = new IndexedValue(element, 'test value', [0], ValueOrigin.UNKNOWN);
    const secondIndexedValue = new IndexedValue(
      element,
      'test value 123',
      [1],
      ValueOrigin.UNKNOWN
    );
    element.setValue(indexedValue);
    element.setValue(secondIndexedValue);

    const validationMessages: ValidationMessages = new ValidationMessages();
    element.validate(validationMessages);

    expect(validationMessages.isEmpty).toBeTruthy();
    expect(validationMessages.hasMessagesFor(elementName, [0])).toBeFalsy();
    expect(validationMessages.hasMessagesFor(elementName, [1])).toBeFalsy();
  });
});
