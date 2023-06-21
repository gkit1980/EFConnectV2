
import { Component, OnInit, ViewChild,ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IceSectionComponent } from '@impeo/ng-ice';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { environment } from "@insis-portal/environments/environment";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


export interface Receipt {
    StartDate: Date;
    EndDate: Date;
    GrossPremium: number;
    ReceiptStatusDescription: string;
    PaymentDate: Date;
    PaymentTypeDescription: string;
}



@Component({
    selector: 'app-motor-custom-detail-table-section',
    templateUrl: './motor-custom-detail-table.section.component.html',
    styleUrls: ['./motor-custom-detail-table.section.component.scss']
})
export class MotorCustomDetailTableComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

    constructor(parent: IceSectionComponent, private activeRouter: ActivatedRoute,
        private cdr: ChangeDetectorRef) {
        super(parent);
    }

    selectedDocUrl = 'policy.selectedNote';

    items: any[];
    Receipts: any[] = [];
    filteredData: any[] = [];
    newReceipts: any[] = [];
    displayedColumns: string[] = ['StartDate', 'EndDate', 'GrossPremium', 'ReceiptStatusDescription', 'PaymentDate', 'PaymentTypeDescription', 'UrlNote'];
    dataSource: MatTableDataSource<Receipt>;
    MobileReceiptsArray: any[] = [];
    InitShowReceiptNumber: number = 0;
    selectedFitlerDate: string = 'Newest';
    selectedFilterStatus: string = 'Όλα';
    filterDates: any = ['Newest', 'Oldest'];
    filterStatuses: any = ['Όλα'];
    showDash: boolean = false;
    showSpinnerBtnArr: boolean[] = [];
    private queryParamMapSubs: Subscription;
    private getReceiptsSubs: Subscription;
    private subscription: Subscription = new Subscription();


    title = 'pages.viewPolicyReceipts.title.label';
    receiptType = 'pages.viewPolicyReceipts.receiptType.label';
    startDate = 'pages.viewPolicyReceipts.startDate.label';
    endDate = 'pages.viewPolicyReceipts.endDate.label';
    grossPremium = 'pages.viewPolicyReceipts.grossPremium.label';
    receiptStatus = 'pages.viewPolicyReceipts.receiptStatus.label';
    paymentDate = 'pages.viewPolicyReceipts.paymentDate.label';
    paymentType = 'pages.viewPolicyReceipts.paymentType.label';
    noticeOfPayment = 'pages.viewPolicyReceipts.noticeOfPayment.label';
    sortBy = 'pages.viewPolicyReceipts.sortBy.label';
    newest = 'pages.viewPolicyReceipts.newest.label';
    test1 = 'pages.viewPolicyReceipts.test1.label';
    status1 = 'pages.viewPolicyReceipts.status1.label';
    test2 = 'pages.viewPolicyReceipts.test2.label';
    collapse = 'pages.viewPolicyReceipts.collapse.label';
    startDateReceipt = 'pages.viewPolicyReceipts.startDateReceipt.label';
    endDateReceipt = 'pages.viewPolicyReceipts.endDateReceipt.label';
    incurance = 'pages.viewPolicyReceipts.incurance.label';
    status2 = 'pages.viewPolicyReceipts.status2.label';
    na = 'pages.viewPolicyReceipts.na.label';
    datePaymentReceipt = 'pages.viewPolicyReceipts.datePaymentReceipt.label';
    autoPayment = 'pages.viewPolicyReceipts.autoPayment.label';
    down = 'pages.viewPolicyReceipts.down.label';
    downloadReceipt = 'pages.viewPolicyReceipts.downloadReceipt.label';
    showMoree = 'pages.viewPolicyReceipts.showMore.label';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;



    ngOnInit() {
        super.ngOnInit();
        this.queryParamMapSubs = this.activeRouter.queryParamMap.subscribe(params => {
            if (params.get("redirect") == "1") {
                // this.context.iceModel.elements['policy.contract.general.info.ContractID'].setSimpleValue(params.get("contractID"));
                this.iceModel.elements["policy.contract.general.info.indexHolder"].setSimpleValue(params.get("index"));
                this.iceModel.elements["policy.selectedBranch"].setSimpleValue(params.get("branch"));

                /////SOS! from redirerection....wait to finish actionGetReceipts

                this.getReceiptsSubs = this.context.$actionEnded.subscribe((actionName: string) => {
                    if (actionName.includes("actionGetReceipts")) {

                        this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
                        if (this.items == null)
                            return;

                          //Bug fix
                        this.context.iceModel.elements['policy.contractKey'].setSimpleValue(this.items[index].ContractKey);

                        this.Receipts = this.items[index].Receipts;
                        if (this.Receipts) {
                            for (let item of this.Receipts) {
                                if (item.PaymentType === "ΠΑΓΙΑ ΕΝΤΟΛΗ") {
                                    item.PaymentTypeDescription = item.PaymentType + ' ***' + item.AccountNumber;
                                } else if (item.PaymentType === "ΕΛΤΑ" || item.PaymentType === "ΜΕΤΡΗΤΑ") {
                                    item.PaymentTypeDescription = "ΜΕΤΡΗΤΑ"
                                } else if (item.PaymentType === "ΛΟΓΑΡΙΑΣΜΟΣ ΔΑΝΕΙΟΥ") {
                                    item.PaymentTypeDescription = item.PaymentType + ' ***' + item.AccountNumber;
                                } else if (item.PaymentType === "ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ") {
                                    item.PaymentTypeDescription = item.PaymentType + ' ***' + item.CreditCardNumber;
                                }

                                if (this.items[index].Branch === "ΖΩΗΣ" || this.items[index].Branch === "ΥΓΕΙΑΣ" || this.items[index].Branch === "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ") {
                                    item.ReceiptTypeDescription = "Δόση";
                                } else {
                                    item.ReceiptTypeDescription = "Ανανέωση";
                                }
                            }

                            this.newReceipts = this.Receipts.map(i => {
                                let temp = i;
                                Object.assign(temp, { active: false })
                                return temp;
                            })

                            this.filteredData = this.newReceipts;
                            this.dataSource = new MatTableDataSource<Receipt>(this.Receipts);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.sortByProperty();
                            this.showMore();

                        }


                        this.Receipts.forEach((item: any) => {
                            this.filterStatuses.push(item.ReceiptStatusDescription);
                            this.showSpinnerBtnArr = [...this.showSpinnerBtnArr, false];
                        })
                        this.filterStatuses = Array.from(new Set(this.filterStatuses))
                        this.context.$actionEnded.observers.pop();
                    }
                });
                this.subscription.add(this.getReceiptsSubs);




            }

        });
        this.subscription.add(this.queryParamMapSubs);

        let index = this.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().values[0].value;

        if (index == null)
            return;

        this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        if (this.items == null)
            return;

        //Bug fix
        this.context.iceModel.elements['policy.contractKey'].setSimpleValue(this.items[index].ContractKey);

        this.Receipts = this.items[index].Receipts;
        if (this.Receipts) {
            for (let item of this.Receipts) {
                if (item.PaymentType === "ΠΑΓΙΑ ΕΝΤΟΛΗ") {
                    item.PaymentTypeDescription = item.PaymentType + ' ***' + item.AccountNumber;
                } else if (item.PaymentType === "ΕΛΤΑ" || item.PaymentType === "ΜΕΤΡΗΤΑ") {
                    item.PaymentTypeDescription = "ΜΕΤΡΗΤΑ"
                } else if (item.PaymentType === "ΛΟΓΑΡΙΑΣΜΟΣ ΔΑΝΕΙΟΥ") {
                    item.PaymentTypeDescription = item.PaymentType + ' ***' + item.AccountNumber;
                } else if (item.PaymentType === "ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ") {
                    item.PaymentTypeDescription = item.PaymentType + ' ***' + item.CreditCardNumber;
                }

                if (this.items[index].Branch === "ΖΩΗΣ" || this.items[index].Branch === "ΥΓΕΙΑΣ" || this.items[index].Branch === "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ") {
                    item.ReceiptTypeDescription = "Δόση";
                } else {
                    item.ReceiptTypeDescription = "Ανανέωση";
                }
            }

            this.newReceipts = this.Receipts.map(i => {
                let temp = i;
                Object.assign(temp, { active: false })
                return temp;
            })

            this.filteredData = this.newReceipts;
            this.dataSource = new MatTableDataSource<Receipt>(this.Receipts);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.sortByProperty();
            this.showMore();

        }

        this.Receipts.forEach((item: any) => {
            this.filterStatuses.push(item.ReceiptStatusDescription);
            this.showSpinnerBtnArr = [...this.showSpinnerBtnArr, false];
        })
        this.filterStatuses = Array.from(new Set(this.filterStatuses))

    }

    ngAfterViewChecked(){
        //your code to update the model
        this.cdr.detectChanges();
      }

    showShowMore(): boolean {
        if (this.filteredData.length > this.InitShowReceiptNumber) {
            return true
        } else {
            return false
        }
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
        let result: any;
        if (row.css) {
            let dt_name = this.context.iceModel.elements[row.css].recipe.dtName;
            let dt = this.page.iceModel.dts[dt_name];
            if (dt) {
                result = dt.evaluateSync();
                return result.defaultValue;
            }
        }
        return null;
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



    async getPdfLink(receiptId: any, idx: number) {
        try {
            this.showSpinnerBtnArr[idx] = true;
            const action = this.context.iceModel.actions['actionGetUserNotesPerUrl'];
            if (action) {
                const executionRule0 = action.executionRules[0];
                await this.context.executeExecutionRule(executionRule0);
                const executionRule1 = action.executionRules[1];
                await this.context.executeExecutionRule(executionRule1);
                this.showSpinnerBtnArr[idx] = false;
            }
          } catch (error) {
            this.showSpinnerBtnArr[idx] = false;
            console.error('MotorCustomDetailTableComponent getPdfLink', error);
          }
    }


    addClick(receiptId: any) {
        this.context.iceModel.elements["policy.Documents.print.dividentPDFDocument"].setSimpleValue(null);
        this.context.iceModel.elements["policy.selectedNote"].setSimpleValue(receiptId);
    }

    // getLabel = function (col:string) {
    //  return this.context.resource.resolve("sections.simple-table." + this.section.name + "." + col, "[" + col + "]");
    //     //return this.context.iceResource.getEntry("currency-code");
    // };

    isNoteUrlEmpty(UrlNote: string) {
        if (UrlNote == "")
            return true;
        else
            return false;
    }

    sortByProperty() {
        // sort by property from dropdownlist //
    }

    sortByStatus() {
        // separate sorted receipts by status //
    }

    mobileReceiptCollapse(index: number) {
        this.filteredData[index].active = !this.filteredData[index].active;
    }

    showMore() {
        this.InitShowReceiptNumber += 10;
        this.MobileReceiptsArray = this.filteredData.slice(0, this.InitShowReceiptNumber)
    }

    onOptionChange() {
        this.filteredData = this.Receipts;
        this.InitShowReceiptNumber = 10;
        if (this.selectedFitlerDate === 'Newest') {
            this.filteredData = this.getSortDataDesc();
            this.MobileReceiptsArray = this.filteredData.slice(0, this.InitShowReceiptNumber)
        } else if (this.selectedFitlerDate === 'Oldest') {
            this.filteredData = this.getSortDataAsc();
            this.MobileReceiptsArray = this.filteredData.slice(0, this.InitShowReceiptNumber)
        }

        if (this.selectedFilterStatus !== 'Όλα') {
            this.filteredData = this.filteredData.filter((item: any) => {
                return item.ReceiptStatusDescription === this.selectedFilterStatus
            })
            this.MobileReceiptsArray = this.filteredData.slice(0, this.InitShowReceiptNumber)
        } else {
            this.MobileReceiptsArray = this.filteredData.slice(0, this.InitShowReceiptNumber)
        }
    }

    getSortDataAsc() {
        return this.filteredData.sort((a, b) => {
            return <any>new Date(a.StartDate) - <any>new Date(b.StartDate);
        });
    }

    getSortDataDesc() {
        return this.filteredData.sort((a, b) => {
            return <any>new Date(b.StartDate) - <any>new Date(a.StartDate);
        });
    }

    includeDash(row: any): boolean {
        if (row.cols[0].element === "contract.details.receipts.title") {
            return this.showDash = true;
        }

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}


