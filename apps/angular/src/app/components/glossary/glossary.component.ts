import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { SitecoreService } from '@insis-portal/services/sitecore.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'glossary-section',
    templateUrl: './glossary.component.html',
    styleUrls: ['./glossary.component.scss']
})



export class GlossaryComponent {

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        this.GlossaryData.map((i: any) => {
            var elem = document.querySelector('#'+i.Name);
            var bounding = elem.getBoundingClientRect();
            var mainContainer = document.getElementById("content"+i.Name);
            var element = document.getElementById("tab"+i.FieldValues.Description)
            element.classList.remove("glossary-tab-active");
            element.classList.remove("h6-active");
            if (bounding.top <= 21 && bounding.top >= -(mainContainer.offsetHeight-22)){
                element.classList.add("glossary-tab-active");
                element.classList.add("h6-active");
                return 0;
            }
        });
    }

    selectedIndex: number = 0;
    activeTab: number;
    GlossaryData: any = [];
    Data: any = [];
    contentLoaded: boolean = false;

    private getGlossarySubs: Subscription;
    private subscription = new Subscription();

    text = 'sections.glossary.text.label';
    insuranceDictionary = 'sections.glossary.insuranceDictionary.label';

    constructor(
        private sitecoreService: SitecoreService
    ) {
        this.getGlossarySubs = this.sitecoreService.getGlossary().subscribe((res: any) => {
            this.GlossaryData = res.value;
            this.Data = this.GlossaryData.map((tab: any, i: number) => {
                let temp = tab.Children.map((child: any, j: number) => {
                    return Object.assign(child, { active: false })
                })
                let newTab = Object.assign({}, tab);
                newTab.Children = temp;
                return newTab;
            });

            if (!!this.GlossaryData) {
                this.contentLoaded = true;
            }
        });
        this.subscription.add(this.getGlossarySubs);
    }


    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onTabClick(letter: any, tabIndex: number) {
        this.activeTab = tabIndex;
        let elmnt = document.getElementById(letter);
        elmnt.scrollIntoView();
        window.scrollBy(0, -20);
    }


    getIcon(iconID: string): string {
        let icon = environment.sitecore_media + iconID + '.ashx';
        return icon;
    }

    titleClick(index: number, tab: number) {
        // let temp = index;
        // for(let i=0; i< tab; i++){
        //     temp = temp - this.dummyData[tab].data.length
        // }
        this.Data[index].Children[tab].active = !this.Data[index].Children[tab].active;
    }

    handleFAQSVG(svg: SVGElement, parent: Element | null): SVGElement {
        svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(239, 51, 64);');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');

        return svg;
    }

}
