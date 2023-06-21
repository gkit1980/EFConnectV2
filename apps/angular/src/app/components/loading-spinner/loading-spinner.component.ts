import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Observable } from "rxjs";
import { SpinnerService } from "@insis-portal/services/spinner.service";

@Component({
	selector: "app-loading-spinner",
	templateUrl: "./loading-spinner.component.html",
	styleUrls: ["./loading-spinner.component.scss"]
})

export class LoadingSpinnerComponent implements OnInit {

	 @ViewChild('spinnerElement') spinnerElement: ElementRef;

	readonly displayPopup = true;

	isLoading$: Observable<boolean>;
	isVisible$: Observable<boolean>;
	topPosition$: Observable<number>;
	leftPosition$: Observable<number>;
	messageChanged$: Observable<string>

	constructor(private spinnerService: SpinnerService) {

  }

	top:Number=0;
	left:number=0;
	styleObj:any;

	ngOnInit(): void {
		this.isLoading$ = this.spinnerService.isLoading$;
		this.isVisible$ = this.spinnerService.isVisible$;
		this.messageChanged$ = this.spinnerService.messageChanged$;

	//	this.left=this.spinnerElement.nativeElement.clientWidth;

		this.spinnerService.topPositionSubj$.subscribe((x:any)=>
		{
         this.top=x;
         if(this.top==0)
		 this.styleObj={}
		 else
		 {
			this.styleObj={
				'position': 'absolute',
				'top.px': this.top,
				'left.px': Math.floor(this.left/2),
			 }
		 }

		});

		// this.spinnerService.leftPositionSubj$.subscribe((x:any)=>
		// {
        //  this.left=this.spinnerElement.nativeElement.clientWidth;
		// });

	}



    getSpinnerStyle(): object {

		if(this.top==0)
        return {};
		else
		{
        return {
            'position': 'absolute',
            'top.px': this.top,
			'left.px': Math.floor(this.left/2),
         };
	   }
    }



}
