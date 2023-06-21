
import { Component, OnInit, ViewChild,ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IceSectionComponent } from '@impeo/ng-ice';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import {  IndexedValue } from '@impeo/ice-core';
import { MatPaginator} from '@angular/material/paginator';
import {  MatSort } from '@angular/material/sort';
import {  MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { environment } from "../../../../../../../apps/angular/src/environments/environment";
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';
import { ModalService } from '@insis-portal/services/modal.service';
import {PageEvent} from '@angular/material/paginator';
import { takeUntil } from 'rxjs/operators';


export interface RequestClosed {

  CaseNumber: string;
  FullName: string;
  Contract: String;
  IncidentDate: Date;
  PaymentAmount:string;
  RequestedAmount:string;
  ClaimNumber: string;
  Documents: string;
}


@Component({
  selector: 'app-eclaims-requests-closed',
  templateUrl: './eclaims-requests-closed.component.html',
  styleUrls: ['./eclaims-requests-closed.component.scss']
})
export class EclaimsRequestsClosedComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

  constructor(parent: IceSectionComponent, private activeRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef, private modalService: NgbModal, public ngbModal: NgbModal, public modalserv: ModalService) {
    super(parent);
}

displayedColumns: string[] = ['IncidentDate', 'CaseNumber', 'ClaimNumber', 'InsuredName', 'RequestedAmount','PaymentAmount','Contract', 'Documents'];
dataSource: MatTableDataSource<RequestClosed>;
Requests: any[] = [];
Documents: any[] = [];
filteredData: any[] = [];
MobileRequestsArray: any[] = [];
InitShowRequestNumber: number = 0;
selectedFitlerDate: string = 'Newest';
selectedFilterStatus: string = 'Όλα';
filterDates: any = ['Newest', 'Oldest'];
filterStatuses: any = ['Όλα'];
showDash: boolean = false;
groupClaimsMessage : string = "Δεν υπάρχουν κλειστά αιτήματα";
groupClaimsExist : boolean = false;
contentLoaded = false;
private  requestsClosed: Subscription;
private subscription: Subscription = new Subscription();
docText : string = "Έγγραφα";
dialogRef: NgbModalRef;
visible: boolean =false;
collapse: any[] = [];
start: number = 0;

currentItemsToShow: any[] = [];

private destroy$ = new Subject<void>();

//pagination values
pageEvent: PageEvent;


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
    'eclaims.valuation.closed.requests'
  ]
    .getValue()
    .forIndex(null) as boolean;

  hasRequestEnded ? (this.contentLoaded = true) : (this.contentLoaded = false);

  this.requestsClosed = this.iceModel.elements[
    'eclaims.valuation.closed.requests'
  ].$dataModelValueChange.subscribe((value: IndexedValue) => {
    if (value.element.getValue().forIndex(null)) {
      this.addItems();
      this.contentLoaded = true;
    } else {
      this.contentLoaded = false;
    }
  });
  this.subscription.add(this.requestsClosed);


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
    this.Requests= this.iceModel.elements["eclaims.requests.closed.array"].getValue().values[0].value;

    this.Requests=this.Requests.map((item:any)=>{

      var newItem= {
        "Id": item.Id,
        "CaseNumber": item.CaseNumber,
        //"Name": item.Name,
        "InsuredName": item.InsuredName,
        "Contract" : item.Contract,
        "ClaimNumber": (item.ClaimNumber==undefined)? "---": item.ClaimNumber,
        "IncidentDate" : (item.IncidentDate=="")? "---" : item.IncidentDate,
        "PaymentAmount": (item.PaymentAmount==undefined) ? "---" : Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(item.PaymentAmount).toString(),
        "RequestedAmount": (item.RequestedAmount==undefined) ? "---" : Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(item.RequestedAmount).toString(),
        "collapse": true
      }
      //this.collapse[newItem.Id] = false;
      return newItem;
   })


    if(this.Requests.length>0)
    this.groupClaimsExist=true;


   this.dataSource = new MatTableDataSource<RequestClosed>(this.Requests);
   this.MobileRequestsArray=this.Requests.slice(0,5);
   this.dataSource.sort = this.sort;
   this.filteredData=this.Requests;
   this.currentItemsToShow=this.Requests;
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
    if (row.css) {
      return row.css
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

  mobileRequestCollapse(index: number) {
    this.filteredData[index].active = !this.filteredData[index].active;
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

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
  //  throw new Error('Method not implemented.');
  this.subscription.unsubscribe();
  this.destroy$.complete();
  }

  async DocumentsPopUp(item : any) {
    this.visible = true;
    this.context.iceModel.elements['eclaims.request.caseId'].setSimpleValue(item.Id);
    let action = this.context.iceModel.actions["action-request-getallfiles"];
    if(action){
      let executionRule = action.executionRules[0];
      await this.context.executeExecutionRule(executionRule);

      //open Dialog
      let popupPageName = "viewEclaimsDocumentsDialog";
      this.iceModel.elements["eclaims.documents.dialog.close.status"].setSimpleValue(false);
      if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
      PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
      this.modalserv.ismodalOpened();
      this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'documentModal', centered: true });
      this.visible = false;
    }
  }


}
