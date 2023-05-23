import { response } from "express";

var _ = require('lodash');
const constants = require("../constants/constants");
const { GoogleAuth } = require('google-auth-library');

export default class GetGooglePassController {

    public static getGooglePass = async (req: any, res: any) => {
        // Create Wallet Model
        let Wallet = req.app.get('Wallet');
        let secret = req.app.get('GooglePrivateKey');
        let contractKey: string = req.query.contractKey;
        let goldenrecord: string = req.query.goldenRecordId;
        let classId: string = req.query.classId;


        let payloadJson={
            "accountId": "",
            "accountName": "",
            "classId": "",
            "id": "",
            "loyaltyPoints": "",
            "secondaryLoyaltyPoints": "",
            "textModulesData": "",
            //"validTimeIntervalEnd": endTime
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

        try {
            //console.log(item) 
            const respGetObject2 = await clientPromise.request({
               url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + "3388000000022101367.eurolife-" + classId + "_" + contractKey + "_" + goldenrecord,
               method: 'GET'
            });
            if(respGetObject2.status == 200){
                    //only passes with old id
                        // let endTime = "";
                        // if(detail.validTimeInterval.end){
                        //     endTime = detail.validTimeInterval.end;
                        // }
                        payloadJson={
                            "accountId": respGetObject2.data.accountId,
                            "accountName": respGetObject2.data.accountName,
                            "classId": respGetObject2.data.classId,
                            "id": respGetObject2.data.id,
                            "loyaltyPoints": respGetObject2.data.loyaltyPoints,
                            "secondaryLoyaltyPoints": respGetObject2.data.secondaryLoyaltyPoints,
                            "textModulesData": respGetObject2.data.textModulesData,
                            //"validTimeIntervalEnd": endTime
                        }


            }
         } catch (error) {
                console.log(`error in google pass request: ${error}`);
        }

        res.status(200).json(payloadJson);
    }

}