import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { delay, map, debounceTime } from 'rxjs/operators';

import { IceContextService } from '@impeo/ng-ice';

@Injectable()
export class SpinnerService {

	// counter of ongoing server operations - used to decide wether to show the spinner or not
	public outstandingSpinnerShowRequests: number;
	private serverOperationStarted: EventEmitter<string>;
	private serverOperationEnded: EventEmitter<string>;

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

		let context = this.contextService.getContext;

		context.$actionStarted.subscribe((actionName: string) =>
		{
			if (this.shouldIgnoreAction(actionName)) return;

			if(actionName=="action-commit-customer-consents")   //specific case
			{
			this.loadingOn();
			}


			this.actionStarted(actionName);
		});
		context.$actionEnded.subscribe((actionName: string) =>
		{
			this.actionEnded(actionName);
			this.loadingOff();

		});

	}

	public shouldIgnoreAction(actionName:string): boolean
	{
	  return this.ignoreActions.indexOf(actionName) >= 0 || actionName.toLowerCase().includes('details');
	}

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
