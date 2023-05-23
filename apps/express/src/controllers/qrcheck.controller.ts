import { async } from "rxjs/internal/scheduler/async";
// import _ from 'lodash';
var _ = require('lodash');
// import CryptoJS from "crypto-js";
var CryptoJS = require("crypto-js");
import { KeyVaultService } from "../service/keyVault-service";
// import axios from "axios";
var axios = require('axios').default;
const constants = require("../constants/constants");
var exphbs = require('express-handlebars');
require('dotenv').config();


export default class QRCheckController {

  public static qrcheck = async (req: any, res: any) => {

    const keyVault = new KeyVaultService();
    let credentials: string;
    try {
      credentials = await keyVault.getSecret(process.env.WALLET_AZURE_SECRET_SYSTEM_USER);
    } catch (error) {
      console.log(`error while connecting to AzureKeyVault with error message: ${error}`);
    }

    let httpParams = req.params;
    var contractIDType = CryptoJS.AES.decrypt(decodeURIComponent(httpParams.contractIDType.toString()), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString(CryptoJS.enc.Utf8);
    var goldenRecordId_Insured = CryptoJS.AES.decrypt(decodeURIComponent(httpParams.golderRecordId.toString()), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW').toString(CryptoJS.enc.Utf8);
    // Identify contractId and Branch
    let goldenRecordId_InsuredIdSplit = goldenRecordId_Insured.toString().split("_");
    let goldenRecordId = goldenRecordId_InsuredIdSplit[0];
    let contractIDTypeSplit = contractIDType.toString().split("_");
    let contractId = contractIDTypeSplit[0];
    let branch = contractIDTypeSplit[1];

    let token = await QRCheckController.Login(credentials);
    let contractDetails = await QRCheckController.getContractDetails(token, contractId, branch, goldenRecordId);
    // Retrieved data
    let data = contractDetails;
    let isDataEmpty = _.isEmpty(data[Object.keys(data)[0]]);
    console.log(`goldenRecordId_Insured: ${goldenRecordId_Insured}`);
    console.log(`goldenRecordId: ${goldenRecordId}`);
    console.log(`credentials: ${credentials}`);
    console.log(`contractIDType: ${contractIDType}`);
    console.log(`contractId: ${contractId}`);
    console.log(`branch: ${branch}`);
    console.log(`token: ${token}`);
    console.log(`contractDetails: ${contractDetails}`);
    console.log(`isDataEmpty: ${isDataEmpty}`);
    console.log(`data: ${data}`);


    if (isDataEmpty && branch != constants.BRANCH_GROUPHEALTH_ID) {
      if (process.env.NODE_ENV == 'development') {
        res.redirect('http://localhost:4200/#/pageNotFound');
      }
      else if (process.env.NODE_ENV == 'production') {
        res.redirect('/#/pageNotFound');
      }
      return;
    }
    let policyStatus: boolean;
    if (isDataEmpty && branch == constants.BRANCH_GROUPHEALTH_ID) {
      policyStatus = false;
    }
    let vehicleLicensePlate: string;
    let propertyStreet: string;
    let isVehicle: boolean = false;
    let isProperty: boolean = false;
    let productDescription: string;
    let contractKey: string;
    let insured = {
      "FirstName": '',
      "LastName": ''
    };
    if (isDataEmpty == false) {
      if (branch == constants.BRANCH_GROUPHEALTH_ID) {
        productDescription = data[Object.keys(data)[0]].ProductDescription.trim();
      } else {
        productDescription = data[Object.keys(data)[0]].ProductDescritpion.trim();
      }
      contractKey = data[Object.keys(data)[0]].ContractKey.trim();
      if (branch == constants.BRANCH_GROUPHEALTH_ID) {
        policyStatus = true;
      } else {
        policyStatus = (data[Object.keys(data)[0]].Status.trim() === constants.STATUS_ACTIVE ||
          data[Object.keys(data)[0]].Status.trim() == constants.STATUS_REINSTATE ||
          data[Object.keys(data)[0]].Status.trim() == constants.STATUS_PARTIAL_SURRENDER_UL ||
          data[Object.keys(data)[0]].Status.trim() == constants.STATUS_CHANGE_INVESTMENT_PLAN ||
          data[Object.keys(data)[0]].Status.trim() == constants.STATUS_PARTIAL_SURRENDER) ? true : false;
      }
      if (branch == constants.BRANCH_MOTOR_ID) {
        vehicleLicensePlate = data[Object.keys(data)[0]].VehicleLicensePlate.trim();
        isVehicle = true;
        isProperty = false;
      }
      if (branch == constants.BRANCH_PROPERTY_ID) {
        propertyStreet = data[Object.keys(data)[0]].PropertyStreet.trim();
        isVehicle = false;
        isProperty = true;
      }
      if (branch == constants.BRANCH_GROUPHEALTH_ID) {
        insured.FirstName = data[Object.keys(data)[0]].InsuredFirstName.trim();
        insured.LastName = data[Object.keys(data)[0]].InsuredLastName.trim();
      }
      let policyParticipants = await QRCheckController.getPolicyParticipants(token, contractId, branch);
      data = policyParticipants;
      if (branch == constants.BRANCH_MOTOR_ID || branch == constants.BRANCH_PROPERTY_ID) {
      } else {
        if (branch == constants.BRANCH_GROUPHEALTH_ID) {

        } else {
          insured = data[Object.keys(data)[0]].find((o: { Relationship: string; }) => {
            return o.Relationship === constants.INSURED_POLICY_HOLDER || o.Relationship === constants.INSURED_POLICY_HOLDER_CORRECT;
          });
          if (insured == undefined) {
            insured = data[Object.keys(data)[0]].find((o: { Relationship: string; }) => {
              return o.Relationship === constants.INSURED || o.Relationship === constants.INSURED_POLICY_HOLDER_CORRECT;
            });
          }
        }
      }
    }

    if (req.accepts('html')) {
      req.app.engine('handlebars', exphbs());
      req.app.set('view engine', 'handlebars');
      res.render('home', {
        policy: {
          policyState: policyStatus,
          isVehicle: isVehicle,
          isProperty: isProperty
        },
        client: {
          name: insured.FirstName + " " + insured.LastName,
          vehicleLicensePlate: vehicleLicensePlate,
          propertyStreet: propertyStreet,
          contractId: contractKey,
        },
        product: {
          description: productDescription
        }
      });
    } else if (req.accepts(['html', 'json']) === 'json') {
      let response = {
        "policy": {
          "policyState": policyStatus,
          "isVehicle": isVehicle,
          "isProperty": isProperty
        },
        "client": {
          "name": insured.FirstName + " " + insured.LastName,
          "vehicleLicensePlate": vehicleLicensePlate,
          "propertyStreet": propertyStreet,
          "contractId": contractKey
        },
        "product": {
          "description": productDescription
        }
      }
      res.type('application/json');
      res.status(200).json(response);
    }
  }

  private static async Login(credentials: any) {
    let url = process.env.BASEURLLOGIN + process.env.BASELOGINCREDENTIALS + credentials;
    let response = await axios.default({
      url: url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        let newError = {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
          config: error.response.config
        }
        return newError;
      })
    return response.access_token;
  }

  private static async getContractDetails(token: string, contractId: string, branch: string, golderRecordId: string) {
    let uri = process.env.BASEURL;
    let resource: string;
    let data: object;
    data = {
      "ContractID": contractId
    };
    switch (branch) {
      case constants.BRANCH_INDIVIDUALS_ID:
        resource = constants.BRANCH_INDIVIDUALS_SERVICE;
        break;
      case constants.BRANCH_PENSION_ID:
        resource = constants.BRANCH_PENSION_SERVICE;
        break;
      case constants.BRANCH_MORTGAGE_ID:
        resource = constants.BRANCH_MORTGAGE_SERVICE;
        break;
      case constants.BRANCH_HEALTH_ID:
        resource = constants.BRANCH_HEALTH_SERVICE;
        break;
      case constants.BRANCH_LIFEHEALTH_ID:
        resource = constants.BRANCH_LIFEHEALTH_SERVICE;
        break;
      case constants.BRANCH_DEATH_ID:
        resource = constants.BRANCH_DEATH_SERVICE;
        break;
      case constants.BRANCH_CONSUMER_ID:
        resource = constants.BRANCH_CONSUMER_SERVICE;
        break;
      case constants.BRANCH_MOTOR_ID:
        resource = constants.BRANCH_MOTOR_SERVICE;
        data = {
          "LOBId": "5",
          "ContractID": contractId
        }
        break;
      case constants.BRANCH_ACCIDENT_ID:
        resource = constants.BRANCH_ACCIDENT_SERVICE;
        break;
      case constants.BRANCH_CARGO_ID:
        resource = constants.BRANCH_CARGO_SERVICE;
        break;
      case constants.BRANCH_CARGOPRUD_ID:
        resource = constants.BRANCH_CARGOPRUD_SERVICE;
        break;
      case constants.BRANCH_PRUD_ID:
        resource = constants.BRANCH_PRUD_SERVICE;
        break;
      case constants.BRANCH_FIREPRUD_ID:
        resource = constants.BRANCH_FIREPRUD_SERVICE;
        break;
      case constants.BRANCH_PROPERTY_ID:
        resource = constants.BRANCH_PROPERTY_SERVICE;
        break;
      case constants.BRANCH_GROUPHEALTH_ID:
        resource = constants.BRANCH_GROUPHEALTH_SERVICE;
        data = {
          "ContractID": contractId,
          "CustomerCode": golderRecordId
        }
        break;
      default: {
        break;
      }
    }
    let response = await axios.default({
      url: uri + resource,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + token
      },
      data: data
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        let newError = {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
          config: error.response.config
        }
        return newError;
      })
    return response;
  }

  private static async getPolicyParticipants(token: string, contractId: string, branch: string) {
    let response = await axios.default({
      url: process.env.BASEURL + '/GetContractParticipants',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + token
      },
      data: {
        "ContractID": contractId
      }
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => {
        let newError = {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
          config: error.response.config
        }
        return newError;
      })
    return response;
  }

}
