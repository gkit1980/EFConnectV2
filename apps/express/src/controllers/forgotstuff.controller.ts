import { fetchServicesFunction } from '../functions/fetchServices.function';

export default class forgotStuffController {

    public static ForgetPassword = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('ForgetPassword',req.body,);
        res.send(response);
    }

    public static VerifyForgetPassword = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifyForgetPassword',req.body,);
        res.send(response);
    }

    public static GetUserName = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('GetUserName',req.body,);
        res.send(response);
    }

}
