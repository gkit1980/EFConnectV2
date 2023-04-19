import {
  IntegrationDataIn,
  IntegrationDataOut,
  ExchangeRule,
  IceIntegration,
} from '@impeo/ice-core';
import { YamlFileService } from '@impeo/exp-ice';
import { get, set } from 'lodash';

// This rule allow you to load JSON ot YML files located inside [repo]/data folder
//
export class InsisStaticJsonExchangeRule extends ExchangeRule {
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
    const dataFileName = this.dataFileName;
    const test = await this.yamlService.loadYaml(dataFileName);
    const data = new IntegrationDataIn();
    data.payload = set({}, 'static-data', test);
    return data;
  }

  private get repoFolder(): string {
    return get(this.integration.iceModel.context.runtime, ['environmentVariables', 'iceRepoPath']);
  }

  private get dataFileName(): string {
    return `data/${this.getParam('dataFileName')}`;
  }
}
