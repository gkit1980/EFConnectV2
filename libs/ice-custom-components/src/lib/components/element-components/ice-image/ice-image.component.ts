import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import * as fsave from "file-saver";

@Component({
  selector: 'app-ice-image',
  templateUrl: './ice-image.component.html',
  styleUrls: ['./ice-image.component.scss']
})
export class IceImageComponent extends ElementComponentImplementation implements OnInit {

  static componentName = 'IceImage';

  ngOnInit() {
    super.ngOnInit();
  }

  get imageSource() {
    return this.getRecipeParam('imageURL');
  }

  get values() {
    return this.value;
  }

  get pageSource() {
    return this.getRecipeParam('pageSource');
  }

}
