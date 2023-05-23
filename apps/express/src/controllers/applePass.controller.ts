import { Request, Response } from 'express';
const fs = require('fs');
let path = require('path');
var CryptoJS = require("crypto-js");

import { ApplePassService } from "../service/apple-pass-service";
export default class applePassController {

  public static CreateApplePass = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      let Wallet = req.app.get('Wallet');
      var encryptedQueryParams = req.query.parameter;
      var encryptedQuery = decodeURIComponent(encryptedQueryParams.toString());
      var bytes = CryptoJS.AES.decrypt(encryptedQuery.toString(), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW');
      var query = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


      var payloadJson = {
        "Branch": query.Branch,
        "ContractIDType": query.ContractIDType,
        "ContractKey": query.ContractKey,
        "dangerAdrress": query.dangerAdrress,
        "ExpirationDate": query.ExpirationDate,
        "GoldenRecordId": query.GoldenRecordId,
        "insuredName": query.insuredName,
        "NextPaymentDate": query.NextPaymentDate,
        "paymentFrequencyToString": query.paymentFrequencyToString,
        "participants": query.participants,
        "paymentStatus": query.paymentStatus,
        "Status": query.Status,
        "ProductDescription": query.ProductDescription,
        "PaymentType": query.PaymentType,
        "VehicleLicensePlate": query.VehicleLicensePlate,
        "remainAmount": query.remainAmount,
        "paymentCode": query.paymentCode,
        "mobilePhone": query.mobilePhone
      }

     // let updateGoldenRecordIdResponse = UpdateGoldenRecordService.updateGoldenRecord(query.GoldenRecordId, query.ContractIDType);
      //console.log(`goldenRecordId response: ${updateGoldenRecordIdResponse}`);

      // TODO: Delete before production
      console.log(`Payload is`);
      console.log(payloadJson);
      let passTypeIdentifier = process.env.APNS_TOPIC;
      let serialNumber = payloadJson.ContractKey + "_" + payloadJson.GoldenRecordId;
      try {
        // 1. Connect to the database to find passes / devices, if found update the lastUpdateValues object
        let _pass = {
          passTypeIdentifier: passTypeIdentifier,
          serialNumber: serialNumber,
          lastUpdated: Date.now(),
          lastUpdateValues: payloadJson
        }
       await Wallet.runInitialCreate(_pass);
      } catch (error) {
        console.log(`error while creating initial pass record with error message: ${error}`)
      }

      // Call to create pass input: query JSON object, output passname
      let fileName = await ApplePassService.CreatePass(query, Wallet, serialNumber)
      let pdfDir = path.resolve(process.env.PASSES);
      var stats = fs.statSync(pdfDir + "/" + fileName + ".pkpass");
      var fileSizeInBytes = stats.size;

      if (fs.existsSync(pdfDir + "/" + fileName + ".pkpass") && fileSizeInBytes > 0) {
        res.setHeader('content-type', 'application/vnd.apple.pkpass');
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Content-Disposition', 'attachment; filename=' + fileName + '.pkpass');
        res.setHeader('Content-Length', fileSizeInBytes);

        var filePath = pdfDir + "/" + fileName + ".pkpass";
        var resolvedPath = path.resolve(filePath);

        res.sendFile(resolvedPath);

        setTimeout(async () => {
          fs.unlinkSync(pdfDir + "/" + fileName + ".pkpass");
        }, 4500);

      }
    }
    catch (error) {
      console.error(error);
    }
  };
}
