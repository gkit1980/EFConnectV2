import axios from 'axios';

export async function fetchGroupServicesFunction(path: string, body: any) {

    let url;
    let headers;
    if (path === 'InsuredRegistration'){
        url = process.env.INSUREDREGISTRATION + body.RegistrationCode
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "ServicesVersion": "1",
            "CultureName": "GR",
            "TimeDiff": null
        }


        let response = await axios({
            url: url,
            method: 'get',
            headers: headers
        })
            .then((res: any) => {
                console.log("res", res);
                return {...res.data,Success:true,status:200};
            })
            .catch((error) => {
                console.log("catch error", error);
                let newError = error;
                if (error.response) {
                    newError = {
                        Success:false,
                        status: error.response.status,
                        statusText: error.response.statusText,
                        headers: error.response.headers,
                        data: error.response.data,
                        config: error.response.config
                    };
                }
                console.log(newError);
                console.log('That did not go well.')
              //  throw error;
                return newError;
            })
    
        return response;
      


    }else
    {
        url = process.env.INSURED
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "ServicesVersion": "1",
            "CultureName": "GR",
            "TimeDiff": null
        }
    
    let response = await axios({
        url: url,
        method: 'post',
        headers: headers,
        timeout:  360000,
        data: JSON.stringify(body)
    })
        .then((res: any) => {
            console.log("res", res);
            return {...res.data,Success:true,status:200};
        })
        .catch((error) => {
            console.log("catch error", error);
            let newError = error;
            if (error.response) {
                newError = {
                    Success:false,
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: error.response.data,
                    config: error.response.config
                };
            }
            console.log(newError);
            console.log('That did not go well.')
            // throw error;
            return newError;
        })

    return response;
    }
}