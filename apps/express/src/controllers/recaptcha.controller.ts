import axios from 'axios';

export default class recaptchaController {

    public static Recaptcha = async (req: any, res: any, next: any) =>{

        const params =
        "secret="+req.body.secret+"&" +
        "response=" + req.body.token
  
    //   return this.http.post('https://www.google.com/recaptcha/api/siteverify?' + params, '');

        let response = await axios({
            url: 'https://www.google.com/recaptcha/api/siteverify?' + params,
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

            res.send(response)
    }
}