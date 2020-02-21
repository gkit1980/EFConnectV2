import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { delay, map, debounceTime } from 'rxjs/operators';

import { IceContextService } from '@impeo/ng-ice';
import { get } from 'lodash';

@Injectable()
export class SpinnerService {
  // counter of ongoing server operations - used to decide wether to show the spinner or not
  private outstandingSpinnerShowRequests: number;
  private serverOperationStarted: EventEmitter<void>;
  private serverOperationEnded: EventEmitter<void>;
  private subscriptions: { [id: string]: Subscription[] } = {};

  public visible: Subject<boolean>;

  //
  //
  constructor(private contextService: IceContextService) {
    this.visible = new Subject();

    this.init({
      spinnerShowDelay: 600, // time to wait before showing any spinner
      spinnerHideDebounceTime: 750 // keeps spinner window open for 0.75s
    });

    this.contextService.$contextCreated.subscribe(contextAndContextId => {
      const context = get(contextAndContextId, 'context');
      const contextId = get(contextAndContextId, 'contextId');
      this.subscriptions[contextId] = [];
      this.subscriptions[contextId].push(
        context.$actionStarted.subscribe((actionName: string) => {
          this.actionStarted(actionName);
        }),
        context.$actionEnded.subscribe((actionName: string) => {
          this.actionEnded(actionName);
        })
      );
    });
  }

  //
  //
  public start(suppress?: boolean): void {
    if (suppress) return;
    this.serverOperationStarted.emit();
  }

  //
  //
  public stop(suppress?: boolean): void {
    if (suppress) return;
    this.serverOperationEnded.emit();
  }

  //
  //
  private init(options: any): void {
    this.serverOperationStarted = new EventEmitter<void>();
    this.serverOperationEnded = new EventEmitter<void>();
    this.outstandingSpinnerShowRequests = 0;

    this.serverOperationStarted.pipe(delay(options.spinnerShowDelay)).subscribe(() => {
      this.outstandingSpinnerShowRequests++;
      this.visible.next(this.outstandingSpinnerShowRequests > 0);
    });

    this.serverOperationEnded
      .pipe(
        map(() => {
          this.outstandingSpinnerShowRequests--;
        }),
        debounceTime(options.spinnerHideDebounceTime)
      )
      .subscribe(() => {
        this.visible.next(this.outstandingSpinnerShowRequests > 0);
      });
  }

  private actionStarted(actionName: string): void {
    if (actionName === 'register-application') return;
    this.start(false);
  }

  private actionEnded(actionName: string): void {
    if (actionName === 'register-application') return;
    this.stop(false);
  }
}
