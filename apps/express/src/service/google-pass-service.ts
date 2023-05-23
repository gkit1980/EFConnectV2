// import * as _ from "lodash";
import { pushNotificationGoogle } from "./push-notification-google-service";
var _ = require('lodash');
var CryptoJS = require("crypto-js");
// import * as CryptoJS from 'crypto-js';
const constants = require("../constants/constants");

export class GooglePassService {

    public static CreateGooglePass= async(query:any, googleId: string): Promise<any>  => {
    
       try {
        var passParticipants = JSON.parse(query.participants);
        var state ="INACTIVE";

        /// Create uid
        var i, random;
        var result = '';
        
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
            result += '-';
            }
            result += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
        }
        //end Create

        //dependent members
        var dependentMembers=[];
        for (let i = 0; i < passParticipants.length; i++) {
            if (passParticipants[i].Relationship === constants.PARTICIPANTS_CHILD_CAPITAL 
            || passParticipants[i].Relationship === constants.PARTICIPANTS_PARTNER_CAPITAL
            || passParticipants[i].Relationship === constants.PARTICIPANTS_CHILD_LOWERCASE
            || passParticipants[i].Relationship === constants.PARTICIPANTS_PARTNER_LOWERCASE){
                dependentMembers.push(passParticipants[i]);
            }
        }

        var classId = "";
        //var userId= insuredName + ContractId.toString();
        var userId = query.ContractKey.toString();
        var passInsuredName = query.insuredName;
        var insuredNameLabel = "Ασφαλισμένος: ";
        var statusDescription = "Ανενεργό";
        if (query.Status == constants.STATUS_ACTIVE ||
        query.Status == constants.STATUS_REINSTATE ||
        query.Status == constants.STATUS_PARTIAL_SURRENDER_UL ||
        query.Status == constants.STATUS_CHANGE_INVESTMENT_PLAN ||
        query.Status == constants.STATUS_PARTIAL_SURRENDER ) {
            statusDescription = "Ενεργό";
            state ="ACTIVE";
        }
        if (statusDescription == "Ενεργό" && query.paymentStatus === "Ανεξόφλητο") {
            if(query.Branch != constants.BRANCH_MOTOR){
                let currentDate = new Date();
                let renewsContract= query.NextPaymentDate;
                let renewsContractArray = renewsContract.split("/");
                let renewsContractDate= new Date(renewsContractArray[2],renewsContractArray[1]-1,renewsContractArray[0]); 
              if(currentDate> renewsContractDate){
                statusDescription = "Ανεξόφλητο";
              }
            }else{
              statusDescription = "Ανεξόφλητο";
            }
          }
        const HospitalsLocations =  [
            {
              "kind": "walletobjects#latLongPoint",
              "latitude": 37.950459536128356,
              "longitude": 23.67009849062239
              }, {
              "kind": "walletobjects#latLongPoint",
              "latitude": 38.028429614940784,
              "longitude": 23.78979259982271
              }, {
              "kind": "walletobjects#latLongPoint",
              "latitude": 38.04340761798858,
              "longitude": 23.8055870979766
              }, {
              "kind": "walletobjects#latLongPoint",
              "latitude": 38.03513093195408,
              "longitude": 23.793377680159256
              }, {
              "kind": "walletobjects#latLongPoint",
              "latitude": 37.9864633438698,
              "longitude": 23.758563497975484
              }, {
              "kind": "walletobjects#latLongPoint",
              "latitude": 38.00646781490297,
              "longitude": 23.79848726914067
              }, {
              "kind": "walletobjects#latLongPoint",  
              "latitude": 37.99064369011416,
              "longitude": 23.769272048830924
              }, {   
              "kind": "walletobjects#latLongPoint",
              "latitude": 40.59413216895989,
              "longitude": 23.015091798031207
              }, {
              "kind": "walletobjects#latLongPoint",  
              "latitude": 37.88582293725876,
              "longitude": 23.746949782632573
              }, {
              "kind": "walletobjects#latLongPoint",  
              "latitude": 37.92538186670167,
              "longitude": 23.699910369292745
              }
        ];
        let expDate = new Date(query.ExpirationDate);
        expDate.setDate(expDate.getDate() + 1);
        var passExpirationDate = expDate.toISOString();
        if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID) {
            passExpirationDate= "2099-07-16T19:20+01:00"
        }

        if (typeof query.insuredName == 'undefined') {
            passInsuredName = "Insured Name"
        }

        var contractIdDeepLink = query.ContractId;
        var contractKeyDeepLink =  query.ContractKey;
        var branchDeepLink = query.Branch;
        var linksModuleData:Array<Object>;
        switch (query.Branch) {
            case constants.BRANCH_MOTOR: {
            //Only motor expired by expiration date and not status
            state ="ACTIVE";
            classId = "3388000000022101367.eurolife-motor";
            let expDate = new Date(query.ExpirationDate);
            expDate.setDate(expDate.getDate() + 4);
            passExpirationDate= expDate.toISOString();
            passInsuredName = query.VehicleLicensePlate;
            insuredNameLabel = "Αρ. Πινακίδας: ";
            let nextLink ='/ice/default/customerArea.motor/greenCard';
            let VehicleLicensePlate = query.VehicleLicensePlate;
            let parametersLinkGreenCard = {
                contractIdDeepLink,
                contractKeyDeepLink,
                branchDeepLink,
                nextLink,
                VehicleLicensePlate
            }
            var encryptedParametersLinkGreenCard = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(parametersLinkGreenCard), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
            nextLink ='/ice/default/customerArea.motor/viewAmendments';
            let parametersLinkViewAmendments = {
                contractIdDeepLink,
                contractKeyDeepLink,
                branchDeepLink,
                nextLink,
                VehicleLicensePlate
            }
            var encryptedParametersLinkViewAmendments = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(parametersLinkViewAmendments), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
            nextLink ='/ice/default/customerArea.motor/policyDetails';
            let parametersLinkpolicyDetails = {
                contractIdDeepLink,
                contractKeyDeepLink,
                branchDeepLink,
                nextLink,
                VehicleLicensePlate
            }
            var encryptedParametersLinkpolicyDetails = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(parametersLinkpolicyDetails), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
            
            linksModuleData = [{
                "kind": "walletobjects#uri",
                "uri": process.env.WEBSERVICEURLDEEPLINK+"/#//ice/default/customerArea.motor/greenCard?returnUrl="+ encryptedParametersLinkGreenCard ,
                "description": "Έκδοση κάρτας διεθνούς ασφάλισης"},
                {
                 "kind": "walletobjects#uri",
                 "uri": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/home?returnUrl="+ encryptedParametersLinkViewAmendments ,
                 "description": "Αίτημα τροποποίησης"},
                {
                 "kind": "walletobjects#uri",
                 "uri": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/viewMyPolicies?returnUrl="+ encryptedParametersLinkpolicyDetails ,
                 "description": "PDF Συμβολαίου"},
                ];
            break;
            }
            case constants.BRANCH_PROPERTY: {
            classId = "3388000000022101367.eurolife-property";
            let expDate = new Date(query.ExpirationDate);
            expDate.setDate(expDate.getDate() + 31);
            passExpirationDate= expDate.toISOString();
            passInsuredName = query.dangerAdrress;
            insuredNameLabel = "Διεύθ. Κινδύνου: ";
            let nextLink ='/ice/default/customerArea.motor/viewAmendments';
            let parametersLinkViewAmendments = {
                contractIdDeepLink,
                contractKeyDeepLink,
                branchDeepLink,
                nextLink
            }
            var encryptedParametersLinkViewAmendments = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(parametersLinkViewAmendments), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
            nextLink ='/ice/default/customerArea.motor/viewClaims';
            let parametersLinkViewClaims = {
                contractIdDeepLink,
                contractKeyDeepLink,
                branchDeepLink,
                nextLink
            }
            var encryptedParametersLinkViewClaims = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(parametersLinkViewClaims), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
            linksModuleData = [
            {
                "kind": "walletobjects#uri",
                "uri": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/home?returnUrl="+ encryptedParametersLinkViewAmendments ,
                "description": "Αίτημα τροποποίησης"},
             {
                "kind": "walletobjects#uri",
                "uri": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/home?returnUrl="+ encryptedParametersLinkViewClaims ,
                "description": "Αίτημα αποζημίωσης"}
            ];
            break;
            }
            case constants.BRANCH_LIFE: {
            let expDate = new Date(query.ExpirationDate);
            expDate.setDate(expDate.getDate() + 76);
            passExpirationDate= expDate.toISOString();
            if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID) {
                classId = "3388000000022101367.eurolife-healthGroup";
                let nextLink ='/ice/default/customerArea.motor/viewClaims';
                let contractTypeDeepLink= constants.BRANCH_GROUPHEALTH_ID;
                let parametersLinkViewClaims = {
                    contractTypeDeepLink,
                    contractIdDeepLink,
                    contractKeyDeepLink,
                    branchDeepLink,
                    nextLink
                }
                var encryptedParametersLinkViewClaims = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(parametersLinkViewClaims), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
                linksModuleData = [
                    {
                     "kind": "walletobjects#uri",
                     "uri": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/home?returnUrl="+ encryptedParametersLinkViewClaims ,
                     "description": "Αίτημα αποζημίωσης"}
                    ];
            } else {
                classId = "3388000000022101367.eurolife-life";
            }
            break;
            }  
            case constants.BRANCH_HEALTH: {
            let expDate = new Date(query.ExpirationDate);
            expDate.setDate(expDate.getDate() + 76);
            passExpirationDate= expDate.toISOString();
            classId = "3388000000022101367.eurolife-health";
            break;
            }
            case constants.BRANCH_INVESTMENT: {
            classId = "3388000000022101367.eurolife-savings";
            let expDate = new Date(query.ExpirationDate);
            expDate.setDate(expDate.getDate() + 76);
            passExpirationDate= expDate.toISOString();
            break;
            }
            default: {
            classId = "3388000000022101367.eurolife-pass-loyalty";
            break;
            }
        }

        let currentDate = new Date();   
        if (currentDate.toISOString() >= passExpirationDate) {    
                state = "EXPIRED";    
        }
        

        var secondaryLoyaltyPoints = {};
        var textModulesData = [{
            "header": "Πρόγραμμα",
            "body": query.ProductDescription,
        }];
        if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) !== constants.BRANCH_GROUPHEALTH_ID) {
            textModulesData = [
            {
                "header": "Συχνότητα Πληρωμής",
                "body": query.paymentFrequencyToString,
            },
            {
                "header": "Τρόπος Πληρωμής",
                "body": query.PaymentType,
            },
            {
                "header": "Κατάσταση Πληρωμής",
                "body": query.paymentStatus,
            }];

            secondaryLoyaltyPoints = {
            "label": "Έως " + query.NextPaymentDate,
            "balance": {
                "string": statusDescription
            }
            }
        }
        if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID || query.Branch ===  constants.BRANCH_HEALTH && dependentMembers.length >= 1) {

            if (textModulesData.length == 1) {
                if(query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID){
                    let currencySign: string = '€ ';
                    let valueFormatted=" - ";
                    if(query.remainAmount != undefined){
                        let amount = Intl.NumberFormat('EUR').format(query.remainAmount);
                        let amountFixed = amount.replace(/[,.]/g, m => (m === ',' ? '.' : ','))
                        valueFormatted = currencySign + amountFixed;
                    }    
                    textModulesData = [{
                        "header": " Υπόλοιπο Ανάλωσης: ",
                        "body": valueFormatted
                    },{
                        "header": "Εξαρτώμενα Μέλη: ",
                        "body": dependentMembers.length
                    }]
                }else{
                    textModulesData = [{
                        "header": "Εξαρτώμενα Μέλη: ",
                        "body": dependentMembers.length
                    }]
                }
            } else {
                if(query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID){
                    let currencySign: string = '€ ';
                    let valueFormatted=" - ";
                    if(query.remainAmount != undefined){
                        let amount = Intl.NumberFormat('EUR').format(query.remainAmount);
                        let amountFixed = amount.replace(/[,.]/g, m => (m === ',' ? '.' : ','))
                        valueFormatted = currencySign + amountFixed;
                    }                  
                    textModulesData.push({
                        "header": "Υπόλοιπο Ανάλωσης: ",
                        "body": valueFormatted
                    })
                }
            textModulesData.push({
                "header": "Εξαρτώμενα Μέλη: ",
                "body": dependentMembers.length,
            })
            }

            for (let i = 0; i < dependentMembers.length; i++) {
            var oldDateFormat = new Date(dependentMembers[i].BirthDate);
            var dd = oldDateFormat.getDate();
            var mm = oldDateFormat.getMonth() + 1;
            var yyyy = oldDateFormat.getFullYear();
            if(query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID){
                let currencySign: string = '€ ';
                let valueFormatted=" - ";
                if(dependentMembers[i].remainAmount != undefined){
                    let amount = Intl.NumberFormat('EUR').format(dependentMembers[i].remainAmount);
                    let amountFixed = amount.replace(/[,.]/g, m => (m === ',' ? '.' : ','))
                    valueFormatted = currencySign + amountFixed;
                }    
                textModulesData.push({
                    "header": dependentMembers[i].LastName + " " + dependentMembers[i].FirstName + " - " + dependentMembers[i].Relationship,
                    "body":  "Υπόλοιπο Ανάλωσης: " + valueFormatted + "\n" + "Ημ. Γεννήσεως: " + dd + "/" + mm + "/" + yyyy 
                })
              }else{
                textModulesData.push({
                    "header": dependentMembers[i].LastName + " " + dependentMembers[i].FirstName + " - " + dependentMembers[i].Relationship,
                    "body":   "Ημ. Γεννήσεως: " + dd + "/" + mm + "/" + yyyy 
                })
              }
            }
            if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID) {
            secondaryLoyaltyPoints = {
                "label": "Status",
                "balance": {
                "string": statusDescription
                }
            }
            }
        }

       
        //Deep Links
        //var encryptedParametersLink = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(parametersLink), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
        var encryptedContractIDType = encodeURIComponent(CryptoJS.AES.encrypt(query.ContractIDType, 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
        var encryptedGoldenRecordId = encodeURIComponent(CryptoJS.AES.encrypt(query.GoldenRecordId, 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());    
        if(linksModuleData){
            linksModuleData.push({
                "kind": "walletobjects#uri",
                "uri": "tel:2109303800" ,
                "description": "Τηλέφωνο υποστήριξης: 2109303800"
            });
            linksModuleData.push({
                "kind": "walletobjects#uri",
                "uri": "mailto:info@eurolife.gr",
                "description": "Email: info@eurolife.gr"
                });
        }else{
            linksModuleData = [{
                "kind": "walletobjects#uri",
                "uri": "tel:2109303800" ,
                "description": "Τηλέφωνο υποστήριξης: 2109303800"
            },{
                "kind": "walletobjects#uri",
                "uri": "mailto:info@eurolife.gr",
                "description": "Email: info@eurolife.gr"
                }];
        }
        if((query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) != constants.BRANCH_GROUPHEALTH_ID) && (query.PaymentType == "ΜΕΤΡΗΤΑ" || query.PaymentType == "ΕΛΤΑ") && query.paymentCode != undefined && query.paymentCode != ""){
            linksModuleData.push({
                "kind": "walletobjects#uri",
                "uri": "https://epliromi.eurolife.gr/index.aspx?rn="+ query.paymentCode,
                "description": "Εξόφληση"});
        }

        var payload={};
        //Ομαδικά και Υγείας
        if(query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID || query.Branch == constants.BRANCH_HEALTH){
            payload = {
                "iss": "wallet@eurolifeconnect.iam.gserviceaccount.com",
                "aud": "google",
                "scope": "https://www.googleapis.com/auth/wallet_object.issuer",
                "typ": "savetowallet",
                "iat": 1615594651,
                "payload": {
                "loyaltyObjects": [{

                    "classId": classId,
                    "id": googleId,
                    "accountId": "Αρ. Συμβολαίου: " + userId,
                    "accountName": insuredNameLabel + passInsuredName,
                    "barcode": {
                    "alternateText": "Αρ. Συμβολαίου: " + query.ContractKey.toString(),
                    "type": "qrCode",
                    "value": process.env.WEBSERVICEURL+"/qrcheck/" + encryptedContractIDType + '/' + encryptedGoldenRecordId
                    },
                    "linksModuleData": {
                    "uris": linksModuleData
                    },
                    "infoModuleData": {
                    "showLastUpdateTime": "true"
                    },
                    "loyaltyPoints": {
                    "label": passInsuredName,
                    "balance": {
                        "string": query.ProductDescription
                    }
                    },
                    "secondaryLoyaltyPoints": secondaryLoyaltyPoints,
                    "textModulesData": textModulesData,
                    "state": state,
                    "validTimeInterval":{
                    "end": {
                        "date": passExpirationDate,
                    },
                    },
                    "disableExpirationNotification": false,
                    "locations": HospitalsLocations
                }
                ]
                },
                "origins": ["http://localhost:4200", "https://uat-ca.eurolife.gr", "https://lifena.eurolife.gr", "https://connect.eurolife.gr"]
            };
        }else if(query.Branch == constants.BRANCH_MOTOR){
            let phone = query.mobilePhone  != undefined ? query.mobilePhone : "";
            //convert greek letters of plate to english
            var englishAlphabet = "ABEHIKMNOPTXYZ";//abcdefghijklmnopqrstuvwxyz
            var greekAlphabet = "ΑΒΕΗΙΚΜΝΟΡΤΧΥΖ";
            let convertedChar;
            let chari;
            var motorPlate = query.VehicleLicensePlate;
            for (let i = 0; i < motorPlate.length; i++){
                    chari = motorPlate[i];
                    if (greekAlphabet.indexOf(chari) !== -1){
                        convertedChar = englishAlphabet[greekAlphabet.indexOf(chari)];
                        motorPlate=motorPlate.replace(chari,convertedChar);
                    }
            }
            console.log("mondial://home/"+ phone +"/"+query.insuredName.split(" ")[0]+"/"+query.insuredName.split(" ")[1]+"/"+motorPlate+"/");
            let lastName = query.insuredName.split(" ")[1];
            let firstName = query.insuredName.split(" ")[0];
            let assistAppParameters="";
            if(phone != undefined && phone != null && phone != ""){
              if(assistAppParameters==""){
                assistAppParameters = "mobilePhone="+phone;
              }else{
                assistAppParameters += "&mobilePhone="+phone;
              }
            }
            if(firstName != undefined && firstName != null && firstName != ""){
              firstName =encodeURI(query.insuredName.split(" ")[0]);
              if(assistAppParameters==""){
                assistAppParameters = "name="+firstName;
              }else{
                assistAppParameters += "&name="+firstName;
              }
            }
            if(lastName != undefined && lastName != null && lastName != ""){
              lastName = encodeURI(query.insuredName.split(" ")[1]);
              if(assistAppParameters==""){
                assistAppParameters = "surname="+lastName;
              }else{
                assistAppParameters += "&surname="+lastName;
              }
            }
            if(motorPlate != undefined && motorPlate != null && motorPlate != ""){
              if(assistAppParameters==""){
                assistAppParameters = "licencePlate="+motorPlate;
              }else{
                assistAppParameters += "&licencePlate="+motorPlate;
              }
            }
            console.log("assistAppParameters:  "+ assistAppParameters);
            payload = {
                "iss": "wallet@eurolifeconnect.iam.gserviceaccount.com",
                "aud": "google",
                "scope": "https://www.googleapis.com/auth/wallet_object.issuer",
                "typ": "savetowallet",
                "iat": 1615594651,
                "payload": {
                "loyaltyObjects": [{
    
                    "classId": classId,
                    "id": googleId,
                    "accountId": "Αρ. Συμβολαίου: " + userId,
                    "accountName": insuredNameLabel + passInsuredName,
                    "barcode": {
                    "alternateText": "Αρ. Συμβολαίου: " + query.ContractKey.toString(),
                    "type": "qrCode",
                    "value": process.env.WEBSERVICEURL+"/qrcheck/" + encryptedContractIDType + '/' + encryptedGoldenRecordId
                    },
                    "appLinkData": {
                        "androidAppLinkInfo": {
                            "appLogoImage": {
                                "sourceUri": {
                                    "uri": "https://scp.eurolife.gr/~/media/AC5336E6CDE940ABA2E8C3564348E132.ashx"    
                                }
                            },
                            "title": {
                                "defaultValue": {
                                    "language": "el-GR",
                                    "value": "Oδική Βοήθεια"
                                }
                            },
                            "description": {
                                "defaultValue": {
                                    "language": "el-GR",
                                    "value":  "Ακολούθησε το σύνδεσμο"
                                }
                            },
                            "appTarget": {
                                "targetUri": {
                                        "uri":  process.env.WEBSERVICEURLDEEPLINK+"/eurolifeAssistApp/?"+assistAppParameters,
                                        "description": "EurolifeAssist"
                                }
                            }
                        }
                    },
                    "linksModuleData": {
                    "uris": linksModuleData
                    },
                    "infoModuleData": {
                    "showLastUpdateTime": "true"
                    },
                    "loyaltyPoints": {
                    "label": passInsuredName,
                    "balance": {
                        "string": query.ProductDescription
                    }
                    },
                    "secondaryLoyaltyPoints": secondaryLoyaltyPoints,
                    "textModulesData": textModulesData,
                    "state": state,
                    "validTimeInterval":{
                    "end": {
                        "date": passExpirationDate,
                    },
                    },
                    "disableExpirationNotification": false
                }
                ]
                },
                "origins": ["http://localhost:4200", "https://uat-ca.eurolife.gr", "https://lifena.eurolife.gr", "https://connect.eurolife.gr"]
            };
        }
        else{
            payload = {
                "iss": "wallet@eurolifeconnect.iam.gserviceaccount.com",
                "aud": "google",
                "scope": "https://www.googleapis.com/auth/wallet_object.issuer",
                "typ": "savetowallet",
                "iat": 1615594651,
                "payload": {
                "loyaltyObjects": [{
    
                    "classId": classId,
                    "id": googleId,
                    "accountId": "Αρ. Συμβολαίου: " + userId,
                    "accountName": insuredNameLabel + passInsuredName,
                    "barcode": {
                    "alternateText": "Αρ. Συμβολαίου: " + query.ContractKey.toString(),
                    "type": "qrCode",
                    "value": process.env.WEBSERVICEURL+"/qrcheck/" + encryptedContractIDType + '/' + encryptedGoldenRecordId
                    },
                    "linksModuleData": {
                    "uris": linksModuleData
                    },
                    "infoModuleData": {
                    "showLastUpdateTime": "true"
                    },
                    "loyaltyPoints": {
                    "label": passInsuredName,
                    "balance": {
                        "string": query.ProductDescription
                    }
                    },
                    "secondaryLoyaltyPoints": secondaryLoyaltyPoints,
                    "textModulesData": textModulesData,
                    "state": state,
                    "validTimeInterval":{
                    "end": {
                        "date": passExpirationDate,
                    },
                    },
                    "disableExpirationNotification": false
                }
                ]
                },
                "origins": ["http://localhost:4200", "https://uat-ca.eurolife.gr", "https://lifena.eurolife.gr", "https://connect.eurolife.gr"]
            };
        }

        //release memory
        passParticipants = state =  i = random = result = dependentMembers = classId = userId = passInsuredName = insuredNameLabel = statusDescription = null;
        passExpirationDate = contractIdDeepLink =  contractKeyDeepLink = branchDeepLink =  linksModuleData = encryptedParametersLinkGreenCard = encryptedParametersLinkViewAmendments = encryptedParametersLinkViewClaims = encryptedParametersLinkpolicyDetails = null;
        secondaryLoyaltyPoints = textModulesData = encryptedContractIDType = encryptedGoldenRecordId = oldDateFormat = dd = mm =  yyyy = englishAlphabet = greekAlphabet =  motorPlate = null;
   
        return payload;

       }
       catch(error){
        console.error(error);
       }
    }
}
    