import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { async } from 'q';
export default class signinController {

    public static Login = async (req: any, res: any, next: any) => {

        let email: string = (req.body.username).replace(/\s/g, "+");
        let psw: string = (req.body.password).replace(/\s/g, "+");

        let dectyptedEmail = CryptoJS.AES.decrypt(email, "ice_username").toString(CryptoJS.enc.Utf8);
        let decryptedPsw = CryptoJS.AES.decrypt(psw, "ice_password").toString(CryptoJS.enc.Utf8);


        let url = process.env.BASEURLLOGIN + `&username=${encodeURIComponent(dectyptedEmail)}&password=${encodeURIComponent(decryptedPsw)}`;
        //console.info("Login url:"+url);  //Dev environment purpose
        let response = await axios({
            url: url,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((res: any) => {
                return res.data;
            })
            .catch((error) => {
                let newError = {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: error.response.data,
                    config: error.response.config
                }
                return newError;
            })
        if (response.status) {
            res.status(response.status).send(response)
        }
        res.send(response)
    }


    public static getTokenFromRefreshToken = async (req: any, res: any, next: any) => {

        let token: string = req.body.data.token;

        let decryptedToken = CryptoJS.AES.decrypt(token, "ice_token").toString(CryptoJS.enc.Utf8);

        let url = process.env.BASEURLLOGIN + `&refresh_token=${decryptedToken}`;

        let response = await axios({
            url: url,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((res: any) => {
                return res.data;
            })
            .catch((error) => {
                let newError = {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: error.response.data,
                    config: error.response.config
                }
                return newError;
            })
        if (response.status) {
            res.status(response.status).send(response)
        }
        res.send(response)
    }

}