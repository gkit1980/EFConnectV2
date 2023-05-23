import * as express from 'express';
import QRCheckController from '../../controllers/qrcheck.controller';

export class QRCheckRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();

		router.get('/:contractIDType/:golderRecordId', QRCheckController.qrcheck);

		return router;
	}

}
