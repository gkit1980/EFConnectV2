import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { LifecycleType } from '@impeo/ice-core';
import * as jwt_token from 'jwt-decode';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from './../../../../environments/environment';
import { Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-header-welcome',
  templateUrl: './header-welcome.component.html',
  styleUrls: ['./header-welcome.component.scss'],
})
export class HeaderWelcomeComponent extends ElementComponentImplementation implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  username: string = '';
  jwt_data: any;
  data: any;
  isLooped: boolean = false;
  isShowNudge: boolean = false;
  refreshCounter: number = 0;
  private subscription1$: Subscription;
  private subscriptions: Subscription[] = [];
  hasGroupHealthContract: boolean =false;
  showEclaimsButton: boolean =false;
  nudgeInform = 'pages.homepage.nudgeInform.label';

  constructor(private localStorage: LocalStorageService, private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (_.has(this.element.recipe, 'dataStoreProperty')) {
      this.subscription1$ = this.context.$lifecycle.subscribe(
        (event) => {
          if (event.type == LifecycleType.ICE_MODEL_READY) {
            this.data = _.get(this.context.dataStore, this.element.recipe.dataStoreProperty);
            // if (this.data == undefined) {
            //   return;
            // }
            if (this.localStorage.getDataFromLocalStorage('refreshStatus') == 1) {
              this.refreshCounter++;
              if (this.data != undefined) {
                this.isLooped = false;
                this.localStorage.setDataToLocalStorage('refreshStatus', 0);
              }
            }
          }
        },
        (err) => console.error('subscription1$ got an error: ' + err)
      );
      this.subscriptions.push(this.subscription1$);
    }

    this.data = _.get(this.context.dataStore, this.element.recipe.dataStoreProperty);
    if (this.data != undefined && !this.isLooped) {
      this.showNudge(this.data);
      this.isLooped = true;
    }
    this.jwt_data = jwt_token(this.localStorage.getDataFromLocalStorage('token'));
    this.username = this.jwt_data.emails[0];
    if(this.localStorage.getDataFromLocalStorage("showGroupHealth")){
      this.hasGroupHealthContract = true;
      this.showEclaimsButton = true;
    }
    this.context.iceModel.elements["eclaims.contract.exist"].$dataModelValueChange.
    subscribe((value: any) => {
     if (value.element.getValue().forIndex(null))
     {
       this.hasGroupHealthContract = true;
     }
    });

    this.context.iceModel.elements["eclaims.groupDetails.exist"].$dataModelValueChange.
    subscribe((value: any) => {
      if (value.element.getValue().forIndex(null))
      {
        this.showEclaimsButton = true;
      }
    });

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  showNudge(data: any): void {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.Branch !== 'ΑΥΤΟΚΙΝΗΤΩΝ') {
          for (let j = 0; j < item.Receipts.length; j++) {
            const receipt = item.Receipts[j];
            if (receipt.ReceiptStatusDescription === 'Ανείσπρακτη') {
              this.isShowNudge = true;
            }
          }
        } else {
          const todayminus62d = moment(new Date()).subtract(62, 'days');
          if(item.LastUrlNotes!=undefined)
          {
            for (let j = 0; j < item.LastUrlNotes.length; j++) {
              const docDate = item.LastUrlNotes[j].docDate;
              if (todayminus62d <= moment(docDate)) {
                this.isShowNudge = true;
              }
            }

          }
        }
      }

    }
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  get imageSourceNotification() {
    return this.getIcon('981D16C6FE5447429742308B97C23613');
  }

  handleNotificationSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('fill', '#049ecc');
    return svg;
  }

  async redirectGroupDetails(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      let jwtData:any;
      jwtData = jwt_token(token);
      let goldenRecordId = jwtData.extension_CustomerCode as string;
      let email = jwtData.emails[0] as string;
      this.context.iceModel.elements['eclaims.customerID'].setSimpleValue(goldenRecordId);
      this.context.iceModel.elements['eclaims.salesforce.email'].setSimpleValue(email);
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);

      this.context.iceModel.elements['selectedcontractbranch'].setSimpleValue(99);
      this.router.navigate(['/ice/default/customerArea.motor/viewEclaimsDetails']);
    } catch (err) {
      console.error(err);
    }

  }
}
