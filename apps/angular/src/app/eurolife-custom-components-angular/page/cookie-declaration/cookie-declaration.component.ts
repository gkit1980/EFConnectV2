import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { CookieConsentService } from '../../../services/cookie-consent.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cookie-declaration',
  templateUrl: './cookie-declaration.component.html',
  styleUrls: ['./cookie-declaration.component.scss']
})
export class CookieDeclarationComponent implements OnInit {

  test: string;
  private consentEventSubs: Subscription;
  @ViewChild('divID') divID: ElementRef<HTMLElement>;




  constructor(public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private consentCookieService:CookieConsentService

  ) { }

   ngOnInit() {

    var consentLink = document.getElementById("CookieDeclarationChangeConsentChange") as HTMLLinkElement;
    consentLink.href = window.location.href;


    var consentLinkWithDraw = document.getElementById("CookieDeclarationChangeConsentWithdraw") as HTMLLinkElement;
    consentLinkWithDraw.href = window.location.href;


    var cookieDeclaration = document.getElementsByClassName("CookieDeclaration")[0];


    this.divID.nativeElement.innerHTML = cookieDeclaration.innerHTML;
    this.consentCookieService.resetClicks();

  this.consentEventSubs=this.consentCookieService.consentModalOpen.subscribe((value: boolean) => {
      if (!value) {
        this.activeModal.close();
      }
      });


  }




  get imageSource() {
    return this.getIcon('99105A3DB76C4494A235D3EEB13C54CD');
  }

  onOK() {
    this.activeModal.close();
    this.modalService.isModalClosed();
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
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

  onNoClick() {
    this.onOK();
  }

  ngOnDestroy()
  {
    this.consentEventSubs.unsubscribe();
  }

}
