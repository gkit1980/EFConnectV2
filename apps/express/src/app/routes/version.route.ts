import * as express from 'express';
import * as winston from 'winston';
import { APIError } from '@impeo/exp-ice';

import { ApplicationInfoService } from '../../service/application-info-service';

export class VersionRoute {
	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();

		let applicationService = new ApplicationInfoService(app);
		router.route('/').get((request, response) => {
			applicationService.getVersion().then((version: any) => {
				response.send( { success: true, data: version } );
			}).catch( ( error: any ) => {
				let apiError = APIError.fromError( error );
				winston.loggers.get('application').error( "Error while executing service call", apiError );
				response.status( apiError.status ).send( apiError );
			} );
		});

		return router;
	}
}
