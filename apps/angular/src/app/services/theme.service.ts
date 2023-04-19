import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  $onThemeChange = new BehaviorSubject<string>('default-light-theme');

  private _currentTheme: string;
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this._currentTheme = localStorage.getItem('theme')
      ? localStorage.getItem('theme')
      : 'default-light-theme';
    this.setInitialTheme();
  }

  public get currentTheme(): string {
    return this._currentTheme;
  }

  public setInitialTheme() {
    this.renderer.addClass(this.document.body, this._currentTheme);
  }

  public setTheme(name: string): boolean {
    if (this.currentTheme === name) return false;

    this.renderer.addClass(this.document.body, name);
    this.renderer.removeClass(this.document.body, this.currentTheme);

    this._currentTheme = name;
    localStorage.setItem('theme', name);
    this.$onThemeChange.next(name);

    return true;
  }
}
