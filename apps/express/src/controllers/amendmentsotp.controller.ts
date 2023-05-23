import { fetchServicesFunction } from '../functions/fetchServices.function';

export default class amendmentsOtpController {

    public static SendOTP = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('SendOTP',req.body,);
        res.send(response);
    }
    
    public static VerifyOTP = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifyOTP',req.body,);
        res.send(response);
    }

}