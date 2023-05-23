import * as express from 'express';
import * as _ from 'lodash';
var email = require('emailjs');
// import amendmentsSendVerificationEmailController from '../controllers/amendmentssendverificationemail.controller'

export class amendmentsVerificationEmailRouter {
	public static getRoutes(): express.Router {
		let router = express.Router();
		router.route('/send-emails').post(async (request, response) => {
			amendmentsVerificationEmailRouter.sendMail(request.body.caseId, request.body.useremail, request.body.contractId);
			response.send({ success: true });
		});

		return router;
	}

	private static sendMail(caseId: any, useremail: any, contractId: any): void {

		var server = email.server.connect({
			user: 'myeurolife@eurolife.gr',
			host: "192.168.1.234",
			ssl: false,
			tls: false,
			port: 25
		});

		var message: any;

		try {
			message = {
				subject: 'EurolifeConnect Καταχώριση Αιτήματος Τροποποίησης',
				from: "connect@eurolife.gr",
				// to: "fspirou@eurolife.gr",
				// to: "rania_daflou@yahoo.com",
				to: useremail,
				attachment: [
					{
						data: '<html> <head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Payment notice</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">'
							+ '<style>@import url("https://fonts.googleapis.com/css?family=Ubuntu&display=swap")'
							+ '/* Remove space around the email design. */'
							+ 'html,'
							+ 'body {'
							+ 'margin: 0 auto !important;'
							+ 'padding: 0!important;'
							+ 'height: 100 % !important;'
							+ 'width: 100 % !important;'
							+ 'max- width: 740px;'
							+ '}'

							+ '/* Stop Outlook resizing small text. */'
							+ '* {'
							+ '- ms - text - size - adjust: 100 %;'
							+ '}'

							+ '/* Stop Outlook from adding extra spacing to tables. */'
							+ 'table,'
							+ 'td {'
							+ 'mso - table - lspace: 0pt!important;'
							+ 'mso - table - rspace: 0pt!important;'
							+ '}'

							+ '/* Use a better rendering method when resizing images in Outlook IE. */'
							+ 'img {'
							+ '-ms - interpolation - mode: bicubic;'
							+ '}'

							+ '/* Prevent Windows 10 Mail from underlining links. Styles for underlined links should be inline. */'
							+ 'a {'
							+ 'text - decoration: none;'
							+ '}'
							+ '</style>'
							+ '</head>'
							+ '<body width="740" style="max-width: 740px; margin: auto; font-family: "Ubuntu", sans-serif;">'
							+ '<table style="border: 0;width: 100%;"><tr><td><table style="border-collapse: collapse;max-width: 740px;width: 100%;border: 0;margin-left: auto;margin-right: auto;"><tr><td style="padding: 27px 0px 26px 0px;">'
							+ '<a href="https://connect.eurolife.gr/" target="_blank"><img src="https://scp.eurolife.gr/~/media/50515F4912C54EBDB4A2D34F7EAA3B41 " height="29" width="190" alt="EurolifeConnect"></a></td></tr>'
							+ '<table style="border-collapse: collapse;max-width: 740px;width: 100%;border: 0;margin-left: auto;margin-right: auto;"><tr><td style="background-color: #ef3340;height: 2px;"></td></tr></table>'
							+ '<table style="border-collapse: collapse;max-width: 656px;border: 0;width: 100%;margin-left: auto;margin-right: auto;">'
							+ '<tr><td><div style="padding: 32px 15px 15px 15px;"><div style="font-size: 22px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.23;letter-spacing: normal;color: #383b38;padding: 56.3px 0px 16.6px 0px;">Αγαπητέ Πελάτη,</div><div style="font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;">Θα θέλαμε να σας ενημερώσουμε ότι το αίτημα τροποποίησης για το συμβόλαιο με αριθμό '
							+ '<b>' + contractId + '</b> που υποβάλατε στο <span><a href="https://connect.eurolife.gr/" style="text-decoration: none;color: #ef3340;">EurolifeConnect</a></span> έχει καταχωρηθεί.<br>Ο αριθμός αιτήματος είναι: '
							+ '<b>' + caseId + '</b></div></div></td></tr>'
							+ '<tr><td><div style="padding: 75px 15px 128px 15px;"><br><p style="margin: 0px;font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;">Με εκτίμηση,</p><p style = "margin: 0px;font-size: 22px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.23;letter-spacing: normal;color: #ef3340;">Ομάδα EurolifeConnect </p><br></div></td></tr></table>'
							+ '<table style="border-collapse: collapse;max-width: 740px;width: 100%;border: 0;margin-left: auto;margin-right: auto;"><tr><td style="background-color: #ef3340;height: 2px;">'
							+ '</td></tr></table>'
							+ '<table style="border-collapse: collapse;max-width: 700px;border: 0;width: 100%;margin-left: auto;margin-right: auto;">'
							+ '<tr><td colspan="4"><p style="opacity: 0.6;font-size: 14px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.36;letter-spacing: normal;color: #383b38;padding: 0px 0px 0px 32px;min-width: 202px;">'
							+ 'Κέντρο Εξυπηρέτησης Πελατών</p></td>'
							+ '<td colspan="1" style="text-align: end;padding: 0px 32px 0px 0px;">'
							+ '<a href="https://www.linkedin.com/company/eurolife-erb" target="_blank" style="text-decoration: none;padding: 0px 16px 0px 0px;">'
							+ '<img src="https://scp.eurolife.gr/~/media/85EF998FA82C40428FB6834D7DE0CFEA.ashx" alt="linkedin" style="width: 23px;height: 23px;"></a>'
							+ '<a href="https://twitter.com/eurolife_erb?lang=el" target="_blank" style="text-decoration: none;padding: 0px 16px 0px 0px;"><img src="https://scp.eurolife.gr/~/media/E29AD575A9924662886987990FCB7088.ashx" alt="twitter" style="width: 23px;height: 19px;"></a>'
							+ '<a href="https://www.youtube.com/user/EurolifeERB " target="_blank" style="text-decoration: none;padding: 0px 0px 0px 0px;"> <img src="https://scp.eurolife.gr/~/media/C20FFEA7172D4565AA68AF4697137DB9.ashx" alt="youtube" style="width: 25px;height: 18px;"></a></td></tr>'
							+ '<tr><td colspan="5"><div><a href="tel:+30 210 9303800 "style="margin: 0px;padding: 0px 0px 0px 32px;font-size: 32px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.31;letter-spacing: normal;color: #ef3340;text-decoration: none;">210 9303800 </a></div></td></tr>'
							+ '<tr><td><a href="mailto:info@eurolife.gr" style="margin: 0px;padding: 0px 0px 0px 32px;font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;text-decoration: none;">info@eurolife.gr</a></td></tr>'
							+ '<tr><td colspan="5"><hr></td></tr>'
							+ '<tr><td colspan="4"><a href="https://connect.eurolife.gr/" target="_blank"><img src="https://scp.eurolife.gr/~/media/50515F4912C54EBDB4A2D34F7EAA3B41 " height="29" width="190" alt="EurolifeConnect"></a></td>'
							+ '<td colspan="1"><p style="opacity: 0.6;font-family: Ubuntu;font-size: 12px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.58;letter-spacing: normal;color: #383b38;text-align: end;padding: 0px 32px 0px 0px;">Copyright 2020 © Eurolife FFH</p></td></tr>'
							+ '</table></table></td></tr></table></body></html>', alternative: true
					}
				]
			};
			server.send(message, function (err: any, message: any) { console.log(err || message); });
		}
		catch (err) {
			console.log("ERROR DATAREAD:" + err);
		}
	}
}
