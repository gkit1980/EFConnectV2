const { GoogleAuth } = require('google-auth-library');
const constants = require("../constants/constants");

export class pushNotificationGoogle {

    public static CreateNewNotificationMessage = async(responseObject:any, query:any, classId:string): Promise<any>  => {
    
       try {

        // var secret = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwt0Sz1RLfkCTR\nVGpTR7LObsqHncd5s9hrn2j1myxZtdK+6d7whqPsf5ueDEECwoUxfcwVMxoHBhth\nqMpuFHcFff+ZsZFM5Lb4Qs4SbHvx1wq7SWVjZLxO4ozgMyYV7I5Hhz0qTA37Fm5z\ntG3PqaTEPDM+s5B9DLdExPK4ZSU057GOtz0rjJj/pv6Vj6yL4aREaQWcMA7qoy8E\nngE74YntyaBsDaEKej7s7XrcCHQ8TvrJOGz5Y6CT8QMYFLF//bEBHOK2yXblW6Fj\nAVlKrdxTzR1xsbH8gnO6ZzdkrEpaxIAZOZKbt6Av7lWAnL0+Ybn2t/3N4KGHMeIA\nQXHACDdfAgMBAAECggEAAvDBvWZNvpeU7UDE1ibqxEGWsCQBdjZ2YvAPnIqc9c8v\nNwsIMSNkZeKHsd0NVeDru3OW6kFj7Pr+iKT43VUM1/QNRT7tpoRlwQLHkAnrFA6a\neJxTihBai8t8QZzIRPQfN/R5oZMLZoKsitNVQm/VtIg16BSv0kzcXdITIdtY/6TW\nPPGCBafVmACAhlbX/PFYfOndZQGEdvx40d3o7WCLd0pQcXR1z8wZbjbtxELjK/hp\nSwPciuO0Jn3HZ7Iu9YJhWEevvN7WJwAG5pIkqDRwUwkJr0dMLelB2AXyFHUcGBJp\neBa8owV9PCJFRUvIugCwTKBMVCjjlLWWTteuS8VuBQKBgQDVX7/qk0GiTTk1Hw+H\n1/THAU7b5KjmJPK/tdOOof8y0DZj03IquceX1K888TL31Pk390cltxMvZGsspd/3\nY4HCGGfv8DBmmMMdbFQxGhe01CQgC5Odx9Ix4QcHR8KvaI4UL1PrFm96jJZqkfl9\nB59VwLZj+zkfvusPMX5DG6qQtQKBgQDUBMUX3iqCTA2mDVyATqrqHN8qzbuiQcWb\nttnBSz91FeE84pPjLlPCIpr5cRPUPDzuvIslg0iRiTc4HCXInu2WuJMjtXGAjOBf\nq8eDbXuewpj5kY0gt1gqErSO2/VUtjs5cPM3mXDvJWVwQdhq3zc6d9UCEFf8aygv\nFTEDz4H4QwKBgEUUxOvLVTqYyea68apHbsZnVAK5Wz13xOfwlFffduIaqyFSuem/\nUDGF+F5AsQGwACfwdSZuyVVUq6Y+5e4QV1hh0nTKTMFKwBDsm61yBy7SaAe/98Dj\nitf/ROlEgHGN5kH+uKqqDtmcXq6OKDokl5+JzwM7uNjgVPYMThaoBGbpAoGABnra\n1z7oB7FxXVjdMeK1oJAfVfyRtoTSGE8/WoQFPXvctXKrWG8rCizqlaMaGwt4RUen\n7Q6VIjWSZXmewgHxewDLJnU+MdKcbPAgGek3tQN3j3EeYhiYbjjCIfehCOTE7J2C\nIXnkFLsM3aB1j9agpn3RGc4MEl/oC4BXTimCbGcCgYA+A0lpyFiwLiyTHqpKzjLY\nV6vfCoAaD4yP2IvK1EcRxxir5bqvfGC8/HBnIfm1QrD03ttQ53MRhBhsIZjoBXml\niSIt542IvJM8cEA6WEJF1O/PHMrySKQR9GI/ZWjMFA2rNcP0cS4OB2KsE/U1YBKC\nKgC6k07PC63NZw5aO3HVeQ==\n-----END PRIVATE KEY-----\n";
        // // AUTH
        // const authOptions = {
        //     credentials: {
        //     client_email: 'wallet@eurolifeconnect.iam.gserviceaccount.com',
        //     private_key: secret,
        //     },
        //     scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
        // };

        // const auth = new GoogleAuth(authOptions);
        // let clientPromise = await auth.getClient();
        var newUpdateMessage = "";
        try {
            // const responseObject = await clientPromise.request({
            //     url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/' + classId + "_" + query.ContractKey.toString()+"_"+ query.ContractIDType + "_" + query.GoldenRecordId,
            //     method: 'GET'
            // });
            if(responseObject){
                if(responseObject.status == 200){


                    var statusDescription = "Ανενεργό";
                    if (query.Status == constants.STATUS_ACTIVE ||
                    query.Status == constants.STATUS_REINSTATE ||
                    query.Status == constants.STATUS_PARTIAL_SURRENDER_UL ||
                    query.Status == constants.STATUS_CHANGE_INVESTMENT_PLAN ||
                    query.Status == constants.STATUS_PARTIAL_SURRENDER ) {
                        statusDescription = "Ενεργό";
                    }
                    if (statusDescription == "Ενεργό" && query.paymentStatus === "Ανεξόφλητο") {
                        if(query.Branch != constants.BRANCH_MOTOR){
                            let currentDate = new Date();
                            let renewsContract= query.NextPaymentDate;
                            let renewsContractArray = renewsContract.split("/");
                            let renewsContractDate= new Date(renewsContractArray[2],renewsContractArray[1]-1,renewsContractArray[0]); 
                        if(currentDate> renewsContractDate){
                            statusDescription = "Ανεξόφλητο";
                        }
                        }else{
                        statusDescription = "Ανεξόφλητο";
                        }
                    }
                    if(responseObject.data.secondaryLoyaltyPoints.balance.string == "Ενεργό" &&  statusDescription == "Ανεξόφλητο"){
                        newUpdateMessage = "Κατάσταση συμβολαίου Ανεξόφλητο";
                    }else if((responseObject.data.secondaryLoyaltyPoints.balance.string == "Ανεξόφλητο" || responseObject.data.secondaryLoyaltyPoints.balance.string == "Ενεργό") &&  query.Status == "Ανενεργό"){
                        newUpdateMessage = "Κατάσταση συμβολαίου Ανενεργό";
                    }else if((responseObject.data.secondaryLoyaltyPoints.balance.string == "Ανεξόφλητο" || responseObject.data.secondaryLoyaltyPoints.balance.string == "Ανενεργό") &&  ((query.Status == "Ενεργό" || query.Status == "Εν Ισχύ") && statusDescription != "Ανεξόφλητο")){
                        newUpdateMessage = "Κατάσταση συμβολαίου Ενεργό";
                    }else if((responseObject.data.secondaryLoyaltyPoints.balance.string == "Ανεξόφλητο" || responseObject.data.secondaryLoyaltyPoints.balance.string == "Ανενεργό") &&  ((query.Status == "Ενεργό" || query.Status == "Εν Ισχύ") && statusDescription == "Ανεξόφλητο")){
                        newUpdateMessage = "Κατάσταση συμβολαίου Ανεξόφλητο";
                    }
                    
                    if(query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) != "99"){
                        let expirationDate = responseObject.data.secondaryLoyaltyPoints.label.split("Έως ")[1]; 
                        if(expirationDate != query.NextPaymentDate){
                            if(newUpdateMessage == ""){
                                newUpdateMessage = "Το συμβόλαιο σου έχει ανανεωθεί έως " + query.NextPaymentDate
                            }else{
                                newUpdateMessage = newUpdateMessage + "\n" + "Το συμβόλαιο σου έχει ανανεωθεί έως " + query.NextPaymentDate
                            } 
                        }
                    }

                    if(query.remainAmount != "" && query.remainAmount != undefined){
                            responseObject.data.textModulesData.forEach((field: any) => {
                                if(field.header.indexOf("Ανάλωσης")>-1){
                                    let amount = Intl.NumberFormat('EUR').format(query.remainAmount);
                                    let amountFixed = amount.replace(/[,.]/g, m => (m === ',' ? '.' : ','))
                                    if(field.body.split(" ")[1] != amountFixed){
                                        let valueFormatted = '€ ' + amountFixed;
                                        if(newUpdateMessage == ""){
                                            newUpdateMessage = "Το νέο διαθέσιμο ποσό είναι " + valueFormatted
                                        }else{
                                            newUpdateMessage = newUpdateMessage + "\n" + "Το νέο διαθέσιμο ποσό είναι " + valueFormatted
                                        }
                                    }
                                }
                            });
                    }

                    var passParticipants = JSON.parse(query.participants);
                    var dependentMembers: any[]=[];
                    for (let i = 0; i < passParticipants.length; i++) {
                        if (passParticipants[i].Relationship === constants.PARTICIPANTS_CHILD_CAPITAL 
                        || passParticipants[i].Relationship === constants.PARTICIPANTS_PARTNER_CAPITAL
                        || passParticipants[i].Relationship === constants.PARTICIPANTS_CHILD_LOWERCASE
                        || passParticipants[i].Relationship === constants.PARTICIPANTS_PARTNER_LOWERCASE){
                            dependentMembers.push(passParticipants[i]);
                        }
                    }
                    if (query.ContractIDType.substr(query.ContractIDType.indexOf('_') + 1) === "99" || query.Branch === "ΥΓΕΙΑΣ" && dependentMembers.length >= 1) {

                        responseObject.data.textModulesData.forEach((field: any) => {
                        if(field.body){
                            if(field.body.indexOf("Ανάλωσης:")>-1){
                                for (let z = 0; z < dependentMembers.length; z++) {
                                    var oldDateFormat = new Date(dependentMembers[z].BirthDate);
                                    var dd = oldDateFormat.getDate();
                                    var mm = oldDateFormat.getMonth() + 1;
                                    var yyyy = oldDateFormat.getFullYear();
                                    var birthDate = dd + "/" + mm + "/" + yyyy;
                                    if(dependentMembers[z].remainAmount != undefined){
                                        let amount = Intl.NumberFormat('EUR').format(dependentMembers[z].remainAmount);
                                        let amountFixed = amount.replace(/[,.]/g, m => (m === ',' ? '.' : ','))
                                        let newAmount = '€ ' + amountFixed;
                                        let oldAmount = field.body.split("Ανάλωσης: ")[1];
                                        oldAmount = oldAmount.split("\n")[0];
                                        if(birthDate == field.body.split("Γεννήσεως: ")[1] && newAmount != oldAmount){
                                            if(newUpdateMessage == ""){
                                                newUpdateMessage = dependentMembers[z].LastName + " " + dependentMembers[z].FirstName + ": Το νέο διαθέσιμο ποσό είναι " + newAmount
                                            }else{
                                                newUpdateMessage = newUpdateMessage + "\n" + dependentMembers[z].LastName + " " + dependentMembers[z].FirstName + ": Το νέο διαθέσιμο ποσό είναι " + newAmount
                                            }
                                        } 
                                    }
                                }
                            }
                        }})
                    }

                }
            
            
                if(responseObject.data.messages){
                    responseObject.data.messages.forEach((field: any) => {
                        if(field.header == "Τελευταία Ενημέρωση"){
                            if(field.body && newUpdateMessage == ""){
                                newUpdateMessage = field.body;
                            }
                        }
                    })
                }
            }
            
            //release memory
            statusDescription = query = passParticipants = dependentMembers = null;

            return newUpdateMessage;
        }catch(error){
            //release memory
            newUpdateMessage = statusDescription = query = passParticipants = dependentMembers = null;
            console.log(error)
        }
       }catch(error){
        //release memory
        newUpdateMessage = statusDescription = query = passParticipants = dependentMembers = null;
        console.log(error)
       }
    }
}