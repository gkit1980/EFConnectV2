import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "@insis-portal/environments/environment";
import { ModalService } from '@insis-portal/services/modal.service';

@Component({
  selector: 'app-review-confirm',
  templateUrl: './review-confirm.component.html',
  styleUrls: ['./review-confirm.component.scss']
})
export class ReviewConfirmComponent implements OnInit {


  constructor(public activeModal: NgbActiveModal,
    private modalService: ModalService) { }

  ngOnInit() {
  }

  get imageSource() {
    return this.getIcon('99105A3DB76C4494A235D3EEB13C54CD');
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

  closeClick() {
    this.activeModal.dismiss();
  }

}
