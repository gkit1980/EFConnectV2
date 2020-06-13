import { TriggerRule, IceConsole, IceUtil } from '@impeo/ice-core';
import { Subscription, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export function getModifierKeys(): string[] {
  return ['ctrl', 'alt', 'meta', 'shift'];
}

export const shortcutParameterName = 'keyCombination';
export const preventDefaultParameterName = 'preventDefault';

export const CantHaveOnlyMultiplerKeysAsShortcutsErrorMessage =
  'Cant have only multiplier keys as shortcut';
export const ParseErrorMessage = 'Error during parsing of your key combination';
export const DoesNotSupportMultipleNonModifierKeys =
  "Shortcuts can't be made of multiple non modifier keys";

function getErrorMessage(modifierKeys: string[], keys: string[]): string {
  let errorMessage = '';
  errorMessage =
    errorMessage ||
    (modifierKeys.length > 0 &&
      keys.length === 0 &&
      CantHaveOnlyMultiplerKeysAsShortcutsErrorMessage);
  errorMessage = errorMessage || (keys.length > 1 && DoesNotSupportMultipleNonModifierKeys);
  return errorMessage;
}

class KeyCombination {
  modifiers: string[];
  key: string;

  constructor(key: string, modifiers: string[]) {
    this.key = key;
    this.modifiers = modifiers;
  }

  static parse(keyCombination: string): KeyCombination {
    const keyCombinationWithModifierKeys: string[] = keyCombination
      .split('+')
      .map((_key) => _key.trim().toLowerCase());

    const modifierKeys =
      keyCombinationWithModifierKeys.filter((_key) => {
        return getModifierKeys().includes(_key);
      }) || [];

    const keys =
      keyCombinationWithModifierKeys.filter((value) => {
        return !getModifierKeys().includes(value);
      }) || [];

    const errorMessage = getErrorMessage(modifierKeys, keys);
    if (errorMessage) IceConsole.error(errorMessage);

    const key = keys[0] || '';

    return new KeyCombination(key, modifierKeys);
  }

  isPressed(keyboardEvent: KeyboardEvent): boolean {
    const modifierKeysPressed = this.modifiers.reduce((previousValue, currentValue) => {
      return previousValue && keyboardEvent[`${currentValue}Key`];
    }, true);
    return (
      modifierKeysPressed &&
      keyboardEvent.code &&
      keyboardEvent.code.toLowerCase().replace('key', '') === this.key
    );
  }
}

export class InsisKeyboardShortcutTriggerRule extends TriggerRule {
  private parseShortcutParameter(shortcutParameter: string): KeyCombination[] {
    const allKeyCombinations: string[] = shortcutParameter
      .split(',')
      .map((combination) => combination.trim().toLowerCase());
    const allKeyCombinationWithModifierKeys: KeyCombination[] = allKeyCombinations.map(
      (keyCombination) => {
        return KeyCombination.parse(keyCombination);
      }
    );
    return allKeyCombinationWithModifierKeys;
  }

  protected registerTriggers(): Subscription[] {
    if (typeof document === 'undefined') return;

    const combinations = this.parseShortcutParameter(this.requireParam(shortcutParameterName));
    const shouldPreventDefault: boolean = this.getParam(preventDefaultParameterName, false);

    const observable = fromEvent(document, 'keyup').pipe(
      filter((keyboardEvent: KeyboardEvent) => {
        return combinations.some((combination) => {
          return combination.isPressed(keyboardEvent);
        });
      })
    );
    return [
      observable.subscribe((event: KeyboardEvent) => {
        if (shouldPreventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (this.getParam('element') && document.activeElement.closest(`div[data-element]`)) {
          // Here we generate an array of all array-item element names
          // that precede the current element, together with current element name
          // eg. [abc~def, abc~def~efg] for element abc~def~efg.
          // This will be needed for forming the indeces array, to send as action context.
          const activeElementName = document.activeElement
            .closest(`div[data-element]`)
            .getAttribute('data-element');
          const indeces: number[] = [];
          let subpaths: string[];
          const pathParts: string[] = activeElementName.split(IceUtil.ARRAY_ITEM_SEPERATOR);
          const arrayLevel: number = pathParts.length - 1;
          if (arrayLevel >= 0) {
            subpaths = new Array<string>(arrayLevel);

            pathParts.forEach((pathPart: string, index: number) => {
              if (index < arrayLevel)
                subpaths[index] = pathParts.slice(0, index + 2).join(IceUtil.ARRAY_ITEM_SEPERATOR);
            });
          }

          if (document.activeElement.closest(`div[data-element="${this.getParam('element')}"]`)) {
            // Prepare action context, i.e. current element's index for action that will be executed.
            // Since index is not element's html attribute, we need to find it out manually.
            subpaths.forEach((subpath) => {
              document.querySelectorAll(`div[data-element="${subpath}"]`).forEach((value, key) => {
                if (value === document.activeElement.closest(`div[data-element="${subpath}"]`))
                  indeces.push(key);
              });
            });

            // If parameter 'index' is set, action will execute
            // only if current element's index matches parameter value.
            if (this.getParam('index')) {
              if (
                !indeces.every((indexItem, index) => {
                  return indexItem === this.getParam('index')[index];
                })
              )
                return;
            }

            this.action.execute({ index: indeces });
          }
          return;
        }

        this.action.execute();
      }),
    ];
  }
}
