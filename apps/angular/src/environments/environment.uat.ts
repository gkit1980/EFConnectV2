// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  sitecore_baseurl: 'https://staging.eurolife.gr/sitecore/api/ssc/aggregate/content/Items',
  sitecore_apikey: '5B2903B2882A41B9BD91C9739A027F6E',
  sitecore_media: 'https://staging.eurolife.gr/~/media/',
  payment_baseurl: "https://esbtestna.eurolife.gr/index.aspx",
  baseurl: "https://uat-ca.eurolife.gr" ,
  decryption_code: 'eurolifeConnect_encrypt_pass_QWEAZXCDSFFGHYFEESW',
//  google_tracking_code: 'UA-16275934-8'
};