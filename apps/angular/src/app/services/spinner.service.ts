import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { delay, debounceTime, tap, take } from 'rxjs/operators';

import { IceContextService } from '@impeo/ng-ice';
import { get, forEach } from 'lodash';
import { IceContext, LifecycleType } from '@impeo/ice-core';

@Injectable()
export class SpinnerService {
  private serverOperationStarted: EventEmitter<string>;
  private serverOperationEnded: EventEmitter<string>;
  private subscriptions: { [id: string]: Subscription[] } = {};
  private delayedActions: string[] = [];
  private actionsQueue: string[] = [];
  private ignoreActions = [
    'register-application',
    'upload-single-claim-attachment-action',
    'upload-file',
    'update-claim',
  ];

  private ignoreActionsInDefinitions = [
    {
      definition: 'insis.claim.fnol',
      action: 'action-claim.client.search',
    },
    {
      definition: 'insis.claim.fnol',
      action: 'action-claim.policy.search',
    },
    {
      definition: 'insis.claim.fnol',
      action: 'action-claim.event.type',
    },
  ];

  public visible: Subject<boolean>;

  //
  //
  constructor(private contextService: IceContextService) {
    this.visible = new Subject();

    this.init({
      spinnerShowDelay: 600, // time to wait before showing any spinner
      spinnerHideDebounceTime: 50, // keeps spinner window open for {N}ms
      considerApplicationInnactiveTime: 120 * 1000, // declare application innactive after {N} minutes
    });

    this.contextService.$contextCreated.subscribe((contextAndContextId) => {
      const context = get(contextAndContextId, 'context') as IceContext;
      const actionStart = (actionName: string, definition: string) => {
        if (this.shouldIgnoreAction(actionName, definition)) return;
        this.actionStarted(actionName);
      };

      const actionEnd = (actionName: string, definition: string) => {
        if (this.shouldIgnoreAction(actionName, definition)) return;
        this.actionEnded(actionName);
      };

      context.$lifecycle.subscribe(({ type, payload }) => {
        if (type === LifecycleType.ACTION_STARTED) {
          actionStart(payload.action, context.definition);
        } else if (type === LifecycleType.ACTION_FINISHED || type === LifecycleType.ACTION_FAILED) {
          actionEnd(payload.action, context.definition);
        } else if (
          type === LifecycleType.ICE_CONTEXT_DEACTIVATED ||
          type === LifecycleType.ICE_APP_UNLOAD
        ) {
          // reset spinner state
          this.delayedActions = [];
          this.actionsQueue = [];
          this.visible.next(this.makeNext());
        }
      });
    });
  }

  //
  //
  public start(actionName, suppress?: boolean): void {
    if (suppress) return;
    this.serverOperationStarted.emit(actionName);
  }

  //
  //
  public stop(actionName, suppress?: boolean): void {
    if (suppress) return;
    this.serverOperationEnded.emit(actionName);
  }

  shouldIgnoreAction = (actionName: string, definition: string) =>
    this.ignoreActions.indexOf(actionName) >= 0 ||
    this.ignoreActionsInDefinitions.find(
      (potential) => definition.includes(potential.definition) && potential.action === actionName
    );

  removeFromList = (actionName, list) => {
    const index = list.indexOf(actionName);
    if (index >= 0) {
      list.splice(index, 1);
    }
  };

  removeFromQueue = (actionName) => {
    this.removeFromList(actionName, this.actionsQueue);
  };

  removeFromDelayed = (actionName) => {
    this.removeFromList(actionName, this.delayedActions);
  };

  isDelayedAction = (actionName) => this.delayedActions.indexOf(actionName) >= 0;

  makeNext = () => this.actionsQueue.length > 0;

  //
  //
  private init(options: any): void {
    this.serverOperationStarted = new EventEmitter<string>();
    this.serverOperationEnded = new EventEmitter<string>();
    this.actionsQueue = [];

    this.serverOperationStarted
      .pipe(
        tap((actionName) => {
          this.delayedActions.push(actionName);
        })
      )
      .pipe(delay(options.spinnerShowDelay))
      .subscribe((actionName) => {
        if (this.isDelayedAction(actionName)) {
          this.removeFromDelayed(actionName);
          this.actionsQueue.push(actionName);
          this.visible.next(this.makeNext());
        }
      });

    this.serverOperationEnded
      .pipe(
        tap((actionName) => {
          this.removeFromDelayed(actionName);
          this.removeFromQueue(actionName);
        }),
        debounceTime(options.spinnerHideDebounceTime)
      )
      .subscribe(() => {
        this.visible.next(this.makeNext());
      });
  }

  private actionStarted(actionName: string): void {
    this.start(actionName, false);
  }

  private actionEnded(actionName: string): void {
    this.stop(actionName, false);
  }
}
