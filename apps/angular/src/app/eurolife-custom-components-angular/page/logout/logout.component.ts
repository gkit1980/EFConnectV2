import { environment } from "./../../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../../../services/local-storage.service";
import { Router } from "@angular/router";
import { LogoutService } from "../../../services/logout.service";
import { AuthService } from "../../../services/auth.service";
import { IcePrincipalService } from "@impeo/ng-ice/services/ice-principal.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"]
})
export class LogoutComponent implements OnInit {
  success: boolean;
  timeOut = "pages.logout.timeOut.label";
  expired = "pages.logout.expired.label";

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private logoutService: LogoutService,
    private principalService: IcePrincipalService
  ) { }

  ngOnInit() { }

  get imageSource() {
    return this.getIcon("EC208845F727483BA841E9F5DA958459");
  }

  onOK() {
   
    this.localStorage.removeAll();
   
    this.closeSalesforceChatDialog();
    this.destroySalesforceChatComponent();


    this.principalService.principal = null;
    this.logoutService.closeDialog();
    this.router.navigate(['/login'], { queryParams: { logout: true } }).then(() => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });
      //
    var element = document.getElementById("popu-8633");
    if(element!=null)
    element.parentNode.removeChild(element);
  }

  cancel() {
    this.logoutService.closeDialog();
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  get closeImageSource() {
    return this.getIcon("9E57CCB2D5E54B739BF6D3DE8551E683");
  }

  handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "27");
    svg.setAttribute("height", "27");

    return svg;
  }

  onNoClick() {
    this.cancel();
  }

  closeSalesforceChatDialog(): void {

 
    let iframe = document.getElementById('salesforce-chat-cmp') as HTMLIFrameElement
    if(iframe!=null)
    iframe.contentWindow.postMessage("close from logout","*");

  }


  destroySalesforceChatComponent(): void {
    const chatElemCls = ['embeddedServiceHelpButton', 'modalContainer'];
    for (const cls of chatElemCls) {
      const chatElem = document.getElementsByClassName(cls);
      for (let index = 0; index < chatElem.length; index++) {
        const element = chatElem[index];
        !!element && element.remove();
      }
    }
  }


}
