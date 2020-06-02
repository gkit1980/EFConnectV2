import { IceCheckboxComponent } from '@impeo/ng-ice';
import { Component } from '@angular/core';

@Component({
  selector: 'insis-checkbox-with-markdown',
  templateUrl: './insis-checkbox-with-markdown.component.html'
})
export class InsisCheckboxWithMarkdownComponent extends IceCheckboxComponent {
  static componentName = 'InsisCheckboxWithMarkdown';
}
