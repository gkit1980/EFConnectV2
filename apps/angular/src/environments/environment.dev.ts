// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  sitecore_baseurl: 'https://scp.eurolife.gr/sitecore/api/ssc/aggregate/content/Items',
  sitecore_apikey: '5B2903B2882A41B9BD91C9739A027F6E',
  sitecore_media: 'https://scp.eurolife.gr/~/media/',
  payment_baseurl:  "https://epliromi.eurolife.gr/index.aspx",
  baseurl: "https://dev-ca.eurolife.gr",
  lwc_baseurl: ' https://myeurolife--qa.sandbox.lightning.force.com/',
  apexrest_baseurl: 'https://myeurolife--qa.sandbox.my.salesforce.com/services/apexrest',
  salesforce_ownerid: '00G7Y0000056OjPUAU',
  decryption_code: 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW',
};
