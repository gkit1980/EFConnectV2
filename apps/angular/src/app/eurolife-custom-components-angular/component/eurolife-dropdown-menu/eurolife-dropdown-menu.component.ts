import { environment } from "./../../../../environments/environment";
import { Component, OnInit, HostListener, ElementRef, ViewChild, ChangeDetectorRef, AfterViewChecked } from "@angular/core";
import { CommunicationService } from "../../../services/communication.service";
import { LocalStorageService } from "../../../services/local-storage.service";
import { LogoutService } from "../../../services/logout.service";
import { ProfilePictureService } from "../../../services/profile-picture.service";
import { IceContextService } from "@impeo/ng-ice";
import { IndexedValue } from '@impeo/ice-core';
import { DecodeJWTService } from "../../../services/decode-jwt.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-eurolife-dropdown-menu",
  templateUrl: "./eurolife-dropdown-menu.component.html",
  styleUrls: ["./eurolife-dropdown-menu.component.scss"]
})
export class EurolifeDropdownMenuComponent implements OnInit, AfterViewChecked {
  profile = "component.dropdown.profile.label";
  certificates = "component.dropdown.certificates.label";
  settings = "component.dropdown.settings.label";
  logOut = "component.dropdown.logOut.label";
  profilePicture: string;
  showAvatar: boolean = true;
  showProfilePicture: boolean;
  showDocs: boolean =true;
  refreshStatus :number;
  dropdownOpen: boolean = false;

  fullName: string;
  jwt_data: any;
  private wasInside = false;

  @ViewChild('myDiv') myDiv: ElementRef<HTMLElement>;

  @HostListener("document:click", ["$event"]) async clickout(event: any) {
    const targetElement = event.target as HTMLElement;
    // Check if the click was outside the element
    if (
      targetElement && !this.elementRef.nativeElement.contains(targetElement)
    ) {
      if (this.dropdownOpen && !(await this.contextService.getContext("customerArea")).iceModel.elements["walkthrough.home.trigger.toggledown"].getValue().forIndex(null)) {
        this.toggleDropdown();
      }
    }
  }

  constructor(
    private localStorage: LocalStorageService,
    private logoutService: LogoutService,
    private contextService: IceContextService,
    private elementRef: ElementRef,
    private profilePictureService: ProfilePictureService,
    private decodeJWT: DecodeJWTService,
    private communicationService: CommunicationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<any> {
    this.refreshStatus = this.localStorage.getDataFromLocalStorage('refreshStatus');

    ///Walkthrough management of the next,previous and done tempate of joyride impementation
    if (this.refreshStatus == 0 || this.refreshStatus == undefined) {
      (await this.contextService.getContext("customerArea")).iceModel.elements['policies.showDocs'].setSimpleValue(this.showDocs);

      (await this.contextService.getContext("customerArea")).iceModel.elements[
        'walkthrough.home.trigger.toggledown'
      ].$dataModelValueChange.subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === true) {
          this.dropdownOpen = true;
        }
      });

    }

      //end Walkthrough management

    this.decodeJWT.decodeToken(
      this.localStorage.getDataFromLocalStorage("token")
    );
    this.communicationService.changeEmitted.subscribe(async (data: any) => {
      this.showDocs = data;
       (await this.contextService.getContext("customerArea")).iceModel.elements["policies.showDocs"].setSimpleValue(this.showDocs);
    });
   // this.showDocs = this.localStorage.getDataFromLocalStorage("dropDownDocs");


    try {
      this.fullName = this.decodeJWT.decodedToken.emails[0];
    } catch (error) {
      return null;
    }

    // this.profilePictureService.getPhoto("testonboarding1000@mail.com")
    this.profilePictureService
      .getPhoto(this.localStorage.getDataFromLocalStorage("email"))
      .subscribe((response: any) => {
        if (response.Photo != null) {
          this.showProfilePicture = true;
          this.showAvatar = false;
          this.profilePicture = "data:image/jpg;base64," + response.Photo;
          this.profilePictureService.storeImage(
            this.showProfilePicture,
            this.profilePicture
          );
        } else {
          this.showProfilePicture = false;
          this.showAvatar = true;
          this.profilePictureService.storeImage(
            this.showProfilePicture,
            "https://scp.eurolife.gr/~/media/587B1CA564EA46D085F1C755786E2E16.ashx"
          );
        }
      });

    this.profilePictureService.changeEmitted.subscribe((data: any) => {
      // this.profilePicture = this.satinizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + data).changingThisBreaksApplicationSecurity;
      this.profilePicture = "data:image/jpg;base64," + data;
      if (this.profilePicture == " ") {
        this.showAvatar = true;
        this.showProfilePicture = false;
        this.profilePictureService.storeImage(
          this.showProfilePicture,
          "https://scp.eurolife.gr/~/media/587B1CA564EA46D085F1C755786E2E16.ashx"
        );
      } else {
        this.showProfilePicture = true;
        this.showAvatar = false;
        this.profilePictureService.storeImage(
          this.showProfilePicture,
          this.profilePicture
        );
      }
    });




  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
  }

  get imageSource() {
    return this.getIcon("587B1CA564EA46D085F1C755786E2E16");
    // return 'https://scp.eurolife.gr/~/media/587B1CA564EA46D085F1C755786E2E16.ashx';
    // return this.value;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute(
      "style",
      "display: block; margin: auto; fill: #ef3340 !important"
    );
    svg.setAttribute("width", "17.9");
    svg.setAttribute("height", "17.2");

    return svg;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getArrow(arg: any) {
    if (this.dropdownOpen) {
      return "fa-angle-up";
    } else {
      return "fa-angle-down";
    }
  }

  logout() {
    this.logoutService.logout(false);
  }

  onPreferences() {
    this.router.navigate(["/ice/default/customerArea.motor/customerProfile"], {
      queryParams: {
        id: 1
      }
    });
  }



  async getJoyrideSteps(arg: any): Promise<string> {
    try {
      if (
        (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) &&
        (await this.contextService.getContext("customerArea")).iceModel.elements['policies.showLastNotes'].getValue().forIndex(null) &&
        this.showDocs
      )
        return 'fifthStep_sixthStep';
      if (
        (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) &&
        (await this.contextService.getContext("customerArea")).iceModel.elements['policies.showLastNotes'].getValue().forIndex(null) &&
        !this.showDocs
      )
        return 'fifth_Step';
      if (
        (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) &&
        !(await this.contextService.getContext("customerArea")).iceModel.elements['policies.showLastNotes'].getValue().forIndex(null) &&
        this.showDocs
      )
        return 'fourthStep_fifthStep';
      if (
        (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) &&
        ! (await this.contextService.getContext("customerArea")).iceModel.elements['policies.showLastNotes'].getValue().forIndex(null) &&
        !this.showDocs
      )
        return 'fourthStep';
      if (
        ! (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) &&
        (await this.contextService.getContext("customerArea")).iceModel.elements['policies.showLastNotes'].getValue().forIndex(null) &&
        this.showDocs
      )
        return 'fourthStep_fifthStep';
      if (
        ! (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) &&
        (await this.contextService.getContext("customerArea")).iceModel.elements['policies.showLastNotes'].getValue().forIndex(null) &&
        !this.showDocs
      )
        return 'fourthStep';
      if (
        ! (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) &&
        ! (await this.contextService.getContext("customerArea")).iceModel.elements['policies.showLastNotes'].getValue().forIndex(null) &&
        this.showDocs
      )
        return 'thirdStep_fourthStep';
      if (
        ! (await this.contextService.getContext("customerArea")).iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) &&
        ! (await this.contextService.getContext("customerArea")).iceModel.elements['policies.showLastNotes'].getValue().forIndex(null) &&
        !this.showDocs
      )
        return 'thirdStep';
      else return '';
    } catch(error) {
      return '';
    }
  }





}
