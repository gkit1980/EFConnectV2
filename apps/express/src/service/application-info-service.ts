import * as express from 'express';
import * as path from 'path';
import * as fs from 'async-file';

export class ApplicationInfoService {
	private static buildVersionFile = 'build.json';

	constructor(private app: express.Application) { }

	getVersion(): Promise<any> {
		let pathToBuildFile = path.resolve(this.app.locals.applicationRoot, ApplicationInfoService.buildVersionFile);

		return new Promise<any>((resolve, reject) => {
			fs.readFile(pathToBuildFile, 'utf8').then(data => {
				resolve(JSON.parse(data));
			}).catch(error => {
				resolve({ DefinitionName: "na", SourceBranch: "na", BuildNumber: "DEV" });
			});
		});
	}
}