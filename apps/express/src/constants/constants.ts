module.exports = Object.freeze({
    // Contract Status
    STATUS_ACTIVE: 'Εν Ισχύ',
    STATUS_REINSTATE: 'Επαναφορά',
    STATUS_PARTIAL_SURRENDER_UL: 'Μερική Εξαγορά Μεριδίων Α/Κ',
    STATUS_CHANGE_INVESTMENT_PLAN:'Αλλαγή επενδυτικού σεναρίου',
    STATUS_PARTIAL_SURRENDER: 'Μερική Εξαγορά',
   
    // Customer's Relationship
    POLICY_HOLDER:'ΣΥΜΒΑΛΟΜΕΝΟΣ',
    POLICY_HOLDER_CORRECT: 'ΣΥΜΒΑΛΛΟΜΕΝΟΣ',
    INSURED_POLICY_HOLDER:'ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΟΜΕΝΟΣ',
    INSURED_POLICY_HOLDER_CORRECT:'ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ',
    INSURED: 'ΑΣΦΑΛΙΣΜΕΝΟΣ',

    // Participants' relationship
    PARTICIPANTS_CHILD_CAPITAL: 'ΤΕΚΝΟ',
    PARTICIPANTS_PARTNER_CAPITAL: 'ΣΥΖΥΓΟΣ',
    PARTICIPANTS_CHILD_LOWERCASE: 'Τέκνο',
    PARTICIPANTS_PARTNER_LOWERCASE: 'Σύζυγος',

    // Branch Description
    BRANCH_MOTOR:'ΑΥΤΟΚΙΝΗΤΩΝ',
    BRANCH_LIFE: 'ΖΩΗΣ',
    BRANCH_PROPERTY: 'ΠΕΡΙΟΥΣΙΑΣ',
    BRANCH_HEALTH: 'ΥΓΕΙΑΣ',
    BRANCH_INVESTMENT: 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ',

    // Branch ID
    BRANCH_INDIVIDUALS_ID:'1',
    BRANCH_PENSION_ID:'2',
    BRANCH_MORTGAGE_ID:'3',
    BRANCH_HEALTH_ID:'4',
    BRANCH_LIFEHEALTH_ID:'5',
    BRANCH_DEATH_ID:'6',
    BRANCH_CONSUMER_ID:'7',
    BRANCH_MOTOR_ID:'8',
    BRANCH_ACCIDENT_ID:'9',
    BRANCH_CARGO_ID:'10',
    BRANCH_CARGOPRUD_ID:'11',
    BRANCH_PRUD_ID:'12',
    BRANCH_FIREPRUD_ID:'13',
    BRANCH_PROPERTY_ID: '14',
    BRANCH_GROUPHEALTH_ID: '99',

     // Branch Service Details
     BRANCH_INDIVIDUALS_SERVICE: '/GetContractIndividualDetails',
     BRANCH_PENSION_SERVICE: '/GetPensionContractDetails',
     BRANCH_MORTGAGE_SERVICE: '/GetContractMortgageDetails',
     BRANCH_HEALTH_SERVICE: '/GetHealthContractDetails',
     BRANCH_LIFEHEALTH_SERVICE: '/GetLifeHealthContractDetails',
     BRANCH_DEATH_SERVICE: '/GetContractDeathDetails',
     BRANCH_CONSUMER_SERVICE: '/GetContractConsumerDetails',
     BRANCH_MOTOR_SERVICE: '/GetContractMotorDetails',
     BRANCH_ACCIDENT_SERVICE: '/GetContractAccidentDetails',
     BRANCH_CARGO_SERVICE: '/GetContractCargoDetails',
     BRANCH_CARGOPRUD_SERVICE: '/GetContractCargoPrudDetails',
     BRANCH_PRUD_SERVICE: '/GetContractDetailsPrudDetails',
     BRANCH_FIREPRUD_SERVICE: '/GetContractFirePrudDetails',
     BRANCH_PROPERTY_SERVICE: '/GetContractPropertyCoolgenDetails',
     BRANCH_GROUPHEALTH_SERVICE: '/GetContractGroupHealthDetails',

    //  GOOGLE Wallet Constants
    GOOGLE_MOTOR_CLASS_ID: '3388000000022101367.eurolife-motor',
    GOOGLE_PROPERTY_CLASS_ID: '3388000000022101367.eurolife-property',
    GOOGLE_GROUPHEALTH_CLASS_ID: '3388000000022101367.eurolife-healthGroup',
    GOOGLE_LIFE_CLASS_ID: '3388000000022101367.eurolife-life',
    GOOGLE_HEALTH_CLASS_ID: '3388000000022101367.eurolife-health',
    GOOGLE_INVESTMENT_CLASS_ID: '3388000000022101367.eurolife-savings',
    // GOOGLE_PASS_LOYALTY_ID: '3388000000022101367.eurolife-pass-loyalty',
});