import { ExecutionRule } from "@impeo/ice-core";

export class ResetPolicyDetailsElementsRule extends ExecutionRule {


    async execute(): Promise<any> {

        this.iceModel.elements['policies.details.PolicyNumber'].reset(null);
        this.iceModel.elements['policies.details.ExpirationDate'].reset(null);
        this.iceModel.elements['policies.details.PartnerName'].reset(null);
        this.iceModel.elements['policies.details.PaymentFrequency'].reset(null);
        this.iceModel.elements['policies.details.title.ProductName'].reset(null);
        this.iceModel.elements['policies.details.StartDate'].reset(null);
        this.iceModel.elements['policies.details.Status'].reset(null);
        this.iceModel.elements['policies.details.InsuranceDuration'].reset(null);
        this.iceModel.elements['policies.details.ProductName'].reset(null);
        this.iceModel.elements['policies.details.PolicyNumberHeader'].reset(null);
        this.iceModel.elements['policy.coverages'].reset(null);
        this.iceModel.elements['policy.Endorsements'].reset(null);
        this.iceModel.elements['policy.details.printProposalPDFDocument'].reset(null);
        this.iceModel.elements['policy.beneficiaries'].reset(null);
        this.iceModel.elements['policy.fundsvaluation'].reset(null);
        this.iceModel.elements['policies.details.property.mortage.loaner'].reset(null);
        this.iceModel.elements['fundvaluation.execution'].reset(null);

        //Group Health

        this.iceModel.elements['policies.details.grouphealth.StartDate'].reset(null);
        this.iceModel.elements['policies.details.grouphealth.ExpirationDate'].reset(null);
        this.iceModel.elements['policies.details.grouphealth.InsuredLastName'].reset(null);
        this.iceModel.elements['policies.details.grouphealth.InsuredFirstName'].reset(null);









    }



}
