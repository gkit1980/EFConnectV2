import {Injectable} from "@angular/core";
declare let ga: Function;
 
@Injectable()
export class GoogleAnalyticsEventsService {
 
    public emitEvent(eventCategory: string,
                    eventAction: string,
                    eventLabel: string = null,
                    eventValue: any = null) {
        ga('send', 'event', {
        eventCategory: eventCategory,
        eventLabel: eventLabel,
        eventAction: eventAction,
        eventValue: eventValue
        });
    }

    public emitPageView(pageUrl: string){
        ga('set', 'page', pageUrl);
		ga('send', 'pageview');
    }
}