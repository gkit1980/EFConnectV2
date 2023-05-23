import { fetchServicesFunction } from '../functions/fetchServices.function';

export default class changeEmailController {

    public static ChangeEmail = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('ChangeEmail',req.body,);
        res.send(response);
    }
    
    public static VerifyChangeEmailSMS = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifyChangeEmailSMS',req.body,);
        res.send(response);
    }

    public static VerifyChangeEmail = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifyChangeEmail',req.body,);
        res.send(response);
    }
    

}