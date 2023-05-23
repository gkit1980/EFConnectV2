
export default class errorLogController {

    public static writeLog = async (req: any, res: any, next: any) => {
        let errorMessage = req.body.message;
        let errorLocation = req.body.location;
        let errorTime = req.body.time;
        let errorData = {
            "Message" : errorMessage,
            "locationUrl" : errorLocation,
            "time" : errorTime
        }
        console.log("Client Error-Logger caught this error: ", errorData);
        res.status(200).send("error successfully logged");
    }



}
