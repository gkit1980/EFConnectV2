import { environment } from "@insis-portal/environments/environment";
import { Component, OnInit } from '@angular/core';
import { SitecoreService } from '@insis-portal/services/sitecore.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'faq-section',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})

export class FaqComponent {
    test: any;
    activeTab: number = 0;
    faqData: any = [];
    contentLoaded: boolean = false;

    private getFaqSubs: Subscription;
    private subscription = new Subscription();

    faq = 'sections.faqComponent.faq.label';
    mayWeHelpYou = 'sections.faqComponent.mayWeHelpYou.label';
    search = 'sections.faqComponent.search.label';

    constructor(private sitecoreService: SitecoreService) {
        this.getFaqSubs = this.sitecoreService.getFaq().subscribe((res: any) => {
            this.faqData = res.value;
            this.filteredData = this.faqData.map((tab: any, i: number) => {
                let temp = tab.Children.map((child: any, j: number) => {
                    return Object.assign(child, { active: false })
                })

                let newTab = Object.assign(tab, {noData: false});
                newTab.Children = temp;
                return newTab;
            });

            if (!!this.faqData) {
                this.contentLoaded = true;
            }
        });
        this.subscription.add(this.getFaqSubs);
    }

    // faqData: any = [{
    //     tabtitle: "My Account",
    //     data: [{ title: "Τι απαιτείται για την εγγραφή στο “customer area”;", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", active: true },
    //     { title: "Πως μπορώ να ενεργοποιήσω τον λογαριασμό μου στο “customer area”;", text: "Lorem Ipsum is simply dummy Aldus PageMaker including versions of Lorem Ipsum.", active: false }]
    // },
    // {
    //     tabtitle: "My Profile",
    //     data: [{ title: "Δεν έχω πρόσβαση στο “customer area”. Τι χρειάζεσται να κάνω;", text: "Lorem Ipsum is simply dummy text of the printing and typesetting Lorem Ipsum.t", active: false },
    //     { title: "Επιθυμώ να αλλάξω το Όνομα Χρήστη στον λογαριασμό μου.", text: "Lorem Ipsum is simply publishing software like Aldus PageMaker including versions of Lorem Ipsum.", active: false }]
    // }
    // ]

    // dummyData = [{
    //     tabname: "Account",
    //     tabcontent: [{
    //         title: "title1",
    //         text: [{ normaltext: "How to " }, { boldtext: "pass ", tooltip: "test tooltip." }, { normaltext: "keep texting." }]
    //     }, {
    //         title: "title2",
    //         text: [{ normaltext: "text example2" }]
    //     }, {
    //         title: "title1",
    //         text: "Lost Account. how to manage to retrieve your credentials"
    //     }, {
    //         title: "title2",
    //         text: "text example2"
    //     }, {
    //         title: "title1",
    //         text: "Lost Account. how to manage to retrieve your credentials"
    //     }, {
    //         title: "title2",
    //         text: "text example2"
    //     }, {
    //         title: "title1",
    //         text: "Lost Account. how to manage to retrieve your credentials"
    //     }, {
    //         title: "title2",
    //         text: "text example2"
    //     }]
    // },
    // {
    //     tabname: "My Policies",
    //     tabcontent: [{
    //         title: "title3",
    //         text: "text example3"
    //     }, {
    //         title: "title4",
    //         text: "text example4"
    //     }]
    // },
    // {
    //     tabname: "My Claims",
    //     tabcontent: [{
    //         title: "title5",
    //         text: "text example3"
    //     }, {
    //         title: "title6",
    //         text: "text example4"
    //     }]
    // }
    // ]

    filteredData: any = [];
    selectedIndex: number = 0;
    editedData: any;

    ngOnInit() {
        // this.editedData = this.createDataSet();
        // this.filteredData = this.editedData.slice(0, this.editedData.length);

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    createDataSet() {
        let newTabList = this.faqData.map((tab: any, i: number) => {
            let tempTab;
            tempTab = Object.assign({}, tab);
            tempTab.data = tab.data.map((dato: any, i: number) => {
                let tempDato = Object.assign({}, dato)
                tempDato.text = this.editStructure(dato.text, dato.tooltip)
                return tempDato;
            })
            return tempTab;
        })
        return this.faqData
    }

    editStructure(data: string, tooltip: string) {

        let tempData = data.split(' ');
        var newStructure: any = [];
        var word: string = '';
        var boldtext: string = '';
        tempData.map((part: any, i: number) => {
            if (part.charAt(0) === '#' && part.substring(part.length - 1) === '$') {
                var obj = Object.assign({ text: word })
                word = '';
                newStructure.push(obj);
                boldtext = boldtext.concat(part);
                boldtext = boldtext.slice(1, boldtext.length - 1);
                var obj = Object.assign({ boldtext: boldtext + ' ', tooltip: tooltip })
                boldtext = '';
                newStructure.push(obj);
            } else if (part.charAt(0) === '#') {
                var obj = Object.assign({ text: word })
                word = '';
                newStructure.push(obj);
                boldtext = boldtext.concat(part + ' ')
                boldtext = boldtext.slice(1, boldtext.length);
            } else if (part.substring(part.length - 1) === '$') {
                boldtext = boldtext.concat(part);
                boldtext = boldtext.slice(0, boldtext.length - 1);
                var obj = Object.assign({ boldtext: boldtext + ' ', tooltip: tooltip })
                boldtext = '';
                newStructure.push(obj);
            } else {
                word = word.concat(part + ' ');
                if (i === tempData.length - 1) {
                    var obj = Object.assign({ text: word })
                    newStructure.push(obj);
                }
            }
        })
        return newStructure;
    }

    getIcon(iconID: string): string {
        let icon = environment.sitecore_media + iconID + '.ashx';
        return icon;
    }

    onTabClick(tabIndex: number) {
        this.selectedIndex = tabIndex;
        this.activeTab = tabIndex;
    }

    titleClick(index: number) {

        this.filteredData[this.activeTab].Children[index].active = !this.filteredData[this.activeTab].Children[index].active;

    }

    onSearchClick(value: string) {
        this.filteredData = this.faqData.map((tab: any, i: number) => {
            let temp = tab.Children.filter((d: any, i: number) => {
                return d.FieldValues.Title.toLowerCase().includes(value.toLocaleLowerCase())
            });
            let newTab = Object.assign({}, tab);
            newTab.Children = temp;
            if (newTab.Children.length === 0){
                newTab.noData = true;
            }else{
                newTab.noData = false;
            }
            return newTab;
        });
        if (this.filteredData[this.activeTab].Children.length === 0){

        }
    }

    handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
        svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(255, 255, 255);');
        svg.setAttribute('width', '22');
        svg.setAttribute('height', '22');

        return svg;
    }

    handleFAQSVG(svg: SVGElement, parent: Element | null): SVGElement {
        svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(239, 51, 64);');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');

        return svg;
    }
}
