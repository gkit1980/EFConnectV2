import { ExchangeRule, IntegrationDataIn, IntegrationDataOut, IceConsole } from '@impeo/ice-core';
import * as _ from 'lodash';

import axios from 'axios';
import * as qs from 'qs';
import * as moment from 'moment';

export class GoProIntegration {
  goproToken = '';
  goproCase: any;
  goproCaseId: string;

  constructor(private baseUrl: string) {}
  public async login(username: string, password: string): Promise<void> {
    IceConsole.info('GoProIntegration login');

    const credentials = {
      credentials: JSON.stringify({
        _type: 'UserCredentialsType',
        username: username,
        password: password
      })
    };

    try {
      const response = await axios({
        method: 'post',
        url: this.baseUrl + '/Client/Access/Login',
        data: qs.stringify(credentials),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      });

      this.goproToken = response.headers['x-goprotoken'];
    } catch (err) {
      IceConsole.error(err);
    }

    return;
  }

  public async initiateCase(parentId: string, templateId: string): Promise<void> {
    IceConsole.info('GoProIntegration initiateCase');

    const initCase = {
      parentId: parentId,
      templateId: templateId
    };

    try {
      const response = await axios({
        method: 'post',
        url: this.baseUrl + '/Client/Data/Case/Initiate',
        data: qs.stringify(initCase),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + this.goproToken
        }
      });

      this.goproCase = response.data;
    } catch (err) {
      IceConsole.error(err);
    }

    return;
  }

  public async createCase(metadata: any): Promise<void> {
    IceConsole.info('GoProIntegration createCase');

    for (const key of Object.keys(metadata)) {
      this.setMetadata(key, metadata[key]);
    }

    const createCase = {
      document: JSON.stringify(this.goproCase)
    };

    try {
      const response = await axios({
        method: 'post',
        url: this.baseUrl + '/Client/Data/Case/Create',
        data: qs.stringify(createCase),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + this.goproToken
        }
      });

      this.goproCaseId = response.data;
    } catch (err) {
      IceConsole.error(err);
    }

    return;
  }

  public async getCase(caseId: string): Promise<void> {
    IceConsole.info('GoProIntegration getCase');

    this.goproCaseId = caseId;
    this.goproCase = null;

    try {
      const response = await axios({
        method: 'get',
        url: this.baseUrl + '/Client/Data/Case/' + this.goproCaseId,
        headers: {
          Authorization: 'Bearer ' + this.goproToken
        }
      });

      this.goproCase = response.data;
    } catch (err) {
      IceConsole.error(err);
    }

    return;
  }

  private setMetadata(name: string, value: any): void {
    for (let i = 0; i < this.goproCase.metaDataEntries.length; i++) {
      if (this.goproCase.metaDataEntries[i].name === name) {
        this.goproCase.metaDataEntries[i].value = value;
      }
    }
  }
}

export class InsisGoproCreateCaseExchangeRule extends ExchangeRule {
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    IceConsole.info('InsisGoproCreateCaseExchangeRule', request);

    const username = this.requireParam('username');
    const password = this.requireParam('password');
    const baseUrl: string = this.requireParam('endpointBaseurl');

    const parentId: string = request.payload.parentId;
    const templateId: string = request.payload.templateId;

    const gopro = new GoProIntegration(baseUrl);

    await gopro.login(username, password);

    await gopro.initiateCase(parentId, templateId);

    const metadata = {
      'Accident.accidentType': request.params['metaDataEntries.Accident.accidentType'],
      'Accident.locationAddress': request.params['metaDataEntries.Accident.locationAddress'],
      'Accident.injuredNumber': request.params['metaDataEntries.Accident.injuredNumber'],
      'Accident.accidentTime': moment(
        request.params['metaDataEntries.Accident.accidentTime'],
        'YYYY-MM-DD'
      ).format(),
      'Accident.locationLat': Number(request.params['metaDataEntries.Accident.locationLat']),
      'Accident.locationLong': Number(request.params['metaDataEntries.Accident.locationLong']),
      'Accident.ambulenceRequired': request.params['metaDataEntries.Accident.ambulenceRequired'],
      'Accident.towTruckRequired': request.params['metaDataEntries.Accident.towTruckRequired']
    };

    await gopro.createCase(metadata);
    IceConsole.info('created case ID', gopro.goproCaseId);

    //IceConsole.info(gopro.goproCase);
    await gopro.getCase(gopro.goproCaseId);
    //IceConsole.info("loaded case", gopro.goproCase);

    const data = new IntegrationDataIn();
    data.payload.caseId = gopro.goproCaseId;
    try {
      data.payload.caseNumber = gopro.goproCase.caseNumber;
      IceConsole.info('case Number', gopro.goproCase.caseNumber);
    } catch (error) {
      data.payload.caseNumber = -1;
    }

    return data;
  }
}
