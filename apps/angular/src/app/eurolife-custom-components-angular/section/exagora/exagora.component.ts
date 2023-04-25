import { Component, OnDestroy, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { IndexedValue } from '@impeo/ice-core';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';


@Component({
  selector: 'app-exagora',
  templateUrl: './exagora.component.html',
  styleUrls: ['./exagora.component.scss']
})
export class ExagoraComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

  expanded = false;
  currentContract: any;
  totalExagora: any;
  investAmount: any;
  lifeAmount: any;
  investDate: any;
  isUlVanilla: boolean = false;
  cashActionEnded = false;

  private prodDescSubs: Subscription;
  private getCashValueEndedSubs: Subscription;
  private subscription = new Subscription();

  policyRedemption = 'sections.exagora.policyRedemption.label';
  latestData = 'sections.exagora.latestData.label';
  calculate = 'sections.exagora.calculate.label';
  lifeRedemption = 'sections.exagora.lifeRedemption.label';
  investRedemption = 'sections.exagora.investRedemption.label';
  totalPolicyRedemption = 'sections.exagora.totalPolicyRedemption.label';


  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  ngOnInit() {
    super.ngOnInit();

    const getCashValueEnded$ = this.context.$actionEnded.pipe(
      first((action) => action === 'actionGetCashValue'),
      catchError((err) => this.handleError(err)),
      tap((_x) => {
        this.getValues();
        this.cashActionEnded = true;
      })
    );

    this.getCashValueEndedSubs = getCashValueEnded$.subscribe(
      (_x) => {},
      (err) => console.error(err)
    );
    this.subscription.add(this.getCashValueEndedSubs);

 //  const prodInvestPlan = 'Greek Top 20'; // for localhost testing
    const prodInvestPlan = ['My Investment Plan','Εξασφαλίζω επένδυση με Δυναμική Προστασία',"Εξασφαλίζω επένδυση για το μέλλον II"]; //'Εξασφαλίζω επένδυση με Δυναμική Προστασία';

    const prodDescElemVal = this.context.iceModel.elements['policies.details.ProductDescritpion']
      .getValue()
      .forIndex(null) as string;

    if (!!prodDescElemVal && prodInvestPlan.includes(prodDescElemVal.trim())) {
      this.isUlVanilla = true;
    } else {
      this.isUlVanilla = false;
    }

    this.prodDescSubs = this.context.iceModel.elements[
      'policies.details.ProductDescritpion'
    ].$dataModelValueChange.subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null) as string;
        if (prodInvestPlan.includes(valElem.trim())) {
          this.isUlVanilla = true;
        } else {
          this.isUlVanilla = false;
        }
      },
      (error) => console.error('ExagoraComponent prodDescSubs', error)
    );
    this.subscription.add(this.prodDescSubs);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  turnOnExpand(): void {
    if (!this.cashActionEnded) {
      this.execActionGetCashValue();
      this.expanded = true;
    }
  }

  private async execActionGetCashValue(): Promise<void> {
    const actName = 'actionGetCashValue';
    const action = this.context.iceModel.actions[actName];
    if (!!action) {
      try {
        await this.context.iceModel.executeAction(actName);
      } catch(err) {
        console.error(`exec ${actName}`, err);
      }
    }
  }

  private handleError(err: any): Observable<never> {
    const message = 'Error in Observable';
    console.error(message, err);
    return throwError(err);
  }

  private getValues(): void {
    // let indexValue = this.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().values[0].value;
    this.investDate = this.iceModel.elements["policies.details.investDate"].getValue().values[0].value;
    this.lifeAmount = this.iceModel.elements["policies.details.lifeExagora"].getValue().values[0].value;
    this.totalExagora = this.iceModel.elements["policies.details.totalExagora"].getValue().values[0].value;
    this.investAmount = this.iceModel.elements["policies.details.investAmount"].getValue().values[0].value;
  }

  getSectionClass(): any {
    let result: any;

    let dt_name = this.context.iceModel.elements["policies.details.border.titles.color"].recipe.dtName;
    let dt = this.page.iceModel.dts[dt_name];
    if (dt) {
      result = dt.evaluateSync();
      if (result.defaultValue) {
        return result.defaultValue;
      }
      else {
        return 'section-breaks-gen';
      }

    }

    return null;
  }

}
