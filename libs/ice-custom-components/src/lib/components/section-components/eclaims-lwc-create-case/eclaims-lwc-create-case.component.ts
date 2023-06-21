import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IndexedValue,LifecycleEvent } from '@impeo/ice-core';
import {
  IceSectionComponent,
  SectionComponentImplementation,
} from '@impeo/ng-ice';
import * as jwt_token from 'jwt-decode';
import { combineLatest, Subject, throwError } from 'rxjs';
import { catchError, map, startWith, takeUntil } from 'rxjs/operators';
import { Coverage } from '@insis-portal/models/coverage.model';
import { EclaimsLwcCreateCaseService } from '@insis-portal/services/eclaims-lwc-create-case.service';
import { SpinnerService } from '@insis-portal/services/spinner.service';
import { environment } from '@insis-portal/environments/environment';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { Router } from '@angular/router';
import { get } from 'lodash';

declare const $Lightning: any;

const LWC_URL = `${environment.lwc_baseurl}/lightning/lightning.out.js`;

// declare global {
//   interface Window {
//     $Lightning: any;
//     $ContentAsset: any;
//   }
// }

// window.$Lightning = undefined;
// window.$ContentAsset =undefined;

interface Token {
  GeneratedToken: string;
}

@Component({
  selector: 'app-eclaims-lwc-create-case',
  templateUrl: './eclaims-lwc-create-case.component.html',
  styleUrls: ['./eclaims-lwc-create-case.component.scss'],
})
export class EclaimsLwcCreateCaseComponent
  extends SectionComponentImplementation
  implements OnInit, OnDestroy
{
  private sfToken: string;
  private token: string;
  private jwtData: any;
  private goldenRecordId = '';
  private policyNumber = '';
  private insuredId = '';
  private dependentMemberId = '';
  private contractGroupHealthInsuredCovers: Coverage[] = [];
  private ailmentId = '';
  //private coverKeyList: string[] = [];
  private claimInsuredName = '';
  private personalContracts :string='';
  private email : string='';
  private customeCode: string='';
  private company: string='';
  private receiptAmount: string='';
  private taxNumber: string='';
  private issueDate: string='';
  private codeNumber: string='';
  private series: string='';
  private requestType: string='0';
  private finalCover: string='';

  private destroy$ = new Subject<void>();
  private refreshStatus: number;
  timer: NodeJS.Timeout;
  timer2: NodeJS.Timeout;


  constructor(
    parent: IceSectionComponent,
    private eclaimsLwcCreateCaseService: EclaimsLwcCreateCaseService,
    private spinnerService: SpinnerService,
    private localStorage: LocalStorageService,
    private router: Router,
    private zone:NgZone
  ) {
    super(parent);
    this.zone.run(() => { console.log('Do change detection here'); });
  }

  ngOnInit(): void {

    this.context.iceModel.elements['eclaims.spinner.stop'].setSimpleValue(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.refreshStatus=this.localStorage.getDataFromLocalStorage('refreshStatus');

    if (!this.refreshStatus || this.refreshStatus==0)   //Refresh state
    {


          this.loadScripts();
          this.getLoginTokenData();

          this.context.iceModel.elements[
            'eclaims.salesforce.token'
          ].$dataModelValueChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (value: IndexedValue) => {
                const valElem = value.element.getValue().forIndex(null);
                if (!!valElem) {
                  this.sfToken = valElem;
                }
              },
              (err: any) =>
                console.error(
                  'EclaimsLwcCreateCaseComponent eclaims.salesforce.token',
                  err
                )
            );

          this.context.$lifecycle
            .pipe(takeUntil(this.destroy$))
            .subscribe((e: LifecycleEvent) => {

              const actionName = get(e, ['payload', 'action']);


              if (actionName === 'actionEclaimsSfToken' && e.type === 'ACTION_FINISHED') {
                this.spinnerService.loadingOff();
              }
            });

          this.sfToken = this.context.iceModel.elements['eclaims.salesforce.token']
            .getValue()
            .forIndex(null);

          if (!this.sfToken) {
            this.spinnerService.loadingOn();
            this.execActionEclaimsSfToken();
          }

          let eclaimsStep: number = this.context.iceModel.elements['eclaims.step']
            .getValue()
            .forIndex(null);

          this.policyNumber = this.context.iceModel.elements[
            'eclaims.selected.ContractKey'
          ]
            .getValue()
            .forIndex(null);

          this.insuredId = this.context.iceModel.elements[
            'eclaims.selected.InsuredId'
          ]
            .getValue()
            .forIndex(null);

          this.dependentMemberId = this.context.iceModel.elements[
            'eclaims.selected.DependentMemberId'
          ]
            .getValue()
            .forIndex(null);

          this.claimInsuredName = this.context.iceModel.elements[
            'eclaims.selected.ClaimInsuredName'
          ]
            .getValue()
            .forIndex(null);

          this.ailmentId = this.context.iceModel.elements['eclaims.selected.ailmentId'].getValue().forIndex(null);

          this.personalContracts = this.context.iceModel.elements['eclaims.salesforce.personalContracts'].getValue().forIndex(null);

          this.email = this.context.iceModel.elements['eclaims.salesforce.email'].getValue().forIndex(null);

          this.customeCode = this.context.iceModel.elements['policies.details.grouphealth.CustomerCode'].getValue().forIndex(null);

          this.company = this.context.iceModel.elements['eclaims.receipt.company'].getValue().forIndex(null);

          this.receiptAmount = this.context.iceModel.elements['eclaims.receipt.receiptAmount'].getValue().forIndex(null);

          this.taxNumber = this.context.iceModel.elements['eclaims.receipt.taxNumber'].getValue().forIndex(null);

          this.issueDate = this.context.iceModel.elements['eclaims.receipt.issueDate'].getValue().forIndex(null);

          this.codeNumber = this.context.iceModel.elements['eclaims.receipt.codeNumber'].getValue().forIndex(null);

          this.series = this.context.iceModel.elements['eclaims.receipt.series'].getValue().forIndex(null);

          this.requestType = this.context.iceModel.elements['eclaims.selected.requestType'].getValue().forIndex(null);

          this.finalCover = this.context.iceModel.elements['eclaims.selected.finalCover'].getValue().forIndex(null);

          const eclaimsStep$ = this.context.iceModel.elements[
            'eclaims.step'
          ].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(eclaimsStep)
          );

          const contractKey$ = this.context.iceModel.elements[
            'eclaims.selected.ContractKey'
          ].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.policyNumber)
          );

          const insuredId$ = this.context.iceModel.elements[
            'eclaims.selected.InsuredId'
          ].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.insuredId)
          );

          const dependentMemberId$ = this.context.iceModel.elements[
            'eclaims.selected.DependentMemberId'
          ].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.dependentMemberId)
          );

          const claimInsuredName$ = this.context.iceModel.elements[
            'eclaims.selected.ClaimInsuredName'
          ].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.claimInsuredName)
          );

          const ailmentId$ = this.context.iceModel.elements['eclaims.selected.ailmentId'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.ailmentId)
          );

          const personalContracts$ = this.context.iceModel.elements['eclaims.salesforce.personalContracts'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.personalContracts)
          );

          const email$ = this.context.iceModel.elements['eclaims.salesforce.email'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.email)
          );

          const customerCode$ = this.context.iceModel.elements['policies.details.grouphealth.CustomerCode'].$dataModelValueChange.pipe(
              map((value) => value.element.getValue().forIndex(null)),
              startWith(this.customeCode)
          );


          const company$ = this.context.iceModel.elements['eclaims.receipt.company'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.company)
          );

          const receiptAmount$ = this.context.iceModel.elements['eclaims.receipt.receiptAmount'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.receiptAmount)
          );

          const taxNumber$ = this.context.iceModel.elements['eclaims.receipt.taxNumber'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.taxNumber)
          );

          const issueDate$ = this.context.iceModel.elements['eclaims.receipt.issueDate'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.issueDate)
          );

          const codeNumber$ = this.context.iceModel.elements['eclaims.receipt.codeNumber'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.codeNumber)
          );

          const series$ = this.context.iceModel.elements['eclaims.receipt.series'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.series)
          );

          const requestType$ = this.context.iceModel.elements['eclaims.selected.requestType'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.requestType)
          );

          const finalCover$ = this.context.iceModel.elements['eclaims.selected.finalCover'].$dataModelValueChange.pipe(
            map((value) => value.element.getValue().forIndex(null)),
            startWith(this.finalCover)
          );


          combineLatest(
            eclaimsStep$,
            contractKey$,
            insuredId$,
            dependentMemberId$,
            claimInsuredName$,
            ailmentId$,
            personalContracts$,
            email$,
            customerCode$,
            company$,
            receiptAmount$,
            taxNumber$,
            issueDate$,
            codeNumber$,
            series$,
            requestType$,
            finalCover$
          )
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              ([
                eclaimsStep,
                contractKey,
                insuredId,
                dependentMemberId,
                claimInsuredName,
                ailmentId,
                personalContracts,
                email,
                customerCode,
                company,
                receiptAmount,
                taxNumber,
                issueDate,
                codeNumber,
                series,
                requestType,
                finalCover
              ]) => {
                this.policyNumber = contractKey as string;
                this.insuredId = insuredId as string;
                this.dependentMemberId = dependentMemberId as string;
                this.claimInsuredName = claimInsuredName as string;
                this.ailmentId = ailmentId as string;
                this.personalContracts = personalContracts as string;
                this.email = email as string;
                this.customeCode = customerCode as string;
                this.company = company as string;
                this.receiptAmount = receiptAmount as string;
                this.taxNumber = taxNumber as string;
                this.issueDate = issueDate as string;
                this.codeNumber = codeNumber as string;
                this.series = series as string;
                this.requestType = requestType as string;
                this.finalCover = finalCover as string;

                if (
                  eclaimsStep === 2 &&
                  !!this.policyNumber &&
                  !!this.insuredId &&
                  !!this.dependentMemberId
                ) {
                 // this.createCoverKeyStr();
                  this.generateEclaimsToken();
                }
              }
            );


    }



  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyLwc();
  }

  private getLoginTokenData(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.jwtData = jwt_token(token);
      this.goldenRecordId = this.jwtData.extension_CustomerCode as string;
    }
  }

//   private createCoverKeyStr(): void {
//  //   this.contractGroupHealthInsuredCovers =this.context.iceModel.elements['policy.coverages'].getValue().values[0].value;
//     this.contractGroupHealthInsuredCovers=this.context.dataStore.clientContracts.filter((x:any)=>x.ContractKey==this.policyNumber)[0].Coverages;

//     for (const cover of this.contractGroupHealthInsuredCovers) {
//       this.coverKeyList = [...this.coverKeyList, cover.CoverKey];
//     }

//     this.coverKeyStr = this.coverKeyList.join();
//   }

  private async execActionEclaimsSfToken(): Promise<void> {
    const actName = 'actionEclaimsSfToken';
    const action = this.context.iceModel.actions[actName];
    if (!!action) {
      try {
        await this.context.iceModel.executeAction(actName);
      } catch (err) {
        console.error(`exec ${actName}`, err);
      }
    }
  }

  private generateEclaimsToken(): void {
    this.spinnerService.loadingOn();


    this.context.iceModel.elements['eclaims.spinner.stop'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          const valElem = value.element.getValue().forIndex(null);
          if (valElem) {
          this.spinnerService.loadingOff();
          }
        },
        (err: any) =>
          console.error(
            'EclaimsLwcCreateCaseComponent eclaims.spinner.sto',
            err
          )
      );



    this.eclaimsLwcCreateCaseService
      .generateEclaimsToken(
        this.goldenRecordId,
        this.policyNumber,
        this.insuredId,
        this.dependentMemberId,
        this.claimInsuredName,
        this.ailmentId,
        this.personalContracts,
        this.email,
        this.customeCode,
        this.company,
        this.receiptAmount,
        this.taxNumber,
        this.issueDate,
        this.codeNumber,
        this.series,
        this.requestType,
        this.finalCover
      )
      .pipe(catchError((err: any) => throwError(err)))
      .subscribe(
        (token: Token) => {
          this.token = token.GeneratedToken;
          this.createLwc(this.token);
        },
        (err: any) => {
          console.error('generateEclaimsToken', err);
        }
      );
  }

  private loadScripts(): void {

    // window.$Lightning=undefined;
    // window.$ContentAsset=undefined;

    const dynamicScripts = [LWC_URL];

    for (const script of dynamicScripts) {
      const node = document.createElement('script');
      node.src = script;
      node.type = 'text/javascript';
      node.async = false;
      document.getElementById('eclaims-create').appendChild(node);
    }

  }

  private createLwc(token: any): void {
    let callback2Counter = 0;

    const callback1 = (
      caseId: string,
      choice: string,
      caseNumber: string,
      subType: string
    ): void => {
      this.context.iceModel.elements['eclaims.category.choice.flag'].setSimpleValue(choice);
      this.context.iceModel.elements['eclaims.salesforce.caseId'].setSimpleValue(caseId);
      this.context.iceModel.elements['eclaims.salesforce.caseNumber'].setSimpleValue(caseNumber);
      this.context.iceModel.elements['eclaims.subType.flag'].setSimpleValue(subType);
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(3);
      this.destroyLwc();
    };

    const callback2 = (stepScreen: string): void => {
      callback2Counter++;

      if (stepScreen === '1' && callback2Counter === 1) {

        spinnerOff();
      }

      if (stepScreen === '-1') {
        backToStart();
      }
    };

    const spinnerOff = (): void => {
      this.spinnerService.loadingOff();
    };

    const backToStart = (): void => {
      let requestType = this.context.iceModel.elements['eclaims.selected.requestType'].getValue().values[0].value;
      if( requestType == "1"){
        this.context.iceModel.elements['eclaims.step'].setSimpleValue(13);
      }else{
        this.context.iceModel.elements['eclaims.step'].setSimpleValue(12);
      }
      this.context.iceModel.elements["eclaims.selected.Incident"].setSimpleValue(null);
      this.destroyLwc();
    };

    try {
      $Lightning.use(
        'c:EclaimsApp',
        function () {
          $Lightning.createComponent(
            'c:Eclaims',
            {
              token: token,
              callback1: function (
                caseId: string,
                choice: string,
                caseNumber: string,
                subType: string
              ) {

                callback1(caseId, choice, caseNumber, subType);
              },
              callback2: function (stepScreen: string) {
                console.log('stepScreen: ', stepScreen);

                callback2(stepScreen);
              },
            },
            'eclaims-create',
            function (cmp: any) {
              console.log('LWC Eclaims component was created');
              // do some stuff
            }
          );
        },
        environment.lwc_baseurl,
        this.sfToken
      );

    } catch (err) {
      console.error('createLwc', err);
      spinnerOff();
    }

  }

  private destroyLwc(): void {
    var eclaimsCreate = document.getElementById('eclaims-create');
    if(eclaimsCreate!=null)
    {
      const article = eclaimsCreate.querySelector('section.cEclaims') as HTMLElement;
      if(article!=null)
      {
        clearInterval(this.timer);
        clearInterval(this.timer2);
        !!article && article.remove();
      }
      //eclaimsCreate.remove();
    }

  }


 ngAfterViewInit()
 {
        ////Bug Apple  ......
        let ii=1;
        this.timer = setInterval(() => {
          ii++;
          const eclaimsCreate = document.getElementById('eclaims-create');

          if(eclaimsCreate!=null)
          {
              const article = eclaimsCreate.querySelector('section.cEclaims') as HTMLElement;
              if(article!=null && article.childElementCount>0)
              clearInterval(this.timer);

              if(this.context.iceModel.elements['eclaims.step'].getValue().forIndex(null)==2)
              {

                clearInterval(this.timer);
                let jj=1;
                this.timer2=setInterval(() => {
                  jj++;
                  const eclaimsCreate = document.getElementById('eclaims-create');
                  const article = eclaimsCreate.querySelector('section.cEclaims') as HTMLElement;

                  if(article!=null  && article.childElementCount>0)
                  {
                  clearInterval(this.timer2);
                  this.context.iceModel.elements['eclaims.spinner.stop'].setSimpleValue(true);

                  }
                  //product issue 14.02
                  if(jj==10)
                  {
                    clearInterval(this.timer2);
                    this.context.iceModel.elements['eclaims.spinner.stop'].setSimpleValue(true);
                    this.router.navigate(['/ice/default/customerArea.motor/viewEclaimsErrors']);
                  }

                },1000)

              }
          }

        }, 1000)

       //end Bug

 }


}
