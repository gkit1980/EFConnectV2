import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";

export class WriteStaticDataToDatastoreExecutionRule extends ExecutionRule {
	async execute(): Promise<void> {
		let data = _.set(this.context.dataStore, this.recipe["datastorePath"], this.recipe["data"]);
	}
}
