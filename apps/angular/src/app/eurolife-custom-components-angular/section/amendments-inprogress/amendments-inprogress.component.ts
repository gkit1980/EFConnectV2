import { Component, OnDestroy, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../../services/local-storage.service';
import { catchError, filter, first, map, tap,takeUntil } from 'rxjs/operators';
import { Subscription, throwError, Subject} from 'rxjs';
import {LifecycleEvent } from '@impeo/ice-core';



@Component({
  selector: 'app-amendments-inprogress',
  templateUrl: './amendments-inprogress.component.html',
  styleUrls: ['./amendments-inprogress.component.scss'],
})
export class AmendmentsInprogressComponent extends SectionComponentImplementation implements OnInit, OnDestroy {
  header: string;
  refreshStatus: any;
  inProgressEmpty: boolean = false;
  data: any[];
  dataToShow: any[] = [];
  clientContracts: any[];
  isNotClosed: boolean = false;
  contentLoaded: boolean = false;

  private lifecycleSubs: Subscription;
  private subscription = new Subscription();
  private destroy$ = new Subject<void>();

  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService
  ) {
    super(parent);
  }

  getIcon(iconID: string): string {
    const icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; float: right; fill: #383b38');
    svg.setAttribute('width', '29');
    svg.setAttribute('height', '30');

    return svg;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '51');
    svg.setAttribute('height', '51');

    return svg;
  }

  formatDate(date: any) {
    if (!!date) {
      return new Date(date);
    } else {
      return '';
    }
  }

  ngOnInit() {


    this.header = this.iceModel.elements[this.recipe['inprogresstitle']].recipe.label.ResourceLabelRule.key.slice(
      1,
      this.iceModel.elements[this.recipe['inprogresstitle']].recipe.label.ResourceLabelRule.key.length
    );

    this.getData();

    const lifecycle$ = this.context.$lifecycle.pipe(
      filter((evt) => evt.payload.hasOwnProperty(this.recipe.dataStoreProperty)),
      map((res) => res.payload[this.recipe.dataStoreProperty]),
      first((items) => !!items),
      catchError((err) => this.handleError(err)),
      tap((_) => this.getData()),
    );

    this.context.$lifecycle
    .pipe(takeUntil(this.destroy$))
    .subscribe((e: LifecycleEvent) => {

      const actionName = _.get(e, ['payload', 'action']);
      if (actionName.includes("actionGetParticipantsHomePage") && e.type === 'ACTION_FINISHED') {
        this.getData();
      }

    });

    this.lifecycleSubs = lifecycle$.subscribe(
      (_) => {},
      (err) => console.error(err)
    );
    this.subscription.add(this.lifecycleSubs);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }



  private handleError(err: any) {
    const message = 'Error in Observable';
    console.error(message, err);
    return throwError(err);
  }

  private getData() {
    this.data = _.get(this.context.dataStore, this.recipe.dataStoreProperty);

    if (!!this.data) {
      this.contentLoaded = true;

      if (this.dataToShow.length === 0) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].Status != 'Closed') {
            this.dataToShow = [...this.dataToShow, this.data[i]];
          }
        }
      }

      this.clientContracts = _.get(this.context.dataStore, 'clientContracts');

      //Product Description
      if (!!this.dataToShow && !!this.clientContracts) {
        let copyDatatoShow = [...this.dataToShow];

        for (let i = 0; i < copyDatatoShow.length; i++) {
          for (let j = 0; j < this.clientContracts.length; j++) {
            if (copyDatatoShow[i].Contract_Name__c === this.clientContracts[j].ContractKey &&copyDatatoShow[i].RC_General_Types__c === 'Motor') {
              copyDatatoShow[i].ProductDescription = this.clientContracts[j].ProductDescritpion;
            }
            if (copyDatatoShow[i].Contract_Name__c === this.clientContracts[j].ContractKey && copyDatatoShow[i].RC_General_Types__c === 'Non-Motor') {
              copyDatatoShow[i].ProductDescription = this.clientContracts[j].ProductDescritpion;
            }
            if (copyDatatoShow[i].Contract_Name__c === this.clientContracts[j].ContractKey && copyDatatoShow[i].RC_General_Types__c === 'Life-Health-Finance') {
              copyDatatoShow[i].ProductDescription = this.clientContracts[j].ProductDescritpion;
              copyDatatoShow[i].Branch = this.clientContracts[j].Branch;
            }
          }
        }

        this.dataToShow = [...copyDatatoShow];
      }

      if (this.dataToShow.length === 0) {
        this.inProgressEmpty = true;
      }
    }
  }
}
