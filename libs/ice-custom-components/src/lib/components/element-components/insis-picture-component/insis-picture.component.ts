import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'insis-picture',
  templateUrl: './insis-picture.component.html'
})
export class InsisPictureComponent extends ElementComponentImplementation implements OnInit {
  static componentName = 'InsisPictureComponent';

  css: string;

  ngOnInit() {
    super.ngOnInit();
    this.css = this.getRecipeParam('css', '');
  }

  get src() {
    return this.getComponentValue();
  }
}
