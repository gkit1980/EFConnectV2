import { Request, Response } from 'express';
const { GoogleAuth } = require('google-auth-library');
import { KJUR } from "jsrsasign";
var _ = require('lodash');
var CryptoJS = require("crypto-js");
import { GooglePassService } from "../service/google-pass-service";
import { UpdateGoldenRecordService } from "../service/update-goldenrecord-service";
import { pushNotificationGoogle } from "../service/push-notification-google-service";

interface Token {
  GeneratedToken: string;
  GeneratedPayload: any;
}

export default class oauth2AuthorizationController {

  public static getUniversalLinkJson= async (req: any, res: any) => {

    let specificObject=[
      {
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
          "namespace": "android_app",
          "package_name": "gr.progressnet.eurolife",
          "sha256_cert_fingerprints":
            ["CE:13:D3:6C:8B:23:04:8F:4F:F7:96:5A:6A:20:1D:B3:73:89:45:13:A7:00:0E:05:B1:E7:DF:04:61:4E:DB:D6"]
        }
      }
    ];    
    res.set('Content-Type', 'application/json');
    res.status(200).json(specificObject);
  }

  public static redirectToPlayStore= async (req: any, res: any) => {

    try{
          console.log("redirect to playstore")
          res.redirect("https://play.google.com/store/apps/details?id=gr.progressnet.eurolife");
    }catch(error){
          console.log("redirectplaystoreError:" +error)
        }
    res.status(200)
  }
  
  public static redirectToAppStore= async (req: any, res: any) => {

    try{
          console.log("redirect to app store")
          res.redirect("https://apps.apple.com/gr/app/eurolife-assist/id1585791237?l=el");
    }catch(error){
          console.log("redirect to app store ERROR")
    }
    res.status(200)
  }

  public static Oauth2GoogleAccess = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {
     const {
      encryptedParameters,
        // ContractId,
        // ProductDescription,
        // Branch,
        // insuredName,
        // ExpirationDate,
        // NextPaymentDate,
        // paymentFrequencyToString,
        // Status,
        // passStatus,
        // PaymentType,
        // dangerAdrress,
        // VehicleLicensePlate,
        // ContractKey,
        // ContractIDType,
        // participants,
        // GoldenRecordId

      } = req.body;

      //Total Memory size
      console.log(`Before create google pass`);
      const used = process.memoryUsage();
      for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
      }

      var encryptedQuery = decodeURIComponent(encryptedParameters.toString());
      var bytes = CryptoJS.AES.decrypt(encryptedQuery.toString(), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW');
      var query = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
     
      let updateGoldenRecordIdResponse = UpdateGoldenRecordService.updateGoldenRecord(query.GoldenRecordId);

      console.log(`goldenRecordId response: ${updateGoldenRecordIdResponse}`);

      var classId;
      switch (query.Branch) {
        case "ΑΥΤΟΚΙΝΗΤΩΝ": {
        classId = "3388000000022101367.eurolife-motor";
        break;
        }
        case "ΠΕΡΙΟΥΣΙΑΣ": {
        classId = "3388000000022101367.eurolife-property";
        break;
        }
        case "ΖΩΗΣ": {
        if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === "99") {
            classId = "3388000000022101367.eurolife-healthGroup";
        } else {
            classId = "3388000000022101367.eurolife-life";
        }
        break;
        }
        case "ΥΓΕΙΑΣ": {
        classId = "3388000000022101367.eurolife-health";
        break;
        }
        case "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ": {
        classId = "3388000000022101367.eurolife-savings";
        break;
        }
        default: {
        classId = "3388000000022101367.eurolife-pass-loyalty";
        break;
        }
    }

    let googleId = classId + "_" + query.ContractKey + "_" + query.GoldenRecordId;
    console.log(`Google Pass with serialNumber: ${googleId} created`);
    
   //console.log(req.app.get('GooglePrivateKey'));      
      var secret = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwt0Sz1RLfkCTR\nVGpTR7LObsqHncd5s9hrn2j1myxZtdK+6d7whqPsf5ueDEECwoUxfcwVMxoHBhth\nqMpuFHcFff+ZsZFM5Lb4Qs4SbHvx1wq7SWVjZLxO4ozgMyYV7I5Hhz0qTA37Fm5z\ntG3PqaTEPDM+s5B9DLdExPK4ZSU057GOtz0rjJj/pv6Vj6yL4aREaQWcMA7qoy8E\nngE74YntyaBsDaEKej7s7XrcCHQ8TvrJOGz5Y6CT8QMYFLF//bEBHOK2yXblW6Fj\nAVlKrdxTzR1xsbH8gnO6ZzdkrEpaxIAZOZKbt6Av7lWAnL0+Ybn2t/3N4KGHMeIA\nQXHACDdfAgMBAAECggEAAvDBvWZNvpeU7UDE1ibqxEGWsCQBdjZ2YvAPnIqc9c8v\nNwsIMSNkZeKHsd0NVeDru3OW6kFj7Pr+iKT43VUM1/QNRT7tpoRlwQLHkAnrFA6a\neJxTihBai8t8QZzIRPQfN/R5oZMLZoKsitNVQm/VtIg16BSv0kzcXdITIdtY/6TW\nPPGCBafVmACAhlbX/PFYfOndZQGEdvx40d3o7WCLd0pQcXR1z8wZbjbtxELjK/hp\nSwPciuO0Jn3HZ7Iu9YJhWEevvN7WJwAG5pIkqDRwUwkJr0dMLelB2AXyFHUcGBJp\neBa8owV9PCJFRUvIugCwTKBMVCjjlLWWTteuS8VuBQKBgQDVX7/qk0GiTTk1Hw+H\n1/THAU7b5KjmJPK/tdOOof8y0DZj03IquceX1K888TL31Pk390cltxMvZGsspd/3\nY4HCGGfv8DBmmMMdbFQxGhe01CQgC5Odx9Ix4QcHR8KvaI4UL1PrFm96jJZqkfl9\nB59VwLZj+zkfvusPMX5DG6qQtQKBgQDUBMUX3iqCTA2mDVyATqrqHN8qzbuiQcWb\nttnBSz91FeE84pPjLlPCIpr5cRPUPDzuvIslg0iRiTc4HCXInu2WuJMjtXGAjOBf\nq8eDbXuewpj5kY0gt1gqErSO2/VUtjs5cPM3mXDvJWVwQdhq3zc6d9UCEFf8aygv\nFTEDz4H4QwKBgEUUxOvLVTqYyea68apHbsZnVAK5Wz13xOfwlFffduIaqyFSuem/\nUDGF+F5AsQGwACfwdSZuyVVUq6Y+5e4QV1hh0nTKTMFKwBDsm61yBy7SaAe/98Dj\nitf/ROlEgHGN5kH+uKqqDtmcXq6OKDokl5+JzwM7uNjgVPYMThaoBGbpAoGABnra\n1z7oB7FxXVjdMeK1oJAfVfyRtoTSGE8/WoQFPXvctXKrWG8rCizqlaMaGwt4RUen\n7Q6VIjWSZXmewgHxewDLJnU+MdKcbPAgGek3tQN3j3EeYhiYbjjCIfehCOTE7J2C\nIXnkFLsM3aB1j9agpn3RGc4MEl/oC4BXTimCbGcCgYA+A0lpyFiwLiyTHqpKzjLY\nV6vfCoAaD4yP2IvK1EcRxxir5bqvfGC8/HBnIfm1QrD03ttQ53MRhBhsIZjoBXml\niSIt542IvJM8cEA6WEJF1O/PHMrySKQR9GI/ZWjMFA2rNcP0cS4OB2KsE/U1YBKC\nKgC6k07PC63NZw5aO3HVeQ==\n-----END PRIVATE KEY-----\n";
      // AUTH
      const authOptions = {
        credentials: {
          client_email: 'wallet@eurolifeconnect.iam.gserviceaccount.com',
          private_key: secret,
        },
        scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
      };

      var oldPass;
      try {
        const auth = new GoogleAuth(authOptions);
        let clientPromise = await auth.getClient();
        oldPass = await clientPromise.request({
            url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + googleId,
            method: 'GET'
        });
      }catch (err) {
        console.log("Pass with contract key: "+ query.ContractKey + " Not Found")
      }

      // Call to create pass input: query JSON object, output payload (json)
      var payload = await GooglePassService.CreateGooglePass(query, googleId);

      //Notification Message
      // if(query.Branch == 'ΖΩΗΣ'){//'ΖΩΗΣ'

      //     var query4 = {
      //         "Branch": query.Branch,
      //         "ContractIDType": query.ContractIDType,
      //         "ContractKey": query.ContractKey,
      //         "dangerAdrress": query.dangerAdrress,
      //         "ExpirationDate": '26/10/22',
      //         "GoldenRecordId": query.GoldenRecordId,
      //         "insuredName": query.insuredName,
      //         "NextPaymentDate": '26/10/22',
      //         "paymentFrequencyToString": query.paymentFrequencyToString,
      //         "participants": [{"ParticipantID":53083,"CID":"3555957","FirstName":"","LastName":"BE-BUSINESS EXCHANGES ΑΕ","FatherName":"","NationalID":"          ","TaxCode":"099876072","Relationship":"ΣΥΜΒΑΛΟΜΕΝΟΣ","Address":"ΣΙΝΙΟΣΟΓΛΟΥ 6 & ΑΛ. ΠΑΝΑΓΟΥΛΗ                     ","Area":"Ν.ΙΩΝΙΑ-ΑΘΗΝΑ                                               ","ZipCode":"14234","FullAddress":"ΣΙΝΙΟΣΟΓΛΟΥ 6 & ΑΛ. ΠΑΝΑΓΟΥΛΗ                      Ν.ΙΩΝΙΑ-ΑΘΗΝΑ                                                14234","ConcentSimple":false,"Insurancedate":"2014-08-01T00:00:00Z","ConcentProfile":false,"ConcentThirdParty":false,"InsuredId":20711,"remainAmount":"25000"},{"ParticipantID":-1,"FirstName":"ΠΑΝΑΓΙΩΤΑ","LastName":"ΑΠΟΣΤΟΛΙΔΟΥ","FatherName":"","BirthDate":"1982-07-22T00:00:00Z","Relationship":"Σύζυγος","FullAddress":"  ","Insurancedate":"2014-08-01T00:00:00Z","ConcentSimple":false,"ConcentProfile":false,"ConcentThirdParty":false,"InsuredId":20710,"remainAmount":"35000"}]                ,
      //         "paymentStatus": query.paymentStatus,
      //         "Status": "Ενεργό",
      //         "ProductDescription": query.ProductDescription,
      //         "PaymentType": query.PaymentType,
      //         "VehicleLicensePlate": "",
      //         "remainAmount":" 35000",
      //         "paymentCode": query.paymentCode
      //     }
      //     var newNotification = await pushNotificationGoogle.CreateNewNotificationMessage(oldPass, query4, classId);

      // }else{
      //     //Get notification message
      //     var newNotification = await pushNotificationGoogle.CreateNewNotificationMessage(oldPass, query, classId);
      //   }
      var newNotification = await pushNotificationGoogle.CreateNewNotificationMessage(oldPass, query, classId);
      if(query.update){
        console.log(`if(query.update) then Google Pass with serialNumber: ${googleId} updated`)
        const auth = new GoogleAuth(authOptions);
        let clientPromise = await auth.getClient();
        // ****UPDATE*****
        try {
          const respGetObject2 = await clientPromise.request({
              url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + googleId,
              method: 'GET'
          });
          if(respGetObject2.status == 200){
            const respUpdate = await clientPromise.request({
              url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + googleId,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              method: 'PUT',
              body: JSON.stringify(payload.payload.loyaltyObjects[0])
            });
            _.set(payload, "payload.loyaltyObjects[0]", respUpdate.data);        
            console.error("respGetObject2 :" + query.ContractKey);

            
            // var StartDate = new Date();
            // var EndDate = new Date();
            // EndDate.setHours(EndDate.getHours() + 4);
            //EXPIRATION_NOTIFICATION as messageType for offers
            var messageΤ = {
              "message": {
                "header": "Τελευταία Ενημέρωση",
                "body": newNotification,
              //   "displayInterval": {
              //         "start": {
              //           "date": StartDate.toISOString()
              //    },
              //         "end": {
              //           "date": EndDate.toISOString()
              //    }
              // },
                "id": payload.payload.loyaltyObjects[0].id,
                "messageType": "TEXT",
              }
            }

            try {
                const addMessage = await clientPromise.request({
                  url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + payload.payload.loyaltyObjects[0].id + "/addMessage",
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  method: 'POST',
                  body: JSON.stringify(messageΤ)
                });
                console.log("Pass with contract key: "+ query.ContractKey + " notification message")
              }catch (error) {
                  console.log("Pass with contract key: "+ query.ContractKey + " not notification message")
              }
          }
        }
        catch (er) {
            console.log("Pass with contract key: "+ query.ContractKey + " Not Found")
        }

      }
       
      // ****UPDATE*****
      // const respGetObjects = await clientPromise.request({
      //   url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject?classId=' + classId,
      //   method: 'GET'
      // });
      // var objects = respGetObjects.data.resources;
      // if (typeof objects !== 'undefined') {
      //   for (let id = 0; id < objects.length; id++) {
      //     if (objects[id].id ==  classId + "_" + ContractKey.toString()+"_"+ ContractIDType + "_" + GoldenRecordId) {
      //       const respUpdate = await clientPromise.request({
      //         url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + classId + "_" + ContractKey.toString()+"_"+ ContractIDType + "_" + GoldenRecordId,
      //         headers: {
      //           'Content-Type': 'application/json',
      //           'Accept': 'application/json',
      //         },
      //         method: 'PUT',
      //         body: JSON.stringify(payload.payload.loyaltyObjects[0])
      //       });
      //       _.set(payload, "payload.loyaltyObjects[0]", respUpdate.data);
      //       break;
      //     }
      //   }
      // }

      var headerNEW = { "alg": "RS256", "typ": "JWT" };
      var sHeader = JSON.stringify(headerNEW);

      ///*  Set payload


      var sPayload = JSON.stringify(payload);
      let sJWT = KJUR.jws.JWS.sign(headerNEW.alg, sHeader, sPayload, secret);

      const token: Token = {
        GeneratedToken: sJWT,
        GeneratedPayload: encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify({payload, newNotification}), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString())
      };

      //release memory
      encryptedQuery = bytes = query = updateGoldenRecordIdResponse = googleId = secret = oldPass = payload = newNotification = messageΤ = newNotification = sPayload = sJWT = headerNEW = sHeader = null;
      //Total Memory size
      console.log(`After create google pass`);
      const used2 = process.memoryUsage();
      for (let key in used2) {
        console.log(`${key} ${Math.round(used2[key] / 1024 / 1024 * 100) / 100} MB`);
      }
      res.status(200).json(token);

    }
    catch (error) {
      //release memory
      encryptedQuery = bytes = query = secret = classId = oldPass = payload = newNotification = messageΤ = newNotification = sPayload = null;
      console.error(error);
      res.status(500).send(error);
    }
  };
  static uuid: any;

  public uuid(): string {
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

    return result;
  }


  getNewDateFormat = (date: string): string => {

    var oldDateFormat = new Date(date);
    var dd = oldDateFormat.getDate();
    var mm = oldDateFormat.getMonth() + 1;
    var yyyy = oldDateFormat.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  }


}