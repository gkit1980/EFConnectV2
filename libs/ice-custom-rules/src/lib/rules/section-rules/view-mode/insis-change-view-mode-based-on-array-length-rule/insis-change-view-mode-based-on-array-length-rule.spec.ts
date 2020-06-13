import { InsisChangeViewModeBasedOnArrayLengthRule } from './insis-change-view-mode-based-on-array-length-rule';
import { IceTesting } from '@impeo/ice-core/testing';
import { RuleHolder, IceModel, SectionViewMode, IndexedValue, ValueOrigin } from '@impeo/ice-core';

describe(InsisChangeViewModeBasedOnArrayLengthRule.name, () => {
  let iceTesting: IceTesting;
  beforeEach(
    () =>
      (iceTesting = IceTesting.initializeTestingRuntime().registerRule(
        RuleHolder.IceSection,
        InsisChangeViewModeBasedOnArrayLengthRule
      ))
  );

  const parentArrayName = 'parentArray';
  const arrayFlexSectionRecipe = {
    arrayElement: parentArrayName,
    grid: {
      rows: [
        {
          cols: [
            {
              size: 'auto',
              'size.xs': 'auto',
              'size.sm': 'auto',
              elements: [
                {
                  name: 'parentArray~childElement',
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const flexSectionRecipe = {
    grid: {
      rows: [
        {
          cols: [
            {
              size: 'auto',
              'size.xs': 'auto',
              'size.sm': 'auto',
              elements: [
                {
                  name: 'anotherElement',
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const createIceContext = async (ruleRecipe: any) =>
    await iceTesting
      .contextBuilder()
      .element('parentArray', 'array')
      .element('parentArray~childElement', 'text')
      .element('anotherElement', 'text')
      .page('testpage', (pageRecipeBuilder) =>
        pageRecipeBuilder
          .section((sectionRecipeBuilder) =>
            sectionRecipeBuilder
              .component('IceArrayFlexSection', arrayFlexSectionRecipe)
              .viewModeRule(InsisChangeViewModeBasedOnArrayLengthRule.name, ruleRecipe)
          )
          .section((sectionRecipeBuilder) =>
            sectionRecipeBuilder.component('IceFlexSection', flexSectionRecipe)
          )
      )
      .build();

  const getSectionWithTheViewmodeRule = (iceModel: IceModel) => {
    const testPage = iceModel.pages['testpage'];
    const sectionWithViewModeRule = testPage.sections.find(
      (section) => section.viewModeRule.ruleName === InsisChangeViewModeBasedOnArrayLengthRule.name
    );
    return sectionWithViewModeRule;
  };

  it('should return default if element does exists, but its not array', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray~childElement',
      condition: 'equals',
      conditionValue: 1,
      viewMode: SectionViewMode.HIDDEN,
    });
    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.DEFAULT);
  });

  it('should return default if conditionValue is not an integer number', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray~childElement',
      condition: 'equals',
      conditionValue: 'asdasd',
      viewMode: SectionViewMode.HIDDEN,
    });
    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.DEFAULT);
  });

  it('should return default if condition is invalid', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray~childElement',
      condition: 'invalid condition',
      conditionValue: 1,
      viewMode: SectionViewMode.HIDDEN,
    });
    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.DEFAULT);
  });

  it('should return default if array element does not have specified number of children', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray',
      condition: 'equals',
      conditionValue: 1,
      viewMode: SectionViewMode.HIDDEN,
    });
    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.DEFAULT);
  });

  it('should return default if array element does not have specified number of children 2', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray',
      condition: 'greater',
      conditionValue: 1,
      viewMode: SectionViewMode.HIDDEN,
    });
    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.DEFAULT);
  });

  it('should return default if array element does not have specified number of children 3', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray',
      condition: 'lesser',
      conditionValue: 0,
      viewMode: SectionViewMode.HIDDEN,
    });
    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.DEFAULT);
  });

  it('should return elseViewMode if array element does not have specified number of children', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray',
      condition: 'equals',
      conditionValue: 1,
      viewMode: SectionViewMode.HIDDEN,
      elseViewMode: SectionViewMode.DISABLED,
    });
    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.DISABLED);
  });

  it('should return viewMode if array element does have specified number of children', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray',
      condition: 'equals',
      conditionValue: 1,
      viewMode: SectionViewMode.HIDDEN,
      elseViewMode: SectionViewMode.DISABLED,
    });

    const childElementValue = new IndexedValue(
      iceModel.elements['parentArray~childElement'],
      'testvalue',
      [0],
      ValueOrigin.INTERNAL
    );
    iceModel.elements['parentArray~childElement'].setValue(childElementValue);

    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.HIDDEN);
  });

  it('should return viewMode if array element does have specified number of children 2', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray',
      condition: 'lesser',
      conditionValue: 2,
      viewMode: SectionViewMode.HIDDEN,
      elseViewMode: SectionViewMode.DISABLED,
    });

    const childElementValue = new IndexedValue(
      iceModel.elements['parentArray~childElement'],
      'testvalue',
      [0],
      ValueOrigin.INTERNAL
    );
    iceModel.elements['parentArray~childElement'].setValue(childElementValue);

    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.HIDDEN);
  });

  it('should return viewMode if array element does have specified number of children 3', async () => {
    const { iceModel } = await createIceContext({
      conditionElement: 'parentArray',
      condition: 'greater',
      conditionValue: 0,
      viewMode: SectionViewMode.HIDDEN,
      elseViewMode: SectionViewMode.DISABLED,
    });

    const childElementValue = new IndexedValue(
      iceModel.elements['parentArray~childElement'],
      'testvalue',
      [0],
      ValueOrigin.INTERNAL
    );
    iceModel.elements['parentArray~childElement'].setValue(childElementValue);

    const sectionWithViewModeRule = getSectionWithTheViewmodeRule(iceModel);
    const viewmode = sectionWithViewModeRule.viewModeRule.getViewMode();
    expect(viewmode).toEqual(SectionViewMode.HIDDEN);
  });
});
