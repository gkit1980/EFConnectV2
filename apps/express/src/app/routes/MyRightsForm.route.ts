import * as express from 'express';
import * as _ from 'lodash';
var email = require('emailjs');


export class MyRightsFormRouter {
	//
	//

	public static getRoutes(): express.Router {
		let router = express.Router();

		//
		//
		router.route('/send-emails').post(async (request, response) => {
			MyRightsFormRouter.sendMail(request.body.theme, request.body.comment, request.body.insuredFirstName, request.body.insuredLastName, request.body.taxCode, request.body.phone, request.body.email);
			response.send({ success: true });
		});

		return router;
	}

	private static sendMail(theme: any, comment: any, insuredFirstName: any, insuredLastName: any, taxCode: any, insuredPhone: any, insuredEmail: any): void {

		var server = email.server.connect({
			user: 'myeurolife@eurolife.gr',
			host: "192.168.1.234",
			ssl: false,
			tls: false,
			port: 25
		});

		var message: any;

		message = {
			subject: 'MyRights form',
			from: "connect@eurolife.gr",
			to: "MyRights@eurolife.gr",
			attachment: [
				{
					data: '<html>Νέα υποβολή φόρμας Eurolife FFH. Τα στοιχεία είναι: <br/> Όνομα: '
						+ insuredFirstName + '<br/> Επώνυμο: '
						+ insuredLastName + '<br/> Α.Φ.Μ: '
						+ taxCode + '<br/> Τηλέφωνο: '
						+ insuredPhone + '<br/> EMail: '
						+ insuredEmail + '<br/> Θέμα: '
						+ theme + '<br/><br/> Σχόλια:<br/>'
						+ comment + '<br/></html>', alternative: true
				}
			]
		};

		// send the message and get a callback with ; an error or details of the message that was sent
		server.send(message, function (err: any, message: any) { console.log(err || message); });

	}
}
