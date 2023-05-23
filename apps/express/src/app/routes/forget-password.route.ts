import * as express from 'express';
import forgetPasswordController from '../../controllers/forget-password.controller';

export class forgetPasswordRouter {

    public static getRoutes(app: express.Application): express.Router {
        let router = express.Router();
        router.post('/ForgetPassword', forgetPasswordController.ForgetPassword)
        router.post('/VerifyForgetPassword', forgetPasswordController.VerifyForgetPassword)
        return router;
    }
}
