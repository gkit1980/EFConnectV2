import { AfterViewChecked,ChangeDetectorRef,Component,OnDestroy,OnInit} from '@angular/core';
import { environment } from './../../../../environments/environment';
import { IndexedValue } from '@impeo/ice-core';
import {IceSectionComponent,SectionComponentImplementation} from '@impeo/ng-ice';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-eclaims-error-script',
  templateUrl: './eclaims-error-script.component.html',
  styleUrls: ['./eclaims-error-script.component.scss']
})
export class EclaimsErrorScriptComponent extends SectionComponentImplementation implements OnInit, OnDestroy, AfterViewChecked
{
private destroy$ = new Subject<void>();
 isSubmit = false;
 isDisabled =false;
 btnLabel :string= "ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΙΚΗ";
 ios: boolean=false;
 errorBrowser: boolean=false;


constructor(parent: IceSectionComponent, private cdr: ChangeDetectorRef, private router: Router,
  private spinnerService: SpinnerService) {
  super(parent);
}

ngOnInit(): void {

  this.errorBrowser= this.context.iceModel.elements['eclaims.salesforce.script.error'].getValue().forIndex(null);


  const stepVal = this.context.iceModel.elements['eclaims.step'].getValue().forIndex(null);

  if (stepVal === 1)
  {
    this.isSubmit = true;
  }

  this.context.iceModel.elements['eclaims.step'].$dataModelValueChange.pipe(takeUntil(this.destroy$)).subscribe(
    (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if (valElem === 1) {
          this.isSubmit = true;
        } else {
          this.isSubmit = false;
        }
      },
      (err: any) =>
        console.error('EclaimsErrorScriptComponent eclaims.step', err)
    );
}

get moreClasses() {
  return this.page.recipe['moreClasses'];
}


getIcon(iconID: string): string {
  let icon = environment.sitecore_media + iconID + '.ashx';
  return icon;
}

get imageSource() {
  return this.getIcon(this.recipe.topImageID);
}


get imageSourceButtonIcon() {
   let imageSource = null;   //this.element.recipe['buttonIcon'];
  if (imageSource == null) return '';
  return imageSource;
}


get svgFillColor() {
  let svgFillColor = this.section.recipe['svgFillColor'];


  if (svgFillColor == null) return '';
  return svgFillColor;
}

 onClick() {
  //  if(!this.errorBrowser)
  //  this.router.navigate(['/ice/default/customerArea.motor/viewClaims',]);
  //  else


  this.spinnerService.loadingOn();
  this.router.navigate(['/ice/default/customerArea.motor/viewClaims',]);
  location.reload();
  this.spinnerService.loadingOff();


}


handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
  svg.setAttribute('style', 'display: block; margin: auto;');
  svg.setAttribute('width', '66');
  svg.setAttribute('height', '61');

  return svg;
}



ngAfterViewChecked(): void {
  this.cdr.detectChanges();
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

}
