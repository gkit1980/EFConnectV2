import { IntegrationDataIn, IntegrationDataOut, ExchangeRule } from '@impeo/ice-core';
import { isString } from 'lodash';
import * as template from 'es6-template-strings';
import oracledb from 'oracledb';
//
//
export class InsisDBExchangeRule extends ExchangeRule {
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    const query = this.getQuery();
    const config = this.getConfig();
    const bindValues = this.getBindValues(request);

    const connection = await oracledb.getConnection(config);
    if (connection.oracleServerVersion < 1202000000) {
      throw new Error('These examples only work with Oracle Database 12.2 or greater');
    }

    const result = await connection.execute(query, bindValues);

    const queryType = this.getParam('queryType');

    const data = new IntegrationDataIn();
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

  protected getQuery(): string {
    const query = this.getParam('query');
    if (!query) return '';
    return query;
  }

  protected getBindValues(request: IntegrationDataOut) {
    return request.params;
  }

  getConfig() {
    return {
      user: this.getValueFromEnvironment(this.getParam('username')),
      password: this.getValueFromEnvironment(this.getParam('password')),
      connectString: this.getValueFromEnvironment(this.getParam('connectString'))
    };
  }

  private getValueFromEnvironment(value: string): string {
    if (!isString(value) || !value.startsWith('env:')) return value;
    return this.runtime.environmentVariables[value.replace('env:', '')];
  }
}
