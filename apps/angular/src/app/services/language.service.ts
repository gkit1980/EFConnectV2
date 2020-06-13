import { Injectable } from '@angular/core';
import { IceRuntimeService } from '@impeo/ng-ice';
import { map } from 'lodash';

export const defaultLanguage = 'en';

// getResourceLanguages

@Injectable()
export class LanguageService {
  private current: string;
  private languages: any[] = [];

  constructor(iceRuntimeService: IceRuntimeService) {
    const current = getDefaultLanguage();
    this.current = current;

    iceRuntimeService.getRuntime().then((runtime) => {
      const avaliableLanguages = iceRuntimeService.getResourceLanguages();
      this.languages = map(avaliableLanguages, (language) => ({ code: language, label: language }));
    });
  }

  getCode() {
    return this.current;
  }

  get() {
    return this.getList().filter((lang) => lang.code === this.current)[0];
  }

  setCode(lang) {
    this.current = lang;
    localStorage.setItem('language_code', lang);
  }

  getList() {
    return this.languages;
  }
}

export const getDefaultLanguage = () => {
  return localStorage.getItem('language_code') || defaultLanguage;
};
