import { Component, OnDestroy, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from "@impeo/ng-ice";
import { environment } from "@insis-portal/environments/environment";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import * as _ from "lodash";
import { IndexedValue,LifecycleEvent } from '@impeo/ice-core';
import { takeUntil } from "rxjs/operators";
import { Subject, throwError } from "rxjs";
import { MatRadioButton } from '@angular/material/radio';



export interface Insured {
  MainInsured: boolean;
  Contractkey: string;
  CustomerCode: string;
  Fullname: string;
  Id: string;
}

@Component({
  selector: 'app-property-available-contracts',
  templateUrl: './property-available-contracts.component.html',
  styleUrls: ['./property-available-contracts.component.scss']
})
export class PropertyAvailableContractsComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

  data: any[] = [];
  refreshStatus: any;
  contentPropertyLoaded: boolean = false;
  contentPropertyData: any[] = [];
  selected: any[] = [];

  items: any[] = [];

  private destroy$ = new Subject<void>();
  spinnerService: any;



  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService
  ) {
    super(parent);
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; float: right; fill: #383b38");
    svg.setAttribute("width", "29");
    svg.setAttribute("height", "30");

    return svg;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");

    return svg;
  }

  async ngOnInit() {

    this.context.iceModel.elements["skeleton.show"].setSimpleValue(true);

    this.context.iceModel.elements["skeleton.show"].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: IndexedValue) => {
        if (!value.element.getValue().forIndex(null)) {
          this.contentPropertyLoaded = true;
        }
      },
        (err: any) =>
          console.error(
            'PropertyAvailableContractsComponent:skeleton.show',
            err
          )
      );

    this.getData();

    this.refreshStatus = this.localStorage.getDataFromLocalStorage("refreshStatus");

    this.context.$lifecycle
      .pipe(takeUntil(this.destroy$))
      .subscribe((e:LifecycleEvent) => {
        const actionName = _.get(e, ['payload', 'action']);

        if (actionName.includes("actionGetParticipantsHomePage") &&   e.type === 'ACTION_FINISHED') {
          this.getData();
          this.contentPropertyLoaded = true;
        }

      });

  }

  ngOnDestroy() {

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
      this.contentPropertyData = [];
      for (const contract of this.data) {
        if (contract.Branch === 'ΠΕΡΙΟΥΣΙΑΣ') {
          if (!!contract.ContractPropertyCoolgenDetails) {
            this.contentPropertyData = [...this.contentPropertyData, contract];
            this.context.iceModel.elements["skeleton.show"].setSimpleValue(false);

          }
        }
      }
    }
  }

  getPropertyContentLoaded() {
    return this.contentPropertyLoaded;
  }

  radioChange(event:MatRadioButton, i:any)
  {
    if (event.value != null)
     {
      this.iceModel.elements["property.notification.step2"].setSimpleValue(true);
      this.context.dataStore.data.clientContracts.forEach((item:any, index:any)=>
      {
        if(event.value.ContractKey==item.ContractKey){
        _.set(this.context.dataStore.data.clientContracts[index],'checked',true);
        }
        else{
        _.set(this.context.dataStore.data.clientContracts[index],'checked',false);
    //    _.set(this.context.dataStore, this.recipe.dataStoreProperty, this.contentPropertyData);
        }
      })

    }
    else {
      this.iceModel.elements["property.notification.step2"].setSimpleValue(false);
    }
  }
}
