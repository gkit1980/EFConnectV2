import { environment } from '@insis-portal/environments/environment';
import { LoginAuthenticationGuard } from "@insis-portal/services/login-authentication.guard";
import { Component, OnInit, HostListener, ElementRef, ApplicationRef } from "@angular/core";
import { Router, NavigationEnd, Route, NavigationStart, ActivatedRoute } from "@angular/router";


import {  IcePrincipalService, IceContextService } from "@impeo/ng-ice";
import { IceContext,ClientPrincipal,IcePrincipal} from "@impeo/ice-core";
import { Subscription, Subject } from "rxjs";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { CheckInactivityService } from "@insis-portal/services/check-inactivity.service";
import { ModalService } from "@insis-portal/services/modal.service";
import { CookieConsentService } from "../../services/cookie-consent.service";
import { ResourceResolver } from '../../resolvers/resource.resolver';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { MotorCustomTableComponent } from '@insis-portal/ice-custom-components/src/lib/components/section-components/motor-custom-table/motor-custom-table.section.component'
import { LogoutService } from '../../services/logout.service';
import { Meta } from '@angular/platform-browser';
import { CanDeactivateGuard } from '@insis-portal/services/guards/can-deactivate-guard.service';
import IdleTimer  from '../../data/IdleTimer';
import { SalesforceChatComponent } from '../salesforce-chat/salesforce-chat.component';
import { CommunicationService } from '@insis-portal/services/communication.service';
import { SpinnerService } from '@insis-portal/services/spinner.service';
import { getDefaultLanguage } from '@insis-portal/services/language.service';
import { get } from 'lodash';
import { split } from 'lodash';
declare let ga: Function;



@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  showHeader = false;
  showFooter = false;
  subscription: Subscription;
  userActivity: any;
  showIcons = false;
  statusActivity: boolean;
  numOfClicks:number=0;
  dialogRef: MatDialogRef<MotorCustomTableComponent>;
  dialogRef2: MatDialogRef<SalesforceChatComponent>;

  userInactive: Subject<any> = new Subject();
  addBlur = false;
  regexpios: RegExp;
  counterHome=0;
  previousUrl: string = null;
  currentUrl: string = null;
  urlArr: string[] = [
    '/login',
    '/signupform',
    '/forgotPassword',
    '/forgotUsername',
    '/createaccount',
    '/groupform',
    '/signup',
    '/pageNotFound',
    '/under-maintenance',
    '/vi'
  ];
  timer: IdleTimer;
  title: string;
  localStoragekey = 'insis-token';




  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private checkInactivityService: CheckInactivityService,
    private communicationService: CommunicationService,
    private modalService: ModalService,
    private cookieConsentService:CookieConsentService,
    private principalService: IcePrincipalService,
    private contextService: IceContextService,
    // private contextFactory: IceContextFactory,
    public dialog: MatDialog, private overlay: Overlay,
    private _elementRef: ElementRef,
    private logoutService: LogoutService,
    private metaService: Meta,
    private spinnerService:SpinnerService
  ) {

    // let principal = this.loadPrincipalFromLocalStorage();
    // if (principal) this.principalService.principal = principal;
    // else
    // {
    //   //  principal = new ClientPrincipal('1','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2ODQ0MDEzODAsImV4cCI6MTcxNTkzNzM4MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImlkIjoiMSIsInJvbGVzIjoiW10iLCJkYXRhIjoiJyciLCJsb2NhbGUiOiJlbCJ9._dVMKVkwJyiNdSUq6w5AVa3nHrVW7MW0i_e9X-wiY48','el',[],'');
    //   //   // principal.decorateIntegrationConfig = (config) => {
    //   //   //  set( config.headers, 'X-Auth', oAuthToken );
    //   //   // }
    //   //   this.principalService.principal.data=principal;
    // }



    this.modalService.modalOpened.subscribe((value: boolean) => { this.addBlur = value });
    this.modalService.modalOpened.subscribe(async (value: boolean) => {
      if (!value) {
        if(!this)
        {
          let action =  (await this.contextService.getContext("customerArea")).iceModel.actions['actionResetModalElements'];
          if (action != null) {
            await action.executionRules[0].execute();

          }
        }
       }
  })


    this.setupGoogleAnalytics();
    if (environment.production) {
      this.addGuard(this.router.config, "login", "signupform", "signupform/form", "groupform","groupform/form","signupform/mobilevalidation", "signupform/confirmation", "groupform/confirmation", "createaccount", "forgotUsername", "forgotPassword", "forgotPassword/recovery", "forgotPassword/reset", "pageNotFound", "under-maintenance","viewEclaimsDetails");
    } else {
      this.addGuard(this.router.config, "login", "signupform", "signupform/form", "groupform","groupform/form","signupform/mobilevalidation", "signupform/confirmation", "groupform/confirmation", "createaccount", "forgotUsername", "forgotPassword", "forgotPassword/recovery", "forgotPassword/reset", "pageNotFound", "under-maintenance", "viewEclaimsDetails","vi", "vi/default");
    }

    this.subscription = router.events.subscribe((event: any) => {



      if (event instanceof NavigationStart) {
        let browserRefresh = !router.navigated;
        if (browserRefresh) {
          this.localStorage.setDataToLocalStorage('refreshStatus', 1);
        }
        else {
          return;
        }
      }
    })




  }

  //
  //
  ngOnInit() {

    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
        const token = this.localStorage.getDataFromLocalStorage('token');
        if (token == undefined &&  (this.currentUrl !== '/' && this.currentUrl !==null) && !this.checkUrlStart(this.urlArr, this.currentUrl)) {
          this.logoutService.logoutSec();
        }
      }
    });


    var sessionStorage_transfer = function(event: any) {
      if(!event) { event = window.event; } // ie suq
      if(!event.newValue) return;          // do nothing if no value to work with
      if (event.key == 'getSessionStorage') {
        console.log('getSessionStorage');
        // another tab asked for the sessionStorage -> send it
        localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
        // the other tab should now have it, so we're done with it.
        setTimeout(() => localStorage.removeItem('sessionStorage'), 1000);
         // <- could do short timeout as well.
      } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
        // another tab sent data <- get it
        var data = JSON.parse(event.newValue);
        console.log('sessionStorage');
        for (var key in data) {
          sessionStorage.setItem(key, data[key]);
        }
        if(!data){ localStorage.removeItem('token'); }
      }
    };

    // listen for changes to localStorage
    window.addEventListener("storage", sessionStorage_transfer, false);
    window.addEventListener("onstorage", sessionStorage_transfer);



    // Ask other tabs for session storage (this is ONLY to trigger event)
    if (!sessionStorage.length) {
      console.log('sessionStoragelength');
      localStorage.setItem('getSessionStorage', 'foobar');
      setTimeout(() => {localStorage.removeItem('getSessionStorage')
      if (!sessionStorage.length){
        this.showFooter = false;
        this.showHeader = false;
        this.statusActivity = true;
        // this.principalService.principal = null;
        var showWalkthrough = this.localStorage.getDataFromLocalStorage("walkthrough");
        this.localStorage.removeAll();
        this.localStorage.setDataToLocalStorage("walkthrough", showWalkthrough);
        let redirectURL = this.route.snapshot.queryParams['returnUrl'] || '//';
        if(this.route.snapshot.component){
          if (redirectURL != '//') {
            if(redirectURL.includes('returnUrl')){
              this.router.navigate(['/login'], { queryParams: { returnUrl: redirectURL }});
            }else{
              this.router.navigate(['/login'], { queryParams: { returnUrl: '/ice/default/customerArea.motor/home?returnUrl='+redirectURL }});
            }
          }else{
            this.router.navigate(['/login']);
          }
        }
        // else
        // {
        //   this.router.navigate(['/login']);
        // }
      }}, 1000);
    };




    this._elementRef.nativeElement.removeAttribute("ng-version");


    // this.userIdle.startWatching();
    // this.userIdle.setCustomActivityEvents(merge(
    //   fromEvent(window, 'mousemove'),
    //   fromEvent(window, 'mouseup'),
    //   fromEvent(window, 'mousedown'),
    //   fromEvent(window, 'resize'),
    //   fromEvent(document, 'keydown'),
    //   fromEvent(document, 'touchstart'),
    //   fromEvent(document, 'touchend'),
    //   fromEvent(document, 'visibilitychange')
    // ))
    // this.userIdle.onTimerStart().subscribe(count => console.log(count));
    // this.userIdle.onTimeout().subscribe(() => {
    //   console.info("Time status activity:"+Date.now());
    //   this.checkInactivityService.setStatusActivity(this.statusActivity);    ///SOS i need this...
    // });

    ///** New Way */
    this.timer = new IdleTimer(900, //expired after 900 sec-15 min
       () => {
        this.title = "Timeout";
        this.checkInactivityService.setStatusActivity(this.statusActivity);
      }
    );



    ///SOS!!!!!!!

    // NgIceRegistration.registerComponent(this.componentsService);
    // NgIceRegistration.registerRules();


    ////ENd SOS

    //show header-footer if user in logged in
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {



        ///* Update Meta Tag  og:url
       this.metaService.updateTag({ property:'og:url', content: environment.baseurl +"/#" + val.url },"property='og:url'");

        this.previousUrl = this.currentUrl;
        this.currentUrl = val.url;


        if(val.url === '/' || val.url.startsWith('/login') || val.url.startsWith('/default/login') || val.url.startsWith('/signup') || val.url.startsWith('/vi') || val.url.startsWith('/groupform') || val.url.startsWith('/createaccount') || val.url.startsWith('/forgotUsername') || val.url.startsWith('/forgotPassword') || val.url.startsWith('/pageNotFound') || val.url.startsWith('/under-maintenance') || (!environment.production && val.url.startsWith('/vi/default')))
        {
          this.showFooter = false;
          this.showHeader = false;
          this.statusActivity = true;
          this.principalService.principal = null;
          var showWalkthrough = this.localStorage.getDataFromLocalStorage("walkthrough");
          this.localStorage.removeAll();
          this.localStorage.setDataToLocalStorage("walkthrough", showWalkthrough);
        }
        else
        {
          this.showFooter = true;
          this.showHeader = true;
          this.statusActivity = false;

          // check user's inactivity
          // this.setTimeout();
          // this.userInactive.subscribe(() => {
          //   this.checkInactivityService.setStatusActivity(this.statusActivity);
          // });


        }
        return;
      } else
      {
        window.scroll(0, 0);
      }
    })
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  // || route.path == excude_signup || route.path == exclude_signupform || exclude_mobilevalidation || route.path == exclude_signupconfirmation || route.path == exclude_createaccount
  addGuard(routes: Route[], exclude: string, excude_signup: string, exclude_signupform: string, exclude_signupgroup: string, exclude_groupform: string,exclude_mobilevalidation: string, exclude_signupconfirmation: string, exclude_groupconfirmation: string, exclude_createaccount: string, exclude_forgotUsername: string, exclude_forgotPassword: string, exclude_forgotPasswordRecovery: string, exclude_forgotPasswordReset: string, exclude_pageNotFound: string, exclude_under_maintenance: string, exclude_eclaims_details:string, exclude_vi: string = null, exclude_vi_default: string = null)
  {
    routes.forEach(route => {
      if (route.path == exclude) {
        return;
      } else if (route.path == excude_signup) {
        return;
      } else if (route.path == exclude_vi) {
        return;
      } else if (route.path == exclude_signupform) {
        return;
      } else if (route.path == exclude_mobilevalidation) {
        return;
      }
      switch (route.path) {
        case exclude: {
          return;
        }
        case excude_signup: {
          return;
        }
        case exclude_vi: {
          return;
        }
        case exclude_vi_default: {
          return;
        }
        case exclude_signupform: {
          return;
        }
        case exclude_signupgroup: {
          return;
        }
        case exclude_groupform: {
          return;
        }
        case exclude_mobilevalidation: {
          return;
        }
        case exclude_signupconfirmation: {
          return;
        }
        case exclude_groupconfirmation: {
          return;
        }
        case exclude_createaccount: {
          return;
        }
        case exclude_forgotUsername: {
          return;
        }
        case exclude_forgotPassword: {
          return;
        }
        case exclude_forgotPasswordRecovery: {
          return;
        }
        case exclude_forgotPasswordReset: {
          return;
        }
        case exclude_pageNotFound: {
          return;
        }
        case exclude_under_maintenance: {
          return;
        }

        case exclude_eclaims_details: {
          route.canDeactivate= [CanDeactivateGuard];
          return;
        }


      }


      let added = false;

      // if (!route.resolve) route.resolve = {};
      // route.resolve['resources'] = ResourceResolver;


      if (route.canActivate) {
        if (!route.canActivate.includes(LoginAuthenticationGuard)) {
          route.canActivate.push(LoginAuthenticationGuard);
          added = true;
        }
      } else
      {
       if(route.path.includes("ice/:repo/:definition/:page"))
       {
       // route.component=
        route.canDeactivate=[CanDeactivateGuard]
       }

        route.canActivate = [LoginAuthenticationGuard];
        added = true;
      }

      if (route.children)
      {
        this.addGuard(route.children, exclude, excude_signup, exclude_signupform, exclude_groupform,exclude_mobilevalidation, exclude_signupconfirmation, exclude_groupconfirmation, exclude_createaccount,
                      exclude_forgotUsername, exclude_forgotPassword, exclude_forgotPasswordRecovery, exclude_forgotPasswordReset, exclude_pageNotFound,
                      exclude_under_maintenance, exclude_eclaims_details,exclude_vi, exclude_vi_default);
      }

    });
  }


  private setupGoogleAnalytics() {
    this.router.events.subscribe((val: any) => {
      if (val instanceof NavigationStart) {
        if (
          val.url === "" ||
          val.url == "/login" ||
          val.url == "/default/login"
        ) {
          // let trackingCode = environment.google_tracking_code;
          // ga('create', trackingCode, 'auto');
        }
      }
    });
  }

  private loadPrincipalFromLocalStorage(): IcePrincipal {
    try {
      const token = localStorage.getItem(this.localStoragekey);
      const langCode = getDefaultLanguage();
      const principal = this.principalFromToken(token, langCode);
      return principal;
    } catch (error) {
      return null;
    }
  }

    //
  //grab the JWT token payload, decode it, and create principal from it
  //
  private principalFromToken(token: string, locale: string): IcePrincipal {
    const tokenParts = split(token, '.');
    if (tokenParts.length !== 3) return null;

    const payload = JSON.parse(decodeURIComponent(escape(atob(tokenParts[1]))));

    payload.data["token"]=token;

    return new ClientPrincipal(payload.id, token, locale, payload.roles, payload.data);
  }




  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);

  }

  @HostListener('window:beforeunload', ['$event'])
   async canLeavePage($event: any) {

    // if( (await this.contextService.$contextCreated()!=undefined))    //  if(this.contextFactory.getContext("customerArea").iceModel!=undefined)
    // {

    //     if( (await this.contextService.getContext("customerArea")).iceModel.elements["eclaims.step"].getValue().forIndex(null)==3 ||  (await this.contextService.getContext("customerArea")).iceModel.elements["eclaims.step"].getValue().forIndex(null)==31)
    //     {
    //     //
    //     (await this.contextService.getContext("customerArea")).iceModel.elements["eclaims.process.exit.trigger"].setSimpleValue(true);
    //     $event.preventDefault();
    //     return false;
    //     }
    //     else return true;
    // }
    //  return true;

   this.contextService.$contextCreated.subscribe((contextAndContextId) => {
      const context = get(contextAndContextId, 'context') as IceContext;

      if (context.iceModel != null) {
        if (context.iceModel.elements["eclaims.step"].getValue().forIndex(null) == 3 || context.iceModel.elements["eclaims.step"].getValue().forIndex(null) == 31) {
          context.iceModel.elements["eclaims.process.exit.trigger"].setSimpleValue(true);
          $event.preventDefault();
        //  return false;
        }
      }

      // else
      //   return true;


    })



   }

  @HostListener('document:click', ['$event']) async clickout(event: any) {
    const target = event.target || event.srcElement || event.currentTarget;
    if (target.className == "col-sm-12")
      this.onChatClick();
    if (target.className == "mat-radio-outer-circle")              //profile section
    {
      const target = event.target || event.srcElement || event.currentTarget;
      let box = target.parentElement.getBoundingClientRect();

      const pos= {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
      };

      this.spinnerService.setTopPosition(pos.top);

    }

    if(target.id == "CookieDeclarationChangeConsentChange" && this.cookieConsentService.getClicks()==0)
      {
        this.cookieConsentService.closeConsentDialog();

        var consentLink = document.getElementById("CookieDeclarationChangeConsentChange") as HTMLLinkElement;
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
        });

        this.cookieConsentService.addClick();
        consentLink.dispatchEvent(event);

      }
    if(target.id == "CookieDeclarationChangeConsentWithdraw")
     {
       this.cookieConsentService.closeConsentDialog();

       var consentLink = document.getElementById("CookieDeclarationChangeConsentWithdraw") as HTMLLinkElement;
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
        });


        this.cookieConsentService.addClick();
        consentLink.dispatchEvent(event);


     }


  }

  @HostListener('window:message', ['$event'])
     onMessage(event:any) {
     this.receiveMessage(event);
  }


  receiveMessage(event: MessageEvent) {
    if(event.data=="close")
    this.closeDialogChat();

  }





  onChatClick() {
    this.showIcons = !this.showIcons;
    const helpButton = document.querySelector('.embeddedServiceHelpButton') as HTMLElement;
    if (!!helpButton) {
      this.showIcons ? helpButton.classList.add('dispBlock') : helpButton.classList.remove('dispBlock');
    }

    const clickToChat = document.getElementById('click-to-chat');
    !!clickToChat && clickToChat.remove();

    const mainDiv1 = document.createElement('div');
    mainDiv1.id = 'click-to-chat';
    mainDiv1.className = 'click-to-chat';

    const para1 = document.createElement('p');
    para1.className = 'h6';
    para1.id = 'chat-label';
    const node1 = document.createTextNode('Click to Chat');
    para1.appendChild(node1);
    mainDiv1.appendChild(para1);

    const secDiv1 = document.createElement('div');
    secDiv1.className = 'click-to-chat-icon';
    secDiv1.id = 'click-to-chat-icon';
    secDiv1.setAttribute('aria-label', 'icon');
    mainDiv1.appendChild(secDiv1);

    // const helpButtonEnabled = document.querySelector('.helpButtonEnabled') as HTMLElement;
    // helpButtonEnabled.appendChild(mainDiv1);
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(255, 255, 255)');
    svg.setAttribute('width', '26');
    svg.setAttribute('height', '26');

    return svg;
  }

  handleSVGChat(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(255, 255, 255)');
    svg.setAttribute('width', '41');
    svg.setAttribute('height', '36');

    return svg;
  }

  toggleChat() {
    let dialog = "SalesforceChatComponent";
    let page = "clicktochat";
    this.openDialog(dialog, page);
  }

  closeDialogChat()
  {
    if(this.dialogRef2!=undefined)
    this.dialogRef2.close();

    this.communicationService.emitChange(true);
    //this.contextService.context.iceModel.elements["communication.contact.details.chat.close.dialog"].setSimpleValue(true); // new way close dialog from communication service
  }

  toggleCall() {
    let dialog = "motorCustomTableComponent";
    let page = "clicktocall";
    this.openDialog(dialog, page);
  }

  async openDialog(dialog: string, Page: string): Promise<void> {
    if (dialog == 'motorCustomTableComponent')
    {
      this.dialogRef = this.dialog.open(MotorCustomTableComponent, {
        panelClass: 'custom-dialog-container',
        disableClose: true,
        closeOnNavigation: false,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        data: {
          page: Page,
          iceContext:  (await this.contextService.getContext("customerArea"))
        }
      });
    }
    if (dialog == 'SalesforceChatComponent')
    {
      this.dialogRef2 = this.dialog.open(SalesforceChatComponent, {
        panelClass: 'custom-dialog-container-ctc',
        disableClose: true,
        closeOnNavigation: false,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        data: {
          page: Page,
          iceContext:  (await this.contextService.getContext("customerArea"))
        }
      });
    }
  }

  getBlurEffect() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url.startsWith('/policyDetails')) {

          if (this.addBlur === true)
            return 'notblurEffect';

        }
        else {
          if (this.addBlur === true)
            return 'blurEffect';

        }

      }
    })

  }

  getChatIconOutlineActive() {
    if (this.showIcons === true && this.showHeader === true) {
      return 'chat-icon-outline-active';
    }
  }

  private checkUrlStart(arr: string[], url: string): boolean {
    if(url!=null)
    return arr.some(x => url.startsWith(x));
  }

}
