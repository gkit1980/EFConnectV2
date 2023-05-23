import { fetchServicesFunction } from '../functions/fetchServices.function';

export default class optOutController {

    public static OptOut = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('OptOut',req.body,);
        res.send(response);
    }

}