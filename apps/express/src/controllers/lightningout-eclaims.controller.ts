import axios from 'axios';
import { Request, Response } from 'express';
const njwt = require('njwt');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

interface Token {
  GeneratedToken: string;
}

export default class lightningOutEclaimsController {
  
  
  public static GenerateAccessToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    let secretPropertiesNames: string[] = [];

    const randomSecretName = (secretPropertiesNames: string[]): string => {
      return secretPropertiesNames[
        Math.floor(Math.random() * secretPropertiesNames.length)
      ];
    };

    const {
      goldenRecordId,
      policyNumber,
      insuredId,
      dependentMemberId,
      claimInsuredName,
      ailmentId,
      personalContracts,
      email,
      customerCode,
      company,
      receiptAmount,
      taxNumber,
      issueDate,
      codeNumber,
      series,
      requestType,
      finalCover,
      benefitsCodes
    } = req.body;

    const claims = {
      iss: 'Connect',
      goldenRecordId,
      policyNumber,
      insuredId,
      dependentMemberId,
      claimInsuredName,
      ailmentId,
      personalContracts,
      email,
      customerCode,
      company,
      receiptAmount,
      taxNumber,
      issueDate,
      codeNumber,
      series,
      requestType,
      finalCover,
      benefitsCodes
    };

    console.log("Eclaims info:"+JSON.stringify(claims));

    const credential = new DefaultAzureCredential();
    const url = process.env.KEY_VAULT_URL;
    const client = new SecretClient(url, credential);

    try {
      for await (let secretProperties of client.listPropertiesOfSecrets()) {
        secretPropertiesNames = [
          ...secretPropertiesNames,
          secretProperties.name,
        ];
      }

      const secretName = randomSecretName(secretPropertiesNames);

      const latestSecret = await client.getSecret(secretName);

      const signingKey = Buffer.from(latestSecret.value, 'ascii');

      let jwt = njwt.create(claims, signingKey, 'HS256');
      jwt.setExpiration(new Date().getTime() + 60 * 15000);
      jwt.setHeader('kid', secretName);

      const token: Token = {
        GeneratedToken: jwt.compact(),
      };

      res.status(200).json(token);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };


  
  public static SalesforceDocsUploaded = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const login = async () => {
      const response = await axios({
        url: process.env.BASEURLSALESFORCELOGIN,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then((res: any) => {
          return res.data;
        })
        .catch((err) => {
          console.error('Error Login for Eclaims: ', err);
          return err;
        });

      return !!response.access_token ? response.access_token : null;
    };

    try {
     
      var startTime = new Date().getTime();
      var endTime : any;
      const token = await login();
      endTime = new Date().getTime();
      var time = endTime - startTime;
      console.log("Time for Salesforce Login:" + time/1000 +" sec");

      const { caseId } = req.body;

      startTime = new Date().getTime();
      const result = await axios({
        url: process.env.APEXREST_BASEURL + '/KivosService/DocumentsUploaded',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: {
          CaseID: caseId,
          DocumentsUploaded: true,
        },
      });
      endTime = new Date().getTime();
      var time = endTime - startTime;
      console.log("Time for KivosService-DocumentsUploaded:" + time/1000 +" sec"); 
   

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json(error);
    }
  };
}
