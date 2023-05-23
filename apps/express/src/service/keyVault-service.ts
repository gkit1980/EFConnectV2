import { CertificateClient, DefaultCertificatePolicy, UpdateCertificateOptions, CertificatePolicy } from "@azure/keyvault-certificates";
import { ChainedTokenCredential, ClientSecretCredential, DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
var axios = require('axios');
var FormData = require('form-data');
var data = new FormData();
require('dotenv').config();

export class KeyVaultService {

    private url: string;
    private AZURE_CLIENT_ID: string;
    private AZURE_CLIENT_SECRET: string;
    private AZURE_TENANT_ID: string;
    private credential: any;
    private secretClient: any;


    private file_1: string;
    private filename_1:string;

    private file_2: string;
    private filename_2:string;


    private keysPath:string;

    public constructor() {
        this.url = process.env.WALLET_KEY_VAULT_URI;
        this.AZURE_CLIENT_ID = process.env.WALLET_AZURE_CLIENT_ID;
        this.AZURE_CLIENT_SECRET = process.env.WALLET_AZURE_CLIENT_SECRET;
        this.AZURE_TENANT_ID = process.env.WALLET_AZURE_TENANT_ID;
        const firstCredential = new ClientSecretCredential(this.AZURE_TENANT_ID, this.AZURE_CLIENT_ID, this.AZURE_CLIENT_SECRET);
        // const secondCredential = new ClientSecretCredential(tenantId, anotherClientId, anotherSecret);
        const credentialChain = new ChainedTokenCredential(firstCredential);
        this.credential = new DefaultAzureCredential();
        this.secretClient = new SecretClient(this.url, credentialChain);

    }

    public getSecret = async (secretName: string) => {
        const secret = await this.secretClient.getSecret(secretName);

        return secret.value;
    }

    public static getCertificateSecret = async (certificateName: string) => {
        // const certificateSecretClient = new CertificateClient(KeyVaultService.url, certificateName);
        // const certificateSecret = await certificateSecretClient.getSecret(certificateName);
        // const PEMPair = certificateSecret.value!;
        // console.log("updatedCertificate certificate's policy:", PEMPair);
    }
}
