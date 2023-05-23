import { Request, Response } from 'express';
const { GoogleAuth } = require('google-auth-library');
import { KJUR } from "jsrsasign";
var _ = require('lodash');
var CryptoJS = require("crypto-js");


interface Update {
  update: boolean;
}
export default class googleUpdateController {

  public static GooglePassUpdate = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {
     const {
      encryptedPayload,
      } = req.body;

      var encryptedQuery = decodeURIComponent(encryptedPayload.toString());
      var bytes = CryptoJS.AES.decrypt(encryptedQuery.toString(), 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW');
      var query = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


      var secret = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwt0Sz1RLfkCTR\nVGpTR7LObsqHncd5s9hrn2j1myxZtdK+6d7whqPsf5ueDEECwoUxfcwVMxoHBhth\nqMpuFHcFff+ZsZFM5Lb4Qs4SbHvx1wq7SWVjZLxO4ozgMyYV7I5Hhz0qTA37Fm5z\ntG3PqaTEPDM+s5B9DLdExPK4ZSU057GOtz0rjJj/pv6Vj6yL4aREaQWcMA7qoy8E\nngE74YntyaBsDaEKej7s7XrcCHQ8TvrJOGz5Y6CT8QMYFLF//bEBHOK2yXblW6Fj\nAVlKrdxTzR1xsbH8gnO6ZzdkrEpaxIAZOZKbt6Av7lWAnL0+Ybn2t/3N4KGHMeIA\nQXHACDdfAgMBAAECggEAAvDBvWZNvpeU7UDE1ibqxEGWsCQBdjZ2YvAPnIqc9c8v\nNwsIMSNkZeKHsd0NVeDru3OW6kFj7Pr+iKT43VUM1/QNRT7tpoRlwQLHkAnrFA6a\neJxTihBai8t8QZzIRPQfN/R5oZMLZoKsitNVQm/VtIg16BSv0kzcXdITIdtY/6TW\nPPGCBafVmACAhlbX/PFYfOndZQGEdvx40d3o7WCLd0pQcXR1z8wZbjbtxELjK/hp\nSwPciuO0Jn3HZ7Iu9YJhWEevvN7WJwAG5pIkqDRwUwkJr0dMLelB2AXyFHUcGBJp\neBa8owV9PCJFRUvIugCwTKBMVCjjlLWWTteuS8VuBQKBgQDVX7/qk0GiTTk1Hw+H\n1/THAU7b5KjmJPK/tdOOof8y0DZj03IquceX1K888TL31Pk390cltxMvZGsspd/3\nY4HCGGfv8DBmmMMdbFQxGhe01CQgC5Odx9Ix4QcHR8KvaI4UL1PrFm96jJZqkfl9\nB59VwLZj+zkfvusPMX5DG6qQtQKBgQDUBMUX3iqCTA2mDVyATqrqHN8qzbuiQcWb\nttnBSz91FeE84pPjLlPCIpr5cRPUPDzuvIslg0iRiTc4HCXInu2WuJMjtXGAjOBf\nq8eDbXuewpj5kY0gt1gqErSO2/VUtjs5cPM3mXDvJWVwQdhq3zc6d9UCEFf8aygv\nFTEDz4H4QwKBgEUUxOvLVTqYyea68apHbsZnVAK5Wz13xOfwlFffduIaqyFSuem/\nUDGF+F5AsQGwACfwdSZuyVVUq6Y+5e4QV1hh0nTKTMFKwBDsm61yBy7SaAe/98Dj\nitf/ROlEgHGN5kH+uKqqDtmcXq6OKDokl5+JzwM7uNjgVPYMThaoBGbpAoGABnra\n1z7oB7FxXVjdMeK1oJAfVfyRtoTSGE8/WoQFPXvctXKrWG8rCizqlaMaGwt4RUen\n7Q6VIjWSZXmewgHxewDLJnU+MdKcbPAgGek3tQN3j3EeYhiYbjjCIfehCOTE7J2C\nIXnkFLsM3aB1j9agpn3RGc4MEl/oC4BXTimCbGcCgYA+A0lpyFiwLiyTHqpKzjLY\nV6vfCoAaD4yP2IvK1EcRxxir5bqvfGC8/HBnIfm1QrD03ttQ53MRhBhsIZjoBXml\niSIt542IvJM8cEA6WEJF1O/PHMrySKQR9GI/ZWjMFA2rNcP0cS4OB2KsE/U1YBKC\nKgC6k07PC63NZw5aO3HVeQ==\n-----END PRIVATE KEY-----\n";
      // AUTH
      const authOptions = {
        credentials: {
          client_email: 'wallet@eurolifeconnect.iam.gserviceaccount.com',
          private_key: secret,
        },
        scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
      };

      const auth = new GoogleAuth(authOptions);
      let clientPromise = await auth.getClient();

      try {
          const respGetObject2 = await clientPromise.request({
              url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + query.payload.payload.loyaltyObjects[0].id,
              method: 'GET'
          });
          if(respGetObject2.status == 200){
            const respUpdate = await clientPromise.request({
              url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + query.payload.payload.loyaltyObjects[0].id,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              method: 'PUT',
              body: JSON.stringify(query.payload.payload.loyaltyObjects[0])
            });
            _.set(query.payload, "payload.loyaltyObjects[0]", respUpdate.data);        
            console.error("update pass: " + query.payload.payload.loyaltyObjects[0].id);

            //notification message
            var messageΤ = {
              "message": {
                "header": "Τελευταία Ενημέρωση",
                "body": query.newNotification,
              //   "displayInterval": {
              //         "start": {
              //           "date": StartDate.toISOString()
              //    },
              //         "end": {
              //           "date": EndDate.toISOString()
              //    }
              // },
                "id": query.payload.payload.loyaltyObjects[0].id,
                "messageType": "TEXT",
              }
            }

            try {
                const addMessage = await clientPromise.request({
                  url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + query.payload.payload.loyaltyObjects[0].id + "/addMessage",
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  method: 'POST',
                  body: JSON.stringify(messageΤ)
                });
                console.log("notification message id: "+  query.payload.payload.loyaltyObjects[0].id)

              }catch (error) {
                  console.log("Pass with contract key: "+ query.payload.payload.loyaltyObjects[0].id + " not notification message")
              }
          }
        }
      catch (er) {
            console.log("Pass with id: "+ query.payload.payload.loyaltyObjects[0].id + " Not Found")
      }
    

      const update: Update = {
        update: true,
      };

      //release memory
      encryptedQuery = bytes = query = secret = clientPromise = messageΤ = null;
      //Total Memory size
      console.log(`Save/Update google pass`);
      const used = process.memoryUsage();
      for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
      }
      res.status(200).json(update);
    }

    catch (error) {
      //release memory
      encryptedQuery = bytes = query = secret = messageΤ = null;
      console.error(error);
      res.status(500).send(error);
    }
  };
}