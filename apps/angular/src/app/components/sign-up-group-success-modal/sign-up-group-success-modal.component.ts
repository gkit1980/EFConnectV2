import { Component, OnInit } from '@angular/core';
import { environment } from '@insis-portal/environments/environment'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';

@Component({
  selector: 'app-sign-up-group-success-modal',
  templateUrl: './sign-up-group-success-modal.component.html',
  styleUrls: ['./sign-up-group-success-modal.component.scss']
})
export class SignUpGroupSuccessModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              private modalService: ModalService) { }

  ngOnInit() {

  }

  get imageSource() {
    return this.getIcon("E8D77F8BE0CC4427B18F0FD7EA8AFB96");
  }

  onOK() {
    this.activeModal.close();
    this.modalService.isModalClosed();
  }

  // cancel() {
  //   this.logoutService.closeDialog();
  // }

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

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; padding: 30px 0px 0px 40px; fill: #92A2CE !important;");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    return svg;
  }

  onNoClick() {
    this.onOK();
  }

}
