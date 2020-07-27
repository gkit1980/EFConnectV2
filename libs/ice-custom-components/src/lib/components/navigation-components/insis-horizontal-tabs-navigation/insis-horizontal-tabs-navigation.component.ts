import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { PageLabelRule } from '@impeo/ice-core';

@Component({
  selector: 'insis-horizontal-tabs-navigation',
  templateUrl: './insis-horizontal-tabs-navigation.component.html',
})
export class InsisHorizontalTabsNavigationComponent implements OnInit, AfterViewInit {
  static componentName = 'InsisHorizontalTabsNavigationComponent ';
  selectedIndex: number;

  @Input() pages: any[];

  @Input() currentPage: any;

  @Output() navigate: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit() {
    const activeTab = document.querySelector('.mat-tab-label-active');
    if (activeTab) {
      // @ts-ignore
      activeTab.focus();
    }
  }

  pageTitle(page: any): string {
    return (page.labelRule as PageLabelRule).getPageTitle();
  }

  ngOnInit() {
    this.selectedIndex = this.pages.findIndex((page) => page.name === this.currentPage.name);
  }

  onClick($event: any) {
    this.navigate.emit({ page: this.pages[$event.index] });
  }

  onIndexChange($event) {
    this.selectedIndex = $event;
    this.navigate.emit({ page: this.pages[$event] });
  }
}
