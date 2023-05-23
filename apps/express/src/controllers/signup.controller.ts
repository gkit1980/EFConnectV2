import { fetchServicesFunction } from '../functions/fetchServices.function';
import { fetchGroupServicesFunction } from '../functions/fetchGroupServices.function';

export default class signupController {

    public static EmailExists = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('EmailExists',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static InitSignUp = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('InitSignUp',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static GetRegistrationCode = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('GetRegistrationCode',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static VerifyRegistrationCode = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifyRegistrationCode',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static VerifyMobile = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifyMobile',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static ReSendSMS = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('ReSendSMS',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static VerifySMS = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifySMS',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static VerifyEmail = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('VerifyEmail',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static CreateUser = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('CreateUser',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static IsValidRegistrationCode = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('IsValidRegistrationCode',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }
    
    
    
    //group flow new services

    public static InitSignUpGroup = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('InitSignUpGroup',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static UpdateUserGroup = async (req: any, res: any, next: any) =>{
        let response = await fetchServicesFunction('UpdateUserGroup',req.body);
        if ( response.status ){
            res.status(response.status).send(response)
        }
        res.send(response)
    }
    
    //---kivos services
    public static InsuredRegistration = async (req: any, res: any, next: any) =>{
        let response = await fetchGroupServicesFunction('InsuredRegistration',req.body);
        if ( response.status ){
            res.send(response)
        }
     
    }

    public static Insured = async (req: any, res: any, next: any) =>{
        let response = await fetchGroupServicesFunction('Insured',req.body);
        if ( response.status ){
            res.send(response);
        }
    }
}
