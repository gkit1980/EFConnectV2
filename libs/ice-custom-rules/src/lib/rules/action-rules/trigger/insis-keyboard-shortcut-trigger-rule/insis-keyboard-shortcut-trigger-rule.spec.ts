import {
  InsisKeyboardShortcutTriggerRule,
  getModifierKeys,
  shortcutParameterName,
  CantHaveOnlyMultiplerKeysAsShortcutsErrorMessage,
  ParseErrorMessage,
  DoesNotSupportMultipleNonModifierKeys,
  preventDefaultParameterName
} from './insis-keyboard-shortcut-trigger-rule';
import { IceTesting } from '@impeo/ice-core/testing';
import { RuleHolder, ExecutionRule, IceConsole, IceContext } from '@impeo/ice-core';

class DummyExecutionRule extends ExecutionRule {
  execute(actionContext?: any): Promise<void> {
    return;
  }
}

let executeActionSpy;
let iceConsoleErrorSpy;
let context: IceContext;

const listeners = [];
const oldImpl = document.addEventListener;
const addEventListener = (type, listener, options) => {
  listeners.push(listener);
  oldImpl(type, listener, options);
};
document.addEventListener = addEventListener;

describe(InsisKeyboardShortcutTriggerRule.name, () => {
  let iceTesting: IceTesting;
  beforeEach(() => {
    iceTesting = IceTesting.initializeTestingRuntime()
      .registerRule(RuleHolder.IceAction, InsisKeyboardShortcutTriggerRule)
      .registerRule(RuleHolder.IceAction, DummyExecutionRule);
    executeActionSpy = jest.spyOn(DummyExecutionRule.prototype, 'execute');
    iceConsoleErrorSpy = jest.spyOn(IceConsole, 'error');

    if (context) context.iceModel.unregisterEvents();
    listeners.forEach(listener => document.removeEventListener('keyup', listener));
  });

  const createIceContext = async (ruleRecipe: any) =>
    await iceTesting
      .contextBuilder()
      .action('test-action', recipeBuilder =>
        recipeBuilder
          .triggerRule(InsisKeyboardShortcutTriggerRule.name, ruleRecipe)
          .executionRule(DummyExecutionRule.name, {})
      )
      .build();

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const createKeyupEvent = (modifierKey: string[], key: string) => {
    key = key || capitalizeFirstLetter(modifierKey[0]);
    const keyboardEventInit = {
      key: key
    };
    modifierKey.forEach(_modifierKey => {
      keyboardEventInit[`${_modifierKey}Key`] = true;
    });
    const event = new KeyboardEvent('keyup', keyboardEventInit);
    return event;
  };

  it('should log error if only modifier keys are set as shortcuts', async () => {
    getModifierKeys().forEach(async modifierKey => {
      const ruleRecipe = {
        [shortcutParameterName]: modifierKey
      };
      context = await createIceContext(ruleRecipe);
      expect(iceConsoleErrorSpy).toHaveBeenCalled();
      expect(iceConsoleErrorSpy).toHaveBeenLastCalledWith(
        CantHaveOnlyMultiplerKeysAsShortcutsErrorMessage
      );
    });
  });

  it('should log error if no key combination param is missing or is empty', async () => {
    context = await createIceContext({});
    expect(iceConsoleErrorSpy).toHaveBeenCalled();
  });

  it('should log error if key combintaion param is invalid combination of keys', async () => {
    context = await createIceContext({
      [shortcutParameterName]: 'ctrl + ad'
    });
    expect(iceConsoleErrorSpy).toHaveBeenCalled();
    expect(iceConsoleErrorSpy).toHaveBeenLastCalledWith(ParseErrorMessage);
  });

  it('should not activate action if correct key combination is not pressed', async () => {
    const ruleRecipe = {
      [shortcutParameterName]: 'ctrl + c'
    };
    context = await createIceContext(ruleRecipe);
    const keyupEvent = createKeyupEvent(['ctrl'], 'h');
    document.dispatchEvent(keyupEvent);
    expect(executeActionSpy).toHaveBeenCalledTimes(0);
  });

  it('should activate action if correct key combination is pressed', async () => {
    const ruleRecipe = {
      [shortcutParameterName]: 'ctrl + c'
    };
    context = await createIceContext(ruleRecipe);
    const keyupEvent = createKeyupEvent(['ctrl'], 'c');
    document.dispatchEvent(keyupEvent);
    expect(executeActionSpy).toHaveBeenCalled();
  });

  it('should support using multiple multiplier keys', async () => {
    const ruleRecipe = {
      [shortcutParameterName]: 'ctrl + alt + c'
    };
    context = await createIceContext(ruleRecipe);
    const keyupEvent = createKeyupEvent(['ctrl', 'alt'], 'c');
    document.dispatchEvent(keyupEvent);
    expect(executeActionSpy).toHaveBeenCalled();
  });

  it('should log error if multiple keys are in the recipe. it does not support using multiple non multiplier keys', async () => {
    const ruleRecipe = {
      [shortcutParameterName]: 'ctrl + v + c'
    };
    context = await createIceContext(ruleRecipe);
    expect(iceConsoleErrorSpy).toHaveBeenCalled();
    expect(iceConsoleErrorSpy).toHaveBeenLastCalledWith(DoesNotSupportMultipleNonModifierKeys);
  });

  it('should not activate preventDefault when prevntDefault param is missing or false', async () => {
    const ruleRecipe = {
      [shortcutParameterName]: 'ctrl + c'
    };
    context = await createIceContext(ruleRecipe);
    const keyupEvent = createKeyupEvent(['ctrl'], 'c');
    const preventDefaultSpy = spyOn(keyupEvent, 'preventDefault');

    document.dispatchEvent(keyupEvent);
    expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
  });

  it('should activate preventDefault when prevntDefault param is true', async () => {
    const ruleRecipe = {
      [shortcutParameterName]: 'ctrl + c',
      [preventDefaultParameterName]: true
    };
    context = await createIceContext(ruleRecipe);
    const keyupEvent = createKeyupEvent(['ctrl'], 'c');
    const preventDefaultSpy = spyOn(keyupEvent, 'preventDefault');

    document.dispatchEvent(keyupEvent);
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });

  it('should activate action if one of the key combinations are pressed', async () => {
    const ruleRecipe = {
      [shortcutParameterName]: 'ctrl + c, alt + c'
    };
    context = await createIceContext(ruleRecipe);

    const keyupEventForCtrlAndC = createKeyupEvent(['ctrl'], 'c');
    const keyupEventForAltAndC = createKeyupEvent(['alt'], 'c');
    document.dispatchEvent(keyupEventForCtrlAndC);
    document.dispatchEvent(keyupEventForAltAndC);

    expect(executeActionSpy).toHaveBeenCalledTimes(2);
  });
});
