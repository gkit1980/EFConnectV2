import * as express from 'express';
import forgetUsernameController from '../../controllers/forget-username.controller';

export class forgetUsernameRouter {

    public static getRoutes(app: express.Application): express.Router {
        let router = express.Router();
        router.post('/GetUserName', forgetUsernameController.GetUserName)
        return router;
    }
}
