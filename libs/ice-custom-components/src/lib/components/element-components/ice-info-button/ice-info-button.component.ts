import { Component, ElementRef, Inject, OnInit } from '@angular/core';

import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import { OverlayRef, Overlay, OverlayPositionBuilder, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material';

@Component({
  selector: 'ice-info-button',
  templateUrl: './ice-info-button.component.html'
})
export class IceInfoButtonComponent extends MaterialElementComponentImplementation
  implements OnInit {
  static componentName = 'IceInfoButton';

  private overlayRef: OverlayRef;

  componentPortal: ComponentPortal<TooltipComponent>;

  private get scrollStrategy(): ScrollStrategy {
    switch (this.getRecipeParam('scrollStrategy')) {
      case 'NoopScrollStrategy':
        return this.overlay.scrollStrategies.noop();
      case 'BlockScrollStrategy':
        return this.overlay.scrollStrategies.block();
      case 'RepositionScrollStrategy':
        return this.overlay.scrollStrategies.reposition();
      default:
        return this.overlay.scrollStrategies.close();
    }
  }

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayPositionBuilder: OverlayPositionBuilder,
    @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) defaults: MatFormFieldDefaultOptions
  ) {
    super(defaults);

    this.overlayRef = this.overlay.create({});
  }

  ngOnInit() {
    super.ngOnInit();

    this.updateConfiguration();
  }

  attachTooltip() {
    this.componentPortal = new ComponentPortal(TooltipComponent);

    if (this.overlayRef.hasAttached()) this.overlayRef.detach();
    else {
      const componentRef = this.overlayRef.attach<TooltipComponent>(this.componentPortal);
      componentRef.instance.text = this.element.textRule.getText(
        'info',
        'Default info',
        this.index
      );
      componentRef.instance.overlayRef = this.overlayRef;
    }
  }

  private updateConfiguration() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: this.getRecipeParam('originX', 'center'),
          originY: this.getRecipeParam('originY', 'bottom'),
          overlayX: this.getRecipeParam('overlayX', 'end'),
          overlayY: this.getRecipeParam('overlayY', 'bottom'),
          offsetX: this.getRecipeParam('offsetX', 0),
          offsetY: this.getRecipeParam('offsetY', 0)
        }
      ]);

    this.overlayRef.updatePositionStrategy(positionStrategy);

    this.overlayRef.getConfig().disposeOnNavigation = this.getRecipeParam(
      'disposeOnNavigation',
      true
    );

    this.overlayRef.getConfig().hasBackdrop = this.getRecipeParam('hasBackdrop', false);

    this.overlayRef.getConfig().backdropClass = this.getRecipeParam('backdropClass', []);

    this.overlayRef.updateSize({
      height: this.getRecipeParam('height', 50),
      width: this.getRecipeParam('width', 300),
      maxHeight: this.getRecipeParam('maxHeight'),
      minHeight: this.getRecipeParam('minHeight'),
      maxWidth: this.getRecipeParam('maxWidth'),
      minWidth: this.getRecipeParam('minWidth')
    });

    this.overlayRef.updateScrollStrategy(this.scrollStrategy);

    this.overlayRef.addPanelClass(this.getRecipeParam('panelClass', []));
  }
}

@Component({
  selector: 'tooltip-component',
  template: `
    <div class="ice-info-bubble">
      <mat-icon class="close" (click)="close()">close</mat-icon>
      <div id="triangle"></div>
      <div [innerHTML]="this.text | MarkdownToHtml" class="bubble-content"></div>
    </div>
  `
})
export class TooltipComponent {
  text = '';

  overlayRef: OverlayRef;

  constructor() {}

  close() {
    if (this.overlayRef.hasAttached()) this.overlayRef.detach();
  }
}
