import { forEach } from "lodash";



var CryptoJS = require("crypto-js");
//var createTemplate = require("passbook"); //old
const { Template } = require("@walletpass/pass-js");   //new
let path = require('path');
const fs = require('fs');
const constants = require("../constants/constants");


export class ApplePassService {

public static CreatePass= async(query:any, Wallet:any, serialNumber: string): Promise<any>  => {

   try {
    //let locations = await Wallet.HospitalsLocationsCollection.find()._doc;
    const HospitalsLocations =  [
      {
        "latitude": 37.950459536128356,
        "longitude": 23.67009849062239,
        "relevantText": "METROPOLITAN"
        }, {
        "latitude": 38.028429614940784,
        "longitude": 23.78979259982271,
        "relevantText": "ΟΜΙΛΟΣ ΥΓΕΙΑ"
        },{
        "latitude": 38.04340761798858,
        "longitude": 23.8055870979766,
        "relevantText": "ΙΑΤΡΙΚΟ ΑΘΗΝΩΝ"
        }, {
        "latitude": 38.03513093195408,
        "longitude": 23.793377680159256,
        "relevantText": "ΙΑΣΩ"
        }, {
        "latitude": 37.9864633438698,
        "longitude": 23.758563497975484,
        "relevantText": "ΕΥΡΩΚΛΙΝΙΚΗ ΑΘΗΝΩΝ"
        }, {
        "latitude": 38.00646781490297,
        "longitude": 23.79848726914067,
        "relevantText": "METROPOLITAN GENERAL"
        }, {
        "latitude": 37.99064369011416,
        "longitude": 23.769272048830924,
        "relevantText": "ΕΡΡΙΚΟΣ ΝΤΥΝΑΝ"
        }, {
        "latitude": 40.59413216895989,
        "longitude": 23.015091798031207,
        "relevantText": "ΚΛΙΝΙΚΗ ΑΓ.ΛΟΥΚΑΣ"
        }, {
        "latitude": 37.88582293725876,
        "longitude": 23.746949782632573,
        "relevantText": "MEDITERRANEO HOSPITAL"
        },
        {
          "latitude": 37.92538186670167,
          "longitude": 23.699910369292745,
          "relevantText": "ΙΑΤΡΙΚΟ ΑΘΗΝΩΝ"
        }
    ];
    var passColor;
    var passParticipants = JSON.parse(query.participants);
    let expDate = new Date(query.ExpirationDate);
    expDate.setDate(expDate.getDate() + 1);
    var passExpirationDate = expDate.toISOString();
    var dependentMembers = [];
    for (let i = 0; i < passParticipants.length; i++) {
      if (passParticipants[i].Relationship === constants.PARTICIPANTS_CHILD_CAPITAL
        || passParticipants[i].Relationship === constants.PARTICIPANTS_PARTNER_CAPITAL
        || passParticipants[i].Relationship === constants.PARTICIPANTS_CHILD_LOWERCASE
        || passParticipants[i].Relationship === constants.PARTICIPANTS_PARTNER_LOWERCASE) {
        dependentMembers.push(passParticipants[i]);
      }
    }
    var passInsuredName = query.insuredName;
    var insuredNameLabel = "ΑΣΦΑΛΙΣΜΕΝΟΣ";
    var statusDescription = "Ανενεργό"

    if (query.Status == constants.STATUS_ACTIVE ||
    query.Status == constants.STATUS_REINSTATE ||
    query.Status == constants.STATUS_PARTIAL_SURRENDER_UL ||
    query.Status == constants.STATUS_CHANGE_INVESTMENT_PLAN ||
    query.Status == constants.STATUS_PARTIAL_SURRENDER ) {
      statusDescription = "Ενεργό";
    }
    if(statusDescription == "Ενεργό" && query.paymentStatus === "Ανεξόφλητο") {
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

    var template = new Template("eventTicket", {
      passTypeIdentifier: process.env.APNS_TOPIC,
      teamIdentifier: process.env.APPLE_DEVELOPER_TEAM_IDENTIFIER,
      backgroundColor: "rgb(255,255,255)",
      webServiceURL:  process.env.WEBSERVICEURL,
      authenticationToken: "ZXVyb2xpZmVQYXNzOmV1cm9saWZlRkZI",
      formatVersion: 1
    });
    var contractIdDeepLink = query.ContractId;
    var contractKeyDeepLink =  query.ContractKey;
    var branchDeepLink = query.Branch;
    var linksModuleData:Array<Object>;
    switch (query.Branch) {
      case constants.BRANCH_MOTOR: {
        let expDate = new Date(query.ExpirationDate);
        expDate.setDate(expDate.getDate() + 4);
        passExpirationDate = expDate.toISOString();
        passColor = "rgb(71, 148, 99)";
        template.images.load("./public/images/motor");    ///new load method images
        passInsuredName = query.VehicleLicensePlate;
        insuredNameLabel = "ΑΡ. ΠΙΝΑΚΙΔΑΣ";
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
        let phone = query.mobilePhone  != undefined ? query.mobilePhone : "";
        //convert greek letters of plate to english
        var englishAlphabet = "ABEHIKMNOPTXYZ";
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
        let firstName = query.insuredName.split(" ")[0];
        let lastName = query.insuredName.split(" ")[1];
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
        linksModuleData = [{
            "key": "newCard",
            "value": process.env.WEBSERVICEURLDEEPLINK+"/#//ice/default/customerArea.motor/greenCard?returnUrl="+ encryptedParametersLinkGreenCard ,
            "attributedValue": "<a href="+process.env.WEBSERVICEURLDEEPLINK+"/#//ice/default/customerArea.motor/greenCard?returnUrl="+ encryptedParametersLinkGreenCard +">Έκδοση κάρτας διεθνούς ασφάλισης</a>"},
            {
             "key": "viewAmendments",
             "value": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/viewAmendments?returnUrl="+ encryptedParametersLinkViewAmendments ,
             "attributedValue": "<a href="+process.env.WEBSERVICEURLDEEPLINK+"/#//ice/default/customerArea.motor/home?returnUrl="+ encryptedParametersLinkViewAmendments +">Αίτημα τροποποίησης</a>"},
             {
             "key": "downloadPDF",
             "value": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/viewMyPolicies?returnUrl="+ encryptedParametersLinkpolicyDetails ,
             "attributedValue": "<a href="+process.env.WEBSERVICEURLDEEPLINK+"/#//ice/default/customerArea.motor/viewMyPolicies?returnUrl="+ encryptedParametersLinkpolicyDetails +">PDF Συμβολαίου</a>"},
             {
              "key": "EurolifeAssistApp",
              "value": process.env.WEBSERVICEURLDEEPLINK+"/eurolifeAssistAppIos/?mobilePhone="+phone+"&name="+firstName+"&surname="+lastName+"&licencePlate="+motorPlate,
              "attributedValue": "<a href="+process.env.WEBSERVICEURLDEEPLINK+"/eurolifeAssistAppIos/?"+assistAppParameters+"/>EurolifeAssist</a>"},//+"universal=true"
            ];
        break;
      }
      case constants.BRANCH_PROPERTY: {
        let expDate = new Date(query.ExpirationDate);
        expDate.setDate(expDate.getDate() + 31);
        passExpirationDate = expDate.toISOString();
        passColor = "rgb(242, 177, 0)";
        template.images.load("./public/images/property");
        passInsuredName = query.dangerAdrress;
        insuredNameLabel = "ΔΙΕΥΘ. ΚΙΝΔΥΝΟΥ";
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
            "key": "viewAmendmentsProperty",
            "value": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/viewAmendments?returnUrl="+ encryptedParametersLinkViewAmendments ,
            "attributedValue": "<a href=" + process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/home?returnUrl="+ encryptedParametersLinkViewAmendments  +">Αίτημα τροποποίησης</a>"},
         {
            "key": "viewClaims",
            "value": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/viewClaims?returnUrl="+ encryptedParametersLinkViewClaims ,
            "attributedValue": "<a href="+process.env.WEBSERVICEURLDEEPLINK+"/#//ice/default/customerArea.motor/home?returnUrl="+ encryptedParametersLinkViewClaims +">Αίτημα αποζημίωσης</a>"},
        ];
        break;
      }
      case constants.BRANCH_LIFE: {
        let expDate = new Date(query.ExpirationDate);
        expDate.setDate(expDate.getDate() + 76);
        passExpirationDate = expDate.toISOString();
        if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID) {
          passColor = "rgb(175, 39, 47)";
          template.images.load("./public/images/healthGroup");
          template.locations = HospitalsLocations;
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
               "key": "viewClaims2",
               "value": process.env.WEBSERVICEURLDEEPLINK+"/#/ice/default/customerArea.motor/viewClaims?returnUrl="+ encryptedParametersLinkViewClaims ,
               "attributedValue": "<a href="+process.env.WEBSERVICEURLDEEPLINK+"/#//ice/default/customerArea.motor/home?returnUrl="+ encryptedParametersLinkViewClaims +">Αίτημα αποζημίωσης</a>"},
              ];
        } else {
          passColor = "rgb(74, 82, 148)";
          template.images.load("./public/images/life");
        }
        break;
      }
      case constants.BRANCH_HEALTH: {
        let expDate = new Date(query.ExpirationDate);
        expDate.setDate(expDate.getDate() + 76);
        passExpirationDate = expDate.toISOString();
        passColor = "rgb(239, 51, 64)";
        template.images.load("./public/images/health");
        template.locations = HospitalsLocations;
        break;
      }
      case constants.BRANCH_INVESTMENT: {
        let expDate = new Date(query.ExpirationDate);
        expDate.setDate(expDate.getDate() + 76);
        passExpirationDate = expDate.toISOString();
        passColor = "rgb(0, 128, 148)";
        template.images.load("./public/images/savings");
        break;
      }
      default: {
        passColor = "rgb(239, 51, 64)";
        template.images.load("./public/images/health");
        break;
      }
    }
    if (typeof passInsuredName == undefined) {
      passInsuredName = "InsuredName"
    }

    const publicPdfDir = './passes';
    //template.keys(publicPdfDir, "wijqa5-jitDix-wutsov");   //OLD 
    //NEW///
    // await template.loadCertificate(                             
    //   "./passes/certfile.pem",
    //   "wijqa5-jitDix-wutsov"
    // );

    await template.setCertificate("","wijqa5-jitDix-wutsov");
    //END NEW//
  
    // var encryptedContractIDType = CryptoJS.AES.encrypt(query.ContractIDType, 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    var encryptedContractIDType = encodeURIComponent(CryptoJS.AES.encrypt(query.ContractIDType, 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
    var encryptedGoldenRecordId = encodeURIComponent(CryptoJS.AES.encrypt(query.GoldenRecordId, 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString());
    template.barcodes = [{
      'format': 'PKBarcodeFormatQR',
      'message': process.env.WEBSERVICEURL+'/qrcheck/' + encryptedContractIDType + '/' + encryptedGoldenRecordId,
      'messageEncoding': 'iso-8859-1'
    }];

    //if status == "Άκυρο" not expire, only for apple passes
    if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) !== constants.BRANCH_GROUPHEALTH_ID){
      // if(query.Status == "Άκυρο"){
      //   let expDate = new Date();
      //   expDate.setDate(expDate.getDate() -1);
      //   passExpirationDate = expDate.toISOString();
      // }
      template.expirationDate =  passExpirationDate.slice(0,-8) +"+01:00";
    }
    //template.fields.relevantDate= "2099-12-12T19:20+01:00";
    console.log("serialNumber: "+serialNumber);
    var pass = template.createPass({
      serialNumber: serialNumber,
      description: "EurolifePass",
      organizationName: process.env.APPLE_DEVELOPER_ORGANIZATIONAL_UNIT,
      foregroundColor: "rgb(59, 59, 59)",
      backgroundColor: "rgb(238, 238, 238)",
      labelColor: passColor,
      eventTicket: {
        "headerFields": [{
          "key": "status",
          "label": "STATUS",
          "value": statusDescription,
          "textAlignment": "PKTextAlignmentRight",
          "changeMessage": "Κατάσταση συμβολαίου %@"
        }],
        "primaryFields": [{
          "key": "balance",
          "label": "",//ProductDescription.toUpperCase(),
          "value": "",
          "textAlignment": "PKTextAlignmentRight"
        }],
        "secondaryFields": [{
          "key": "userName",
          "label": insuredNameLabel,
          "value": passInsuredName,
        },
        {
          "key": "contractNum",
          "label": "ΑΡ. ΣΥΜΒΟΛΑΙΟΥ",
          "value": query.ContractKey,
          "textAlignment": "PKTextAlignmentRight"
        }],
      }
    });

    var auxiliaryFields = [{}];
    var backFields: any[]=[];
    backFields= [{
      "key": "programBack",
      "label": "ΠΡΟΓΡΑΜΜΑ:",
      "value": query.ProductDescription,
    }];

    if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) !== constants.BRANCH_GROUPHEALTH_ID) {
      auxiliaryFields = [
        {
          "key": "program",
          "label": "ΠΡΟΓΡΑΜΜΑ",
          "value": query.ProductDescription,
        },
        {
          "key": "date",
          "label": "ΗΜ. ΑΝΑΝΕΩΣΗΣ",
          "value": query.NextPaymentDate,
          "textAlignment": "PKTextAlignmentRight",
          "changeMessage": "Το συμβόλαιο σου έχει ανανεωθεί έως %@"
        }];
      backFields = [
        {
          "key": "dateBack",
          "label": "Συχνότητα Πληρωμής",
          "value": query.paymentFrequencyToString,
        },
        {
          "key": "userNameBack",
          "label": "Τρόπος Πληρωμής",
          "value": query.PaymentType,
        },
        {
          "key": "contractNumBack",
          "label": "Κατάσταση Πληρωμής",
          "value": query.paymentStatus,
        }];
    }

    if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID || query.Branch === constants.BRANCH_HEALTH && dependentMembers.length >= 1) {
      if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID) {
        auxiliaryFields = [
          {
            "key": "program",
            "label": "ΠΡΟΓΡΑΜΜΑ",
            "value": query.ProductDescription,
          }];
      }
      if (backFields.length == 1) {
        if(query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === constants.BRANCH_GROUPHEALTH_ID){
          let currencySign: string = '€ ';
          let valueFormatted=" - ";
          if(query.remainAmount != undefined){
              let amount = Intl.NumberFormat('EUR').format(query.remainAmount);
              let amountFixed = amount.replace(/[,.]/g, m => (m === ',' ? '.' : ','))
              valueFormatted = currencySign + amountFixed;
          }    
          backFields = [{
            "key": "remainAmount",
            "label": "Υπόλοιπο Ανάλωσης: ",
            "value": valueFormatted,
            "changeMessage": "Το νέο διαθέσιμο ποσό είναι %@"
          },{
            "key": "dependentMembers",
            "label": "Εξαρτώμενα Μέλη: ",
            "value": dependentMembers.length,
          }]
      }else{
        backFields = [{
          "key": "dependentMembers",
          "label": "Εξαρτώμενα Μέλη: ",
          "value": dependentMembers.length,
        }];
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
          backFields.push({
            "key": "remainAmount",
            "label": "Υπόλοιπο Ανάλωσης: ",
            "value": valueFormatted,
            "changeMessage": "Το νέο διαθέσιμο ποσό είναι %@"
          });
        }
        backFields.push({
          "key": "ProductDescription",
          "label": "Εξαρτώμενα Μέλη: ",
          "value": dependentMembers.length,
        });
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
          backFields.push({
            "key": "field" + i,
            "label": dependentMembers[i].LastName + " " + dependentMembers[i].FirstName + " - " + dependentMembers[i].Relationship,
            "value": "Υπόλοιπο Ανάλωσης: " + valueFormatted + "\n" + "Ημ. Γεννήσεως: " + dd + "/" + mm + "/" + yyyy ,
            "changeMessage": dependentMembers[i].LastName + " " + dependentMembers[i].FirstName +": Νέο διαθέσιμο ποσό" + "\n" +"%@"
          })
        }else{
          backFields.push({
            "key": "field" + i,
            "label": dependentMembers[i].LastName + " " + dependentMembers[i].FirstName + " - " + dependentMembers[i].Relationship,
            "value": "Ημ. Γεννήσεως: " + dd + "/" + mm + "/" + yyyy ,
          })
        }
        
      }
    }
    if((query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) != constants.BRANCH_GROUPHEALTH_ID) && (query.PaymentType == "ΜΕΤΡΗΤΑ" || query.PaymentType == "ΕΛΤΑ") && query.paymentCode != undefined && query.paymentCode != ""){
      if(linksModuleData){
        linksModuleData.push({
          "key": "payment",
          "value": "href=https://epliromi.eurolife.gr/index.aspx?rn="+ query.paymentCode,
         "attributedValue": "<a href=https://epliromi.eurolife.gr/index.aspx?rn="+ query.paymentCode +">Εξόφληση</a>"},);
      }else{
        linksModuleData =[{
            "key": "payment2",
            "value": "href=https://epliromi.eurolife.gr/index.aspx?rn="+ query.paymentCode,
            "attributedValue": "<a href=https://epliromi.eurolife.gr/index.aspx?rn="+ query.paymentCode +">Εξόφληση</a>"
          }]
        }
    }

    if(linksModuleData){
      linksModuleData.forEach((link: any) => {
        backFields.push(link);
      });
    }

    backFields.push({
      "key": "tel",
      "label": "Τηλέφωνο υποστήριξης: ",
      "value": "2109303800",
    },{
      "key": "email",
      "label": "Email: ",
      "value": "info@eurolife.gr",
    });


    auxiliaryFields.forEach(element => {
      pass.auxiliaryFields.add(element);
    });

    backFields.forEach(element => {
      pass.backFields.add(element);
    });


    //create uid
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
    //end create uid

    let filename = "EurolifeConnectPass_" + result;
    let pdfDir=path.resolve(process.env.PASSES);
    // var file = fs.createWriteStream(pdfDir +"/"+filename + ".pkpass");

    //*OLD
    // pass.on("error", function (error: any) {
    //   console.error(error);
    //   process.exit(1);
    // })


    // pass.pipe(file);

   //END
    
   //NEW
   const buf = await pass.asBuffer();
   await fs.writeFile(pdfDir +"/"+filename + ".pkpass", buf,(err:any,result:any)=>
   {
    if(err) console.log('error', err);
   }
   
   );




    //release memory
    passColor = passParticipants =  passExpirationDate =  dependentMembers =  passInsuredName =  insuredNameLabel =  statusDescription = null;
    template = contractIdDeepLink = contractKeyDeepLink = branchDeepLink = linksModuleData = oldDateFormat = dd =  mm =  yyyy = i = random = result = null;
    encryptedGoldenRecordId = encryptedContractIDType = encryptedParametersLinkGreenCard = encryptedParametersLinkViewAmendments = encryptedParametersLinkViewClaims = encryptedParametersLinkpolicyDetails = englishAlphabet = greekAlphabet = motorPlate = null;
    pass = auxiliaryFields = backFields =null;

    return new Promise(async resolve => {
    setTimeout(() => {
      var stats = fs.statSync(pdfDir +"/"+ filename + ".pkpass");
      var fileSizeInBytes = stats.size;
      if (fs.existsSync(pdfDir +"/"+ filename + ".pkpass") && fileSizeInBytes > 0) {
   
        var filePath = pdfDir +"/"+ filename + ".pkpass";
        var resolvedPath = path.resolve(filePath);
        resolve(filename);
        
      }
    }, 4000);
    })

  }
  catch (error) {
    console.error(error);
  }
}

	
}