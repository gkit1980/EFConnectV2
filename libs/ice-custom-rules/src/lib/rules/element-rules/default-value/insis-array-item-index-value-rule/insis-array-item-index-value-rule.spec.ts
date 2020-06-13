import { RuleHolder, ItemElement } from '@impeo/ice-core';
import { IceTesting } from '@impeo/ice-core/testing';
import { InsisArrayItemIndexValueRule } from './insis-array-item-index-value-rule';

describe(InsisArrayItemIndexValueRule.name, () => {
  let iceTesting: IceTesting;
  beforeEach(
    () =>
      (iceTesting = IceTesting.initializeTestingRuntime().registerRule(
        RuleHolder.IceElement,
        InsisArrayItemIndexValueRule
      ))
  );

  const elementName = 'parentArray~index';
  const createIceContext = async (ruleRecipe: any) =>
    await iceTesting
      .contextBuilder()
      .element('parentArray', 'array')
      .element(elementName, 'text', (element) =>
        element.defaultValueRule(InsisArrayItemIndexValueRule.name, ruleRecipe)
      )
      .build();

  it('sets elements value to the index it has in a array', async () => {
    const ruleRecipe = { indexing: 'zero-based' };
    const { iceModel } = await createIceContext(ruleRecipe);

    const element = <ItemElement>iceModel.elements[elementName];
    const rule = <InsisArrayItemIndexValueRule>element.defaultValueRule;

    expect(rule.getValue([0])).toEqual(0);
  });

  it('one-based param sets elements value to the index it has in the array plus one', async () => {
    const ruleRecipe = { indexing: 'one-based' };
    const { iceModel } = await createIceContext(ruleRecipe);

    const element = <ItemElement>iceModel.elements[elementName];
    const rule = <InsisArrayItemIndexValueRule>element.defaultValueRule;

    expect(rule.getValue([0])).toEqual(1);
  });

  it('sets the last index that an element has when nested in arrays', async () => {
    const ruleRecipe = { indexing: 'zero-based' };
    const { iceModel } = await createIceContext(ruleRecipe);

    const element = <ItemElement>iceModel.elements[elementName];
    const rule = <InsisArrayItemIndexValueRule>element.defaultValueRule;

    expect(rule.getValue([0, 3, 5])).toEqual(5);
  });

  it('adds one to nested arrays element index', async () => {
    const ruleRecipe = { indexing: 'one-based' };
    const { iceModel } = await createIceContext(ruleRecipe);

    const element = <ItemElement>iceModel.elements[elementName];
    const rule = <InsisArrayItemIndexValueRule>element.defaultValueRule;

    expect(rule.getValue([0, 3])).toEqual(4);
  });
});
