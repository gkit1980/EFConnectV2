import { MirrorRule, IceElement, IndexedValue, IceConsole } from '@impeo/ice-core';
import * as _ from 'lodash';

//
//
export class InsisDynIdForKeyWithDefaultMirrorRule extends MirrorRule {
  //
  //
  public registerAtOrigin(): void {
    const path = `${this.context.definition}.dynId`;
    const key = this.requireParam('key');

    this.subscriptions.push(
      this.dataStore.subscribe(path, {
        next: (dataStorePath) => {
          if (dataStorePath !== path) return;
          let value = this.dataStore.get([this.context.definition, 'dynId']) as string;
          if (_.isObject(value)) return IceConsole.warn(`Object is not allowed here`);
          if (value != null && !_.startsWith(value, `${key}:`)) return;
          if (value == null) value = this.getParam('defaultValue', null);
          else value = value.substr(4);
          this.element.setSimpleValue(value);
        },
      })
    );
  }

  protected getOriginElements(): IceElement[] {
    throw new Error(
      'InsisDynIdForKeyWithDefaultMirrorRule: Method getOriginElements() not implemented.'
    );
  }

  protected onElementValueChange(value: IndexedValue): void {
    throw new Error(
      'InsisDynIdForKeyWithDefaultMirrorRule: Method onElementValueChange() not implemented.'
    );
  }
}
