import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-text-with-link',
  templateUrl: './text-with-link.component.html',
  styleUrls: ['./text-with-link.component.scss']
})
export class TextWithLinkComponent extends ElementComponentImplementation implements OnInit {
  static componentName = 'Text With Link';
  public labelPosition: string;
  public labelHtml: string;
  public valueHtml: string;

  constructor(public sanitized: DomSanitizer) {
    super();
  }

  public ngOnInit() {
    super.ngOnInit();
    let target = this.getRecipeParam("target");
    let linkType = this.getRecipeParam("linkType");
    let htmlLink: string;
    this.valueHtml = this.value;
    this.labelPosition = this.getRecipeParam('labelPosition', 'after');
    this.labelHtml = this.label;
    const regexPattern = /\[(.*?)\]\((.*?)\)/;
    let match: RegExpMatchArray;
    while (true) {
      if (target == 'label') {
        match = this.labelHtml.match(regexPattern);
      } else {
        match = this.valueHtml.match(regexPattern);
      }
      if (match != null) {
        switch (linkType) {
          case 'telephone':
            htmlLink = "<a href =tel:+\"" + match[2] + "\">" + match[1] + "</a>";
            break;
          case 'email':
            htmlLink = "<a href =mailto:\"" + match[2] + "\">" + match[1] + "</a>";
            break;
          default:
            htmlLink = "<a href=\"" + match[2] + "\">" + match[1] + "</a>";
            break;
        }

        if (target == 'label') {
          this.labelHtml = this.labelHtml.replace(regexPattern, htmlLink);
        } else {
          this.valueHtml = this.valueHtml.replace(regexPattern, htmlLink);
        }
      }
      else break;
    }
  }

  onClick() {
    console.log('Clicked');
  }

}
