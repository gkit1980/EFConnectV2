import { response } from "express";

var _ = require('lodash');
const constants = require("../constants/constants");
const { GoogleAuth } = require('google-auth-library');

export default class WalletGooglePassesController {

    public static retrieveGooglePasses = async (req: any, res: any) => {
        // Create Wallet Model
        let Wallet = req.app.get('Wallet');
        let secret = req.app.get('GooglePrivateKey');
        let googleClassIds = [constants.GOOGLE_MOTOR_CLASS_ID
            , constants.GOOGLE_PROPERTY_CLASS_ID
            , constants.GOOGLE_GROUPHEALTH_CLASS_ID
            , constants.GOOGLE_LIFE_CLASS_ID
            , constants.GOOGLE_HEALTH_CLASS_ID
            , constants.GOOGLE_INVESTMENT_CLASS_ID];
        let googleDetails: any[] = [];

        try{
            let deleteAllDocs = await Wallet.GooglePassCollection.deleteMany({});
            console.log(`deleteAllDocs: ${deleteAllDocs}`);
        }catch(error){
            console.log(`Error to delete google passes: ${error}`);
        }
        
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
        let GooglePassesWithOldId = 0;
        let responseBody = {
            "GooglePassesWithOldId": GooglePassesWithOldId,
            "GoogleDetails": googleDetails
        }

        // Get Google Passes statistics
        for(const item of googleClassIds) {
            try {
                console.log(item)
                const respGetObject2 = await clientPromise.request({
                    url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject?classId=' + item,
                    method: 'GET'
                });
                if(respGetObject2.status == 200){
                    //responseBody.GoogleStatistics[item] = respGetObject2.data.resources.length;
                    for(const detail of respGetObject2.data.resources){
                        //only passes with old id
                        if(detail.id.split("_").length > 4){
                            googleDetails.push(detail.id);
                            // let endTime = "";
                            // if(detail.validTimeInterval.end){
                            //     endTime = detail.validTimeInterval.end;
                            // }
                            let payloadJson={
                                "accountId": detail.accountId,
                                "accountName": detail.accountName,
                                "classId": detail.classId,
                                "id": detail.id,
                                "loyaltyPoints": detail.loyaltyPoints,
                                "secondaryLoyaltyPoints": detail.secondaryLoyaltyPoints,
                                "textModulesData": detail.textModulesData,
                                //"validTimeIntervalEnd": endTime
                            }
                            let _pass = {
                                serialNumber: detail.id,
                                lastUpdated: Date.now(),
                                lastUpdateValues: payloadJson
                            }
                            Wallet.GooglePassCollection.create(_pass).then((docPass: any) => {
                               console.log(`Add google Pass to database with id: ${detail.id}`);
                               console.log("And doc:" + JSON.stringify(docPass));
                             })
                        }
                    }

                    let nextPage = respGetObject2.data.pagination.nextPageToken;
                    while(nextPage){
                        const respGetObject = await clientPromise.request({
                            url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject?classId=${item}&token=${nextPage}`,
                            method: 'GET'
                        });
                        if(respGetObject.status == 200){
                            for(const detail of respGetObject.data.resources){
                                if(detail.id.split("_").length > 4){
                                    googleDetails.push(detail.id);
                                    let payloadJson={
                                        "accountId": detail.accountId,
                                        "accountName": detail.accountName,
                                        "classId": detail.classId,
                                        "id": detail.id,
                                        "loyaltyPoints": detail.loyaltyPoints,
                                        "secondaryLoyaltyPoints": detail.secondaryLoyaltyPoints,
                                        "textModulesData": detail.textModulesData,
                                    }
                                    let _pass = {
                                        serialNumber: detail.id,
                                        lastUpdated: Date.now(),
                                        lastUpdateValues: payloadJson
                                    }
                                    Wallet.GooglePassCollection.create(_pass).then((docPass: any) => {
                                       console.log(`Add google Pass to database with id: ${detail.id}`);
                                       console.log("And doc:" + JSON.stringify(docPass));
                                     })
                                }
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
        responseBody.GooglePassesWithOldId =  googleDetails.length;
        res.status(200).json(responseBody);
    }

}