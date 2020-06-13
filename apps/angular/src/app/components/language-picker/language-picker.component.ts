import { Component } from '@angular/core';
import { IceRuntimeService } from '@impeo/ng-ice';
import { get } from 'lodash';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'language-picker',
  templateUrl: './language-picker.component.html',
})
export class LanguagePickerComponent {
  showWarning = false;
  tempLangCode = null;

  translation = {
    dialogConfirmLabel: '',
    dialogDiscardLabel: '',
    dialogTitle: '',
    dialogMessage: '',
  };

  constructor(private languageService: LanguageService, private runtimeService: IceRuntimeService) {
    this.runtimeService.getRuntime().then((runtime) => {
      this.translation = {
        dialogConfirmLabel: runtime.iceResource.resolve('portal.languages.dialog.confirm'),
        dialogDiscardLabel: runtime.iceResource.resolve('portal.languages.dialog.discard'),
        dialogTitle: runtime.iceResource.resolve('portal.languages.dialog.title'),
        dialogMessage: runtime.iceResource.resolve('portal.languages.dialog.message'),
      };
    });
  }

  get languages() {
    return this.languageService.getList();
  }

  get currentLabel() {
    const lang = this.languageService.get();
    return get(lang, 'label', '');
  }

  onChange(langCode) {
    if (langCode !== this.languageService.getCode()) {
      // show dialog message with warning
      this.tempLangCode = langCode;
      this.showWarning = true;
    }
  }

  confirm() {
    this.languageService.setCode(this.tempLangCode);
    this.showWarning = false;
    window.location.reload();
  }

  discard() {
    this.showWarning = false;
    this.tempLangCode = null;
  }

  trackByFn(item) {
    return item.code;
  }
}
