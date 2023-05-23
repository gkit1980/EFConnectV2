import axios from 'axios';

export async function fetchServicesFunction(path: string, body: any) {

    let url;
    let headers;
    if (path === 'SendOTP' || path === 'VerifyOTP'){
        url = process.env.BASEURLAMENDMENTSOTP + path
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "ServicesVersion": "1",
            "CultureName": "GR",
            "TimeDiff": null
        }
    }else{
        url = process.env.BASEURLSIGNUP + path
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
    let response = await axios({
        url: url,
        method: 'post',
        headers: headers,
        data: JSON.stringify(body)
    })
        .then((res: any) => {
            return res.data;
        })
        .catch((error) => {
            let newError = error;
            if (error.response) {
                newError = {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: error.response.data,
                    config: error.response.config
                };
            }
            console.log(newError);
            return newError;
        })

    return response;
}