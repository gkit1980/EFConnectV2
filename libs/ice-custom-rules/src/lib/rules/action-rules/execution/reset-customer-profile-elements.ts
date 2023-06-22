import { ExecutionRule } from "@impeo/ice-core";

export class ResetCustomerProfileRule extends ExecutionRule {


    async execute(): Promise<any> {

        let refreshStatus = + localStorage.getItem("reFreshStatus");
        if (refreshStatus != 0) {
            this.iceModel.elements['customer.details.BirthDate'].reset(null);
            this.iceModel.elements['customer.details.TaxCode'].reset(null);
            this.iceModel.elements['customer.details.Email'].reset(null);
            this.iceModel.elements['customer.details.FathersName'].reset(null);
            this.iceModel.elements['customer.details.FirstName'].reset(null);
            this.iceModel.elements['customer.details.LastName'].reset(null);
            this.iceModel.elements['customer.details.MobilePhone'].reset(null);
            this.iceModel.elements['customer.details.NationalID'].reset(null);
        }
    }
}
