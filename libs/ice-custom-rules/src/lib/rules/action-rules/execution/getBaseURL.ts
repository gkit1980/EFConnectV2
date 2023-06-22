export class getBaseURL {

    constructor() { }

    baseURL(url: string) {
        if (url == 'https://lifeuatna.eurolife.gr/CustomerDataProvider/api/CustomerDocumentsBrowser') {
            return process.env.BASEURLDOCS;
        } else if (url == 'https://lifeuatna.eurolife.gr/CardLinkWebAPI/api/CardLink')
            return process.env.BASEURLCARDLINK;
        return process.env.BASEURL;
    }
}