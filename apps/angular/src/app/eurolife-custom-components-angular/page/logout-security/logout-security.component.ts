import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../../../services/logout.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './logout-security.component.html',
  styleUrls: ['./logout-security.component.scss'],
})
export class LogoutSecurityComponent implements OnInit {
  success: boolean;

  endSession1 = 'pages.logoutSecurity.text1.label';
  endSession2 = 'pages.logoutSecurity.text2.label';

  constructor(
    private router: Router,
    private logoutService: LogoutService
  ) {}

  ngOnInit() {}

  get imageSource() {
    return this.getIcon('99105A3DB76C4494A235D3EEB13C54CD');
  }

  onOK() {
    this.logoutService.closeDialog();
  }

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
    this.router.navigate(['/login']).then(() => {
      location.reload();
    });
  }
}
