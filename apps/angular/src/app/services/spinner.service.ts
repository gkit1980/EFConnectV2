import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, map, debounceTime } from 'rxjs/operators';
import { IceContext, LifecycleType } from '@impeo/ice-core';
import { IceContextService } from '@impeo/ng-ice';
import { get } from "lodash";

@Injectable()
export class SpinnerService {

	// counter of ongoing server operations - used to decide wether to show the spinner or not
	public outstandingSpinnerShowRequests: number;
	private serverOperationStarted: EventEmitter<string>;
	private serverOperationEnded: EventEmitter<string>;
  private delayedActions: string[] = [];
  private actionsQueue: string[] = [];

	private ignoreActions = [
	'actionGetPolicies',
	'actionGetDocumentTypes',
	'actionGetUserNotesPerUrl',
	'actionGetCustomerFullData',
	'actionGetGdprData',
	'actionAmendmentsOnInit',
	'actionGetConsents',
	'actionGetLastURLNote',
	'actionGetStatements'
  ];


  private ignoreActionsInDefinitions = [
    {
      definition: 'customerArea',
      action: 'something',
    },
    {
      definition: 'customerArea',
      action: 'something',
    }
  ];

  public visible: Subject<boolean>;

	private isLoadingSubj = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubj.asObservable();

	private isVisibleSubj = new BehaviorSubject<boolean>(false);
	isVisible$ = this.isVisibleSubj.asObservable();

    //Position top,left

	private topPositionSubj = new BehaviorSubject<number>(0);
	topPositionSubj$ = this.topPositionSubj.asObservable();

	private leftPositionSubj = new BehaviorSubject<number>(0);
	leftPositionSubj$ = this.leftPositionSubj.asObservable();



	private messageChangedSubj = new BehaviorSubject<string>('');
	messageChanged$ = this.messageChangedSubj.asObservable();

	//
	//
	constructor(private contextService: IceContextService) {
		this.init({
			spinnerShowDelay: 600, // time to wait before showing any spinner
			spinnerHideDebounceTime: 50, // keeps spinner window open for 50ms
			considerApplicationInnactiveTime: (120 * 1000) // declare application innactive after 2 minutes
		});



    /////////start
		// let context = this.contextService.getContext;

		// context.$actionStarted.subscribe((actionName: string) =>
		// {
		// 	if (this.shouldIgnoreAction(actionName)) return;

		// 	if(actionName=="action-commit-customer-consents")   //specific case
		// 	{
		// 	this.loadingOn();
		// 	}


		// 	this.actionStarted(actionName);
		// });
		// context.$actionEnded.subscribe((actionName: string) =>
		// {
		// 	this.actionEnded(actionName);
		// 	this.loadingOff();

		// });

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

    /////////end
	}


  shouldIgnoreAction = (actionName: string, definition: string) =>
    this.ignoreActions.indexOf(actionName) >= 0 ||
    this.ignoreActionsInDefinitions.find(
      (potential) => definition.includes(potential.definition) && potential.action === actionName
    );

	public start(actionName:string, suppress?: boolean): void {
		if (suppress) return;
    this.serverOperationStarted.emit(actionName);
	}

	public stop(actionName:string,suppress?: boolean): void {
		if (suppress) return;
		this.serverOperationEnded.emit(actionName);
	}

	public setMessage(message: string): void {
		this.messageChangedSubj.next(message);
	}

	private init(options: any): void {

		this.serverOperationStarted = new EventEmitter<string>();
		this.serverOperationEnded = new EventEmitter<string>();
		this.outstandingSpinnerShowRequests = 0;

		this.serverOperationStarted
			.pipe(delay(options.spinnerShowDelay))
			.subscribe((actionName) => {
				this.outstandingSpinnerShowRequests++;
				this.isVisibleSubj.next(this.outstandingSpinnerShowRequests > 0);
			});

		this.serverOperationEnded
			.pipe(
				map(() => { this.outstandingSpinnerShowRequests--; }),
				debounceTime(options.spinnerHideDebounceTime)
			)
			.subscribe((actionName) => {
				this.isVisibleSubj.next(this.outstandingSpinnerShowRequests > 0);
			});
	}

	private actionStarted(actionName: string): void {
		this.start(actionName, false);
	}

	private actionEnded(actionName: string): void {
	    this.stop(actionName, false);

	}

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

	loadingOn() {
		this.isLoadingSubj.next(true);
	}

	loadingOff() {
		this.isLoadingSubj.next(false);
	}


	setTopPosition(pos:number)
	{
		this.topPositionSubj.next(pos);
	}

	setLeftPosition(pos:number)
	{
		this.leftPositionSubj.next(pos)
	}
}
