import { ExecutionRule } from "@impeo/ice-core";

export class ResetModalElements extends ExecutionRule {


    async execute(): Promise<any> {

        //reset email
        this.iceModel.elements['changePasswordResult'].reset(null);
        this.iceModel.elements['customer.details.standarMsgEmail'].reset(null);
        this.iceModel.elements['customer.details.newEmail'].reset(null);
        this.iceModel.elements['customer.details.outputEmailErrors'].reset(null);
        this.iceModel.elements['customer.details.changeEmailButton'].reset(null);
        this.iceModel.elements['customer.details.afterEmailVerification'].reset(null);
        this.iceModel.elements['customer.details.insertCodeTimerEmail'].reset(null);
        this.iceModel.elements['customer.details.firstStepEmailErrors'].reset(null);

        //reset mobile
        this.iceModel.elements['customer.details.standarMsgMobilePhone'].reset(null);
        this.iceModel.elements['customer.details.finalMsgMobilePhone'].reset(null);
        this.iceModel.elements['customer.details.MobilePhoneI'].reset(null);
        this.iceModel.elements['customer.details.outputMobileErrors'].reset(null);
        this.iceModel.elements['customer.details.afterMobilePhoneVerification'].reset(null);
        this.iceModel.elements['customer.details.insertCodeTimer'].reset(null);



    }



}
