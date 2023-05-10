
import { environment } from './../../../../environments/environment';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IceElement,LifecycleEvent } from '@impeo/ice-core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { LifecycleType } from '@impeo/ice-core';
import { SpinnerService } from '../../../services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CommunicationService } from '../../../services/communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pending-payment',
  templateUrl: './pending-payment.component.html',
  styleUrls: ['./pending-payment.component.scss']
})
export class PendingPaymentComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<any>;
  cols: string[];
  table: MatTable<any>;
  selectedRow: any;
  selectionElement: IceElement;
  allReceipts: any[] = [];
  allUnpaidReceipts: any[] = [];
  allLastNotes: any[] = [];
  filterCols: string[] = [];
  indexPos: number;
  dataWithNoteURLs: any[] = [];
  isLooped: boolean = false;
  data: any;
  showUnpaidReceipts: boolean = false;
  showLastReceipts: boolean = false;
  showLastNotes: boolean = false;     //add
  showPendingPayments: boolean =false;
  refreshCounter: number = 0;
  currentPaymentCode: any;
  branch: any;
  amount: any;
  contentLoaded:boolean=false;
  showSpinnerBtnArr: boolean[] = [];
  private queryParamMapSubs: Subscription;
  private datastoreSubs: Subscription;
  private getLastURLNoteSubs: Subscription;
  private subscription: Subscription = new Subscription();

  constructor(parent: IceSectionComponent, private SpinnerService: SpinnerService,
    private activateRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private communicationService: CommunicationService,
    private route: Router) {
    super(parent);
  }


  title = 'sections.simplePageNoPagination.title.label';
  dateR = 'sections.simplePageNoPagination.dateR.label';
  dateP = 'sections.simplePageNoPagination.dateP.label';
  contractKey = 'sections.simplePageNoPagination.contractKey.label';
  paymentCode = 'sections.simplePageNoPagination.paymentCode.label';
  lastPayments = 'sections.simplePageNoPagination.lastPayments.label';
  lastNotes = 'sections.simplePageNoPagination.lastNotes.label';
  dateSub = 'sections.simplePageNoPagination.dateSub.label';
  wayPayment = 'sections.simplePageNoPagination.wayPayment.label';
  request = 'sections.simplePageNoPagination.request.label';



  pendingPayments = 'sections.pendingPayment.pendingPayments.label';      //add
  dateRenewal = 'sections.pendingPayment.dateRenewal.label';             //add
  totalAmount = 'sections.pendingPayment.amount.label';                       //add
  autoPayment=  'sections.pendingPayment.autoPayment.label';                  //add
  paymentButton = 'sections.pendingPayment.paymentButton.label'              //add
  alert = 'sections.pendingPayment.alert.label';                     //add
  loadingButton = 'sections.pendingPayment.loadingButton.label';



  ngOnInit() {

    //
    super.ngOnInit();


    this.queryParamMapSubs = this.activateRoute.queryParamMap.subscribe((params: any) => {
      if (params.params.email != null) {
        this.localStorage.setDataToLocalStorage("email", params.params.email);
      }

    });
    this.subscription.add(this.queryParamMapSubs);


    if (_.has(this.recipe, 'dataStore'))
    {
      this.datastoreSubs = this.context.$lifecycle.subscribe(event => {
        if (event.type == LifecycleType.ICE_MODEL_READY) {
          this.data = this.context.dataStore[this.recipe.dataStore];
          if(this.data==undefined) return;
          // this.SpinnerService.stop();
          if (this.localStorage.getDataFromLocalStorage("refreshStatus") == 1)
          {
            this.refreshCounter++;
            if(this.data!=undefined)
            {
              this.isLooped=false;
              this.localStorage.setDataToLocalStorage("refreshStatus", 0);
            }

          }

          if (!this.isLooped) {
            this.showData(this.data);
            this.isLooped=true;

          }

        }

        this.getLastURLNoteSubs = this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

          const actionName = _.get(e, ['payload', 'action']);

          if (actionName.includes("actionGetLastURLNote") && e.type === 'ACTION_FINISHED') {
            this.dataWithNoteURLs = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
           // this.context.$actionEnded.observers.pop();
          }

        });
        this.subscription.add(this.getLastURLNoteSubs);

      });
      this.subscription.add(this.datastoreSubs);

    }

    this.data = _.get(this.context.dataStore, this.recipe.dataStore);
    if(this.data!= undefined && !this.isLooped)
    {
      this.showData(this.data);
      this.isLooped=true;
    }




  }

  handleSVGPaymentCode(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    return svg;
  }


  filtercols(cols: any[]): string[] {
    var filtelCols = new Array;

    for (let item of cols) {
      if (item != "contractNum") {
        filtelCols.push(item);
      }
    }
    return filtelCols;
  }

  getBranchClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life_text';
      case 'ΥΓΕΙΑΣ':
        return 'health_text';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor_text';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house_text';
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings_text';
      case 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ':
        return 'otherpc_text';
      case 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ':
        return 'otherpc_text';
    }
  }




  selectRow(row: any): void {

    this.selectedRow = row;
    if (!this.selectionElement)
      return;
    var index = _.indexOf(this.dataSource.data, row);
    this.selectionElement.setSimpleValue(index);
  }

  getLabelName(col: string): string {
    // var name=this.context.iceResource.resolve("sections.home." + this.section.name + "." + col, "[" + col + "]")
    var name = this.resource.resolve("sections.home." + this.section.name + "." + col, col)
    return name;
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  orderByDate(arr: any[], dateProp: any) {
    return arr.slice().sort(function (a, b) {
      return b[dateProp] < a[dateProp] ? -1 : 1;
    });
  }

  showIcon(col: any): boolean {
    if (col === "contract")
      return true;
    else
      return false;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; float: right; fill: #383b38');
    svg.setAttribute('width', '29');
    svg.setAttribute('height', '30');

    return svg;
  }

  handleSVGLastPay(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; float: right; fill: #383b38');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }


  async getLastNotePdfLink(receiptId: any, idx: number) {
    try {
      this.showSpinnerBtnArr[idx] = true;
      this.context.iceModel.elements['statement.pdf.base64'].setSimpleValue(null);
      this.context.iceModel.elements['receipts.url'].setSimpleValue(receiptId);
      const action = this.context.iceModel.actions['actionGetHomePdf'];
      if (action) {
        await action.executionRules[0].execute();
        await action.executionRules[1].execute();
        this.showSpinnerBtnArr[idx] = false;
      }
    } catch (error) {
      this.showSpinnerBtnArr[idx] = false;
      console.error('PendingPaymentComponent getLastNotePdfLink', error);
    }
  }


  showDownloadButton(receiptId: any): boolean {

    if (this.allUnpaidReceipts.length != 0) {
      for (let i in this.allUnpaidReceipts) {
        try {
          let specificReceipt = this.dataWithNoteURLs[this.allUnpaidReceipts[i].index].Receipts.filter((x: any) => {
            if (x.ReceiptKey == receiptId)
              return x;
          });


          if (specificReceipt.length == 0)
            continue;


          if (specificReceipt[0].UrlNote === "")
            return false;
          else
            return true;

        }
        catch (error) {
          return false;
        }
      }
    }
    return false;

  }

  showLastNoteButton(receiptId: any): boolean {
    try {
      if (receiptId == "" || receiptId == undefined) {
        return false;
      }
      else
        return true;
    }
    catch (error) {
      return;
    }
  }

  handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');

    return svg;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '70');
    svg.setAttribute('height', '70');

    return svg;
  }

  opacityForPayment(row:any):string
  {

  if(row.paymentCode != null && (row.paymentType === 'ΜΕΤΡΗΤΑ' || row.paymentType === 'ΕΛΤΑ'))
   return " ";
  else
  return "enable-opacity";
  }

  showData(data: any) {
//    this.isLooped = true;
    if (data) {

      for (let i = 0; i < data.length; i++) {
        // var newRow: any = {};

        var contract = data[i].ProductDescritpion;
        // var contractNum = data[i].ContractKey;
        // var branch = data[i].Branch;

        if (data[i].Branch === "ΖΩΗΣ" || data[i].Branch === "ΥΓΕΙΑΣ" || data[i].Branch === "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ") {
          this.communicationService.emitChange(true);
          this.localStorage.setDataToLocalStorage("dropDownDocs", true);
        }
        else {
          this.localStorage.setDataToLocalStorage("dropDownDocs", false);
        }


        if (data[i].Branch != "")      //All Branches follow the same logic including 'Motor'
        {
        for (let j = 0; j < data[i].Receipts.length; j++)
           {

            if (data[i].Receipts[j].ReceiptStatusDescription == "Ανείσπρακτη" && data[i].Receipts[j].GrossPremium>0)
             {
                this.indexPos = i
                this.showUnpaidReceipts = true;

                //*Extra Rule for payment codes
                //1.
                if(data[i].Branch=="ΥΓΕΙΑΣ" || data[i].Branch=="ΖΩΗΣ" ||  data[i].Branch=="ΠΕΡΙΟΥΣΙΑΣ" ||  data[i].Branch=="ΑΥΤΟΚΙΝΗΤΩΝ")
                this.currentPaymentCode = data[i].Receipts[j].paymentCode;
                else
                this.currentPaymentCode="---"


                //*Extra Rule for payment codes
                //2.
                if(data[i].Receipts[j].PaymentType == 'ΠΑΓΙΑ ΕΝΤΟΛΗ' || data[i].Receipts[j].PaymentType == 'ΛΟΓΑΡΙΑΣΜΟΣ ΔΑΝΕΙΟΥ' || data[i].Receipts[j].PaymentType == 'ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ')
                this.currentPaymentCode="---"



                this.amount = data[i].Receipts[j].GrossPremium;
                this.branch = data[i].Branch;
                var newRowUnpaid: any = {};
                newRowUnpaid["contract"] = contract;
                newRowUnpaid["contractNum"] = data[i].ContractKey;    //this will be hidden for UnpaidReceipts
                newRowUnpaid["paymentCode"] = this.currentPaymentCode;
                newRowUnpaid["amount"] = this.amount+"€";
                newRowUnpaid["renewal"] = this.formatDate(data[i].Receipts[j].StartDate);
                newRowUnpaid["branch"] = this.branch;
                newRowUnpaid["receiptKey"] = data[i].Receipts[j].ReceiptKey;
                newRowUnpaid["paymentType"] = data[i].Receipts[j].PaymentType;

                newRowUnpaid["urlNote"] = data[i].Receipts[j].UrlNote;

                newRowUnpaid["AccountNumber"] = "Αυτόματη Πληρωμή: **" + data[i].Receipts[j].AccountNumber;
                newRowUnpaid["index"] = this.indexPos;
                this.allUnpaidReceipts.push(newRowUnpaid);
             }
           }
        }
      //  else
      //   {
      //     let subtractDays = moment(new Date()).subtract(74, 'days');

      //     if(data[i].hasOwnProperty("LastUrlNotes"))
      //     {

      //         for(let j=0;j<data[i].LastUrlNotes.length;j++)
      //         {
      //           if(subtractDays <= moment(data[i].LastUrlNotes[j].docDate))
      //               {
      //                 var newRowUnpaid: any = {};
      //                 newRowUnpaid["contract"] = contract;
      //                 newRowUnpaid["contractNum"] = data[i].ContractKey;
      //                 newRowUnpaid["paymentCode"] = "";
      //                 newRowUnpaid["amount"] = "";
      //                 newRowUnpaid["branch"] = data[i].Branch;
      //                 newRowUnpaid["renewal"] = this.formatDate(this.findRenewalDeateByLastReceipt(data[i]));

      //                 let addDays = moment(new Date()).add(74, 'days');
      //                 if(moment(this.findRenewalDeateByLastReceipt(data[i])) <= addDays)
      //                 {
      //                   newRowUnpaid["urlNote"] = data[i].LastUrlNotes[j].url;
      //                 }
      //                 else
      //                 {
      //                 newRowUnpaid["urlNote"] ="";
      //                 continue;                            //you should not appear the specific receipt
      //                 }

      //                 // newRowUnpaid["urlNote"] = data[i].LastUrlNotes[j].url;
      //                 //newRowUnpaid ["paymentType"] = "ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ";

      //                 newRowUnpaid["index"] = this.index;
      //                 this.allUnpaidReceipts.push(newRowUnpaid);
      //               }
      //         }

      //     }

      //   }



        // this.allReceipts = this.orderByDate(this.allReceipts, "paymentDate");
        this.allUnpaidReceipts = this.orderByDate(this.allUnpaidReceipts, "paymentDate");
        this.allUnpaidReceipts.forEach((val) => this.showSpinnerBtnArr = [...this.showSpinnerBtnArr, false]);


      }


      this.context.iceModel.elements['policy.contract.general.info.indexHolderHome'].setSimpleValue(null);
      this.context.iceModel.elements['policy.contract.general.info.indexHolderHome'].setSimpleValue(this.indexPos);

      this.contentLoaded=true;



    }

  }

  findRenewalDeateByLastReceipt(item:any): string
  {

    if(item.Receipts[0].ReceiptStatusDescription === 'Ανείσπρακτη')
      return this.unpaidReceipts(item);
    else if(item.Receipts[0].ReceiptStatusDescription=== 'Εξοφλημένη'  )
      return item.Receipts[0].EndDate;

  }


  unpaidReceipts(item: any): any {

    let arrayFilterReceiptStatus = item.Receipts.filter((x: any) => x.ReceiptStatusDescription.trim() == 'Ανείσπρακτη');

    if(arrayFilterReceiptStatus.length==0)     //bypass in case unpaid receipts
    return new Date();

    return arrayFilterReceiptStatus.length > 1 ? arrayFilterReceiptStatus[arrayFilterReceiptStatus.length - 1].StartDate : arrayFilterReceiptStatus[0].StartDate;
  }


  onReceipts(row: any) {
    let branch: number;

    //map index of selected contract
    let contractIndex = this.mapContract(row.contractNum);
    var indexOfContractIDType: any;
    //map branches
    if (row.branch == "ΥΓΕΙΑΣ") {
      branch = 1;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      // indexOfContractIDType = this.data[contractIndex].ContractIDType.indexOf('_');
      // this.iceModel.elements["policy.selectedContractIDType"].setSimpleValue(this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1));
    } else if (row.branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ") {
      indexOfContractIDType = this.data[contractIndex].ContractIDType.indexOf('_');
      if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "2") {
        branch = 11;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else {
        branch = 2;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
    } else if (row.branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      branch = 3;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    } else if (row.branch == "ΠΕΡΙΟΥΣΙΑΣ") {
      indexOfContractIDType = this.data[contractIndex].ContractIDType.indexOf('_');
      if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "13") {
        branch = 13;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else {
        branch = 4;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
    } else if (row.branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ") {
      branch = 6;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    } else if (row.branch == "ΣΚΑΦΩΝ") {
      branch = 7;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    } else if (row.branch == "ΑΣΤΙΚΗ ΕΥΘΥΝΗ") {
      branch = 8;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    } else if (row.branch == "ΖΩΗΣ") {
      indexOfContractIDType = this.data[contractIndex].ContractIDType.indexOf('_');
      if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "6") {
        branch = 12;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "3") {
        branch = 15;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "7") {
        branch = 14;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "4") {
        branch = 16;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "5") {
        branch = 17;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else {
        branch = 9;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
    }
    else {
      branch = 5;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    }

    this.iceModel.elements["policy.contract.general.info.ContractID"].setSimpleValue(null);
    this.iceModel.elements["policy.contract.general.info.ContractID"].setSimpleValue(this.data[contractIndex].ContractID);

    //set data to localStorage
    this.localStorage.setDataToLocalStorage("index", contractIndex);
    this.localStorage.setDataToLocalStorage("selectedBranch", this.context.iceModel.elements['policy.selectedBranch'].getValue().values[0].value);
    // this.localStorage.setDataToLocalStorage("selectedContractIDType", this.context.iceModel.elements['policy.selectedContractIDType'].getValue().values[0].value);
    this.localStorage.setDataToLocalStorage("contractID", this.data[contractIndex].ContractID);
    this.localStorage.setDataToLocalStorage("contractKey", row.contractNum);


    //Add in local storage the navigation info
    this.localStorage.setDataToLocalStorage("navigation", this.iceModel.elements["exclude.Navigation.Tab"].getValue().values[0].value);
    this.context.iceModel.elements['policy.contract.general.info.indexHolder'].setSimpleValue(contractIndex);
    this.route.navigate([
      "/ice/default/customerArea.motor/policyDetails"
    ], {
      queryParams: {
        id: 4,
        contractID: row.contractNum,
        branch: branch,
        index: contractIndex,
        redirect: 1

      }
    });
  }

  mapContract(myData: any): number {
    var index = -1;
    for (let item of this.data) {
      if (item.ContractKey === myData)
        return this.data.indexOf(item);
    }
    return index;
  }

  redirectToPayment(row: any) {
    this.context.iceModel.elements["policies.details.TotalUnpaidAmount"].setSimpleValue(row.amount);
    this.route.navigate(['/ice/default/customerArea.motor/paymentManagement']
      , {
        queryParams: {
          paymentCode: row.paymentCode,
          branch: row.branch,
          index: row.contractNum
        }
      });

  }


  redirectPaymentCondition(row: any): boolean {
    if ((row.branch != 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ' && row.branch != 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ' && row.branch != 'ΑΣΤΙΚΗ ΕΥΘΥΝΗ') &&
      row.paymentCode != null &&
      (row.paymentType === 'ΜΕΤΡΗΤΑ' || row.paymentType === 'ΕΛΤΑ')
    )
      return true;
    else
      return false;

  }

  ///*Walkthrough Purpose */

  icon(): string {
    let icon = environment.sitecore_media + "C8705EB508D542E59548EF002F938768" + ".ashx";
    return icon;
  }

  handleSVGIndexIcon(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}






