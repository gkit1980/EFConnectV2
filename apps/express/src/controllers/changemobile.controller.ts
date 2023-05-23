import { fetchServicesFunction } from '../functions/fetchServices.function';

export default class changeMobileController {

    public static ChangeMobile = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('ChangeMobile',req.body,);
        res.send(response);
    }

    public static VerifyChangeMobile = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifyChangeMobile',req.body,);
        res.send(response);
    }

}