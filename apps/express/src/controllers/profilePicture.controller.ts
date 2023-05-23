import { fetchServicesFunction } from '../functions/fetchServices.function';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';

export default class profilePictureController {

    public static uploadPhoto = async (req: any, res: any, next: any) => {
        let email = req.body.postData.data.Email;
        let photo = req.body.postData.data.Photo;

        let decryptedEmail = CryptoJS.AES.decrypt(email, "ice_email").toString(CryptoJS.enc.Utf8);
        let decryptedPhoto = CryptoJS.AES.decrypt(photo, "ice_photo").toString(CryptoJS.enc.Utf8);


        let url = process.env.BASEURLSIGNUP + "UploadPhoto";

        let response = await axios({
            url: url,
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "ServicesVersion": "1",
                "CultureName": "GR"
            }, data: {
                "Email": decryptedEmail,
                "Photo": decryptedPhoto
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
         

        //Memory release
        email=photo=decryptedEmail=decryptedPhoto=null;

        if (response.status) {
            res.status(response.status).send(response)
        }
        res.send(response)
    }

    public static getPhoto = async (req: any, res: any, next: any) => {
        let email = req.body.postData.data.Email;

        let decryptedEmail = CryptoJS.AES.decrypt(email, "ice_email").toString(CryptoJS.enc.Utf8);


        let url = process.env.BASEURLSIGNUP + "GetPhoto";

        let response = await axios({
            url: url,
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "ServicesVersion": "1",
                "CultureName": "GR"
            }, data: {
                "Email": decryptedEmail
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
