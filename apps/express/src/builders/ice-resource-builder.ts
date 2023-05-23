import { YamlFileService } from '@impeo/exp-ice';

export class IceResourceBuilder {
    private yamlService: YamlFileService;
    constructor(repositoryPath: string) {
        this.yamlService = new YamlFileService(repositoryPath);
    }
    async buildResourceRecipe(): Promise<any> {
        return await this.yamlService.loadYaml('resources.yml')
    }
}
