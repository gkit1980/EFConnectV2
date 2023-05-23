import { response } from "express";

var _ = require('lodash');
const constants = require("../constants/constants");
const { GoogleAuth } = require('google-auth-library');

export default class WalletStatisticsController {

    public static retrieveStatistics = async (req: any, res: any) => {
        // Create Wallet Model
        let Wallet = req.app.get('Wallet');
        let secret = req.app.get('GooglePrivateKey');
        let googleClassIds = [constants.GOOGLE_MOTOR_CLASS_ID
            , constants.GOOGLE_PROPERTY_CLASS_ID
            , constants.GOOGLE_GROUPHEALTH_CLASS_ID
            , constants.GOOGLE_LIFE_CLASS_ID
            , constants.GOOGLE_HEALTH_CLASS_ID
            , constants.GOOGLE_INVESTMENT_CLASS_ID];
        let googleStatistics: any;
        let appleStatistics: any;
        let googleDetails: any[] = [];
        let googleSumStatistics: any;

        let responseBody = {
            "GoogleStatistics": {
                "3388000000022101367.eurolife-motor": 0,
                "3388000000022101367.eurolife-property": 0,
                "3388000000022101367.eurolife-healthGroup": 0,
                "3388000000022101367.eurolife-life": 0,
                "3388000000022101367.eurolife-health": 0,
                "3388000000022101367.eurolife-savings": 0
            },
            "GoogleSumStatistics": googleSumStatistics,
            "AppleStatistics": appleStatistics,
            "GoogleDetails": googleDetails
        }

        const numOfApplePasses = await Wallet.PassCollection.estimatedDocumentCount();
        responseBody.AppleStatistics = numOfApplePasses;

        // AUTH
        const authOptions = {
            credentials: {
                client_email: 'wallet@eurolifeconnect.iam.gserviceaccount.com',
                private_key: secret,
            },
            scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
        };

        const auth = new GoogleAuth(authOptions);
        let clientPromise = await auth.getClient();

        // Get Google Passes statistics
        for(const item of googleClassIds) {
            try {
                //console.log(item) 
                const respGetObject2 = await clientPromise.request({
                    url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject?classId=' + item,
                    method: 'GET'
                });
                if(respGetObject2.status == 200){
                    responseBody.GoogleStatistics[item] = respGetObject2.data.resources.length;
                    for(const detail of respGetObject2.data.resources){
                        googleDetails.push(detail.id);
                    }
            
                    let nextPage = respGetObject2.data.pagination.nextPageToken;
                    while(nextPage){
                            const respGetObject = await clientPromise.request({
                            url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject?classId=${item}&token=${nextPage}`,
                            method: 'GET'
                        });
                        if(respGetObject.status == 200){
                            responseBody.GoogleStatistics[item] = responseBody.GoogleStatistics[item] + respGetObject.data.resources.length;
                            for(const detail of respGetObject.data.resources){
                                googleDetails.push(detail.id);
                            }
                        }
                        nextPage = respGetObject.data.pagination.nextPageToken;
                    }
                }
            } catch (error) {
                console.log(`error in wallet statistics: ${error}`);
            }
        }
        responseBody.GoogleDetails = googleDetails;
        responseBody.GoogleSumStatistics = googleDetails.length;
        res.status(200).json(responseBody);
    }

}