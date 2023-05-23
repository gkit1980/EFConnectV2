import { fetchServicesFunction } from '../functions/fetchServices.function';

export default class forgetUsernameController {

    public static GetUserName = async (req: any, res: any, next: any) => {
        let response = await fetchServicesFunction('GetUserName', req.body);
        res.send(response);
    }

}
