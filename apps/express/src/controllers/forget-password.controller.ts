import { fetchServicesFunction } from '../functions/fetchServices.function';

export default class forgetPasswordController {

    public static ForgetPassword = async (req: any, res: any, next: any) => {
        console.log('Forgot password error logger request body', req.body)
        let response = await fetchServicesFunction('ForgetPassword', req.body);
        try {
        if (response.Errors[0].ErrorCode === 5){
            let errorArray: any = [];
            let emptyHeader: any = null;
            let newResponse = {
                Success: true,
                Errors: errorArray,
                Header: emptyHeader
              } 
              console.log('Forgot password error logger response ', newResponse)     
              res.send(newResponse)
        }
        } catch {
            console.log('Forgot password error logger response ', response) 
            res.send(response);
        }
        console.log('Forgot password error logger response ', response) 
        res.send(response);
    }

    public static VerifyForgetPassword = async (req: any, res: any, next: any) => {
        console.log('Verify Forgot password error logger request body', req.body)
        let response = await fetchServicesFunction('VerifyForgetPassword', req.body);
        console.log('Verify Forgot password error logger response', response)
        res.send(response);
    }

}
