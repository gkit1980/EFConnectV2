 import * as express from 'express';

import { createHeloWorldRouter } from '../routes/hello-world';
import { CrossDeviceRouter } from '../routes/cross-device.router';
import { ExternalRoutes } from '../routes/external.route';
import { PublicRoutes } from '../routes/public.route';
import { VersionRoute } from '../routes/version.route';
import { ContractIDRoute } from '../routes/contractID.route';
import { signUpRouter } from '../routes/signup.route';
import { signInRouter } from '../routes/signin.route';
import { errorLoggerRouter } from '../routes/errorlogger.route';
import { forgetUsernameRouter } from '../routes/forget-username.route';
import { forgetPasswordRouter } from '../routes/forget-password.route';
import { profilePictureRouter } from '../routes/profilePicture.route';
import { recaptchaRouter } from '../routes/recaptcha.route';
import { amendmentsOtpRouter } from '../routes/amendmentsotp.route';
import { AppleWalletRouter } from '../routes/appleWallet.route';
import { QRCheckRouter } from '../routes/qrcheck.route';
import { oauth2AuthorizationRouter } from '../routes/oauth2-authorization.route';
import { WalletStatisticsRouter } from '../routes/walletStatistics.route';
import { WalletGooglePassesRouter } from '../routes/walletGooglePasses.route';
import { GetGooglePassRouter } from '../routes/getGooglePass.route';
import { ResourceRouter } from '../routes/resource.route';
import { SignupGroupRouter } from '../routes/signupGroupForm.route';
import { ContactFormRouter } from '../routes/contactForm.route';
import { MyRightsFormRouter } from '../routes/MyRightsForm.route';
import { amendmentsVerificationEmailRouter } from '../routes/amendmentsVerificationEmailRouter.route';
import { lightningOutEclaimsRouter } from '../routes/lightningout-eclaims.route';
import { googlePassUpdateRouter } from '../routes/google-passUpdate.route';
import { applePassRouter } from '../routes/applePass.route';
import { ExpressApplication } from '../express-application';
import { ExpressApplicationOptions } from '../express-application-options';

export function configureRoutes(app: express.Application,appOptions:ExpressApplicationOptions) {
  // const prefix = '/api/v1';

  // app.use(prefix, createHeloWorldRouter());

  // register crossdevice routes
  // const crossDeviceRouter = new CrossDeviceRouter();
  // app.use(prefix, crossDeviceRouter.getRoutes());


  app.use("/api/v1/external", ExternalRoutes.getRoutes());
  app.use("/api/v1/public", PublicRoutes.getRoutes());
  app.use("/api/v1/version", VersionRoute.getRoutes(app));
  app.use("/api/v1/token", ContractIDRoute.getRoutes(app)); //ContractID route
  // ----  middleware for eurolife services ---- //
  app.use("/api/v1/middleware/signup", signUpRouter.getRoutes(app));
  app.use("/api/v1/middleware/signin", signInRouter.getRoutes(app));
  app.use("/api/v1/middleware/errorlogger", errorLoggerRouter.getRoutes(app));
  app.use("/api/v1/middleware/forgotUsername", forgetUsernameRouter.getRoutes(app));
  app.use("/api/v1/middleware/forgotPassword", forgetPasswordRouter.getRoutes(app));
  app.use("/api/v1/middleware/profilePicture", profilePictureRouter.getRoutes(app));
  app.use("/api/v1/middleware/recaptchaservice", recaptchaRouter.getRoutes(app));
  app.use("/api/v1/middleware/amendments/otp", amendmentsOtpRouter.getRoutes(app));


  //Apple Wallet routes
  app.use("/v1", AppleWalletRouter.getRoutes(app));
  // Wallet qrcheck route
  app.use("/qrcheck", QRCheckRouter.getRoutes(app));

  // //Universal Links
  app.use("/apple-app-site-association", AppleWalletRouter.getRoutes(app));
  app.use("/.well-known/apple-app-site-association", AppleWalletRouter.getRoutes(app));


  app.use("/.well-known/assetlinks.json", oauth2AuthorizationRouter.getRoutesUniversalLink(app));
  app.use("/eurolifeAssistApp", oauth2AuthorizationRouter.getRouteRedirectToPlayStore(app));
  app.use("/eurolifeAssistAppIos", oauth2AuthorizationRouter.getRouteRedirectToAppStore(app));

  // Wallet statistics
  app.use("/api/v1/wallet", WalletStatisticsRouter.getRoutes(app));

  // Wallet old google passes to database
  app.use("/api/v1/wallet", WalletGooglePassesRouter.getRoutes(app));

  // Get Google Pass
  app.use("/api/v1/wallet", GetGooglePassRouter.getRoutes(app));

  let resourceRouter = ResourceRouter.getRoutes(app,appOptions);
  app.use('/api/v1', resourceRouter);

  const signupGroupFormRouter = SignupGroupRouter.getRoutes();
  app.use('/api/v1/signupGroupForm', signupGroupFormRouter);


  const contactFormRouter = ContactFormRouter.getRoutes();
   app.use('/api/v1/contactForm', contactFormRouter);

  const myRightsFormRouter = MyRightsFormRouter.getRoutes();
  app.use('/api/v1/myRightsForm', myRightsFormRouter);

  const AmendmentsRouter = amendmentsVerificationEmailRouter.getRoutes();
  app.use("/api/v1/amendments", AmendmentsRouter);

  const EclaimsRouter = lightningOutEclaimsRouter.getRoutes();
   app.use("/api/v1/middleware/lightningOut", EclaimsRouter);

  const oauth2Router = oauth2AuthorizationRouter.getRoutes();
  app.use("/api/v1/middleware/oauth2", oauth2Router);

  const googleUpdateRouter = googlePassUpdateRouter.getRoutes();
  app.use("/api/v1/middleware/google", googleUpdateRouter);

  const appleRouter = applePassRouter.getRoutes();
  app.use("/api/v1/middleware/apple", appleRouter);





}
