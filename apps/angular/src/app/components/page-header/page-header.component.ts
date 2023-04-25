import { environment } from './../../../environments/environment';
import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { LocalStorageService } from "../../services/local-storage.service";
import { WindowScrollingService } from "../../services/window-scrolling.service";
import { LogoutService } from '../../services/logout.service';
import { IceContextService } from "@impeo/ng-ice";
import { IndexedValue, LifecycleType } from '@impeo/ice-core';
import { Router } from "@angular/router";
import { Observable, Subscription, throwError,Subject } from 'rxjs';
import { catchError, takeUntil, first, tap } from 'rxjs/operators';


@Component({
  selector: "header",
  templateUrl: "./page-header.component.html",
  styleUrls: ["./page-header.component.scss"]
})
export class PageHeaderComponent {
  HEADER_LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';
  navbarOpen = false;
  panelExpanded = true;
  user1: string;
  modalOpen: boolean = false;
  showAmendments:boolean =false;
  showClaimsIcon: boolean= false;

  private lifecycleSubs: Subscription;
  private destroy$ = new Subject<void>();


  private subscription = new Subscription();

  myEurolife = 'app.header.myEurolife.label';
  contracts = 'app.header.contracts.label';
  allowances = 'app.header.allowances.label';
  additives = 'app.header.additives.label';
  communication = 'app.header.communication.label';
  profile = 'app.header.profile.label';
  certificates = 'app.header.certificates.label';
  settings = 'app.header.settings.label';
  logout = 'app.header.logout.label';
  fullName: string;
  refreshStatus :number;


  constructor(
    private authService: AuthService,
    private storage: LocalStorageService,
    private windowScrolling: WindowScrollingService,
    private contextService: IceContextService,
    private router: Router,
    private logoutService: LogoutService,
    private localStorage: LocalStorageService
  ) { }

  async ngOnInit() {


    const lifecycle$ = (await this.contextService.getContext("customerArea")).$lifecycle
    .pipe(
      first((evt) => evt.type === LifecycleType.BEFORE_PAGE_LOAD),
      catchError((err) => this.handleError(err)),
      tap((_x) => {
        this.chkIsMobile();
      })
    );

    this.lifecycleSubs = lifecycle$.subscribe(
      (_x) => {},
      (err) => console.error(err)
    );
    this.subscription.add(this.lifecycleSubs);

    const token = this.localStorage.getDataFromLocalStorage('token');
    this.user1 = this.storage.getDataFromLocalStorage("email");
    if (!!token) {
      this.authService.buildPrincipal();
    }


    this.refreshStatus = this.localStorage.getDataFromLocalStorage('refreshStatus');
    this.showAmendments = this.localStorage.getDataFromLocalStorage('showAmendments');

    if (this.refreshStatus == 0 || this.refreshStatus == undefined) {
      if ((await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) == true) {
        this.showAmendments = true;
        this.localStorage.setDataToLocalStorage('showAmendments', true);
      } else {
        this.showAmendments = false;
        this.localStorage.setDataToLocalStorage('showAmendments', false);
      }

      (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === true) {
          this.showAmendments = true;
          this.localStorage.setDataToLocalStorage('showAmendments', true);
        } else {
          this.showAmendments = false;
          this.localStorage.setDataToLocalStorage('showAmendments', false);
        }
      });


      (await this.contextService.getContext("customerArea")).iceModel.elements['eclaims.notification.icon.flag'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === true) {
          this.showClaimsIcon = true;
        }
        else
        this.showClaimsIcon = false;

      });



      if (this.router.url.includes('viewAmendments')) {
        this.showAmendments = true;
        this.localStorage.setDataToLocalStorage('showAmendments', true);
      }
    }

  }

  private async chkIsMobile(): Promise<void> {
    const isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;

    if (isMobile) {
      (await this.contextService.getContext("customerArea")).iceModel.elements['home.isMobileDevice'].setSimpleValue(true);
    } else {
      (await this.contextService.getContext("customerArea")).iceModel.elements['home.isMobileDevice'].setSimpleValue(false);
    }
  }

  private handleError(err: any): Observable<never> {
    const message = 'Error in Observable';
    console.error(message, err);
    return throwError(err);
  }

  userName(): string {
    let agent = { userName: "agent" };
    return agent ? agent.userName : "n/a";
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  getShowClaimsIcon(): boolean {
   return this.showClaimsIcon;
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
    if (this.navbarOpen) {
      this.windowScrolling.disable();
    } else {
      this.windowScrolling.enable();
    }
  }

  get imageSource() {
    return this.getIcon('587B1CA564EA46D085F1C755786E2E16');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: #ef3340');
    svg.setAttribute('width', '17.9');
    svg.setAttribute('height', '17.2');

    return svg;
  }




  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '70');
    svg.setAttribute('height', '70');

    return svg;
  }

  handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }

  handleSVGInfo(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');

    return svg;
  }



  async fillDatastore() {
    (await this.contextService.getContext("customerArea")).iceModel.elements['triggerActionWriteFromOther'].setSimpleValue(1);
  }



  toggleDropdown() {
    this.navbarOpen = false;
    this.windowScrolling.enable();
  }

  logoutFuction() {

    this.logoutService.logout(false);

  }

  onPreferences() {
    this.router.navigate([
      "/ice/default/customerArea.motor/customerProfile"
    ], {
      queryParams: {
        id: 1
      }
    });
  }

  getIsActive() {
    if (this.navbarOpen === true) {
      return 'is-active';
    }
  }

  getShow_FullViewPort() {
    const array: string[] = ['show', 'full_view_port'];
    if (this.navbarOpen === true) {

      return array;
    }
  }



  ngOnDestroy(): void {

  this.destroy$.next();
  this.destroy$.complete();
  }

}
