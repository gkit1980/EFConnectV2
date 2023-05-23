import { async } from "rxjs/internal/scheduler/async";
// import _ from 'lodash';
var _ = require('lodash');
import * as fs from "fs";
import * as path from "path";
import { ApplePassService } from "../service/apple-pass-service";
import { UpdateGoldenRecordService } from "../service/update-goldenrecord-service";
import { KJUR } from "jsrsasign";
const http2 = require('http2');
import { KeyVaultService } from "../service/keyVault-service";


export default class AppleWalletController {

    public static getUniversalLinkJson= async (req: any, res: any) => {

        let specificObject={
            applinks: {
              apps: [{}],
              details: [
                {
                  appID: "G27G9DZHLC.gr.progressnet.eurolifeassist",
                  paths: [ "*/eurolifeAssistApp/*","*/eurolifeAssistAppIos/*"]
                },
              ]
            }
          }
          res.set('Content-Type', 'application/pkcs7-mime');
          res.status(200).json(specificObject);
        }


    public static registerLogs = async (req: any, res: any) => {
        // Create Wallet Model
        let Wallet = req.app.get('Wallet');

        let body = req.body.logs;
        let _appleLogs = {
            logs: body
        }
        await Wallet.AppleLogsCollection.create(_appleLogs).then((docAppleLogs: any) => {
            console.log("Created AppleLogs entries");
        })
        res.status(200).send();
    }

    public static registerPass = async (req: any, res: any) => {
        // Create Wallet Model
        let Wallet = req.app.get('Wallet');
        let httpParams = req.params;
        let httpBody = req.body;
        console.log(`Pass with ${httpParams.serialNumber} to be registered in the database`);
        console.log(`Pass with ${httpParams.serialNumber} \n pushToken = ${httpBody.pushToken} `);

        //serialNumber = payloadJson.ContractKey +  "_" + payloadJson.GoldenRecordId;
        let goldenRecordId = httpParams.serialNumber.split("_")[1];
        //Group Contract
        if(httpParams.serialNumber.split("_")[2]){
            goldenRecordId = httpParams.serialNumber.split("_")[1]  + "_" + httpParams.serialNumber.split("_")[2];
        }

        let _pass = {
            passTypeIdentifier: httpParams.passTypeIdentifier,
            serialNumber: httpParams.serialNumber,
            lastUpdated: Date.now(),
            lastUpdateValues: {}
        }
        let _device = {
            deviceLibraryIdentifier: httpParams.deviceLibraryIdentifier,
            pushToken: httpBody.pushToken
        }
        try {
            Wallet.runCreate(_pass, _device);
            if(goldenRecordId){
                let updateGoldenRecordIdResponse = UpdateGoldenRecordService.updateGoldenRecord(goldenRecordId);
                console.log(`Pass with goldenRecordId: ${goldenRecordId} was succesfully registered`);
                console.log(`goldenRecordId response: ${updateGoldenRecordIdResponse}`);
            }
            res.status(201).send();
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    public static deletePass = async (req: any, res: any) => {
        // Create Wallet Model
        let Wallet = req.app.get('Wallet');

        let httpParams = req.params;
        let httpBody = req.body;
        console.log(`Pass with ${httpParams.serialNumber} to be un-registered from the database`);
        let _pass = {
            passTypeIdentifier: httpParams.passTypeIdentifier,
            serialNumber: httpParams.serialNumber,
            lastUpdated: Date.now()
        }
        let _device = {
            deviceLibraryIdentifier: httpParams.deviceLibraryIdentifier,
            pushToken: httpBody.pushToken
        }
        try {
            Wallet.runDelete(_pass, _device);
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    public static retrievePasses = async (req: any, res: any) => {
        // Create Wallet Model
        let Wallet = req.app.get('Wallet');

        let httpParams = req.params;
        let httpQuery = req.query;

        console.log(`Device with deviceLibraryIdentifier: ${httpParams.deviceLibraryIdentifier} requested the list of passes`);

        let mongooseFilter = {
            "deviceLibraryIdentifier": httpParams.deviceLibraryIdentifier
        }
        let requestedPasses: any[] = [];
        let responseBody = {
            "serialNumbers": requestedPasses,
            "lastUpdated": httpQuery.passesUpdatedSince
        };
        await Wallet.DeviceCollection.findOne(mongooseFilter)
            .populate({
                path: 'passes',
                match: {
                    lastUpdated: {
                        $gt: httpQuery.passesUpdatedSince
                    }
                }
            })
            .exec(function (err: any, device: any) {
                if (err) return err;
                if (device != null) {
                    let passes = device._doc.passes;
                    for (let index = 0; index < passes.length; index++) {
                        const element = passes[index];
                        requestedPasses.push(element._doc.serialNumber);
                    }
                    responseBody.serialNumbers = requestedPasses;
                    httpQuery.passesUpdatedSince = Date.now().toString();
                    responseBody.lastUpdated = httpQuery.passesUpdatedSince;
                    let httpBody = responseBody;
                    if (_.isEmpty(httpBody)) {
                        console.log(`Device with deviceLibraryIdentifier: ${httpParams.deviceLibraryIdentifier} got a 204 response`);
                        res.status(204).send();
                    } else {
                        console.log(`Device with deviceLibraryIdentifier: ${httpParams.deviceLibraryIdentifier} got a 200 response. Body follows`);
                        console.log(httpBody);
                        res.status(200).json(httpBody);
                    }
                } else {
                    console.log(`Device with deviceLibraryIdentifier: ${httpParams.deviceLibraryIdentifier} got a 204 response`);
                    res.status(204).send();
                }
            });
    }

    public static sendPass = async (req: any, res: any) => {
        // Create Wallet Model
        let Wallet = req.app.get('Wallet');

        let httpParams = req.params;
        console.log(`Pass with serialNumber: ${httpParams.serialNumber} has been requested from device`);
        let mongooseFilter = {
            "serialNumber": httpParams.serialNumber,
            "passTypeIdentifier": httpParams.passTypeIdentifier
        }
        try {
            // 1. Connect to the database to find passes / devices, if found update the lastUpdateValues object
            let _pass = await Wallet.PassCollection.findOne(mongooseFilter);
            if (_pass != null) {
                let _initialPass = await Wallet.InitialPassCollection.findOne(mongooseFilter);
                let fileName: any;
                if(_initialPass != null){
                    fileName = await ApplePassService.CreatePass(_initialPass._doc.lastUpdateValues, Wallet, httpParams.serialNumber);
                    try{
                        let mongooseFilter = { "serialNumber": _initialPass._doc.serialNumber };
                        let update = {
                            lastUpdated: Date.now(),
                            lastUpdateValues: _initialPass._doc.lastUpdateValues
                        };
                        //maybe need populate to devices
                        const keyVault = new KeyVaultService();
                        let applePrivateKey = await keyVault.getSecret(process.env.WALLET_AZURE_SECRET_APPLE);
                        let appleJWT = createAppleJWT(applePrivateKey);
                        await Wallet.PassCollection.findOneAndUpdate(mongooseFilter, update, {
                            new: true,  useFindAndModify: false
                        }).populate('devices').exec(function (err: any, pass: any) {
                            if (err) return err;
                            if (pass != null) {
                              let devices = pass._doc.devices;
                              for (let index = 0; index < devices.length; index++) {
                                const element = devices[index];
                                console.log(`{SendPass} ${_initialPass._doc.lastUpdateValues} found in the database`);
                                connectToAppleAPNS(appleJWT, element._doc.pushToken);

                              }
                            }
                          });
                    }catch(error){
                        console.log(`{SendPass} Pass with serialNumber: ${_initialPass._doc.serialNumber} not found. Error: ${error}`);
                    }
                }else{
                    fileName = await ApplePassService.CreatePass(_pass._doc.lastUpdateValues, Wallet, httpParams.serialNumber);
                }
                let pdfDir=path.resolve(process.env.PASSES);
                var stats = fs.statSync(pdfDir+"/" + fileName + ".pkpass");
                var fileSizeInBytes = stats.size;

                if (fs.existsSync(pdfDir+"/"+fileName + ".pkpass") && fileSizeInBytes > 0) {
                    res.setHeader('content-type', 'application/vnd.apple.pkpass');
                    res.setHeader('Content-Transfer-Encoding', 'binary');
                    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName + '.pkpass');
                    res.setHeader('Content-Length', fileSizeInBytes);
                    res.setHeader('Cache-Control', 'no-store');
                    var filePath = pdfDir +"/"+ fileName + ".pkpass";
                    var resolvedPath = path.resolve(filePath);
                    res.status(200).sendFile(resolvedPath);
                    setTimeout(async () => {
                        fs.unlinkSync(pdfDir+"/"+ fileName + ".pkpass");
                    }, 4000);

                    //delete initial pass
                    Wallet.deleteInitialPass(httpParams.serialNumber);
                }
            } else {
                console.log(`Pass with serialNumber: ${httpParams.serialNumber} got a 401 error`);
                res.status(401).send();
            }
        } catch (error) {
            console.log(error);
        }
    }





}

var createAppleJWT = function(applePrivateKey: string) {
    let currentTime = KJUR.jws.IntDate.get('now');
    var secret = applePrivateKey;
    // Set Header
    var headerNEW = { "alg": "ES256", "kid": process.env.APNS_CERTIFICATE_KEY };
    var sHeader = JSON.stringify(headerNEW);

    // Set payload
    var payload = {
      "iss": process.env.APPLE_DEVELOPER_TEAM_IDENTIFIER,
      "iat": KJUR.jws.IntDate.get('now')
    };
    var sPayload = JSON.stringify(payload);
    console.log("New Apple JWT created");

    //release memory
    payload = null;

    return KJUR.jws.JWS.sign(headerNEW.alg, sHeader, sPayload, secret);
  }


  var connectToAppleAPNS = async function(token: string, deviceToken: string) {
    let UUID = generateUUID();
    let expirationDate = notificationExpirationDate();
    let url = process.env.APNS;
    let path = '/3/device/' + deviceToken;
    const client = http2.connect(url);
    client.on('error', (err: any) => console.error(err));
    let headers = {
      ':scheme': 'https',
      ':method': 'POST',
      ':path': path,
      'authorization': `bearer ${token}`,
      'apns-topic': process.env.APNS_TOPIC,
      'apns-push-type': 'alert',
      'apns-id': UUID,
      'apns-expiration': expirationDate,
      'apns-priority': 10,
      'Content-Type': 'application/json'
    }
    const request = client.request(headers);

    request.on('response', (headers: any, flags: any) => {
      for (const name in headers) {
        console.log(`${name}: ${headers[name]}`);
      }
    });
    let body = {
      "aps": {
        "alert": "Pass update",
        "content-available": 1
      }
    };
    request.setEncoding('utf8');
    let data = '';
    request.on('data', (chunk: any) => { data += chunk; });
    request.write(JSON.stringify(body));
    request.on('end', () => {
      console.log(`\n${data}`);
      client.close();
    });
    request.end();
  }

 var generateUUID= function() {
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

  var notificationExpirationDate = function() {
    return KJUR.jws.IntDate.get('now + 1hour');
  }
