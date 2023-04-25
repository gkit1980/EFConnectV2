import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';
import { LogoutService } from '../../../services/logout.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss']
})
export class SessionTimeoutComponent implements OnInit {

  success: boolean;

  endSession1 = 'pages.sessionTimeout.endSession1.label';
  endSession2 = 'pages.sessionTimeout.endSession2.label';

  constructor(private localStorage: LocalStorageService, private router: Router, private logoutService: LogoutService) { }


  ngOnInit() {
  }

  get imageSource() {
    return this.getIcon('99105A3DB76C4494A235D3EEB13C54CD');
  }

  onOK() {
    this.localStorage.removeAll();
    this.logoutService.closeDialog();
    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }

  // cancel() {
  //   this.logoutService.closeDialog();
  // }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  get closeImageSource() {
    return this.getIcon('9E57CCB2D5E54B739BF6D3DE8551E683');
  }

  handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '27');
    svg.setAttribute('height', '27');

    return svg;
  }

  onNoClick() {
    this.onOK();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.userIdle.resetTimer();
    // this.router.navigate(['/login']);
  }
}
