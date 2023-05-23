require('dotenv').config();
var _ = require('lodash');
var axios = require('axios').default;
const constants = require("../constants/constants");

export class UpdateGoldenRecordService {

    public static async updateGoldenRecord(goldenRecordId: string) {
        let uri = process.env.LOGIC_APP_URL;
        let data: object;
        let goldenRecordIDSplit: string[];
        let processedGoldenRecordId: string;

        if (goldenRecordId.toString().split("_")[1]) {
            goldenRecordIDSplit = goldenRecordId.toString().split("_");
            processedGoldenRecordId = goldenRecordIDSplit[0];
        } else {
            processedGoldenRecordId = goldenRecordId;
        }

        data = {
            "GoldenRecord": processedGoldenRecordId
        };
        // TODO: Remove before deployment to production
        console.log(`updateGoldenRecordId post request:`);
        console.log(data);

        let response = await axios.default({
            url: uri,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            data: data
        })
            .then((res: any) => {
                return res.data;
            })
            .catch((error: any) => {
                let newError = {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: error.response.data,
                    config: error.response.config
                }
                return newError;
            })
        return response;
    }
}