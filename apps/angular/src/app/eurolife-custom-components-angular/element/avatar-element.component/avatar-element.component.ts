import { Component } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { ProfilePictureService } from './../../../services/profile-picture.service';


@Component({
  selector: 'app-avatar-element',
  templateUrl: './avatar-element.component.html'
})
export class AvatarElementComponent extends ElementComponentImplementation  {

  static componentName = 'AvatarElement';
  isProfilePicture: boolean;

  constructor(private profilePictureService: ProfilePictureService){
    super();
    this.isProfilePicture = this.profilePictureService.restoreImage().isProfilePicture;
  }


  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: #ef3340;');
    svg.setAttribute('width', '33');
    svg.setAttribute('height', '35');

    return svg;
  }

}
