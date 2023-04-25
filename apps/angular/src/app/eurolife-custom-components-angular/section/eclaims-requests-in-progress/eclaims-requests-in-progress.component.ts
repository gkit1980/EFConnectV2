
import { Component, OnInit, ViewChild,ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IceSectionComponent } from '@impeo/ng-ice';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { IndexedValue } from '@impeo/ice-core';
import {  NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from '../../page/pop-up-page/pop-up-page.component';
import { ModalService } from '../../../services/modal.service';
import { takeUntil } from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';



export interface RequestInProgress {
  Contract:string;
  CaseNumber: string;
  FullName: string;
  IncidentDate: Date;
  PaymentAmount:string;
  ClaimNumber:string;
  Documents: string;

}


@Component({
  selector: 'app-eclaims-requests-in-progress',
  templateUrl: './eclaims-requests-in-progress.component.html',
  styleUrls: ['./eclaims-requests-in-progress.component.scss']
})
export class EclaimsRequestsInProgressComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

  constructor(parent: IceSectionComponent, private activeRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef,public ngbModal: NgbModal, public modalService: ModalService) {
    super(parent);
}

displayedColumns: string[] = ['IncidentDate','CaseNumber','ClaimNumber', 'FullName', 'PaymentAmount','Contract','Documents'];
dataSource: MatTableDataSource<RequestInProgress>;
Requests: any[] = [];
filteredData: any[] = [];
MobileRequestsArray: any[] = [];
InitShowRequestNumber: number = 0;
selectedFitlerDate: string = 'Newest';
selectedFilterStatus: string = 'Όλα';
filterDates: any = ['Newest', 'Oldest'];
filterStatuses: any = ['Όλα'];
showDash: boolean = false;
groupClaimsMessage : string = "Δεν υπάρχουν αιτήματα σε εξέλιξη";
groupClaimsExist : boolean = false;
contentLoaded = false;
private  requestsInprogress: Subscription;
private subscription: Subscription = new Subscription();
docText:string ="Έγγραφα";
dialogRef: NgbModalRef;
visible: boolean =false;

private destroy$ = new Subject<void>();

hideRuleContent:boolean[] = [];
collapse: boolean = false;

//pagination values
pageEvent: PageEvent;
start: number = 0;

//Labels
sortBy = 'pages.viewPolicyReceipts.sortBy.label';
newest = 'pages.viewPolicyReceipts.newest.label';
test1 = 'pages.viewPolicyReceipts.test1.label';
status1 = 'pages.viewPolicyReceipts.status1.label';
test2 = 'pages.viewPolicyReceipts.test2.label';


@ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
      this.dataSource.paginator = paginator;
  }
@ViewChild(MatSort) sort: MatSort;



ngOnInit() {
  this.addItems();

  const hasRequestEnded = this.iceModel.elements[
    'eclaims.valuation.inprogress.requests'
  ]
    .getValue()
    .forIndex(null) as boolean;

    hasRequestEnded ? (this.contentLoaded = true) : (this.contentLoaded = false);

  this.requestsInprogress = this.iceModel.elements[
    'eclaims.valuation.inprogress.requests'
  ].$dataModelValueChange.subscribe((value: IndexedValue) => {
    if (value.element.getValue().forIndex(null)) {
      this.addItems();
      this.contentLoaded = true;
    } else {
      this.contentLoaded = false;
    }
  });
  this.subscription.add(this.requestsInprogress);

   //close dialog
   this.context.iceModel.elements['eclaims.documents.dialog.close.status'].$dataModelValueChange.pipe(takeUntil(this.destroy$))
   .subscribe((value: IndexedValue) => {
      const valElem = value.element.getValue().forIndex(null);
      if(valElem && this.dialogRef!=undefined){
        this.ngbModal.dismissAll();
        this.context.iceModel.elements['eclaims.documents.dialog.close.status'].setSimpleValue(false);
      }
    },
    (err: any) =>
      console.error(
        'EclaimsRequestsInProgressComponent eclaims.documents.dialog.close.status',
        err
      )
  );




}


  addItems()
  {

    this.Requests=this.iceModel.elements["eclaims.requests.inprogress.array"].getValue().values[0].value;

    this.Requests=this.Requests.map((item:any)=>{

       var newItem= {
         "Id": item.Id,
         "CaseNumber": item.CaseNumber,
         "Contract" : item.Contract,
         "Name": item.Name,
         "FullName": item.InsuredName,
         "ClaimNumber": (item.ClaimNumber==undefined)? "---": item.ClaimNumber,
         "IncidentDate" : (item.IncidentDate=="")? "---" : item.IncidentDate,
         "PaymentAmount": (item.PaymentAmount==undefined) ? "---" : Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(item.PaymentAmount).toString(),
         "collapse": true
       }

       return newItem;
    })

    if(this.Requests.length>0)
    this.groupClaimsExist=true;

    this.dataSource = new MatTableDataSource<RequestInProgress>(this.Requests);
    this.MobileRequestsArray=this.Requests.slice(0,5);
    this.dataSource.sort = this.sort;
    this.filteredData=this.Requests;
  }

  onPageChanged(pageEvent: PageEvent) {
    const end = (pageEvent.pageIndex + 1) * pageEvent.pageSize;
    this.start = pageEvent.pageIndex * pageEvent.pageSize;
    this.MobileRequestsArray = this.filteredData.slice(this.start,end)
  }

  formatDate(date: any) {
    if (date == null)
        return null;
    else
        return new Date(date);
}


getGridColumnClass(col: any) {
    return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
};


getSectionClass(row: any) {
    // let result: any;
    if (row.css) {
        return row.css;
        // let dt_name = this.context.iceModel.elements[row.css].recipe.dtName;
        // let dt = this.page.iceModel.dts[dt_name];
        // if (dt) {
        //     result = dt.evaluateSync();
        //     return result.defaultValue;
        }
        else
          return "";
    }



getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
}

handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '25');
    svg.setAttribute('height', '25');
    svg.setAttribute('pointer', 'cursor');
    return svg;
}


  onOptionChange() {
    this.filteredData = this.Requests;
    this.InitShowRequestNumber = 10;

    if (this.selectedFitlerDate === 'Newest')
    {
        this.filteredData = this.getSortDataDesc();
        this.MobileRequestsArray = this.filteredData.slice(0, this.InitShowRequestNumber)
    }
    else if (this.selectedFitlerDate === 'Oldest')
    {
        this.filteredData = this.getSortDataAsc();
        this.MobileRequestsArray = this.filteredData.slice(0, this.InitShowRequestNumber)
    }

    if (this.selectedFilterStatus !== 'Όλα')
    {
        this.filteredData = this.filteredData.filter((item: any) => {
            return item.ReceiptStatusDescription === this.selectedFilterStatus
        })
        this.MobileRequestsArray = this.filteredData.slice(0, this.InitShowRequestNumber)
    } else
    {
        this.MobileRequestsArray = this.filteredData.slice(0, this.InitShowRequestNumber)
    }
}

mobileRequestCollapse(item: any) {
  this.filteredData[item].active = !this.filteredData[item].active
}

toggleCollapse(item: any): void {
  item.collapse = !item.collapse;
}

getSortDataAsc() {
  return this.filteredData.sort((a:any, b:any) =>
  {
  a = a.IncidentDate.split('-');
  b = b.IncidentDate.split('-');
  return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
  })
}

getSortDataDesc() {
    return this.filteredData.sort((a:any, b:any) =>
    {
      a = a.IncidentDate.split('-');
      b = b.IncidentDate.split('-');
      return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];

    })

}

async DocumentsPopUp(item: any) {
  this.visible = true;
  console.log("visible in Document", this.visible)
  this.context.iceModel.elements['eclaims.request.caseId'].setSimpleValue(item.Id);
  let action = this.context.iceModel.actions["action-request-getallfiles"];
  if (action) {

    console.log("visible in action", this.visible)
    await action.executionRules[0].execute();

    //open Dialog
    let popupPageName = "viewEclaimsDocumentsDialog";
    this.iceModel.elements["eclaims.documents.dialog.close.status"].setSimpleValue(false);
    if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
    PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
    this.modalService.ismodalOpened();
    this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'documentModal', centered: true });
    this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
    this.visible = false;
  }

}

ngAfterViewInit (){
  this.dataSource.sort = this.sort;
}


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.complete();
  //  throw new Error('Method not implemented.');
  }




}
