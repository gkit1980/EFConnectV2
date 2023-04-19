import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { NgIceTesting } from '@impeo/ng-ice/testing';
import { InsisSliderComponent } from './insis-slider.component';
import { FormsModule } from '@angular/forms';

describe(InsisSliderComponent.name, () => {
  let iceTesting: NgIceTesting;

  beforeEach(async () => {
    iceTesting = NgIceTesting.initializeTestingRuntime((optionsBuilder) => {
      optionsBuilder.list('test', 'text', (list) => list.item('test1').item('test2').item('test3'));
    });

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatSliderModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      declarations: [InsisSliderComponent],
      providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  async function createIceContext(componentRecipe: any) {
    return await iceTesting
      .contextBuilder()
      .element('mockElement', 'text', (element) =>
        element.component(InsisSliderComponent.componentName, componentRecipe)
      )
      .element('rangeElement', 'text', (element) => {
        element
          .component(InsisSliderComponent.componentName, componentRecipe)
          .rangeRule('StaticRangeRule', { min: 5, max: 10 });
      })
      .element('defautvalueElement', 'integer', (element) => {
        element
          .component(InsisSliderComponent.componentName, componentRecipe)
          .defaultValueRule('StaticValueRule', { value: 25 });
      })
      .element('valuesElement', 'text', (element) => {
        element
          .component(InsisSliderComponent.componentName, componentRecipe)
          .valuesRule('ListValuesRule', { list: 'test' });
      })
      .element('rangeElementWithDefautRuleInTheRange', 'text', (element) => {
        element
          .component(InsisSliderComponent.componentName, componentRecipe)
          .rangeRule('StaticRangeRule', { min: 5, max: 10 })
          .defaultValueRule('StaticValueRule', { value: 7 });
      })
      .element('rangeElementWithDefautRuleOutOfTheRange', 'text', (element) => {
        element
          .component(InsisSliderComponent.componentName, componentRecipe)
          .rangeRule('StaticRangeRule', { min: 5, max: 10 })
          .defaultValueRule('StaticValueRule', { value: 25 });
      })
      .page('mockPage', (page) =>
        page.section((section) =>
          section
            .includeElement('mockElement')
            .includeElement('rangeElement')
            .includeElement('defautvalueElement')
            .includeElement('valuesElement')
            .includeElement('rangeElementWithDefautRuleInTheRange')
            .includeElement('rangeElementWithDefautRuleOutOfTheRange')
        )
      )
      .build();
  }

  it('should create', async () => {
    const iceContext = await createIceContext({});
    const component = iceTesting
      .componentFactory(iceContext)
      .createIceElementComponent(InsisSliderComponent, 'mockElement');
    expect(component.componentInstance).toBeDefined();
  });

  it('range rule sets min and max', async () => {
    const iceContext = await createIceContext({});
    const { componentInstance } = iceTesting
      .componentFactory(iceContext)
      .createIceElementComponent(InsisSliderComponent, 'rangeElement');

    expect(componentInstance.min).toEqual(5);
    expect(componentInstance.max).toEqual(10);
  });

  it('defaut value sets correctly', async () => {
    const iceContext = await createIceContext({});
    const { componentInstance } = iceTesting
      .componentFactory(iceContext)
      .createIceElementComponent(InsisSliderComponent, 'defautvalueElement');

    expect(componentInstance.slider.value).toEqual(25);
  });

  it('when values rule is applied and the slider is dragged on the first position the elemets value will equal to the first value of the values', async () => {
    const iceContext = await createIceContext({});
    const { componentInstance } = iceTesting
      .componentFactory(iceContext)
      .createIceElementComponent(InsisSliderComponent, 'valuesElement');

    componentInstance.componentValue = 1;
    componentInstance.change();

    expect(componentInstance.element.getValue().forIndex(null)).toEqual('test1');
  });

  it('when defaut value is set to a value that is not in the range of the range rule the elements value is set to the defaut value', async () => {
    const iceContext = await createIceContext({});
    const { componentInstance } = iceTesting
      .componentFactory(iceContext)
      .createIceElementComponent(InsisSliderComponent, 'rangeElementWithDefautRuleOutOfTheRange');

    expect(componentInstance.slider.value).toEqual(25);
  });

  it('when defaut value is set to a value that is in the range of the range rule the elements value is set to the defaut value', async () => {
    const iceContext = await createIceContext({});
    const { componentInstance } = iceTesting
      .componentFactory(iceContext)
      .createIceElementComponent(InsisSliderComponent, 'rangeElementWithDefautRuleInTheRange');

    expect(componentInstance.slider.value).toEqual(7);
  });
});
