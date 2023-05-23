import { fetchServicesFunction } from '../functions/fetchServices.function';

export default class changePasswordController {

    public static ChangePassword = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('ChangePassword',req.body,);
        res.send(response);
    }
    
}