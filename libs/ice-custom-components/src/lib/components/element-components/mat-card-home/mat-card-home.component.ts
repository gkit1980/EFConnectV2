
import { environment } from '@insis-portal/environments/environment';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { LifecycleEvent,LifecycleType } from '@impeo/ice-core';
import { IcePrincipalService } from '@impeo/ng-ice';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { Subscription } from 'rxjs';



@Component({
  // selector: 'app-gdpr-notification',
  templateUrl: "./mat-card-home.component.html",
  styleUrls: ["./mat-card-home.component.scss"]
})
export class MatCardHomeComponent extends ElementComponentImplementation {

  @ViewChild('theCard') theCard: ElementRef;


  labelPosition: string;
  cardTitle: string;
  cardLink: string;
  cardContent: string;
  cardValue: any;
  cardComplementText: string;
  items: any[];
  timer: any;
  contentLoaded: boolean= false;
  type:string;
  notificationclaim: boolean =false;

  private subscription1$: Subscription;
  private subscription2$: Subscription;
  private subscriptions: Subscription[] = [];


  constructor(
    private icePrincipalService: IcePrincipalService,
    private localStorage: LocalStorageService
  ) {
    super();
  }

  async ngOnInit()
  {
    this.type=this.element.recipe["type"];


    // this.ckeckIfDafDocExists();
    this.context.iceModel.elements['customer.details.username'].setSimpleValue(this.icePrincipalService.principal.id);

    this.addItems();
    this.subscription1$ = this.context.$lifecycle.subscribe((e: LifecycleEvent) => {
      if (e.type == LifecycleType.ICE_MODEL_READY) {
        this.addItems();
      }
    });
    this.subscriptions.push(this.subscription1$);



  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  private addItems(): any {
    if (this.element.recipe["dataStoreProperty"] == null)
    {
      return;
    }

    //dataStoreProperty comes from the page
    this.items = _.get(
      this.context.dataStore,
      this.element.recipe["dataStoreProperty"]
    );
    if (this.items != null) {
      this.cardTitle = this.element.recipe["title"];
      this.cardLink = this.element.recipe["link"];
      this.cardContent = this.element.recipe["content"];
      this.cardValue = this.items.length.toString();

      if (this.element.recipe["type"] == "amendisabled") {
        this.cardValue = '0';
      }

      if (this.element.recipe["type"] !== "amendments") {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Status.trim() == "Ελεύθερο") {
            this.cardValue = (this.items.length - 1).toString();
          }
        }

        if (this.element.recipe["type"] === "contracts") {
          if (this.localStorage.getDataFromLocalStorage("showDaf") === true) {
            this.cardValue++;
          }
          this.cardComplementText = this.element.recipe[
            "complementText"
          ];
        }

        if (this.element.recipe["type"] === "amendments") {
          this.cardValue = "0";
          this.cardComplementText = this.element.recipe[
            "complementText"
          ];
        }

        if (this.element.recipe["type"] === "claims")
        {

          var counter: number = 0;
          var counterForGroup:number=0;
          var counterForProperty:number=0;

          _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
            if (contract.ContractType === 99)
            {
            counterForGroup=contract.CountNotClosedEclaims + this.context.iceModel.elements['eclaims.additional.request'].getValue().forIndex(null);
            }
            if (contract.ContractType === 14)   //property
            {
             counterForProperty=contract.CountOpenPropertyclaims + this.context.iceModel.elements['property.claim.additional.request'].getValue().forIndex(null);
            }
          });

          counter=counterForGroup+counterForProperty;   ///SOS  add open Group+Property claims   !!!!


          for (let item of this.items)
          {
            if (item.hasOwnProperty("Claims"))
            {
              for (let itemClaim of item.Claims)
              {
                if (this.checkClaimStatus(itemClaim, item.Branch))       //private claim
                {
                  counter++;
                }
              }

            }
            if (item.hasOwnProperty("CountOpenEclaims"))          //eclaims existemce
            {
               if(item.CountOpenEclaims>0)
               this.context.iceModel.elements["eclaims.notification.icon.flag"].setSimpleValue(true);
               else
               this.context.iceModel.elements["eclaims.notification.icon.flag"].setSimpleValue(false);
            }
          }

          // if(counter>0)
          // this.context.iceModel.elements["eclaims.notification.icon.flag"].setSimpleValue(true);


          this.cardValue = counter.toString();
          this.cardComplementText = this.element.recipe["complementText"];
        }

      }
      else
      {
        this.cardValue = this.context.iceModel.elements["amendments.countAmendments"].getValue().forIndex(null);
        this.cardComplementText = this.element.recipe["complementText"];
      }
      this.contentLoaded=true;
    }
    else
    {
      this.cardTitle = this.element.recipe["title"];
      this.cardLink = this.element.recipe["link"];
      this.cardContent = this.element.recipe["content"];
      this.cardComplementText = this.element.recipe["complementText"];
    }
  }

  checkClaimStatus(
    item: any,
    branch: string
  ): boolean { // *claim: open/closed =true/false
    switch (branch) {
      case "ΖΩΗΣ": {
        if (item.ClaimsStatusDescription != undefined) {

          switch (item.ClaimsStatusDescription.trim()) {
            case "Ανοικτή":
              return true;      //opened
            case "Προς Πληρωμή":
              return true;     //opened
            case "Απορριφθείσα":
              return false;      //closed
            case "Κλειστή (Ζημ)":
              return false;      //closed
            case "Κλειστή (Λογ)":
              return false;      //closed
            case "Κλειστή 'Ανευ Συν.":
              return false;     //closed
            case "Εκκρεμότητα":
              return true;      //opened
            case "Εγκεκριμένη (Ζημ)":
              return true;      // opened
            case "Άκυρη":
              return false;      //closed
            case "Κλειστή (Επιστρ. Δικ)":
              return false;      // closed
            case "Απόρριψη λόγω Εκπιπτομένου":
              return false;      //closed
            case "Ανοικτή λόγω Αγωγής":
              return true;      // opened
            case "Απορριφθείσα με Καταγγελία Ασφ":
              return false;      // closed
            case "Απορριφθείσα λόγω Προΰπαρξης":
              return false;      // closed
            case "Απορριφθείσα λόγω Αναμονών":
              return false;      // closed
            default:
              return false;
          }

        }
        break;
      }
      case "ΥΓΕΙΑΣ": {
        if (item.ClaimsStatusDescription != undefined) {

          switch (item.ClaimsStatusDescription.trim()) {
            case "Ανοικτή":
              return true;      //opened
            case "Προς Πληρωμή":
              return true;     //opened
            case "Απορριφθείσα":
              return false;      //closed
            case "Κλειστή (Ζημ)":
              return false;      //closed
            case "Κλειστή (Λογ)":
              return false;      //closed
            case "Κλειστή 'Ανευ Συν.":
              return false;     //closed
            case "Εκκρεμότητα":
              return true;      //opened
            case "Εγκεκριμένη (Ζημ)":
              return true;      // opened
            case "Άκυρη":
              return false;      //closed
            case "Κλειστή (Επιστρ. Δικ)":
              return false;      // closed
            case "Απόρριψη λόγω Εκπιπτομένου":
              return false;      //closed
            case "Ανοικτή λόγω Αγωγής":
              return true;      // opened
            case "Απορριφθείσα με Καταγγελία Ασφ":
              return false;      // closed
            case "Απορριφθείσα λόγω Προΰπαρξης":
              return false;      // closed
            case "Απορριφθείσα λόγω Αναμονών":
              return false;      // closed
            default:
              return false;
          }

        }
        break;
      }
      case "ΑΥΤΟΚΙΝΗΤΩΝ": {
        if (
          item.ClosingClaimDate != "" &&
          item.ClosingClaimDate != "1900-01-01T00:00:00Z"
        )
          return false;
        else return true;
        break;
      }

      case "ΠΕΡΙΟΥΣΙΑΣ": {
        if (
          item.ClosingClaimDate != "" &&
          item.ClosingClaimDate != "1900-01-01T00:00:00Z"
        )
          return false;
        else return true;
        break;
      }
      case "ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ": {
        return false;
        break;
      }
      case "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ": {
        return false;
        break;
      }

      default: {
        break;
      }
    }

    return true;
  }

  getNotificationClaim()
  {
    if(this.context.iceModel.elements["eclaims.notification.icon.flag"].getValue().forIndex(null) && this.type=="claims")
    return true;

    else
    return false;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto; fill: #ffffff");
    svg.setAttribute("width", "29");
    svg.setAttribute("height", "30");

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  get cardColor(): string {
    return this.element.recipe["colorCard"];
  }

  handleSVGInfo(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');

    return svg;
  }



  fillDatastore()
  {
    this.context.iceModel.elements["triggerActionWriteFromOther"].setSimpleValue(1);
  }

}
