import { environment } from '@insis-portal/environments/environment';
import { Component} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IcePage, IceSection  } from '@impeo/ice-core';
import { PageComponentImplementation, IceContextService } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { ModalService } from '@insis-portal/services/modal.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface PopupPageData {
  page: string
  iceContext: IceContextService
}

@Component({
  selector: 'app-pop-up-page',
  templateUrl: './pop-up-page.component.html',
  styleUrls: ['./pop-up-page.component.scss']
})
export class PopUpPageComponent extends PageComponentImplementation {
  static componentName = 'PopUpPage';
  static pageToDisplay: IcePage;
  showTopSection = false;
  showTriangle = false;
  srcsafe:string;
  srcsafeurl: SafeResourceUrl;


  private myFunc = this.handleSVG.bind(this); //SOS!!! pass context to SVG context

  //public sanitizer: DomSanitizer
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: ModalService,
    public sanitizer: DomSanitizer

  ) {
    super();
  }

  ngOnInit() {
    if (PopUpPageComponent.pageToDisplay == null) return;
    this.page = PopUpPageComponent.pageToDisplay;
    super.ngOnInit();
    this.context.iceModel.elements['pagebutton'].setSimpleValue(this.page.name);
    this.showTopSection = this.page.recipe['showTopSection'];
    this.showTriangle = this.page.recipe['showTriangle'];      //only for walkthrough dialogs

     //extra customization for animated photo
    if(this.recipe.name=="viewGroupProfileSuccessDialog")
    {
    this.srcsafe=this.getIcon(this.recipe.topImageID);
    this.srcsafeurl=this.sanitizer.bypassSecurityTrustResourceUrl(this.srcsafe);
    }

  }

  get alignmentClass(): string {
    if (this.recipe.flag === "consents")
      return 'custom-page-content-container-consent';

    if (this.recipe.flag === "walkthrough policyDetails1")
      return 'custom-page-content-container-walkthrough';

  }

  get closeImageSource() {
    return this.getIcon('9E57CCB2D5E54B739BF6D3DE8551E683');
  }

  handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '27');
    svg.setAttribute('height', '27');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  get Page(){
    return this.recipe.name;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {

    if(this.page.recipe.topImageColour!=undefined)
    svg.lastElementChild.firstElementChild.setAttribute("fill",this.page.recipe.topImageColour)
  // svg.setAttribute("colour", this.page.recipe.topImageColour);
    return svg;
  }

  get imageSource() {

    return this.getIcon(this.page.recipe.topImageID);
  }

  onNoClick() {

    //Only for Consent purposes
    if (this.page.name == "consent") {
      if (this.context.iceModel.elements['consent.page.index'].getValue().forIndex(null) == 3) {
        // this.context.iceModel.elements["consent.popupdialog"].setSimpleValue(false);
        // this.context.iceModel.elements['consent.page.index'].setSimpleValue(2);
        this.modalService.isModalClosed();
        this.activeModal.close();

      }
      else {
        this.context.iceModel.elements["consent.popupdialog"].setSimpleValue(true);
        this.context.iceModel.elements['consent.page.index'].setSimpleValue(3);
      }

    }
    else {


      this.modalService.isModalClosed();
      this.activeModal.close();



    }

  }

  //Only for Consent purposes
  showCloseIcon(): boolean {
    if (this.page.name.includes('consent')) {
      if (this.context.iceModel.elements["consent.showcloseicon"].getValue().forIndex(null) == true && this.context.iceModel.elements["consent.page.index"].getValue().forIndex(null) == 1)
        return true;
      else
        return false;
    }
    else
      return false;
  }

  get moreClasses1() {
    return this.page.recipe['moreClasses1'];
  }


}
