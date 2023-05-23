import * as express from 'express';
import errorLogController from '../../controllers/errorlog.controller';

export class errorLoggerRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
		router.post('/writelog', errorLogController.writeLog)

		return router;
	}
}
