import {
  IntegrationDataIn,
  IntegrationDataOut,
  ExchangeRule,
  IceIntegration,
} from '@impeo/ice-core';
import { YamlFileService } from '@impeo/exp-ice';
import { get, set } from 'lodash';
import * as path from 'path';

// This rule allow you to load JSON ot YML files located inside [repo]/data folder
//
export class InsisLoadYmlFileExchangeRule extends ExchangeRule {
  private yamlService: YamlFileService;

  constructor(
    protected integration: IceIntegration,
    protected recipe: any,
    public ruleName: string
  ) {
    super(integration, recipe, ruleName);
    this.yamlService = new YamlFileService(this.repoFolder);
  }

  //
  //
  async execute(requestData: IntegrationDataOut): Promise<IntegrationDataIn> {
    const dataFileName = this.dataFileURL;
    const data = new IntegrationDataIn();
    let ymlContent: any;

    const extension: string = path.extname(dataFileName).split('.').pop().toLocaleUpperCase();

    if (!SUPPORTED_FILE_TYPES[extension]) {
      const errorMsg =
        'Unsupported file format! Rule supports only *.json or *.yml files. File:' + dataFileName;
      console.error(errorMsg);
      data.payload.error = { message: errorMsg };
      return data;
    }

    try {
      ymlContent = await this.yamlService.loadYaml(dataFileName);
    } catch (e) {
      console.error('Loading file failed:', dataFileName, 'Error:', e);
      data.payload.error = e;
      return data;
    }

    if (!ymlContent) console.error('No content loaded for file:', dataFileName);

    set(data.payload, this.payloadPath, ymlContent);

    return data;
  }

  private get repoFolder(): string {
    return get(this.integration.iceModel.context.runtime, ['environmentVariables', 'iceRepoPath']);
  }

  private get dataFileURL(): string {
    return `${this.getParam('dataFileURL')}`;
  }

  private get payloadPath(): string {
    return 'file';
  }
}

enum SUPPORTED_FILE_TYPES {
  JSON = 'json',
  YML = 'yml',
}
