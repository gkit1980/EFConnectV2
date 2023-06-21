import { Component, OnInit } from "@angular/core";
import { PageComponentImplementation } from "@impeo/ng-ice";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";




@Component({
  selector: "app-simple-page-no-title",
  templateUrl: "./simple-page-no-title.component.html",
  styleUrls: ["./simple-page-no-title.component.scss"]
})
export class SimplePageNoTitleComponent extends PageComponentImplementation
  implements OnInit {
  // static componentName = "SimplePageNoTitle";

  flag:string="";
  refreshStatus:number;
  returnUrl:String;


  constructor(private localStorage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute
    )
  {
    super();
  }

//this Page is being used viewAmendmentDetails,viewClaimDetails

  ngOnInit() {
    super.ngOnInit();
    this.flag = this.page.recipe['componentFlag']
    this.refreshStatus=this.localStorage.getDataFromLocalStorage("refreshStatus");

    if( this.refreshStatus==1)
    {
      if(this.flag=="amnendmentDetails" || this.flag ==  'amendmentHomeDetails'|| this.flag == 'amendmentHealthDetails' || this.flag == 'amendmentLifeDetails'|| this.flag == 'amendmentFinanceDetails' || this.flag == 'propertyNotificationDetails')
      {
        //Deep Link
        this.route.queryParams.subscribe((params: any) => {
          this.returnUrl = params["returnUrl"] || '//';
          if(this.returnUrl == '//' || this.returnUrl == undefined){
           this.router.navigate(['/ice/default/customerArea.motor/viewAmendments']);
        }
        })
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '//';
        // if(this.returnUrl == '//' || this.returnUrl == undefined){
        //    this.router.navigate(['/ice/default/customerArea.motor/viewAmendments']);
        // }
      }
    }


  }



}
