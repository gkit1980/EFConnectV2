import {
  ExchangeRule,
  IceIntegration,
  IntegrationDataIn,
  IntegrationDataOut
} from '@impeo/ice-core';
import { get, isString, toString } from 'lodash';
import oracledb from 'oracledb';
import * as fs from 'fs';
import * as path from 'path';

//
//
export class InsisDBExchangeRule extends ExchangeRule {
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    let query = this.getQuery();
    const queryFileURL = this.getQueryFileURL();
    const data = new IntegrationDataIn();

    console.log(
      'InsisDBExchangeRule:' + this.integration.name,
      'queryFileURL:',
      this.fullQueryFilePath
    );

    // When both query string and queryFileURL are specified the query string from the recipe is preferred
    if (!query && queryFileURL) {
      const fileExist = await new Promise((resolve, reject) => {
        try {
          resolve(fs.existsSync(this.fullQueryFilePath));
        } catch (e) {
          console.error(
            'InsisDBExchangeRule:' + this.integration.name,
            'Error checking if file exists:',
            this.fullQueryFilePath,
            'Error:',
            e
          );
          data.payload.error = e;
          return data;
        }
      });

      if (!fileExist) {
        const errorMessage = `InsisDBExchangeRule: ${this.integration.name}. Provided query file does not exist: ${this.fullQueryFilePath}`;
        console.error(errorMessage);
        data.payload.error = errorMessage;
        return data;
      }

      try {
        query = await new Promise<string>((resolve, reject) => {
          fs.readFile(this.fullQueryFilePath, 'utf8', (error, fileBufer) => {
            if (error) {
              console.error(
                'InsisDBExchangeRule:' + this.integration.name,
                'Error reading file:',
                this.fullQueryFilePath,
                'Error:',
                error
              );
              data.payload.error = error;
              return data;
            } else {
              resolve(fileBufer.toString());
            }
          });
        });

        if (!query) {
          const errorMessage = `InsisDBExchangeRule:' ${this.integration.name}. Empty query content loaded: ${this.fullQueryFilePath}`;
          console.error(errorMessage);
          data.payload.error = errorMessage;
          return data;
        }
      } catch (e) {
        console.error(
          'InsisDBExchangeRule:' + this.integration.name,
          'Can not load query file:',
          this.fullQueryFilePath,
          'Error:',
          e
        );
        data.payload.error = e;
        return data;
      }
    }

    const config = this.getConfig();
    const bindValues = this.getBindValues(request);
    let connection;

    try {
      connection = await oracledb.getConnection(config);
    } catch (e) {
      console.error(
        'InsisDBExchangeRule:' + this.integration.name,
        'Error establishing Oracledb connection!',
        config
      );
      data.payload = { error: e };
      return data;
    }

    if (connection.oracleServerVersion < 1202000000) {
      throw new Error('These examples only work with Oracle Database 12.2 or greater');
    }

    const result = await connection.execute(query, bindValues);
    const queryType = this.getParam('queryType');
    let rows = [];

    if (queryType.toLowerCase() === 'json') {
      rows = result.rows.map(row => JSON.parse(row[0]));
    } else {
      const names = result.metaData.map(item => item.name);
      rows = result.rows.map(row =>
        row.reduce((acc, current, index) => {
          acc[names[index]] = current;
          return acc;
        }, {})
      );
    }

    data.payload = { rows };
    return data;
  }

  getConfig() {
    return {
      user: this.getValueFromEnvironment(this.getParam('username')),
      password: this.getValueFromEnvironment(this.getParam('password')),
      connectString: this.getValueFromEnvironment(this.getParam('connectString'))
    };
  }

  protected getQuery(): string {
    const query = this.getParam('query');
    if (!query) return '';
    return query;
  }

  protected getBindValues(request: IntegrationDataOut) {
    console.log('InsisDBExchangeRule with params', request.params);
    return request.params;
  }

  private getValueFromEnvironment(value: string): string {
    if (!isString(value) || !value.startsWith('env:')) return value;
    return this.runtime.environmentVariables[value.replace('env:', '')];
  }

  private get repoFolder(): string {
    return get(this.integration.iceModel.context.runtime, ['environmentVariables', 'iceRepoPath']);
  }

  private getQueryFileURL(): string {
    return this.getParam('queryFileURL');
  }

  private get fullQueryFilePath(): string {
    return path.resolve(this.repoFolder + '/' + this.getQueryFileURL());
  }
}
