import { TriggerRule, IceConsole, IceUtil, IceClientRuntime } from '@impeo/ice-core';
import { Subscription, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isUndefined } from 'lodash';
import { timer } from 'rxjs';
import * as isNode from 'detect-node';

export class TimerTriggerRule extends TriggerRule {
  protected registerTriggers(): Subscription[] {
    // if ((this.context.runtime as IceClientRuntime) == null) return;

    if (isNode) return;

    const interval = this.getParam('intervalMs') as number;
    console.log('TimerTriggerRule registerTriggers', interval);

    const subscribe = timer(interval, interval).subscribe((val) => {
      if (this.context.active) this.action.execute();
    });

    return [subscribe];
  }
}
