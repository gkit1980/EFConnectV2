import { CookieDeclarationComponent } from './../../eurolife-custom-components-angular/page/cookie-declaration/cookie-declaration.component';
import { environment } from "./../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, NavigationEnd } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TermsConditionsComponent } from "../../eurolife-custom-components-angular/page/terms-conditions/terms-conditions.component";
import { LocalStorageService } from "../../services/local-storage.service";

@Component({
  selector: "page-footer",
  templateUrl: "./page-footer.component.html",
  styleUrls: ["./page-footer.component.scss"]
})
export class PageFooterComponent implements OnInit {
  public version = {};
  public year: Number = new Date().getFullYear();
  showCommunicationPoint = true;
  footerDisclaimerWhite: boolean;

  information1 = "app.footer.information1.label";
  information2 = "app.footer.information2.label";
  center = "app.footer.center.label";
  telephone = "app.footer.telephone.label";
  info = "app.footer.info.label";
  communication = "app.footer.communication.label";
  questions = "app.footer.questions.label";
  glossary = "app.footer.glossary.label";
  eurolife = "app.footer.eurolife.label";
  oroiXrishs = "app.footer.oroiXrishs.label";
  copyright = "app.footer.copyright.label";
  prostasiadedomenwn = "app.footer.prostasiadedomenwn.label";
  politikicookies = "app.footer.politikicookies.label";

  constructor(
    private http: HttpClient,
    private route: Router,
    private modalService: NgbModal,
    private localStorage: LocalStorageService
  ) {
    let path = "./api/v1/version";
    this.http.get(path).subscribe(resp => (this.version = resp["data"]));

    let refresh = this.localStorage.getDataFromLocalStorage("refreshStatus");

    if (refresh === 1) {
      var re = /communicationService/gi;
      var re2 = /viewMyPolicies/gi;
      var re3 = /viewClaims/gi;
      var re4 = /paymentManagement/gi;
      var re5 = /viewAmendments/gi;
      var str = this.route.url;
      if (str.search(re) == -1) {
        this.showCommunicationPoint = false;
      } else {
        this.showCommunicationPoint = true;
      }
      if (
        str.search(re2) == -1 &&
        str.search(re3) == -1 &&
        str.search(re4) == -1 &&
        str.search(re5) == -1
      ) {
        this.footerDisclaimerWhite = true;
      } else {
        this.footerDisclaimerWhite = false;
      }
    }

    this.route.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        var re = /communicationService/gi;
        var re2 = /viewMyPolicies/gi;
        var re3 = /viewClaims/gi;
        var re4 = /paymentManagement/gi;
        var re5 = /viewAmendments/gi;
        var str = this.route.url;
        if (str.search(re) == -1) {
          this.showCommunicationPoint = false;
        } else {
          this.showCommunicationPoint = true;
        }
        if (
          str.search(re2) == -1 &&
          str.search(re3) == -1 &&
          str.search(re4) == -1 &&
          str.search(re5) == -1
        ) {
          this.footerDisclaimerWhite = true;
        } else {
          this.footerDisclaimerWhite = false;
        }
      }
    });
  }

  ngOnInit() {
    // var acceptButton = document.getElementsByClassName("optanon-allow-all")[0];
    // var saveSettingButton = document.getElementsByClassName(
    //   "optanon-white-button-middle"
    // )[0];
    // var allowAllButton = document.getElementsByClassName(
    //   "optanon-white-button-middle"
    // )[1];

    // acceptButton.addEventListener("click", function() {
    //   location.reload();
    // });

    // allowAllButton.addEventListener("click", function() {
    //   location.reload();
    // });

    // saveSettingButton.addEventListener("click", function() {
    //   location.reload();
    // });
  }

  cookieClick() {
    this.modalService.open(CookieDeclarationComponent, { windowClass: 'xlModal' });
    // document.getElementById("cookie-btn").click();
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block;");
    svg.setAttribute("width", "145");
    svg.setAttribute("height", "62");

    return svg;
  }

  handleSocialSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; fill: #ef3340 !important;");
    svg.setAttribute("width", "28");
    svg.setAttribute("height", "25");

    return svg;
  }

  openDialog() {
    this.modalService.open(TermsConditionsComponent, {
      windowClass: "xlModal"
    });
  }

  openDialogLegal() {
    window.open("https://www.eurolife.gr/prosopika-dedomena/ekseidikeumeni-enimerosi-ana-etaireia-kai-epeksergasia/" , "_blank");
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  imageSource(avatar: string): string {
    let mypath = `${environment.sitecore_media}${avatar}.ashx`;
    return mypath;
  }

  onClick(socialMedia: string) {
    switch (socialMedia) {
      case "linkedin":
        window.open("https://www.linkedin.com/company/eurolife-erb");
        break;
      case "twitter":
        window.open("https://twitter.com/eurolife_erb?lang=el");
        break;
      case "facebook":
        window.open("https://www.facebook.com/eurolife.ffh/");
        break;
      case "youtube":
        window.open("https://www.youtube.com/user/EurolifeERB");
        break;
      default:
        break;
    }
  }

  getDisclaimerWhite() {
    if (this.footerDisclaimerWhite === true) {
      return "disclaimer-white";
    }
  }

  getCommunicationDisclaimerFixTop() {
    if (this.showCommunicationPoint === true) {
      return "communication-disclaimer-fix-top";
    }
  }
}
