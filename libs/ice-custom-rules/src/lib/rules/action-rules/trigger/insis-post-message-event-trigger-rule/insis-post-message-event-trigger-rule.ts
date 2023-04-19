import { TriggerRule } from '@impeo/ice-core';
import { Subscription, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { get } from 'lodash';

export class InsisPostMessageEventTriggerRule extends TriggerRule {
  protected registerTriggers(): Subscription[] {
    if (typeof window === 'undefined') return [];

    const eventName = this.requireParam('event');
    const event$ = fromEvent(window, 'message')
      .pipe(
        filter(({ data }: MessageEvent) => {
          return get(data, 'type') === 'ice' && get(data, 'event') === eventName;
        })
      )
      .subscribe(() => {
        this.action.execute({ event: eventName });
      });

    return [event$];
  }
}
